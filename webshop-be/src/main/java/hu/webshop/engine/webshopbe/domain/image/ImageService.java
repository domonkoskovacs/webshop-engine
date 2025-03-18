package hu.webshop.engine.webshopbe.domain.image;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Objects;
import java.util.UUID;

import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import hu.webshop.engine.webshopbe.domain.base.exception.ImageException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.image.properties.ImageProperties;
import hu.webshop.engine.webshopbe.domain.image.value.ImageIdentifier;
import hu.webshop.engine.webshopbe.domain.util.Constants;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ImageService {

    private final ImageProperties imageProperties;

    public byte[] getImageFromFolder(UUID id, String fileExtension) {
        log.info("getImageFromFolder > id: [{}]", id);
        String imageName = id.toString() + "." + fileExtension;
        Path imageDirectory = Paths.get(imageProperties.getFolderName());
        Path fullImageDirectory = Paths.get(System.getProperty("user.dir"), String.valueOf(imageDirectory));
        Path imagePath = Path.of(String.valueOf(fullImageDirectory), imageName);

        if (!Files.exists(imagePath)) {
            throw new EntityNotFoundException("Image not found");
        }

        try {
            return Files.readAllBytes(new File(imagePath.toUri()).toPath());
        } catch (IOException e) {
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, "Image can't be read");
        }
    }

    public ImageIdentifier saveImageToFolder(MultipartFile image) {
        log.info("saveImageToFolder > image: [{}]", image);
        try {
            Path imageDirectory = Paths.get(imageProperties.getFolderName());
            Path fullImageDirectory = Paths.get(System.getProperty("user.dir"), String.valueOf(imageDirectory));
            Files.createDirectories(fullImageDirectory);
            UUID imageId = UUID.randomUUID();
            String originalFilename = image.getOriginalFilename();
            String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf('.')) : "";
            String finalFileName = imageId + fileExtension;
            Path imagePath = fullImageDirectory.resolve(finalFileName);
            Files.copy(image.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            return new ImageIdentifier(imageId, image.getOriginalFilename());
        } catch (IOException e) {
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, e.getMessage());
        }
    }

    public String getImageUrl(ImageIdentifier image) {
        HttpServletRequest request = ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();
        String host = request.getServerName();
        String protocol = request.getScheme();
        int serverPort = request.getServerPort();
        String imageExtension = (image.originalFilename() != null) ? FilenameUtils.getExtension(image.originalFilename()) : null;
        StringBuilder builder = new StringBuilder();
        builder.append(protocol)
                .append("://")
                .append(host);
        if (host.equals("localhost")) {
            builder.append(":")
                    .append(serverPort);
        }
        builder.append("/api/image/")
                .append(image.imageId())
                .append("?fileExtension=")
                .append(imageExtension);
        return builder.toString();
    }


    /**
     * Deletes the image file corresponding to the given image URL.
     * Expects URLs in the format:
     * path/{uuid}?fileExtension={ext}
     * If the URL’s host does not match the backend domain (configured via imageProperties),
     * the image is assumed to be hosted externally (e.g., via a CDN) and is not deleted.
     *
     * @param imageUrl the image URL to delete.
     */
    public void deleteImageFromFolder(String imageUrl) {
        log.info("deleteImageFromFolder > imageUrl: {}", imageUrl);
        try {
            URI imageUri = new URI(imageUrl);
            String urlHost = imageUri.getHost();
            String backendDomain = imageProperties.getServerDomain();
            if (!urlHost.equals(backendDomain)) {
                log.info("Skipping deletion. Image URL host [{}] does not match backend domain [{}].", urlHost, backendDomain);
                return;
            }
        } catch (Exception e) {
            log.warn("Could not parse URI for image deletion check: [{}]", e.getMessage());
            return;
        }
        String fileName = extractFileNameFromUrl(imageUrl);
        if (fileName == null) {
            log.warn("Failed to extract file name from URL: [{}]", imageUrl);
            return;
        }
        deleteImageFromFileName(fileName);
    }

    /**
     * Deletes multiple image files given a comma-separated list of image URLs.
     * Each URL is processed individually.
     *
     * @param imageUrls the comma-separated list of image URLs.
     */
    public void deleteImagesFromFolder(String imageUrls) {
        log.info("deleteImagesFromFolder > imageUrls: [{}]", imageUrls);
        if (imageUrls == null || imageUrls.trim().isEmpty()) {
            return;
        }
        Arrays.stream(imageUrls.split(Constants.IMAGE_URL_SEPARATOR))
                .map(String::trim)
                .filter(url -> !url.isEmpty())
                .forEach(this::deleteImageFromFolder);
    }

    /**
     * Deletes the image file corresponding to the given file name.
     * Assumes the file name is in the format {uuid}.{ext}.
     *
     * @param fileName the image file name to delete.
     */
    public void deleteImageFromFileName(String fileName) {
        log.info("deleteImageFromFileName > fileName: [{}]", fileName);
        if (fileName == null || fileName.trim().isEmpty()) {
            log.warn("File name is null or empty");
            return;
        }
        Path imagePath = getFullImagePath(fileName);
        if (!Files.exists(imagePath)) {
            log.warn("Image file {} does not exist", imagePath);
            return;
        }
        try {
            Files.delete(imagePath);
            log.info("Deleted image file: {}", imagePath);
        } catch (IOException e) {
            log.error("Failed to delete image file {}: {}", imagePath, e.getMessage());
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, "Failed to delete image: " + e.getMessage());
        }
    }

    /**
     * Extracts the expected file name from an image URL.
     * Expects URLs in the format:
     * path/{uuid}?fileExtension={ext}
     * and returns a file name in the format: {uuid}.{ext}.
     * Uses URI instead of URL.
     *
     * @param url the image URL.
     * @return the constructed file name, or null if extraction fails.
     */
    public String extractFileNameFromUrl(String url) {
        log.info("extractFileNameFromUrl > url: [{}]", url);
        try {
            URI imageUri = new URI(url);
            String path = imageUri.getPath();
            String uuidPart = path.substring(path.lastIndexOf('/') + 1);
            String query = imageUri.getQuery();
            String extension = null;
            if (query != null) {
                for (String param : query.split("&")) {
                    if (param.startsWith("fileExtension=")) {
                        extension = param.substring("fileExtension=".length());
                        break;
                    }
                }
            }
            if (uuidPart.isEmpty() || extension == null || extension.isEmpty()) {
                return null;
            }
            return uuidPart + "." + extension;
        } catch (Exception e) {
            log.warn("Failed to extract file name from URL {}: {}", url, e.getMessage());
            return null;
        }
    }

    /**
     * Builds the full path to an image file based on the configured folder.
     *
     * @param fileName the image file name (e.g. uuid.jpg).
     * @return the full Path to the image file.
     */
    private Path getFullImagePath(String fileName) {
        Path imageDirectory = Paths.get(imageProperties.getFolderName());
        Path fullImageDirectory = Paths.get(System.getProperty("user.dir"), imageDirectory.toString());
        return fullImageDirectory.resolve(fileName);
    }
}