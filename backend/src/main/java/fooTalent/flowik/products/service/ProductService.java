package fooTalent.flowik.products.service;

import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.products.dto.ProductRegister;
import fooTalent.flowik.products.dto.ProductUpdated;
import fooTalent.flowik.products.entity.Product;
import fooTalent.flowik.products.repositories.ProductRepository;
import fooTalent.flowik.provider.service.ProviderService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        idProviders.forEach(p -> {
            if(!providerService.existProvider(p)){
                throw new RuntimeException("Proveedor no encontrado con ID: " + p);
            }
        });

        List<String> namesProvider = new ArrayList<>();
        idProviders.forEach(p -> {
            String name = providerService.getProviderById(p).getName_provider();
            namesProvider.add(name);
        });

        Product product = new Product(productRegister, namesProvider);
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
        idProviders.forEach(idProvider -> {
            if(!providerService.existProvider(idProvider)){
                throw new RuntimeException("Proveedor no encontrado con ID: " + idProvider);
            }
        });

        List<String> namesProvider = new ArrayList<>();
        idProviders.forEach(idProvider -> {
            String name = providerService.getProviderById(idProvider).getName_provider();
            namesProvider.add(name);
        });

        Product product = getProductById(id);
        product.updateProduct(productUpdated, namesProvider);
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
}