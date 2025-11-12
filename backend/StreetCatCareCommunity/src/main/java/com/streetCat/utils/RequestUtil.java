package com.streetCat.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetCat.vo.request.CreateNewPostRequest;

import java.util.Map;

public class RequestUtil {

    /**
     * 从请求体中提取并转换数据到 CreateNewPostRequest
     * @param requestBody 请求体
     * @return CreateNewPostRequest 对象
     */
    public static CreateNewPostRequest convertToCreateNewPostRequest(Map<String, Object> requestBody) {
        CreateNewPostRequest request = new CreateNewPostRequest();

        // 提取基本字段
        request.setTitle((String) requestBody.get("title"));
        request.setContent((String) requestBody.get("content"));
        request.setPostType((String) requestBody.get("postType"));

        // 处理 images 字段
        Object images = requestBody.get("images");
        if (images != null) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                String imagesJson = objectMapper.writeValueAsString(images);
                request.setImages(imagesJson);
            } catch (Exception e) {
                request.setImages("[]"); // 如果转换失败，设置为空数组
            }
        } else {
            request.setImages("[]"); // 默认为空数组
        }

        return request;
    }
}