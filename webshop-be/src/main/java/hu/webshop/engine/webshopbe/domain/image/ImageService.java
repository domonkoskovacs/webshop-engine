package hu.webshop.engine.webshopbe.domain.image;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collection;
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
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ImageService {

    private final ImageProperties imageProperties;
    @Getter
    private Path storageLocation;

    @PostConstruct
    public void init() {
        storageLocation = Paths.get(imageProperties.getFolderName())
                .toAbsolutePath()
                .normalize();
        try {
            Files.createDirectories(storageLocation);
        } catch (IOException e) {
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, "Failed to create storage directory");
        }
    }

    public String save(MultipartFile image) {
        log.info("Saving image: {}", image.getOriginalFilename());
        try {
            UUID imageId = UUID.randomUUID();
            String fileExtension = extractExtension(image.getOriginalFilename());
            String finalFileName = imageId + fileExtension;
            Path targetPath = storageLocation.resolve(finalFileName);
            Files.copy(image.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return buildUrl(imageId, image.getOriginalFilename());
        } catch (IOException e) {
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, e.getMessage());
        }
    }

    public byte[] get(UUID id, String fileExtension) {
        log.info("get > id: [{}], fileExtension: [{}]", id, fileExtension);
        String fileName = id.toString() + "." + fileExtension;
        Path filePath = storageLocation.resolve(fileName);
        if (!Files.exists(filePath)) {
            throw new EntityNotFoundException("Image not found");
        }
        try {
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, "Failed to read image");
        }
    }

    private String buildUrl(UUID imageId, String fileName) {
        HttpServletRequest request = ((ServletRequestAttributes) Objects.requireNonNull(RequestContextHolder.getRequestAttributes())).getRequest();
        String host = request.getServerName();
        String protocol = request.getScheme();
        int serverPort = request.getServerPort();
        String imageExtension = FilenameUtils.getExtension(fileName);
        StringBuilder builder = new StringBuilder(protocol)
                .append("://")
                .append(host);
        if ("localhost".equals(host)) {
            builder.append(":").append(serverPort);
        }
        builder.append("/api/image/")
                .append(imageId)
                .append("?fileExtension=")
                .append(imageExtension);
        return builder.toString();
    }

    public void delete(String fileName) {
        log.info("delete > fileName: [{}]", fileName);
        if (fileName == null || fileName.trim().isEmpty()) {
            log.warn("Invalid file name provided for deletion");
            return;
        }
        Path filePath = storageLocation.resolve(fileName);
        if (!Files.exists(filePath)) {
            log.warn("File {} does not exist", filePath);
            return;
        }
        try {
            Files.delete(filePath);
            log.info("Deleted image file: {}", filePath);
        } catch (IOException e) {
            log.error("Error deleting file {}: {}", filePath, e.getMessage());
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, "Failed to delete image: " + e.getMessage());
        }
    }

    public void deleteByUrl(String imageUrl) {
        log.info("deleteByUrl > imageUrl: [{}]", imageUrl);
        if (!isLocalImage(imageUrl)) {
            log.info("Skipping deletion. Image URL {} is external.", imageUrl);
            return;
        }
        String fileName = extractFileNameFromUrl(imageUrl);
        if (fileName == null) {
            log.warn("Failed to extract file name from URL: {}", imageUrl);
            return;
        }
        delete(fileName);
    }

    public void deleteByUrls(Collection<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }
        imageUrls.forEach(this::deleteByUrl);
    }

    private boolean isLocalImage(String imageUrl) {
        try {
            URI uri = new URI(imageUrl);
            String urlHost = uri.getHost();
            String backendDomain = imageProperties.getServerDomain();
            return backendDomain.equals(urlHost);
        } catch (Exception e) {
            log.warn("Failed to parse URI {}: {}", imageUrl, e.getMessage());
            return false;
        }
    }

    public String extractFileNameFromUrl(String url) {
        try {
            URI uri = new URI(url);
            String path = uri.getPath();
            String uuidPart = path.substring(path.lastIndexOf('/') + 1);
            String query = uri.getQuery();
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
            log.warn("Error extracting file name from URL {}: {}", url, e.getMessage());
            return null;
        }
    }

    private String extractExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return "";
        }
        return originalFilename.substring(originalFilename.lastIndexOf('.'));
    }
}
