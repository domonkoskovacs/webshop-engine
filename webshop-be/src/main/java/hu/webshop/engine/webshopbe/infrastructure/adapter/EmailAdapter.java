package hu.webshop.engine.webshopbe.infrastructure.adapter;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.EmailMapper;
import hu.webshop.engine.webshopbe.infrastructure.model.request.EmailRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.PromotionEmailRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.PromotionEmailResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailAdapter {

    private final EmailService emailService;
    private final EmailMapper emailMapper;

    public void create(PromotionEmailRequest request) {
        log.info("create > request: [{}]", request);
        emailService.createPromotionEmail(emailMapper.fromRequest(request));
    }

    public List<PromotionEmailResponse> getAll() {
        log.info("getAll");
        return emailMapper.toResponseList(emailService.getAllPromotionEmail());
    }

    public PromotionEmailResponse get(UUID id) {
        log.info("get > id: [{}]", id);
        return emailMapper.toResponse(emailService.getPromotionEmail(id));
    }

    public void delete(UUID id) {
        log.info("delete > id: [{}]", id);
        emailService.deletePromotionEmail(id);
    }

    public void test(UUID id, EmailRequest request) {
        log.info("test > id: [{}]", id);
        emailService.testPromotionEmail(id, request.email());
    }
}
