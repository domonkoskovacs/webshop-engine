package hu.webshop.engine.webshopbe.infrastructure.adapter;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.email.PromotionEmailService;
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

    private final PromotionEmailService promotionEmailService;
    private final EmailMapper emailMapper;

    public PromotionEmailResponse create(PromotionEmailRequest request) {
        log.info("create > request: [{}]", request);
        return emailMapper.toResponse(promotionEmailService.createPromotionEmail(emailMapper.fromRequest(request)));
    }

    public List<PromotionEmailResponse> getAll() {
        log.info("getAll");
        return emailMapper.toResponseList(promotionEmailService.getAllPromotionEmail());
    }

    public PromotionEmailResponse get(UUID id) {
        log.info("get > id: [{}]", id);
        return emailMapper.toResponse(promotionEmailService.getPromotionEmail(id));
    }

    public void delete(UUID id) {
        log.info("delete > id: [{}]", id);
        promotionEmailService.deletePromotionEmail(id);
    }

    public void test(UUID id, EmailRequest request) {
        log.info("test > id: [{}]", id);
        promotionEmailService.testPromotionEmail(id, request.email());
    }
}
