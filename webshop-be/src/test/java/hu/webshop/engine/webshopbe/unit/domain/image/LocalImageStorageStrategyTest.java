package hu.webshop.engine.webshopbe.unit.domain.image;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import hu.webshop.engine.webshopbe.domain.base.exception.ImageException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.image.properties.ImageProperties;
import hu.webshop.engine.webshopbe.domain.image.strategy.LocalImageStorageStrategy;

@ExtendWith(MockitoExtension.class)
@DisplayName("LocalImageStorageStrategy unit tests")
class LocalImageStorageStrategyTest {

    @InjectMocks
    private LocalImageStorageStrategy localImageStorageStrategy;
    @Mock
    private ImageProperties imageProperties;

    @Test
    @DisplayName("init throws ImageException when directory creation fails")
    void initThrowsImageExceptionWhenDirectoryCreationFails() {
        //Given
        when(imageProperties.getFolderName()).thenReturn("invalid/folder");

        try (MockedStatic<Files> filesMockedStatic = mockStatic(Files.class)) {
            filesMockedStatic.when(() -> Files.createDirectories(any(Path.class)))
                    .thenThrow(new IOException("Failed to create directory"));
            LocalImageStorageStrategy strategy = new LocalImageStorageStrategy(imageProperties);

            //When //Then
            assertThatThrownBy(strategy::init)
                    .isInstanceOf(ImageException.class)
                    .satisfies(ex -> {
                        ImageException ie = (ImageException) ex;
                        assertThat(ie.getResponse().error().get(0).reasonCode()).isEqualTo(ReasonCode.IMAGE_EXCEPTION);
                        assertThat(ie.getResponse().error().get(0).message()).contains("Failed to create storage directory");
                    });
        }
    }


    @Test
    @DisplayName("save throws ImageException when filename is invalid")
    void saveThrowsImageExceptionWhenFilenameIsInvalid() {
        //Given
        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("invalid_filename_without_dot");

        //When //Then
        assertThatThrownBy(() -> localImageStorageStrategy.save(file))
                .isInstanceOf(ImageException.class)
                .satisfies(ex -> {
                    ImageException ie = (ImageException) ex;
                    assertThat(ie.getResponse().error().get(0).reasonCode()).isEqualTo(ReasonCode.IMAGE_EXCEPTION);
                    assertThat(ie.getResponse().error().get(0).message()).contains("Invalid image filename");
                });
    }

    @Test
    @DisplayName("save throws ImageException when file save fails")
    void saveThrowsImageExceptionWhenFileSaveFails() throws IOException {
        //Given
        when(imageProperties.getFolderName()).thenReturn("test-folder");
        localImageStorageStrategy.init();
        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("test.jpg");
        when(file.getInputStream()).thenThrow(new IOException("I/O Error"));

        //When //Then
        assertThatThrownBy(() -> localImageStorageStrategy.save(file))
                .isInstanceOf(ImageException.class)
                .satisfies(ex -> {
                    ImageException ie = (ImageException) ex;
                    assertThat(ie.getResponse().error().get(0).reasonCode()).isEqualTo(ReasonCode.IMAGE_EXCEPTION);
                    assertThat(ie.getResponse().error().get(0).message()).contains("Failed to save image");
                });
    }


    @Test
    @DisplayName("get throws ImageException when file does not exist")
    void getThrowsImageExceptionWhenFileDoesNotExist() {
        //Given
        when(imageProperties.getFolderName()).thenReturn("test-folder");
        localImageStorageStrategy.init();

        String filename = "nonexistent.jpg";

        try (MockedStatic<Files> filesMockedStatic = mockStatic(Files.class)) {
            Path fakePath = localImageStorageStrategy.getStorageLocation().resolve(filename);
            filesMockedStatic.when(() -> Files.exists(fakePath)).thenReturn(false);

            //When //Then
            assertThatThrownBy(() -> localImageStorageStrategy.get(filename))
                    .isInstanceOf(ImageException.class)
                    .satisfies(ex -> {
                        ImageException ie = (ImageException) ex;
                        assertThat(ie.getResponse().error().get(0).reasonCode()).isEqualTo(ReasonCode.IMAGE_EXCEPTION);
                        assertThat(ie.getResponse().error().get(0).message()).contains("Image file not found");
                    });
        }
    }


    @Test
    @DisplayName("get throws ImageException when file read fails")
    void getThrowsImageExceptionWhenFileReadFails() {
        //Given
        when(imageProperties.getFolderName()).thenReturn("test-folder");
        localImageStorageStrategy.init();

        String filename = "test.jpg";

        try (MockedStatic<Files> filesMockedStatic = mockStatic(Files.class)) {
            Path fakePath = localImageStorageStrategy.getStorageLocation().resolve(filename);

            filesMockedStatic.when(() -> Files.exists(fakePath)).thenReturn(true);
            filesMockedStatic.when(() -> Files.readAllBytes(fakePath))
                    .thenThrow(new IOException("Failed to read file"));

            //When //Then
            assertThatThrownBy(() -> localImageStorageStrategy.get(filename))
                    .isInstanceOf(ImageException.class)
                    .satisfies(ex -> {
                        ImageException ie = (ImageException) ex;
                        assertThat(ie.getResponse().error().get(0).reasonCode()).isEqualTo(ReasonCode.IMAGE_EXCEPTION);
                        assertThat(ie.getResponse().error().get(0).message()).contains("Failed to read image file");
                    });
        }
    }


    @Test
    @DisplayName("delete throws ImageException when file delete fails")
    void deleteThrowsImageExceptionWhenFileDeleteFails() {
        //Given
        when(imageProperties.getFolderName()).thenReturn("test-folder");
        localImageStorageStrategy.init();
        String filename = "test.jpg";

        try (MockedStatic<Files> filesMockedStatic = mockStatic(Files.class)) {
            filesMockedStatic.when(() -> Files.deleteIfExists(any(Path.class)))
                    .thenThrow(new IOException("Failed to delete file"));

            //When //Then
            assertThatThrownBy(() -> localImageStorageStrategy.delete(filename))
                    .isInstanceOf(ImageException.class)
                    .satisfies(ex -> {
                        ImageException ie = (ImageException) ex;
                        assertThat(ie.getResponse().error().get(0).reasonCode()).isEqualTo(ReasonCode.IMAGE_EXCEPTION);
                        assertThat(ie.getResponse().error().get(0).message()).contains("Failed to delete image");
                    });
        }
    }

}

