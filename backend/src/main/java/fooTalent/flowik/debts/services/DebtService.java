package fooTalent.flowik.debts.services;

import fooTalent.flowik.clients.entities.Client;
import fooTalent.flowik.clients.repositories.ClientRepository;
import fooTalent.flowik.debts.dto.DebtRegister;
import fooTalent.flowik.debts.dto.DebtResponse;
import fooTalent.flowik.debts.entities.Debt;
import fooTalent.flowik.debts.enums.StatusDebt;
import fooTalent.flowik.debts.repositories.DebtRepository;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
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
