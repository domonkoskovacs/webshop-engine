package hu.webshop.engine.webshopbe.integration;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import com.github.database.rider.core.api.dataset.DataSet;
import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.domain.product.repository.CategoryRepository;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CategoryRequest;
import lombok.RequiredArgsConstructor;

@DisplayName("Category controller integration tests")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class CategoryControllerIT extends IntegrationTest {

    private static final String BASE_URL = "/api/category";
    private static final String CATEGORY_ID = "a40ce50d-531e-4205-84b0-3244b983a8ae";
    private static final String SUB_CATEGORY_ID = "a40ce50d-531e-4205-84b0-3244b983a8a1";
    private final CategoryRepository categoryRepository;

    @Test
    @DisplayName("all category can be retrieved")
    @DataSet("category.yml")
    void allCategoryCanBeRetrieved() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL);

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$[0].name").value("category"))
                .andExpect(jsonPath("$[0].subCategories[0].name").value("subCategory"));
    }

    @Test
    @DisplayName("get category by id")
    @DataSet("category.yml")
    void getCategoryById() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL + "/" + CATEGORY_ID);

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("category"))
                .andExpect(jsonPath("$.subCategories[0].name").value("subCategory"));
    }

    @Test
    @DisplayName("not found category throws 404")
    void notFoundCategoryThrows404() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL + "/a40ce50d-531e-4205-84b0-3244b983a8a2");

        //Then
        resultActions.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("category can be created")
    void categoryCanBeCreated() throws Exception {
        //Given
        CategoryRequest request = new CategoryRequest("name");

        //When
        ResultActions resultActions = performPost(BASE_URL, request, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("name"));
        transaction();
        awaitFor(() -> !categoryRepository.findAll().isEmpty());
    }

    @Test
    @DisplayName("sub category can be added")
    @DataSet(value = "category.yml")
    void subCategoryCanBeAdded() throws Exception {
        //Given
        CategoryRequest request = new CategoryRequest("name");

        //When
        ResultActions resultActions = performPost(BASE_URL + "/subCategory/" + CATEGORY_ID, request, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isCreated())
                .andExpect(jsonPath("$.subCategories").isArray())
                .andExpect(jsonPath("$.subCategories", hasSize(2)));
    }

    @Test
    @DisplayName("category can be updated")
    @DataSet(value = "category.yml")
    void categoryCanBeUpdated() throws Exception {
        //Given
        CategoryRequest request = new CategoryRequest("name");

        //When
        ResultActions resultActions = performPut(BASE_URL + "/" + CATEGORY_ID, request, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("name"));
    }

    @Test
    @DisplayName("category can be deleted")
    @DataSet(value = "category.yml")
    void categoryCanBeDeleted() throws Exception {
        //Given //When
        ResultActions resultActions = performDelete(BASE_URL + "/" + CATEGORY_ID, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk());
    }

    @Test
    @DisplayName("sub category can be deleted")
    @DataSet(value = "category.yml")
    void subCategoryCanBeDeleted() throws Exception {
        //Given //When
        ResultActions resultActions = performDelete(BASE_URL + "/subCategory/" + SUB_CATEGORY_ID, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk());
    }
}
