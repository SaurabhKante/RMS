package com.rms.service.impl;

import com.rms.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    @Override
    public String uploadDishImage(MultipartFile file) {

        String originalFilename = file.getOriginalFilename();

        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(
                    originalFilename.lastIndexOf(".")
            );
        }

        String objectKey =
                "dishes/" + UUID.randomUUID() + extension;

        try {

            PutObjectRequest putRequest =
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(objectKey)
                            .contentType(file.getContentType())
                            .build();

            s3Client.putObject(
                    putRequest,
                    RequestBody.fromInputStream(
                            file.getInputStream(),
                            file.getSize()
                    )
            );

            String publicUrl = String.format(
                    "https://%s.s3.%s.amazonaws.com/%s",
                    bucketName,
                    region,
                    objectKey
            );

            log.info(
                    "Dish image uploaded successfully: {}",
                    publicUrl
            );

            return publicUrl;

        } catch (IOException e) {

            log.error(
                    "Failed to read uploaded file input stream",
                    e
            );

            throw new RuntimeException(
                    "Failed to read the uploaded file: "
                            + e.getMessage(),
                    e
            );

        } catch (Exception e) {

            log.error(
                    "Failed to upload dish image to S3: {}",
                    e.getMessage(),
                    e
            );

            throw new RuntimeException(
                    "Failed to upload image to S3: "
                            + e.getMessage(),
                    e
            );
        }
    }
}