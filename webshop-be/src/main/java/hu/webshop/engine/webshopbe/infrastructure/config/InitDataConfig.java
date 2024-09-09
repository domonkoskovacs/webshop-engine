package hu.webshop.engine.webshopbe.infrastructure.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class InitDataConfig implements CommandLineRunner {

    private final UserService userService;
    private final AdminProperties adminProperties;
    private final StoreService storeService;

    @Override
    public void run(String... args) {
        if (userService.getCountByRole(Role.ROLE_ADMIN) == 0) {
            User defaultAdmin = User.builder()
                    .email(adminProperties.getUsername() + "@admin.com")
                    .firstname(adminProperties.getUsername())
                    .lastname(adminProperties.getUsername())
                    .password(adminProperties.getPassword())
                    .role(Role.ROLE_ADMIN)
                    .verified(true)
                    .phoneNumber("123")
                    .build();

            userService.initUser(defaultAdmin);
            log.info("admin was created: [{}]", defaultAdmin);
        }
        if (!storeService.isStoreInitialized()) {
            storeService.initStore();
        }
    }

    @Data
    @Component
    @ConfigurationProperties("spring.security.admin")
    public static class AdminProperties {
        private String username;
        private String password;
    }
}
