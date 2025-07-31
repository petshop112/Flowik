package fooTalent.misino.products.service;

import fooTalent.misino.products.entity.Product;

import java.util.List;

public interface ProductServiceImpl {

    Product createProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(Long id);

    boolean existProduct(Long id);

    Product updateProduct(Product product);

    void deleteProductById(Long id);
}