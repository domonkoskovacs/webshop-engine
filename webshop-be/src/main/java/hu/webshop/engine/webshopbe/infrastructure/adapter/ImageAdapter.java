package hu.webshop.engine.webshopbe.infrastructure.adapter;

import java.util.UUID;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.image.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageAdapter {

    private final ImageService imageService;

    public ByteArrayResource getById(UUID id) {
        log.info("getImage > id: [{}]", id);
        return imageService.getById(id);
    }
}
