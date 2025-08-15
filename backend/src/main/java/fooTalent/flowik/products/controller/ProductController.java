package fooTalent.flowik.products.controller;

import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.products.dto.*;
import fooTalent.flowik.products.entity.Product;
import fooTalent.flowik.products.repositories.ProductRepository;
import fooTalent.flowik.products.service.ProductServiceImpl;
import fooTalent.flowik.users.repositories.UserRepository;
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
    private final UserRepository userRepository;


    @Operation(summary = "Registrar un nuevo producto")
    @PostMapping("/{id_user}")
    public ResponseEntity<ProductResponse> createProduct(@RequestBody @Valid ProductRegister productRegister,
                                                         UriComponentsBuilder uriComponentsBuilder) {

        Product product = new Product();
        product = productService.createProduct(productRegister);

        URI url = uriComponentsBuilder.path("/api/products/{id_product}")
                .buildAndExpand(product.getId())
                .toUri();
        return ResponseEntity.created(url).body(new ProductResponse(product));
    }

    @Operation(summary = "Listar todos los productos",
            description = "Necesita ingresar el id de usuario, por cuestiones de privacidad y seguridad")
    @GetMapping("/getProducts/{id_user}")
    public ResponseEntity<List<ProductList>> getAllProducts(@PathVariable("id_user") Long idUser) {

        SecurityUtil.validateUserAccess(userRepository, idUser);

        return ResponseEntity.ok(
                productService.getAllProducts().stream()
                        .map(ProductList::new)
                        .toList()
        );
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
}