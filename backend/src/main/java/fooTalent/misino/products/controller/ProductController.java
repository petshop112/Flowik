package fooTalent.misino.products.controller;

import fooTalent.misino.products.dto.ProductList;
import fooTalent.misino.products.dto.ProductRegister;
import fooTalent.misino.products.dto.ProductResponse;
import fooTalent.misino.products.dto.ProductUpdated;
import fooTalent.misino.products.entity.Product;
import fooTalent.misino.products.service.ProductServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductServiceImpl productService;

    public ProductController(ProductServiceImpl productService){
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRegister productRegister,
                                                         UriComponentsBuilder uriComponentsBuilder){

        Product product = productService.createProduct(new Product(productRegister));

        URI url = uriComponentsBuilder.path("/api/products/{id_product}")
                .buildAndExpand(product.getId())
                .toUri();

        ProductResponse productResponse = new ProductResponse(product);
        return ResponseEntity.created(url).body(productResponse);
    }

    @GetMapping
    public ResponseEntity<List<ProductList>> getAllProducts(){

        return ResponseEntity.ok(
                productService.getAllProducts().stream()
                        .map(p -> new ProductList(p))
                        .toList()
        );
    }

    @GetMapping("/{id_product}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id_product") Long idProduct){

        Product product = productService.getProductById(idProduct);
        return ResponseEntity.ok(
                new ProductResponse(product)
        );
    }

    @PutMapping("/{id_product}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable("id_product") Long idProduct,
                                                         @RequestBody ProductUpdated productUpdated){
        Product product = productService.getProductById(idProduct);
        product.updateProduct(productUpdated);
        product = productService.updateProduct(product);

        ProductResponse productResponse = new ProductResponse(product);
        return ResponseEntity.ok(productResponse);
    }

    @DeleteMapping("/{id_product}")
    public ResponseEntity deleteProductById(@PathVariable("id_product") Long idProduct){

        productService.deleteProductById(idProduct);
        return ResponseEntity.noContent().build();
    }
}