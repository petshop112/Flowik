package fooTalent.flowik.products.service;

import fooTalent.flowik.products.dto.ProductRegister;
import fooTalent.flowik.products.dto.ProductUpdated;
import fooTalent.flowik.products.entity.Product;

import java.util.List;

public interface ProductServiceImpl {

    Product createProduct(ProductRegister productRegister);

    List<Product> getAllProducts();

    Product getProductById(Long id);

    boolean existProduct(Long id);

    Product updateProduct(Long id, ProductUpdated productUpdated);

    void deleteProductById(Long id);

    Product desactivateProductById(Long id);
}