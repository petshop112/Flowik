package fooTalent.flowik.products.services;

import fooTalent.flowik.products.dto.*;
import fooTalent.flowik.products.entities.Product;
import fooTalent.flowik.providers.entities.Provider;
import jakarta.validation.Valid;

import java.util.List;

public interface ProductServiceImpl {

    Product createProduct(ProductRegister productRegister);

    List<Product> getAllProducts();

    Product getProductById(Long id);

    boolean existProduct(Long id);

    Product updateProduct(Long id, ProductUpdated productUpdated);

    void deleteProductsByIds(List<Long> productIDs);

    void toggleProductsActiveState(List<Long> productIDs);

    Integer getStockStatusById(Long id);

    List<Product> editPrice(@Valid ProducEditPrice producEditPrice);

    void saveValidProducts(List<ProductValidationResponse.ValidProduct> validProducts, Provider provider);
}