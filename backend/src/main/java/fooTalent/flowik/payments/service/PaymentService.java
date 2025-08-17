package fooTalent.flowik.payments.service;

import fooTalent.flowik.client.entity.Client;
import fooTalent.flowik.client.repositories.ClientRepository;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.payments.Repository.PaymentRepository;
import fooTalent.flowik.payments.dto.PaymentRequest;
import fooTalent.flowik.payments.dto.PaymentResponse;
import fooTalent.flowik.payments.entity.Payment;
import fooTalent.flowik.payments.util.Calcs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ClientRepository clientRepository;

    @Transactional
    public PaymentResponse createPayment(Long id_client, PaymentRequest request) {
        Client client = clientRepository.findById(id_client)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado con id: " + id_client));

        List<Payment> newPayments = Calcs.applyPayment(client, request.paymentMount(), paymentRepository);

        if (newPayments.isEmpty()) {
            throw new ResourceNotFoundException("No se generó ningún pago. Verifique el monto o las deudas del cliente.");
        }

        Payment latestCreatedPayment = newPayments.get(newPayments.size() - 1);

        return new PaymentResponse(
                latestCreatedPayment.getId(),
                request.paymentMount(),
                latestCreatedPayment.getDatePayment()
        );
    }

    public List<PaymentResponse> getAllPaymentsByUser(String email) {
        return paymentRepository.findByCreatedBy(email).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PaymentResponse getPaymentById(Long id, String email) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago con id " + id + " no encontrado"));

        if (!payment.getCreatedBy().equals(email)) {
            throw new RuntimeException("No autorizado para ver este pago");
        }
        return convertToDto(payment);
    }

    private PaymentResponse convertToDto(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getPaymentMount(),
                payment.getDatePayment()
        );
    }
}
