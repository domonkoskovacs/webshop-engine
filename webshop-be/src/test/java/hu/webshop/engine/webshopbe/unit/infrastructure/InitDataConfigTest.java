package hu.webshop.engine.webshopbe.unit.infrastructure;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.infrastructure.config.InitDataConfig;

@ExtendWith(MockitoExtension.class)
@DisplayName("Init data config unit tests")
class InitDataConfigTest {

    @Mock
    private UserService userService;

    @Mock
    private InitDataConfig.AdminProperties adminProperties;

    @Mock
    private StoreService storeService;

    @InjectMocks
    private InitDataConfig initDataConfig;

    @Test
    @DisplayName("admin is saved if the admin count is 0")
    void adminIsSavedIfTheAdminCountIs0() {
        //Given
        when(adminProperties.getUsername()).thenReturn("admin");
        when(adminProperties.getPassword()).thenReturn("admin");

        //When
        initDataConfig.run();

        //Then
        verify(userService, times(1)).initUser(any());
    }

    @Test
    @DisplayName("only admin was created")
    void onlyAdminWasCreated() {
        //Given
        when(userService.getCountByRole(Role.ROLE_ADMIN)).thenReturn(0L);
        when(adminProperties.getUsername()).thenReturn("admin");
        when(adminProperties.getPassword()).thenReturn("admin");

        //When
        initDataConfig.run();

        //Then
        verify(userService).initUser(any());
    }

    @Test
    @DisplayName("no init user is created when they both present")
    void noInitUserIsCreatedWhenTheyBothPresent() {
        //Given
        when(userService.getCountByRole(Role.ROLE_ADMIN)).thenReturn(1L);

        //When
        initDataConfig.run();

        //Then
        verify(userService, times(0)).initUser(any());
    }

    @Test
    @DisplayName("store created if it is not initialized")
    void storeCreatedIfItIsNotInitialized() {
        //Given
        when(storeService.isStoreInitialized()).thenReturn(false);

        //When
        initDataConfig.run();

        //Then
        verify(storeService, times(1)).initStore();
    }

    @Test
    @DisplayName("store is not created if initialized")
    void storeIsNotCreatedIfInitialized() {
        //Given
        when(storeService.isStoreInitialized()).thenReturn(true);

        //When
        initDataConfig.run();

        //Then
        verify(storeService, times(0)).initStore();
    }
}
