package hu.webshop.engine.webshopbe.base;

import static org.awaitility.Awaitility.await;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.FileVisitOption;
import java.nio.file.FileVisitResult;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.SimpleFileVisitor;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.EnumSet;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.TimeUnit;

import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.context.transaction.TestTransaction;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.database.rider.core.api.configuration.DBUnit;
import com.github.database.rider.core.api.configuration.Orthography;
import com.github.database.rider.core.api.dataset.DataSet;
import com.github.database.rider.junit5.api.DBRider;
import hu.webshop.engine.webshopbe.container.MailDevContainer;
import hu.webshop.engine.webshopbe.domain.order.strategy.StripePaymentStrategy;
import hu.webshop.engine.webshopbe.domain.order.value.IntentSecret;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.infrastructure.config.InitDataConfig;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import hu.webshop.engine.webshopbe.infrastructure.model.request.LoginRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Testcontainers
@ActiveProfiles(IntegrationTest.TEST_PROFILE)
@AutoConfigureMockMvc
@Transactional
@ExtendWith(MockitoExtension.class)
@DBRider
@DBUnit(caseInsensitiveStrategy = Orthography.LOWERCASE, schema = "public")
@SpringBootTest(webEnvironment = RANDOM_PORT)
@ContextConfiguration(loader = PropertiesLoggerLoader.class)
public abstract class IntegrationTest {

    public static final String TEST_PROFILE = "test";
    @SuppressWarnings(value = {"all"})
    static final PostgreSQLContainer<?> container = (PostgreSQLContainer<?>) new PostgreSQLContainer(DockerImageName.parse("postgres:latest"))
            .withDatabaseName("test")
            .withUsername("postgres")
            .withPassword("postgres")
            .withReuse(true);
    @SuppressWarnings(value = {"all"})
    static final MailDevContainer<?> mailContainer = (MailDevContainer<?>) new MailDevContainer(DockerImageName.parse("maildev/maildev")).withReuse(true);

    static {
        container.start();
        mailContainer.start();
    }

    @Autowired
    protected MockMvc mockMvc;
    @Autowired
    protected ObjectMapper objectMapper;
    @MockitoBean
    protected StripePaymentStrategy stripeService;
    @MockitoSpyBean
    protected InitDataConfig initDataConfig;
    @MockitoBean
    protected Clock clock;

    @DynamicPropertySource
    public static void properties(DynamicPropertyRegistry registry) {
        PostgreSQLContainer<?> postgreSQLContainer = container;
        registry.add("spring.datasource.url", postgreSQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgreSQLContainer::getUsername);
        registry.add("spring.datasource.password", postgreSQLContainer::getPassword);

        registry.add("spring.mail.port", mailContainer::getSmtpMappedPort);
    }

    @AfterAll
    static void cleanupFolder() throws IOException {
        Files.walkFileTree(Paths.get("src/test/resources/images"), EnumSet.noneOf(FileVisitOption.class), Integer.MAX_VALUE, new SimpleFileVisitor<>() {
            @Override
            public @NotNull FileVisitResult visitFile(Path file, @NotNull BasicFileAttributes attrs) throws IOException {
                if (!file.getFileName().toString().equals("e3ee6173-d53a-46c0-aea8-2de257e47089.png") && file.toString().endsWith(".png")) {
                    Files.delete(file);
                }
                return FileVisitResult.CONTINUE;
            }

            @Override
            public @NotNull FileVisitResult visitFileFailed(Path file, @NotNull IOException exc) {
                return FileVisitResult.CONTINUE;
            }

            @Override
            public @NotNull FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                if (!dir.equals(Paths.get("src/test/resources/images")) && isEmptyDirectory(dir)) {
                    Files.delete(dir);
                }
                return FileVisitResult.CONTINUE;
            }
        });
    }

    private static boolean isEmptyDirectory(Path dir) throws IOException {
        try (DirectoryStream<Path> dirStream = Files.newDirectoryStream(dir)) {
            return !dirStream.iterator().hasNext();
        }
    }

    /**
     * Before each test, it cleans the database, then runs the commandline runner for init users and store
     * mocks payments
     */
    @BeforeEach
    @DataSet(cleanBefore = true)
    void setup() {
        IntentSecret intentSecret = new IntentSecret(UUID.randomUUID().toString(), UUID.randomUUID().toString());
        String refundId = UUID.randomUUID().toString();
        lenient().when(stripeService.createIntent(any())).thenReturn(intentSecret);
        lenient().when(stripeService.retrieveIntent(any())).thenReturn(intentSecret);
        lenient().doNothing().when(stripeService).cancelPaymentIntent(any());
        lenient().when(stripeService.createRefund(any(), any())).thenReturn(refundId);
        initDataConfig.run();
        when(clock.instant()).thenReturn(Instant.parse("2025-03-25T00:00:00Z"));
        when(clock.getZone()).thenReturn(ZoneId.of("UTC"));
    }

    protected void awaitFor(Callable<Boolean> condition) {
        await().pollDelay(Duration.ofMillis(100)).pollInterval(Duration.ofSeconds(1)).atMost(4, TimeUnit.SECONDS).until(condition);
    }

    protected void transaction() {
        TestTransaction.flagForCommit();
        TestTransaction.end();
        TestTransaction.start();
    }

    protected String pathWithId(String pathTemplate, Object id) {
        return pathTemplate.replace("{id}", id.toString());
    }

    protected ResultActions performPost(String url) throws Exception {
        return mockMvc.perform(post(url).contentType(MediaType.APPLICATION_JSON).content(""));
    }

    protected ResultActions performPost(String url, Role role) throws Exception {
        return mockMvc.perform(post(url).contentType(MediaType.APPLICATION_JSON)
                .content("")
                .header(AUTHORIZATION, "Bearer " + getToken(role)));
    }

    protected String getToken(Role role) throws Exception {
        MvcResult mvcResult = performPost(ApiPaths.Auth.LOGIN, new LoginRequest(role == Role.ROLE_ADMIN ? "admin@admin.com" : "test@test.com", role == Role.ROLE_ADMIN ? "admin" : "pass"))
                .andExpect(status().isOk()).andReturn();
        return objectMapper.readTree(mvcResult.getResponse().getContentAsString()).get("accessToken").asText();
    }

    protected ResultActions performPost(String url, Object body) throws Exception {
        return mockMvc.perform(post(url).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    protected ResultActions performPost(String url, Object body, String token) throws Exception {
        return mockMvc.perform(post(url).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)).header(AUTHORIZATION, token));
    }

    protected ResultActions performPost(String url, Object body, Role role) throws Exception {
        return mockMvc.perform(post(url).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)).header(AUTHORIZATION, "Bearer " + getToken(role)));
    }

    protected ResultActions performPost(String url, String payload, String signatureHeader) throws Exception {
        return mockMvc.perform(post(url).header("Stripe-Signature", signatureHeader)
                .content(payload)
                .contentType(MediaType.APPLICATION_JSON)
        );
    }

    protected ResultActions performPut(String url, Object body, Role role) throws Exception {
        return mockMvc.perform(put(url).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)).header(AUTHORIZATION, "Bearer " + getToken(role)));
    }

    protected ResultActions performPut(String url, Object body) throws Exception {
        return mockMvc.perform(put(url).contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));
    }

    protected ResultActions performGet(String url) throws Exception {
        return mockMvc.perform(get(url));
    }

    protected ResultActions performGet(String url, String token) throws Exception {
        return mockMvc.perform(get(url).contentType(MediaType.APPLICATION_JSON).header(AUTHORIZATION, token));
    }

    protected ResultActions performGet(String url, Role role) throws Exception {
        return mockMvc.perform(get(url).contentType(MediaType.APPLICATION_JSON).header(AUTHORIZATION, "Bearer " + getToken(role)));
    }

    protected ResultActions performGet(String url, Role role, MultiValueMap<String, String> params) throws Exception {
        return mockMvc.perform(get(url).contentType(MediaType.APPLICATION_JSON)
                .params(params)
                .header(AUTHORIZATION, "Bearer " + getToken(role)));
    }

    protected ResultActions performDelete(String url, Role role) throws Exception {
        return mockMvc.perform(delete(url).header(AUTHORIZATION, "Bearer " + getToken(role)));
    }

    protected ResultActions performDelete(String url, Role role, Object body) throws Exception {
        return mockMvc.perform(delete(url).contentType(MediaType.APPLICATION_JSON).header(AUTHORIZATION, "Bearer " + getToken(role)).content(objectMapper.writeValueAsString(body)));
    }

    protected ResultActions performDelete(String url) throws Exception {
        return mockMvc.perform(delete(url));
    }

    protected ResultActions performDelete(String url, Object body) throws Exception {
        return mockMvc.perform(delete(url).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(body)));
    }
}
