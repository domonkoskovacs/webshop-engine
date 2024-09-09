package hu.webshop.engine.webshopbe.integration;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.ResultActions;

import hu.webshop.engine.webshopbe.base.IntegrationTest;

@DisplayName("Image controller integration test")
class ImageControllerIT extends IntegrationTest {
    private static final String BASE_URL = "/api/image";
    private static final String IMAGE_ID = "e3ee6173-d53a-46c0-aea8-2de257e47089";
    private static final String WRONG_IMAGE_ID = "fdd9468a-5bbf-4999-af30-a5a796ecab3d";
    private static final String IMAGE_EXTENSION = "png";

    @Test
    @DisplayName("get image endpoint return an image")
    void getImageEndpointReturnAnImage() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL + "/" + IMAGE_ID + "?fileExtension=" + IMAGE_EXTENSION);

        //Then
        resultActions.andExpect(status().isOk());
    }

    @Test
    @DisplayName("wrong id gives back 404")
    void wrongIdGivesBack404() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL + "/" + WRONG_IMAGE_ID + "?fileExtension=" + IMAGE_EXTENSION);

        //Then
        resultActions.andExpect(status().isNotFound());
    }
}
