package fooTalent.flowik.products.controller;

import fooTalent.flowik.products.dto.ProductResponse;
import fooTalent.flowik.products.entities.Product;
import fooTalent.flowik.products.services.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @PostMapping("/adjust")
    public ResponseEntity<ProductResponse> adjustStock(@RequestParam Long productId, @RequestParam int quantity) {
        Product updatedProduct = stockService.adjustStock(productId, quantity);
        return ResponseEntity.ok(new ProductResponse(updatedProduct));
    }
}