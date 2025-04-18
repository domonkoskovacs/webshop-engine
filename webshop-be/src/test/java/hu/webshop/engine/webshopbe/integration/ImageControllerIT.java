package hu.webshop.engine.webshopbe.integration;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.ResultActions;

import com.github.database.rider.core.api.dataset.DataSet;
import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;

@DisplayName("Image controller integration test")
class ImageControllerIT extends IntegrationTest {
    private static final String IMAGE_ID = "92f27627-9b1b-4a2e-aad5-f5ad38f01f74";
    private static final String WRONG_IMAGE_ID = "fdd9468a-5bbf-4999-af30-a5a796ecab3d";

    @Test
    @DisplayName("get image endpoint return an image")
    @DataSet("image.yaml")
    void getImageEndpointReturnAnImage() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(pathWithId(ApiPaths.Images.BY_ID, IMAGE_ID));

        //Then
        resultActions.andExpect(status().isOk());
    }

    @Test
    @DisplayName("wrong id gives back 404")
    void wrongIdGivesBack404() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(pathWithId(ApiPaths.Images.BY_ID, WRONG_IMAGE_ID));

        //Then
        resultActions.andExpect(status().isNotFound());
    }
}
