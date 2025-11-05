package com.streetCat.controller;

import com.streetCat.utils.FileUploadUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/upload/image")
public class ImageUploadController {
    @PostMapping
    public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("文件不能为空");
        }
        try {
            String url = FileUploadUtil.uploadToRustFs(file);
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            // 上传失败也返回 400，body 写原因
            return ResponseEntity.badRequest().body("上传失败：" + e.getMessage());
        }
    }
}