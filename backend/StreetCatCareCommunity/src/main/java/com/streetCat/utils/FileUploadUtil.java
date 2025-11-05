package com.streetCat.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.UUID;

@Component
public class FileUploadUtil {

    private static S3Client staticS3;
    private static String staticBucket;
    private static String staticEndpoint;

    @Autowired
    private S3Client s3Client;

    @Value("${rustfs.bucket}")
    private String bucket;

    @Value("${rustfs.endpoint}")
    private String endpoint;

    @PostConstruct
    public void init() {
        staticS3 = s3Client;
        staticBucket = bucket;
        staticEndpoint = endpoint;
        initializeBucket();
    }

    private void initializeBucket() {
        try {
            staticS3.headBucket(builder -> builder.bucket(staticBucket));
            System.out.println("存储桶 '" + staticBucket + "' 已存在");
            setBucketPublicRead();
        } catch (NoSuchBucketException e) {
            System.out.println("存储桶 '" + staticBucket + "' 不存在，正在创建...");
            try {
                staticS3.createBucket(builder -> builder.bucket(staticBucket));
                System.out.println("存储桶 '" + staticBucket + "' 创建成功");
                setBucketPublicRead();
            } catch (Exception createException) {
                System.err.println("创建存储桶失败: " + createException.getMessage());
                throw new RuntimeException("无法创建存储桶: " + staticBucket, createException);
            }
        }
    }

    private void setBucketPublicRead() {
        String policy = """
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": ["*"]},
                    "Action": ["s3:GetObject"],
                    "Resource": ["arn:aws:s3:::%s/*"]
                }
            ]
        }
        """.formatted(staticBucket);

        staticS3.deleteBucketPolicy(d -> d.bucket(staticBucket));

        /* 写入新策略 */
        staticS3.putBucketPolicy(p -> p.bucket(staticBucket).policy(policy));
        System.out.println("桶 " + staticBucket + " 策略已强制重置为公开只读");
    }

    public static String uploadToRustFs(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("文件不能为空");
        }

        try {
            String fileKey = generateFileKey(file.getOriginalFilename());
            String contentType = determineContentType(file.getOriginalFilename());

            System.out.println("开始上传文件: " + file.getOriginalFilename());
            System.out.println("文件Key: " + fileKey);
            System.out.println("Content-Type: " + contentType);
            System.out.println("文件大小: " + file.getSize() + " bytes");

            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(staticBucket)
                    .key(fileKey)
                    .contentType(contentType)
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();

            staticS3.putObject(putRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            String publicUrl = generatePublicUrl(fileKey);

            System.out.println("文件上传成功");
            System.out.println("访问链接: " + publicUrl);

            return publicUrl;

        } catch (IOException e) {
            throw new RuntimeException("文件读取失败", e);
        } catch (S3Exception e) {
            System.err.println("S3上传错误: " + e.awsErrorDetails().errorMessage());
            throw new RuntimeException("文件上传失败: " + e.awsErrorDetails().errorMessage(), e);
        } catch (Exception e) {
            System.err.println("上传过程发生错误: " + e.getMessage());
            throw new RuntimeException("上传失败", e);
        }
    }

    private static String generateFileKey(String originalFilename) {
        String datePath = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));

        String randomId = UUID.randomUUID().toString().substring(0, 8);

        String extension = getFileExtension(originalFilename);

        return String.format("%s/%s%s", datePath, randomId, extension);
    }

    private static String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".dat";
        }
        return filename.substring(filename.lastIndexOf(".")).toLowerCase(Locale.ROOT);
    }

    private static String determineContentType(String filename) {
        String extension = getFileExtension(filename);

        return switch (extension) {
            case ".jpg", ".jpeg" -> "image/jpeg";
            case ".png" -> "image/png";
            case ".gif" -> "image/gif";
            case ".bmp" -> "image/bmp";
            case ".webp" -> "image/webp";
            case ".svg" -> "image/svg+xml";
            case ".pdf" -> "application/pdf";
            case ".txt" -> "text/plain";
            case ".zip" -> "application/zip";
            default -> "application/octet-stream";
        };
    }

    private static String generatePublicUrl(String fileKey) {
        String cleanEndpoint = staticEndpoint.replaceAll("/+$", "");
        return String.format("%s/%s/%s", cleanEndpoint, staticBucket, fileKey);
    }

    public static boolean isSupportedImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return false;
        }

        String filename = file.getOriginalFilename();
        if (filename == null) {
            return false;
        }

        String extension = getFileExtension(filename);
        return extension.matches("\\.(jpg|jpeg|png|gif|bmp|webp|svg)$");
    }

    public static String getBucketInfo() {
        return String.format("存储桶: %s, 端点: %s", staticBucket, staticEndpoint);
    }
}