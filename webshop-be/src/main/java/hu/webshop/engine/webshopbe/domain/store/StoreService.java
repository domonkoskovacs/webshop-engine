package hu.webshop.engine.webshopbe.domain.store;

import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.store.entity.SocialIcon;
import hu.webshop.engine.webshopbe.domain.store.entity.Store;
import hu.webshop.engine.webshopbe.domain.store.mapper.StoreUpdateMapper;
import hu.webshop.engine.webshopbe.domain.store.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class StoreService {

    private final StoreRepository storeRepository;
    private final StoreUpdateMapper updateMapper;

    public Store updateStore(Store store) {
        Store old = getStore();
        Store updated = updateMapper.update(old, store);
        storeRepository.save(updated);
        return updated;
    }

    public Store getStore() {
        return storeRepository.findAll(Sort.by(Sort.Direction.ASC, "creationTime")).get(0);
    }

    public Store addSocialIcon(SocialIcon socialIcon) {
        Store store = getStore();
        store.addSocialIcon(socialIcon);
        return storeRepository.save(store);
    }

    public Store removeSocialIcon(UUID id) {
        Store store = getStore();
        store.removeSocialIcon(id);
        return storeRepository.save(store);
    }

    public void initStore() {
        if (isStoreInitialized()) return;
        storeRepository.save(Store.builder()
                .minOrderPrice(0.0)
                .build());
    }

    public boolean isStoreInitialized() {
        return !storeRepository.findAll().isEmpty();
    }
}
