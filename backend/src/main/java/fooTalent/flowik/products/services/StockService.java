package fooTalent.flowik.products.services;

import fooTalent.flowik.config.SecurityUtil;
import fooTalent.flowik.exceptions.ResourceNotFoundException;
import fooTalent.flowik.notifications.repositories.NotificationRepository;
import fooTalent.flowik.notifications.services.NotificationService;
import fooTalent.flowik.products.entities.Product;
import fooTalent.flowik.products.repositories.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {

    private final ProductRepository productRepository;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @Transactional
    public Product adjustStock(Long productId, int quantityChange) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "ID", productId));

        Integer oldAmount = product.getAmount();
        Integer newAmount = oldAmount + quantityChange;

        product.setAmount(newAmount);

        checkAndNotifyStockStatus(product, oldAmount, newAmount);

        return productRepository.save(product);
    }

    private void checkAndNotifyStockStatus(Product product, Integer oldAmount, Integer newAmount) {
        Integer lowThreshold = product.getLowStockThreshold();
        Integer criticalThreshold = product.getCriticalStockThreshold();

        String notificationTitle = null;
        String notificationDescription = null;

        if (oldAmount > lowThreshold && newAmount <= lowThreshold) {
            notificationTitle = "Alerta de stock bajo";
            notificationDescription = "El stock del producto '" + product.getName() + "' ha alcanzado un nivel BAJO.";
        } else if (oldAmount > criticalThreshold && newAmount <= criticalThreshold) {
            notificationTitle = "Alerta de stock crítico";
            notificationDescription = "¡Alerta! El stock de '" + product.getName() + "' ha alcanzado un nivel CRÍTICO.";
        }

        if (notificationTitle != null) {
            String createdBy = null;
            try {
                createdBy = SecurityUtil.getAuthenticatedEmail();
            } catch (RuntimeException e) {
            }
            notificationService.createStockNotification(notificationTitle, notificationDescription, product.getId(), createdBy);
        }
    }
    @Transactional
    public void checkAllProductsStockLevels() {
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            Integer currentAmount = product.getAmount();
            Integer lowThreshold = product.getLowStockThreshold();
            Integer criticalThreshold = product.getCriticalStockThreshold();

            String notificationTitle = null;
            String notificationDescription = null;

            if (currentAmount <= criticalThreshold) {
                notificationTitle = "Alerta de stock crítico";
                notificationDescription = "¡Alerta! El stock de '" + product.getName() + "' ha alcanzado un nivel CRÍTICO.";
            } else if (currentAmount <= lowThreshold) {
                notificationTitle = "Alerta de stock bajo";
                notificationDescription = "El stock del producto '" + product.getName() + "' ha alcanzado un nivel BAJO.";
            }

            if (notificationTitle != null) {
                String productCreatorEmail = product.getCreatedBy();

                boolean alreadyNotified = notificationService.hasActiveStockNotification(product.getId(), productCreatorEmail, notificationTitle);

                if (!alreadyNotified) {
                    notificationService.createStockNotification(notificationTitle, notificationDescription, product.getId(), productCreatorEmail);
                }
            }
        }
    }

    public boolean hasActiveStockNotification(Long productId, String userEmail, String type) {

        return notificationRepository.existsByReferenceIdAndCreatedByAndTitle(productId, userEmail, type);
    }
    @Scheduled(fixedRate = 8 * 60 * 60 * 1000)
    public void scheduleStockCheck() {
        this.checkAllProductsStockLevels();
    }

}
