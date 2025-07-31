package fooTalent.misino.products.service;

import fooTalent.misino.products.entity.Product;
import fooTalent.misino.products.repositories.ProductRepositoryImpl;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService implements ProductServiceImpl{

    private final ProductRepositoryImpl productRepository;

    public ProductService(ProductRepositoryImpl productRepository){
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró el producto con ID " + id));
    }

    @Override
    public boolean existProduct(Long id) {
        return productRepository.existsById(id);
    }

    @Override
    @Transactional
    public Product updateProduct(Product product) {
        if(!this.existProduct(product.getId())){
            throw new EntityNotFoundException("No se encontró el producto con ID " + product.getId());
        }
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProductById(Long id) {
        if(!this.existProduct(id)){
            throw new EntityNotFoundException("No se encontró el producto con ID " + id);
        }
        productRepository.deleteById(id);
    }
}