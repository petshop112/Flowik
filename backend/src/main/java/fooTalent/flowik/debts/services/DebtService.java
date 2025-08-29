package fooTalent.flowik.debts.services;

import fooTalent.flowik.clients.entities.Client;
import fooTalent.flowik.clients.repositories.ClientRepository;
import fooTalent.flowik.debts.dto.DebtRegister;
import fooTalent.flowik.debts.dto.DebtResponse;
import fooTalent.flowik.debts.entities.Debt;
import fooTalent.flowik.debts.enums.StatusDebt;
import fooTalent.flowik.debts.repositories.DebtRepository;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.notifications.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DebtService {

    private final DebtRepository debtRepository;
    private final ClientRepository clientRepository;
    private final NotificationService notificationService;

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
                .orElseThrow(() -> new ResourceNotFoundException("Deuda", "ID", debtId));

        return new DebtResponse(debt);
    }

    @Transactional(readOnly = true)
    public void updateAccountStatus(){

        List<Debt> debts = debtRepository.findAll();

        for(Debt debt : debts){
            LocalDate expirationDate = debt.getExpirationDate();
            Integer overdueDebt = debt.getOverdueDebt();
            Integer criticalDebt = debt.getCriticalDebt();
            Long daysExpired = null;

            String notificationTitle = null;
            String notificationDescription = null;

            if(LocalDate.now().isAfter(expirationDate)){
                daysExpired = ChronoUnit.DAYS.between(expirationDate, LocalDate.now());

                if(daysExpired >= overdueDebt && daysExpired <= criticalDebt){
                    notificationTitle = "Alerta de deuda atrasada";
                    notificationDescription = "¡Alerta! La deuda de '" + debt.getClient().getName_client() + "' ha alcanzado el nivel ATRASADO.";
                }else if(daysExpired <= criticalDebt){
                    notificationTitle = "Alerta de deuda crítica";
                    notificationDescription = "¡Alerta! La deuda de '" + debt.getClient().getName_client() + "' ha alcanzado el nivel CRÍTICO.";
                }

                if(notificationTitle != null) {
                    String notificationCreatorEmail = debt.getCreatedBy();

                    boolean alreadyNotified = notificationService.hasActiveStockNotification(debt.getId(), notificationCreatorEmail, notificationTitle);

                    if (!alreadyNotified) {
                        notificationService.createStockNotification(notificationTitle, notificationDescription, debt.getId(), notificationCreatorEmail);
                    }
                }
            }
        }
    }
}