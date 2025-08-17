package fooTalent.flowik.debt.service;

import fooTalent.flowik.client.entity.Client;
import fooTalent.flowik.client.repositories.ClientRepository;
import fooTalent.flowik.debt.dto.DebtRegister;
import fooTalent.flowik.debt.dto.DebtResponse;
import fooTalent.flowik.debt.entity.Debt;
import fooTalent.flowik.debt.enums.StatusDebt;
import fooTalent.flowik.debt.repositories.DebtRepository;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

    @Service
    @RequiredArgsConstructor
    public class DebtService {

        private final DebtRepository debtRepository;
        private final ClientRepository clientRepository;

        @Transactional
        public DebtResponse createDebt(Long clientId, DebtRegister register, String email) {
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente"));

            Debt debt = new Debt();
            debt.setClient(client);
            debt.setMount(register.mount() != null ? register.mount() : BigDecimal.ZERO);
            debt.setStatus(StatusDebt.Impago);
            debt.setIsActive(true);

            Debt saved = debtRepository.save(debt);

            return new DebtResponse(saved);
        }

        @Transactional(readOnly = true)
        public List<DebtResponse> getDebtsByClient(Long clientId, String email) {
            Client client = clientRepository.findById(clientId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente"));

            return client.getDebts().stream()
                    .map(DebtResponse::new)
                    .toList();
        }

        @Transactional(readOnly = true)
        public DebtResponse getDebtById(Long debtId, String email) {
            Debt debt = debtRepository.findById(debtId)
                    .orElseThrow(() -> new ResourceNotFoundException("Deuda"));

            return new DebtResponse(debt);
        }

}
