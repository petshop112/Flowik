package fooTalent.flowik.products.controller;

import fooTalent.flowik.products.dto.ProductResponse;
import fooTalent.flowik.products.entities.Product;
import fooTalent.flowik.products.services.StockService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @Operation(summary = "Modificar Stock de productos por ID")
    @PostMapping("/adjust")
    public ResponseEntity<ProductResponse> adjustStock(@RequestParam Long productId, @RequestParam int quantity) {
        Product updatedProduct = stockService.adjustStock(productId, quantity);
        return ResponseEntity.ok(new ProductResponse(updatedProduct));
    }
}