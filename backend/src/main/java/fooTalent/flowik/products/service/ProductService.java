package fooTalent.flowik.products.service;

import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.products.dto.ProductRegister;
import fooTalent.flowik.products.dto.ProductUpdated;
import fooTalent.flowik.products.entity.Product;
import fooTalent.flowik.products.repositories.ProductRepositoryImpl;
import fooTalent.flowik.provider.service.ProviderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProductService implements ProductServiceImpl{

    private final ProductRepositoryImpl productRepository;
    private final ProviderService providerService;

    public ProductService(ProductRepositoryImpl productRepository,
                          ProviderService providerService){
        this.productRepository = productRepository;
        this.providerService = providerService;
    }

    @Override
    @Transactional
    public Product createProduct(ProductRegister productRegister) {

        List<Long> idProviders = productRegister.providerIds();
        idProviders.forEach(p -> {
            if(!providerService.existProvider(p)){
                throw new RuntimeException("Proveedor no encontrado con ID: " + p);
            }
        });

        Set<String> namesProvider = new HashSet<>();
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

        Set<Long> idProviders = productUpdated.providerIds();
        idProviders.forEach(p -> {
            if(!providerService.existProvider(p)){
                throw new RuntimeException("Proveedor no encontrado con ID: " + p);
            }
        });

        Set<String> namesProvider = new HashSet<>();
        idProviders.forEach(p -> {
            String name = providerService.getProviderById(p).getName_provider();
            namesProvider.add(name);
        });

        Product product = getProductById(id);
        product.updateProduct(productUpdated, namesProvider);
        System.out.println(productUpdated);
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProductById(Long id) {
        if(!this.existProduct(id)){
            throw new ResourceNotFoundException("Producto", "ID", id);
        }
        productRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Product desactivateProductById(Long id) {

        if(!this.existProduct(id)){
            throw new ResourceNotFoundException("Producto", "ID", id);
        }

        Product product = this.getProductById(id);
        product.desactivate();
        return productRepository.save(product);
    }
}