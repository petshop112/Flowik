package fooTalent.flowik.debt.controller;

import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.debt.dto.DebtRegister;
import fooTalent.flowik.debt.dto.DebtResponse;
import fooTalent.flowik.debt.service.DebtService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/Debt")
public class DebtController {

    private final DebtService debtService;

    @Operation(summary = "Crear una nueva deuda para un cliente")
    @PostMapping("/{clientId}")
    public ResponseEntity<DebtResponse> createDebt(@PathVariable Long clientId, @RequestBody @Valid DebtRegister register) {
        String email = SecurityUtil.getAuthenticatedEmail();
        DebtResponse response = debtService.createDebt(clientId,register, email);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Obtener todas las deudas de un cliente")
    @GetMapping("/{idClient}")
    public ResponseEntity<List<DebtResponse>> getAllDebtClient(@PathVariable("idClient") Long idClient) {
        String email = SecurityUtil.getAuthenticatedEmail();
        List<DebtResponse> debts = debtService.getDebtsByClient(idClient, email);
        return ResponseEntity.ok(debts);
    }

  @Operation(summary = "Obtener una deuda específica")
    @GetMapping("/detail/{debtId}")
    public ResponseEntity<DebtResponse> getDebtById(@PathVariable("debtId") Long debtId) {
        String email = SecurityUtil.getAuthenticatedEmail();
        DebtResponse response = debtService.getDebtById(debtId, email);
        return ResponseEntity.ok(response);
    }

}
