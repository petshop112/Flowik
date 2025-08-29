package fooTalent.flowik.products.services;

import fooTalent.flowik.exceptions.BadRequestException;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.products.dto.ProducEditPrice;
import fooTalent.flowik.products.dto.ProductRegister;
import fooTalent.flowik.products.dto.ProductUpdated;
import fooTalent.flowik.products.dto.ProductValidationResponse;
import fooTalent.flowik.products.entities.Product;
import fooTalent.flowik.products.enums.AdjustType;
import fooTalent.flowik.products.enums.AdjustValue;
import fooTalent.flowik.products.repositories.ProductRepository;
import fooTalent.flowik.providers.entities.Provider;
import fooTalent.flowik.providers.repositories.ProviderRepository;
import fooTalent.flowik.providers.services.ProviderService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@AllArgsConstructor
public class ProductService implements ProductServiceImpl{

    private final ProductRepository productRepository;
    private final ProviderService providerService;
    private final ProviderRepository providerRepository;

    @Override
    @Transactional
    public Product createProduct(ProductRegister productRegister) {

        List<Long> idProviders = productRegister.providerIds();
        idProviders.forEach(id -> {
            if(!providerService.existProvider(id)){
                throw new RuntimeException("Proveedor no encontrado con ID: " + id);
            }
        });

        List<Provider> providers = this.providerService.getProvidersByIds(idProviders);
        Product product = new Product(productRegister, providers);
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "ID", id));
    }

    @Override
    public boolean existProduct(Long id) {
        return productRepository.existsById(id);
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, ProductUpdated productUpdated) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "ID", id));

        if (productUpdated.name() != null && !productUpdated.name().isBlank()) {
            if (productUpdated.name().length() < 2 || productUpdated.name().length() > 50) {
               throw new BadRequestException
                       ("El nombre del producto debe tener entre 2 y 50 caracteres.");
            }
        }

        if (productUpdated.description() != null && !productUpdated.description().isBlank()) {
            if (productUpdated.description().length() < 3 || productUpdated.description().length() > 255) {
                throw new BadRequestException
                        ("La descripción del producto debe tener entre 3 y 255 caracteres.");
            }
        }

        if (productUpdated.category() != null && !productUpdated.category().isBlank()) {
            if (productUpdated.category().length() < 3 || productUpdated.category().length() > 50) {
                throw new BadRequestException
                        ("La categoría del producto debe tener entre 3 y 50 caracteres.");
            }
        }

        if(productUpdated.amount() != null) {
            if (productUpdated.amount() < 0) {
                throw new BadRequestException
                        ("La cantidad debe ser mayor o igual a 0.");
            }
        }

        if (productUpdated.sellPrice() != null && productUpdated.sellPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException
                    ("El precio debe ser mayor o igual a 0.00.");
        }

        List<Provider> providers = null;
        if (productUpdated.providerIds() != null && !productUpdated.providerIds().isEmpty()) {
            providers = providerRepository.findAllById(productUpdated.providerIds());
            if (providers.isEmpty()) providers = null;
        }

        boolean anyUpdate = false;
        if (productUpdated.name() != null && !productUpdated.name().isBlank()) anyUpdate = true;
        if (productUpdated.description() != null && !productUpdated.description().isBlank()) anyUpdate = true;
        if (productUpdated.category() != null && !productUpdated.category().isBlank()) anyUpdate = true;
        if (productUpdated.amount() != null && productUpdated.amount() >= 0) anyUpdate = true;
        if (productUpdated.sellPrice() != null && productUpdated.sellPrice().compareTo(BigDecimal.ZERO) > 0) anyUpdate = true;
        if (providers != null && !providers.isEmpty()) anyUpdate = true;
        if (!anyUpdate) {
            throw new BadRequestException
                    ("No se modificó ningún campo del producto.");
        }

        product.updateProduct(productUpdated, providers);

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProductsByIds(List<Long> productIDs) {
        productRepository.deleteAllByIdInBatch(productIDs);
    }

    @Override
    @Transactional
    public void toggleProductsActiveState(List<Long> productIDs) {
        productRepository.toggleProductsActiveState(productIDs);
    }

    @Override
    public Integer getStockStatusById(Long id) {
        return productRepository.findAmountById(id);
    }

    @Override
    public List<Product> editPrice(ProducEditPrice producEditPrice) {

        BigDecimal value = producEditPrice.value();
        AdjustType adjustType = producEditPrice.adjustType();
        AdjustValue adjustValue = producEditPrice.adjustValue();

        if(value.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("El valor debe ser mayor que 0.");
        }

        List<Long> idProducts = producEditPrice.IDs();
        List<Product> products = productRepository.findAllById(idProducts);

        for(Product product : products){

            BigDecimal currentPrice = product.getSellPrice();
            BigDecimal newPrice;

            if(adjustValue.equals(AdjustValue.Percent)) {

                BigDecimal percentValue = value.divide(new BigDecimal(100), 2, RoundingMode.HALF_UP);
                BigDecimal adjustmentAmount = currentPrice.multiply(percentValue);

                if(adjustType.equals(AdjustType.Aumentar)){
                    newPrice = currentPrice.add(adjustmentAmount);
                }else{
                    newPrice = currentPrice.subtract(adjustmentAmount);
                }

            }else{ // AdjustValue.Money

                if(adjustType.equals(AdjustType.Aumentar)){
                    newPrice = currentPrice.add(value);
                }else{
                    newPrice = currentPrice.subtract(value);
                }
            }

            if(newPrice.compareTo(BigDecimal.ZERO) < 0){
                newPrice = BigDecimal.ZERO;
            }

            product.setSellPrice(newPrice);
        }

        this.productRepository.saveAll(products);
        return products;
    }
    public void saveValidProducts(List<ProductValidationResponse.ValidProduct> validProducts, Provider provider) {
        List<Product> entities = validProducts.stream().map(v -> {
            Product p = new Product();
            p.setName(v.getName());
            p.setDescription(v.getDescription());
            p.setCategory(v.getCategory());
            p.setAmount(v.getAmount());
            p.setSellPrice(v.getSellPrice());
            p.setProviders(List.of(provider));
            return p;
        }).toList();

        productRepository.saveAll(entities);
    }
}