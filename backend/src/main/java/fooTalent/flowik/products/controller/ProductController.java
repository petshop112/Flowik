package fooTalent.flowik.products.controller;

import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.products.dto.*;
import fooTalent.flowik.products.entity.Product;
import fooTalent.flowik.products.service.ProductServiceImpl;
import fooTalent.flowik.users.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductServiceImpl productService;
    private final UserRepository userRepository;

    public ProductController(ProductServiceImpl productService,
                             UserRepository userRepository){
        this.productService = productService;
        this.userRepository = userRepository;
    }

    @Operation(summary = "Registrar un nuevo producto")
    @PostMapping("/{id_user}")
    public ResponseEntity<ProductResponse> createProduct(@PathVariable("id_user") Long idUser,
                                                         @RequestBody @Valid ProductRegister productRegister,
                                                         UriComponentsBuilder uriComponentsBuilder){

        SecurityUtil.validateUserAccess(userRepository, idUser);

        Product product = productService.createProduct(productRegister);

        URI url = uriComponentsBuilder.path("/api/products/{id_product}")
                .buildAndExpand(product.getId())
                .toUri();
        return ResponseEntity.created(url).body(new ProductResponse(product));
    }

    @Operation(summary = "Listar todos los productos")
    @GetMapping("/{id_user}")
    public ResponseEntity<List<ProductList>> getAllProducts(@PathVariable("id_user") Long idUser){

        SecurityUtil.validateUserAccess(userRepository, idUser);

        return ResponseEntity.ok(
                productService.getAllProducts().stream()
                        .map(ProductList::new)
                        .toList()
        );
    }

    @Operation(summary = "Traer un producto por ID")
    @GetMapping("/{id_user}/{id_product}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id_user") Long idUser,
                                                          @PathVariable("id_product") Long idProduct){

        SecurityUtil.validateUserAccess(userRepository, idUser);

        Product product = productService.getProductById(idProduct);
        return ResponseEntity.ok(
                new ProductResponse(product)
        );
    }

    @Operation(summary = "Modificar un producto")
    @PutMapping("/{id_user}/{id_product}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable("id_user") Long idUser,
                                                         @PathVariable("id_product") Long idProduct,
                                                         @RequestBody @Valid ProductUpdated productUpdated){

        SecurityUtil.validateUserAccess(userRepository, idUser);

        Product product = productService.updateProduct(idProduct, productUpdated);
        return ResponseEntity.ok(new ProductResponse(product));
    }

    @Operation(summary = "Eliminar múltiples productos de forma definitiva por IDs")
    @DeleteMapping
    public ResponseEntity<Void> deleteProductsByIds(@RequestBody ProductIDs productIDs){

        productService.deleteProductsByIds(productIDs.IDs());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Desactivar múltiples productos (eliminado lógico) por IDs")
    @PatchMapping
    public ResponseEntity<Void> toggleProductsActiveState(@RequestBody ProductIDs productIDs){

        productService.toggleProductsActiveState(productIDs.IDs());
        return ResponseEntity.noContent().build();
    }
}