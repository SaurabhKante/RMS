package com.rms.service;

import org.springframework.web.multipart.MultipartFile;

public interface S3Service {

    /**
     * Uploads a multipart file to the configured S3 bucket under the
     * "dishes/" prefix and returns the publicly-accessible URL.
     *
     * @param file the image file sent from the client
     * @return public S3 URL of the uploaded object
     */
    String uploadDishImage(MultipartFile file);
}
