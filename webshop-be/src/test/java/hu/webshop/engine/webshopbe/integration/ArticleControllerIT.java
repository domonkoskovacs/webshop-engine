package hu.webshop.engine.webshopbe.integration;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.nio.file.Paths;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.ResultActions;

import com.github.database.rider.core.api.dataset.DataSet;
import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.domain.article.repository.ArticleRepository;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import lombok.RequiredArgsConstructor;

@DisplayName("Article controller integration test")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class ArticleControllerIT extends IntegrationTest {

    private static final String BASE_URL = "/api/article";
    private static final String VALID_ARTICLE_ID = "a40ce50d-531e-4205-84b0-3244b983a8ae";
    private final ArticleRepository articleRepository;

    @Test
    @DisplayName("all articles can be retrieved")
    @DataSet(value = "article.yml")
    void allArticlesCanBeRetrieved() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL);

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("name"));
    }

    @Test
    @DisplayName("article can be retrieved by id")
    @DataSet("article.yml")
    void articleCanBeRetrievedById() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL + "/" + VALID_ARTICLE_ID);

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("name"));
    }

    @Test
    @DisplayName("not found article return 404")
    @DataSet("article.yml")
    void notFoundArticleReturn404() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL + "/a40ce50d-531e-4205-84b0-3244b983a8a1");

        //Then
        resultActions.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Admin can create an article")
    void adminCanCreateAnArticle() throws Exception {
        //Given
        byte[] pngBytes = Files.readAllBytes(Paths.get("src/test/resources/images/e3ee6173-d53a-46c0-aea8-2de257e47089.png"));
        MockMultipartFile image = new MockMultipartFile("image", "test.png", MediaType.IMAGE_PNG_VALUE, pngBytes);

        //When
        ResultActions resultActions = mockMvc.perform(multipart(BASE_URL)
                .file(image)
                .param("name", "name")
                .param("text", "text")
                .param("buttonText", "button")
                .param("buttonLink", "link")
                .header(AUTHORIZATION, "Bearer " + getToken(Role.ROLE_ADMIN)));

        //Then
        resultActions.andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("name"));
        transaction();
        awaitFor(() -> !articleRepository.findAll().isEmpty());
    }

    @Test
    @DisplayName("Article can be deleted by admin")
    @DataSet("article.yml")
    void articleCanBeDeletedByAdmin() throws Exception {
        //Given //When
        ResultActions resultActions = performDelete(BASE_URL + "/" + VALID_ARTICLE_ID, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk());
        transaction();
        awaitFor(() -> articleRepository.findAll().isEmpty());
    }
}
