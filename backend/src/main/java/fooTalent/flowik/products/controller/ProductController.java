package fooTalent.flowik.products.controller;

import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.products.dto.*;
import fooTalent.flowik.products.entity.Product;
import fooTalent.flowik.products.repositories.ProductRepository;
import fooTalent.flowik.products.service.ProductServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductServiceImpl productService;
    private final ProductRepository productRepository;

    @Operation(summary = "Registrar un nuevo producto")
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody @Valid ProductRegister productRegister,
                                                         UriComponentsBuilder uriComponentsBuilder) {

        Product product = productService.createProduct(productRegister);

        URI url = uriComponentsBuilder.path("/api/products/{id_product}")
                .buildAndExpand(product.getId())
                .toUri();
        return ResponseEntity.created(url).body(new ProductResponse(product));
    }

    @Operation(summary = "Listar todos los productos del usuario autenticado")
    @GetMapping("/getProducts")
    public ResponseEntity<List<ProductList>> getAllProducts() {

        String email = SecurityUtil.getAuthenticatedEmail();

        List<ProductList> products = productService.getAllProducts().stream()
                .filter(product -> product.getCreatedBy().equals(email))
                .map(ProductList::new)
                .toList();
        if (products.isEmpty()) {
            throw new ResourceNotFoundException("Productos", "Usuario", email);
            }
        return ResponseEntity.ok(products);
    }

    @Operation(summary = "Traer un producto por ID")
    @GetMapping("/{id_product}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id_product") Long idProduct) {

        String email = SecurityUtil.getAuthenticatedEmail();

        Product existingProduct = productRepository.findById(idProduct)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "ID", idProduct));

        if (!existingProduct.getCreatedBy().equals(email)) {
            throw new AccessDeniedException("No puedes ver un producto que no creaste.");
        }

        return ResponseEntity.ok(new ProductResponse(existingProduct));
    }

    @Operation(summary = "Modificar un producto")
    @PutMapping("/{id_product}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable("id_product") Long idProduct,
                                                         @RequestBody @Valid ProductUpdated productUpdated) {

        String email = SecurityUtil.getAuthenticatedEmail();

        Product existingProduct = productRepository.findById(idProduct)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "ID", idProduct));

        if (!existingProduct.getCreatedBy().equals(email)) {
            throw new AccessDeniedException("No puedes modificar un producto que no creaste.");
        }

        Product updated = productService.updateProduct(idProduct, productUpdated);
        return ResponseEntity.ok(new ProductResponse(updated));
    }

    @Operation(summary = "Eliminar de forma definitiva múltiples productos por IDs")
    @DeleteMapping
    public ResponseEntity<Void> deleteProductsByIds(@RequestBody ProductIDs productIDs) {

        String email = SecurityUtil.getAuthenticatedEmail();

        List<Product> products = productRepository.findAllById(productIDs.IDs());
        if (products.size() != productIDs.IDs().size()) {
            throw new ResourceNotFoundException("Producto", "IDs", productIDs.IDs());
        }

        products.forEach(p -> {
            if (!p.getCreatedBy().equals(email)) {
                throw new AccessDeniedException("No puedes eliminar un producto que no creaste.");
            }
        });

        productService.deleteProductsByIds(productIDs.IDs());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Desactivar múltiples productos (eliminado lógico) por IDs")
    @PatchMapping
    public ResponseEntity<Void> toggleProductsActiveState(@RequestBody ProductIDs productIDs) {

        String email = SecurityUtil.getAuthenticatedEmail();

        List<Product> products = productRepository.findAllById(productIDs.IDs());
        if (products.size() != productIDs.IDs().size()) {
            throw new ResourceNotFoundException("Producto", "IDs", productIDs.IDs());
        }

        products.forEach(p -> {
            if (!p.getCreatedBy().equals(email)) {
                throw new AccessDeniedException("No puedes modificar el estado de un producto que no creaste.");
            }
        });

        productService.toggleProductsActiveState(productIDs.IDs());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Obtener el número de stock de un producto por IDs")
    @GetMapping("/stock/{id_product}")
    public ResponseEntity<StockProduct> getStockStatusById(@PathVariable("id_product") Long idProduct) {

        String email = SecurityUtil.getAuthenticatedEmail();

        Product existingProduct = productRepository.findById(idProduct)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "ID", idProduct));

        if (!existingProduct.getCreatedBy().equals(email)) {
            throw new AccessDeniedException("No puedes ver un producto que no creaste.");
        }

        Integer amountProduct = productService.getStockStatusById(idProduct);
        return ResponseEntity.ok(new StockProduct(amountProduct));
    }

    @Operation(summary = "Ajustar precios en productos por IDs")
    @PatchMapping("/")
    public ResponseEntity<List<ProductList>> editPrice(@RequestBody @Valid ProducEditPrice producEditPrice){


        String email = SecurityUtil.getAuthenticatedEmail();

        List<ProductList> products = productService.editPrice(producEditPrice).stream()
                .filter(product -> product.getCreatedBy().equals(email))
                .map(product -> new ProductList(product))
                .toList();

        return ResponseEntity.ok(products);
    }
}