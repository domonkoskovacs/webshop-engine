package hu.webshop.engine.webshopbe.infrastructure.adapter;

import java.util.UUID;

import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.SocialIconMapper;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.StoreMapper;
import hu.webshop.engine.webshopbe.infrastructure.model.request.SocialIconRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.StoreRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.StoreResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoreAdapter {

    private final StoreService storeService;
    private final StoreMapper storeMapper;
    private final SocialIconMapper socialIconMapper;

    public StoreResponse getStore() {
        return storeMapper.toResponse(storeService.getStore());
    }

    public StoreResponse updateStore(StoreRequest storeRequest) {
        return storeMapper.toResponse(storeService.updateStore(storeMapper.fromRequest(storeRequest)));
    }

    public StoreResponse addIcon(SocialIconRequest socialIconRequest) {
        return storeMapper.toResponse(storeService.addSocialIcon(socialIconMapper.fromRequest(socialIconRequest)));
    }

    public StoreResponse removeIcon(UUID id) {
        return storeMapper.toResponse(storeService.removeSocialIcon(id));
    }
}
