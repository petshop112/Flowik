package fooTalent.flowik.payments.controller;

import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.payments.dto.PaymentRequest;
import fooTalent.flowik.payments.dto.PaymentResponse;
import fooTalent.flowik.payments.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "Registrar un nuevo Pago para un Cliente")
    @PostMapping("/{id_client}")
    public ResponseEntity<PaymentResponse> createPayment(@PathVariable ("id_client")Long id_client,
                                                         @RequestBody @Valid PaymentRequest paymentRequest) {
        return ResponseEntity.ok(paymentService.createPayment(id_client, paymentRequest));
    }

    @Operation(summary = "Obtener todos los pagos del usuario autenticado")
    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        String email = SecurityUtil.getAuthenticatedEmail();
        return ResponseEntity.ok(paymentService.getAllPaymentsByUser(email));
    }

    @Operation(summary = "Obtener un pago por su ID (si pertenece al usuario autenticado)")
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        String email = SecurityUtil.getAuthenticatedEmail();
        return ResponseEntity.ok(paymentService.getPaymentById(id, email));
    }
}
