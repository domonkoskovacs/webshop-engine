package hu.webshop.engine.webshopbe.domain.image;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.article.ArticleService;
import hu.webshop.engine.webshopbe.domain.article.entity.Article;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ImageCleanUpService {

    private final ProductService productService;
    private final ArticleService articleService;
    private final ImageService imageService;

    public void deleteUnusedImages() {
        Set<String> referencedFiles = getReferencedFileNames();
        Path imageDirectory = imageService.getStorageLocation();
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(imageDirectory)) {
            StreamSupport.stream(stream.spliterator(), false)
                    .filter(Files::isRegularFile)
                    .map(path -> path.getFileName().toString())
                    .filter(fileName -> !referencedFiles.contains(fileName))
                    .forEach(this::processUnusedImageFile);
        } catch (IOException e) {
            log.error("Error listing files in directory {}: {}", imageDirectory, e.getMessage());
        }
    }

    private Set<String> getReferencedFileNames() {
        return Stream.concat(
                productService.getAll().stream()
                        .flatMap(product -> product.getImageUrls().stream())
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
        imageService.delete(fileName);
        log.info("Deleted unused image file: {}", fileName);
    }
}
