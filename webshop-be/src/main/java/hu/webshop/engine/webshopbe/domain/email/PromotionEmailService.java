package hu.webshop.engine.webshopbe.domain.email;


import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.base.exception.EmailException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.email.entity.PromotionEmail;
import hu.webshop.engine.webshopbe.domain.email.repository.PromotionalEmailRepository;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class PromotionEmailService {

    private final PromotionalEmailRepository promotionalEmailRepository;
    private final EmailService emailService;

    public PromotionEmail createPromotionEmail(PromotionEmail promotionEmail) {
        log.info("createPromotionEmail > promotionEmail: [{}]", promotionEmail);
        if (promotionalEmailRepository.existsPromotionEmailByName(promotionEmail.getName())) {
            throw new EmailException(ReasonCode.PROMOTION_EMAIL_NAME_OCCUPIED, "Email name is occupied please select a new one");
        }
        return promotionalEmailRepository.save(promotionEmail);
    }

    public List<PromotionEmail> getAllPromotionEmail() {
        log.info("getAllPromotionEmail");
        return promotionalEmailRepository.findAll();
    }

    public PromotionEmail getPromotionEmail(UUID id) {
        log.info("getPromotionEmail > id: [{}]", id);
        return promotionalEmailRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("promotional email was not found"));
    }

    public void deletePromotionEmail(UUID id) {
        log.info("deletePromotionEmail > id: [{}]", id);
        promotionalEmailRepository.deleteById(id);
    }

    /**
     * a promotion email can be tested, this function sends it to the given email, every other data filled with dummy values
     *
     * @param id    promotion email id
     * @param email test email
     */
    public void testPromotionEmail(UUID id, @jakarta.validation.constraints.Email String email) {
        PromotionEmail promotionEmail = promotionalEmailRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Promotion email was not found"));
        User testUser = User.builder().email(email).firstname("Test").lastname("Test").build();
        testUser.setId(UUID.randomUUID());
        emailService.sendPromotionEmail(promotionEmail, testUser);
    }

    /**
     * sends a recurring email, but catches every error in order complete the majority of the job
     */
    public void sendRecurringPromotionEmail(PromotionEmail promotionEmail, User user) {
        try {
            emailService.sendPromotionEmail(promotionEmail, user);
        } catch (Exception e) {
            log.error("error during sending recurring email", e);
        }
    }

    /**
     * sends a recurring email, but catches every error in order complete the majority of the job
     */
    public void sendRecurringMarketingEmail(User user) {
        try {
            Product product = user.getMostDiscontedSavedProduct();
            if (product != null) {
                emailService.sendMarketingEmail(user, product);
            }
        } catch (Exception e) {
            log.error("error during sending recurring email", e);
        }
    }
}
