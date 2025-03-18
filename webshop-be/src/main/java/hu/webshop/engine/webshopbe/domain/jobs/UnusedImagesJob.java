package hu.webshop.engine.webshopbe.domain.jobs;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import hu.webshop.engine.webshopbe.domain.article.ArticleService;
import hu.webshop.engine.webshopbe.domain.article.entity.Article;
import hu.webshop.engine.webshopbe.domain.image.ImageService;
import hu.webshop.engine.webshopbe.domain.image.properties.ImageProperties;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;


@Slf4j
@Component
@RequiredArgsConstructor
public class UnusedImagesJob {

    private final ProductService productService;
    private final ArticleService articleService;
    private final StoreService storeService;
    private final ImageService imageService;
    private final ImageProperties imageProperties;

    /**
     * Deletes unused images if this job is enabled in the store configuration.
     * This job runs as per the configured cron expression (typically every midnight).
     */
    @Scheduled(cron = "${application.schedule.unused-images.cron}")
    @SchedulerLock(name = "deleteUnusedImages", lockAtMostFor = "50s", lockAtLeastFor = "30s")
    public void deleteUnusedImages() {
        log.info("UnusedImagesJob started");

        Path imageDirectory = Paths.get(System.getProperty("user.dir"), imageProperties.getFolderName());
        boolean deleteEnabled = Boolean.TRUE.equals(storeService.getStore().getDeleteUnusedPictures());
        if (!deleteEnabled || !Files.exists(imageDirectory)) {
            log.warn("UnusedImagesJob aborted: deleteUnusedPictures flag is [{}] and image directory exists: [{}]",
                    storeService.getStore().getDeleteUnusedPictures(), Files.exists(imageDirectory));
            return;
        }

        Set<String> referencedFiles = getReferencedFileNames();

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(imageDirectory)) {
            StreamSupport.stream(stream.spliterator(), false)
                    .filter(Files::isRegularFile)
                    .map(path -> path.getFileName().toString())
                    .filter(fileName -> !referencedFiles.contains(fileName))
                    .forEach(this::processUnusedImageFile);
        } catch (IOException e) {
            log.error("Error listing files in directory {}: {}", imageDirectory, e.getMessage());
        }

        log.info("UnusedImagesJob completed");
    }

    private Set<String> getReferencedFileNames() {
        return Stream.concat(
                productService.getAll().stream()
                        .map(Product::getImageUrls)
                        .filter(imageUrls -> imageUrls != null && !imageUrls.trim().isEmpty())
                        .flatMap(imageUrls -> Arrays.stream(imageUrls.split(Constants.IMAGE_URL_SEPARATOR)))
                        .map(String::trim)
                        .map(imageService::extractFileNameFromUrl)
                        .filter(Objects::nonNull),
                articleService.getAll().stream()
                        .map(Article::getImageUrl)
                        .filter(url -> url != null && !url.trim().isEmpty())
                        .map(String::trim)
                        .map(imageService::extractFileNameFromUrl)
                        .filter(Objects::nonNull)
        ).collect(Collectors.toSet());
    }

    private void processUnusedImageFile(String fileName) {
        try {
            imageService.deleteImageFromFolder(fileName);
            log.info("Deleted unused image file: {}", fileName);
        } catch (IllegalArgumentException e) {
            log.warn("File {} does not have a valid UUID", fileName);
        } catch (Exception e) {
            log.error("Failed to delete file {}: {}", fileName, e.getMessage());
        }
    }

}
