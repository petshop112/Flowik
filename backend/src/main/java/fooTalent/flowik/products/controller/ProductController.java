package fooTalent.flowik.products.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.exceptions.util.FileParseException;
import fooTalent.flowik.products.dto.*;
import fooTalent.flowik.products.entities.Product;
import fooTalent.flowik.products.repositories.ProductRepository;
import fooTalent.flowik.products.services.FileParserService;
import fooTalent.flowik.products.services.OpenAiServiceWrapper;
import fooTalent.flowik.products.services.ProductServiceImpl;
import fooTalent.flowik.providers.entities.Provider;
import fooTalent.flowik.providers.repositories.ProviderRepository;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;
import fooTalent.flowik.products.dto.TableRowResponse;

import java.net.URI;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductServiceImpl productService;
    private final ProductRepository productRepository;
    private final FileParserService parserService;
    private final ProviderRepository providerRepository;
    private final OpenAiServiceWrapper openAiServiceWrapper;

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
                                                         @RequestBody ProductUpdated productUpdated) {

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
    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductValidationResponse> uploadFile(
            @RequestPart("documents") MultipartFile documents,
            @RequestParam("providerId") Long providerId) throws Exception {

        if (documents == null || documents.isEmpty()) {
            throw new FileParseException("El archivo no fue enviado o está vacío");
        }

        String email = SecurityUtil.getAuthenticatedEmail();

        Provider provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor", "ID", providerId));

        if (!provider.getCreatedBy().equals(email)) {
            throw new IllegalArgumentException("El proveedor seleccionado no pertenece al usuario autenticado.");
        }

        TableRowResponse result = parserService.parseFile(documents);

        StringBuilder contenido = new StringBuilder();
        contenido.append(String.join(", ", result.headers())).append("\n");
        for (List<String> row : result.rows()) {
            contenido.append(String.join(", ", row)).append("\n");
        }

        String prompt = """
        Analiza el siguiente contenido de archivo (puede provenir de PDF, Excel o CSV) y devuélvelo en formato JSON con dos listas:

        - `validos`: productos que cumplen con las validaciones.
        - `invalidos`: productos que no cumplen y sus errores.

        Campos esperados por producto:
        - name: obligatorio, entre 3 y 50 caracteres.
        - description: obligatorio, entre 10 y 255 caracteres.
        - category: obligatoria, entre 3 y 50 caracteres.
        - amount: número entero >= 0.
        - sellPrice: decimal >= 0.00, hasta 10 enteros y 2 decimales.

        No incluyas providerIds en la respuesta porque se asignará externamente.

        Devuelve únicamente un JSON válido con esta estructura:
        {
          "validos": [ { "name": "...", "description": "...", "category": "...", "amount": 0, "sellPrice": 0.00 }, ... ],
          "invalidos": [ { "fila": X, "errores": ["mensaje de error 1", "mensaje de error 2"] }, ... ]
        }

        Aquí está el contenido del archivo:
        """ + contenido;

        String rawJson = openAiServiceWrapper.analizerProducts(prompt);

        ObjectMapper mapper = new ObjectMapper();
        ProductValidationResponse aiResponse = mapper.readValue(rawJson, ProductValidationResponse.class);
        productService.saveValidProducts(aiResponse.getValid(), provider);
        return ResponseEntity.ok(aiResponse);
    }
}