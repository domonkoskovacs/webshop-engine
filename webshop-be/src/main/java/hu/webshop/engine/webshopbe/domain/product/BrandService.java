package hu.webshop.engine.webshopbe.domain.product;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.product.entity.Brand;
import hu.webshop.engine.webshopbe.domain.product.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class BrandService {
    private final BrandRepository brandRepository;

    public List<Brand> getAll() {
        log.info("getAll");
        return brandRepository.findAll();
    }

    public Brand getByName(String brandName) {
        Optional<Brand> brandByName = brandRepository.findBrandByName(brandName);
        return brandByName.orElseGet(() -> {
            Brand newBrand = Brand.builder().name(brandName).build();
            return brandRepository.save(newBrand);
        });
    }

    public boolean existsByName(String brandName) {
        return brandRepository.existsByName(brandName);
    }
}
