package fooTalent.flowik.products.service;

import fooTalent.flowik.exceptions.BadRequestException;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.products.dto.ProducEditPrice;
import fooTalent.flowik.products.dto.ProductRegister;
import fooTalent.flowik.products.dto.ProductUpdated;
import fooTalent.flowik.products.entity.Product;
import fooTalent.flowik.products.enums.AdjustType;
import fooTalent.flowik.products.enums.AdjustValue;
import fooTalent.flowik.products.repositories.ProductRepository;
import fooTalent.flowik.provider.entity.Provider;
import fooTalent.flowik.provider.service.ProviderService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ProductService implements ProductServiceImpl{

    private final ProductRepository productRepository;
    private final ProviderService providerService;

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

        if(!this.existProduct(id)){
            throw new ResourceNotFoundException("Producto", "ID", id);
        }

        List<Long> idProviders = productUpdated.providerIds();
        List<Provider> providers = new ArrayList<>();

        for(Long idProvider : idProviders) {
            Provider provider = providerService.getProviderById(idProvider);
            if(provider == null){
                throw new RuntimeException("Proveedor no encontrado con ID: " + idProvider);
            }
            providers.add(provider);
        }

        Product product = getProductById(id);
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
}