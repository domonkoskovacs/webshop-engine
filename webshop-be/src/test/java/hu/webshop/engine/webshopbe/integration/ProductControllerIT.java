package hu.webshop.engine.webshopbe.integration;

import static org.junit.jupiter.api.Assertions.fail;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.github.database.rider.core.api.dataset.DataSet;
import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.product.repository.ProductRepository;
import hu.webshop.engine.webshopbe.domain.product.value.Discount;
import hu.webshop.engine.webshopbe.domain.product.value.Gender;
import hu.webshop.engine.webshopbe.domain.product.value.ProductSortType;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CsvRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.DeleteProductRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.DiscountRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ProductRequest;
import lombok.RequiredArgsConstructor;

@DisplayName("Product controller integration tests")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class ProductControllerIT extends IntegrationTest {

    private static final String BASE_URL = "/api/product";
    private static final String PRODUCT_ID = "b7f86506-8ea8-4908-b8f4-668c5ec6a7e1";
    private static final UUID SUB_CATEGORY_ID = UUID.fromString("a40ce50d-531e-4205-84b0-3244b983a8a1");
    private final ProductRepository productRepository;

    @Test
    @DisplayName("product can be created")
    @DataSet("category.yml")
    void productCanBeCreated() throws Exception {
        //Given
        ProductRequest request = new ProductRequest("brand", "name", "des",
                SUB_CATEGORY_ID, Gender.UNISEX, 2, 3.2, 10.0, null, "000");

        //When
        ResultActions resultActions = mockMvc.perform(getMultipartRequest(HttpMethod.POST, BASE_URL, request, Role.ROLE_ADMIN));

        //Then
        resultActions.andExpect(status().isCreated()).andExpect(jsonPath("$.brand.name").value("brand"));
    }

    @NotNull
    private MockHttpServletRequestBuilder getMultipartRequest(HttpMethod httpMethod, String url, ProductRequest request, Role role) throws Exception {
        byte[] pngBytes = Files.readAllBytes(Paths.get("src/test/resources/images/e3ee6173-d53a-46c0-aea8-2de257e47089.png"));
        MockMultipartFile image1 = new MockMultipartFile("images", "test.png", MediaType.IMAGE_PNG_VALUE, pngBytes);
        MockMultipartFile image2 = new MockMultipartFile("images", "test.png", MediaType.IMAGE_PNG_VALUE, pngBytes);
        return multipart(httpMethod, url)
                .file(image1)
                .file(image2)
                .param("brand", request.brand())
                .param("name", request.name())
                .param("description", request.description())
                .param("subCategoryId", request.subCategoryId().toString())
                .param("gender", String.valueOf(request.gender()))
                .param("count", request.count().toString())
                .param("price", request.price().toString())
                .param("discountPercentage", request.discountPercentage().toString())
                .header(AUTHORIZATION, "Bearer " + getToken(role));
    }

    @Test
    @DisplayName("get all product")
    @DataSet("adminAndProducts.yml")
    void getAllProduct() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.content").isArray()).andExpect(jsonPath("$.content").isNotEmpty());
    }

    @Test
    @DisplayName("get all product with all params")
    @DataSet("adminAndProducts.yml")
    void getAllProductWithAllParams() throws Exception {
        //Given
        ProductSortType sortType = ProductSortType.ASC_PRICE;

        //When
        ResultActions resultActions = mockMvc.perform(get(BASE_URL)
                .param("brands", "brand")
                .param("categories", "category")
                .param("subCategories", "subCategory")
                .param("genders", Gender.UNISEX.toString(), Gender.MEN.toString())
                .param("maxPrice", "100.0")
                .param("minPrice", "1.0")
                .param("maxDiscountPercentage", "20.0")
                .param("minDiscountPercentage", "1.0")
                .param("itemNumber", "0")
                .param("sortType", sortType.name())
                .param("page", "0")
                .param("size", "10")
                .accept(MediaType.APPLICATION_JSON));

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content").isNotEmpty());
    }

    @Test
    @DisplayName("all sort types work")
    @DataSet("adminAndProducts.yml")
    void allSortTypesWork() throws Exception {
        //Given //When //Then
        mockMvc.perform(get(BASE_URL).param("sortType", ProductSortType.ASC_PRICE.name())).andExpect(status().isOk());
        mockMvc.perform(get(BASE_URL).param("sortType", ProductSortType.DESC_PRICE.name())).andExpect(status().isOk());
        mockMvc.perform(get(BASE_URL).param("sortType", ProductSortType.ASC_DISCOUNT.name())).andExpect(status().isOk());
        mockMvc.perform(get(BASE_URL).param("sortType", ProductSortType.DESC_DISCOUNT.name())).andExpect(status().isOk());
    }

    @Test
    @DisplayName("product can be retrieved by id")
    @DataSet("adminAndProducts.yml")
    void productCanBeRetrievedById() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL + "/" + PRODUCT_ID, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.brand.name").value("brand"));
    }

    @Test
    @DisplayName("not found product return 404")
    @DataSet("adminAndProducts.yml")
    void notFoundProductReturn404() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL + "/b7f86506-8ea8-4908-b8f4-668c5ec1a727", Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("product can be deleted")
    @DataSet("adminAndProducts.yml")
    void productCanBeDeleted() throws Exception {
        //Given
        DeleteProductRequest deleteProductRequest = new DeleteProductRequest(List.of(UUID.fromString(PRODUCT_ID)));

        //When
        ResultActions resultActions = performDelete(BASE_URL, Role.ROLE_ADMIN, deleteProductRequest);
        transaction();

        //Then
        resultActions.andExpect(status().isOk());
        awaitFor(() -> productRepository.findById(UUID.fromString(PRODUCT_ID)).orElse(null) == null);
    }

    @Test
    @DisplayName("product can be updated")
    @DataSet("adminAndProducts.yml")
    void productCanBeUpdated() throws Exception {
        //Given
        ProductRequest request = new ProductRequest("newBrand", "name", "des",
                SUB_CATEGORY_ID, Gender.UNISEX, 2, 3.2, 10.0, null, "000");

        //When
        ResultActions resultActions = mockMvc.perform(getMultipartRequest(HttpMethod.PUT, BASE_URL + "/" + PRODUCT_ID, request, Role.ROLE_ADMIN));

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.brand.name").value("newBrand"));
    }

    @Test
    @DisplayName("discount can be set")
    @DataSet("adminAndProducts.yml")
    void discountCanBeSet() throws Exception {
        //Given
        DiscountRequest request = new DiscountRequest(List.of(new Discount(UUID.fromString(PRODUCT_ID), 20.0)));

        //When
        ResultActions resultActions = performPost(BASE_URL + "/discount", request, Role.ROLE_ADMIN);
        transaction();

        //Then
        awaitFor(() -> {
            Optional<Product> byId = productRepository.findById(UUID.fromString(PRODUCT_ID));
            if (byId.isPresent()) {
                Product product = byId.get();
                return product.getDiscountPercentage().equals(20.0);
            }
            return false;
        });
        resultActions.andExpect(status().isOk());
    }

    @Test
    @DisplayName("get endpoints are public")
    @DataSet("adminAndProducts.yml")
    void getEndpointsArePublic() throws Exception {
        //Given
        ProductRequest request = new ProductRequest("brand", "name", "des",
                SUB_CATEGORY_ID, Gender.UNISEX, 2, 3.2, 10.0, null, "000");
        DiscountRequest discountRequest = new DiscountRequest(List.of(new Discount(UUID.fromString(PRODUCT_ID), 20.0)));
        DeleteProductRequest deleteProductRequest = new DeleteProductRequest(List.of(UUID.fromString(PRODUCT_ID)));

        //When //Then
        performGet(BASE_URL).andExpect(status().isOk());
        performGet(BASE_URL + "/" + PRODUCT_ID).andExpect(status().isOk());
        mockMvc.perform(getMultipartRequest(HttpMethod.POST, BASE_URL, request)).andExpect(status().isForbidden());
        performDelete(BASE_URL, deleteProductRequest).andExpect(status().isForbidden());
        mockMvc.perform(getMultipartRequest(HttpMethod.PUT, BASE_URL + "/" + PRODUCT_ID, request)).andExpect(status().isForbidden());
        performPost(BASE_URL + "/discount", discountRequest).andExpect(status().isForbidden());
    }

    @NotNull
    private MockHttpServletRequestBuilder getMultipartRequest(HttpMethod httpMethod, String url, ProductRequest request) throws Exception {
        byte[] pngBytes = Files.readAllBytes(Paths.get("src/test/resources/images/e3ee6173-d53a-46c0-aea8-2de257e47089.png"));
        MockMultipartFile image1 = new MockMultipartFile("images", "test.png", MediaType.IMAGE_PNG_VALUE, pngBytes);
        MockMultipartFile image2 = new MockMultipartFile("images", "test.png", MediaType.IMAGE_PNG_VALUE, pngBytes);
        return multipart(httpMethod, url)
                .file(image1)
                .file(image2)
                .param("brand", request.brand())
                .param("name", request.name())
                .param("description", request.description())
                .param("subCategoryId", request.subCategoryId().toString())
                .param("gender", request.gender().toString())
                .param("count", request.count().toString())
                .param("price", request.price().toString())
                .param("discountPercentage", request.discountPercentage().toString());
    }

    @Test
    @DisplayName("user can call get endpoint but not any other")
    @DataSet("verifiedUserAndProduct.yml")
    void userCanCallGetEndpointButNotAnyOther() throws Exception {
        //Given
        ProductRequest request = new ProductRequest("brand", "name", "des",
                SUB_CATEGORY_ID, Gender.UNISEX, 2, 3.2, 10.0, null, "000");
        DiscountRequest discountRequest = new DiscountRequest(List.of(new Discount(UUID.fromString(PRODUCT_ID), 20.0)));
        DeleteProductRequest deleteProductRequest = new DeleteProductRequest(List.of(UUID.fromString(PRODUCT_ID)));

        //When //Then
        performGet(BASE_URL, Role.ROLE_USER).andExpect(status().isOk());
        performGet(BASE_URL + "/" + PRODUCT_ID, Role.ROLE_USER).andExpect(status().isOk());
        mockMvc.perform(getMultipartRequest(HttpMethod.POST, BASE_URL, request, Role.ROLE_USER)).andExpect(status().isForbidden());
        performDelete(BASE_URL, Role.ROLE_USER, deleteProductRequest).andExpect(status().isForbidden());
        mockMvc.perform(getMultipartRequest(HttpMethod.PUT, BASE_URL + "/" + PRODUCT_ID, request, Role.ROLE_USER)).andExpect(status().isForbidden());
        performPost(BASE_URL + "/discount", discountRequest, Role.ROLE_USER).andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("all brands can be retried")
    @DataSet("brand.yml")
    void allBrandsCanBeRetried() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL + "/brand");

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray()).andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$[0].name").value("brand"));
    }

    @Test
    @DisplayName("product can be imported")
    @DataSet("brandAndSubCategory.yml")
    void productCanBeImported() throws Exception {
        //Given
        if (!productRepository.findAll().isEmpty()) fail();
        CsvRequest request = new CsvRequest("aXRlbU51bWJlcjticmFuZDtuYW1lO2Rlc2NyaXB0aW9uO3N1YkNhdGVnb3J5TmFtZTtnZW5kZXI7Y291bnQ7cHJpY2U7ZGlzY291bnRQZXJjZW50YWdlO2ltYWdlc1VybHMNCml0ZW0wMDA7YnJhbmQ7c2hpcnQ7dGhpcyBpcyBhIHNoaXJ0O3N1YkNhdGVnb3J5O1VOSVNFWDsxMDsxMC4wOzEuMDtpbWFnZVVybA");

        //When
        ResultActions resultActions = performPost(BASE_URL + "/import", request, Role.ROLE_ADMIN);
        transaction();

        //Then
        resultActions.andExpect(status().isOk());
        awaitFor(() -> !productRepository.findAll().isEmpty());
    }

    @Test
    @DisplayName("products can be exported")
    @DataSet("adminAndProducts.yml")
    void productsCanBeExported() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL + "/export", Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.csv")
                .value("QnJhbmQ7TmFtZTtEZXNjcmlwdGlvbjtTdWJDYXRlZ29yeTtHZW5kZXI7Q291bnQ7UHJpY2U7RGlzY291bnRQZXJjZW50YWdlO0ltYWdlVXJscztJdGVtTnVtYmVyDQpicmFuZDtuYW1lO2Rlc2NyaXB0aW9uO3N1YkNhdGVnb3J5O1VOSVNFWDsyOzEwLjA7MTAuMDs7aXRlbU5vMDAwDQpicmFuZDtuYW1lO2Rlc2NyaXB0aW9uO3N1YkNhdGVnb3J5O1VOSVNFWDsyOzEwLjA7MTAuMDs7aXRlbU5vMDAwDQo="));

    }

    @Test
    @DisplayName("products can be exported with all params")
    @DataSet("adminAndProducts.yml")
    void productsCanBeExportedWithAllParams() throws Exception {
        //Given
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("from", "2023-09-09");
        params.add("to", "2023-09-11");
        params.addAll("brands", List.of("brand", "randomBrand"));
        params.addAll("categories", List.of("category", "randomCategory"));
        params.addAll("subCategories", List.of("subCategory", "randomSubCategory"));
        params.addAll("genders", List.of(Gender.UNISEX.toString(), Gender.MEN.toString()));
        params.add("maxPrice", "20.0");
        params.add("minPrice", "2.0");
        params.add("maxDiscountPercentage", "100.0");
        params.add("minDiscountPercentage", "0.0");
        params.add("showOutOfStock", "true");

        //When
        ResultActions resultActions = performGet(BASE_URL + "/export", Role.ROLE_ADMIN, params);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.csv")
                .value("QnJhbmQ7TmFtZTtEZXNjcmlwdGlvbjtTdWJDYXRlZ29yeTtHZW5kZXI7Q291bnQ7UHJpY2U7RGlzY291bnRQZXJjZW50YWdlO0ltYWdlVXJscztJdGVtTnVtYmVyDQpicmFuZDtuYW1lO2Rlc2NyaXB0aW9uO3N1YkNhdGVnb3J5O1VOSVNFWDsyOzEwLjA7MTAuMDs7aXRlbU5vMDAwDQpicmFuZDtuYW1lO2Rlc2NyaXB0aW9uO3N1YkNhdGVnb3J5O1VOSVNFWDsyOzEwLjA7MTAuMDs7aXRlbU5vMDAwDQo="));
    }
}
