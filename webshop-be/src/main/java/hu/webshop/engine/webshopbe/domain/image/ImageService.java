package hu.webshop.engine.webshopbe.domain.image;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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
import hu.webshop.engine.webshopbe.domain.image.entity.Image;
import hu.webshop.engine.webshopbe.domain.image.properties.ImageProperties;
import hu.webshop.engine.webshopbe.domain.image.repository.ImageRepository;
import hu.webshop.engine.webshopbe.domain.image.value.ImageIdentifier;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ImageService { //todo javadoc

    private final ImageRepository imageRepository;
    private final ImageProperties imageProperties;

    public Image getImage(UUID id) {
        log.info("getImage > id: [{}]", id);
        return imageRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Image not found")); //todo enable this functionality
    }

    public UUID saveImage(MultipartFile image) { //todo enable this functionality
        log.info("saveImage > image: [{}]", image);
        try {
            return imageRepository.save(Image.builder().imageData(image.getBytes()).build()).getId();
        } catch (IOException e) {
            throw new ImageException(ReasonCode.IMAGE_EXCEPTION, e.getMessage());
        }
    }

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

    //todo image cdn

    public void deleteImage(UUID id) {
        log.info("deleteImage > id: [{}]", id);
        //todo delete image, also add function call to article and product delete to ensure there are no unused images
    }
}
