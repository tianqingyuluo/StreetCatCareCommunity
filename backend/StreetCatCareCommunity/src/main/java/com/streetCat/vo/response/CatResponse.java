package com.streetCat.vo.response;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetCat.pojo.Cat; // 假设你的 Cat 实体类路径是 com.streetCat.pojo.Cat
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class CatResponse {
    private String id;
    private String name;
    private String breed;
    private String gender;          // MALE / FEMALE
    private Integer ageMonths;
    private String healthStatus;    // HEALTHY,SICK,INJURED,CRITICAL
    private String description;
    private List<String> photos;    // uri 字符串列表
    private Boolean isNeutered;
    private String vaccinationStatus; // NONE,PARTIAL,COMPLETE
    private String status;          // ACTIVE,ADOPTED,DECEASED,REMOVED
    private String shelterId;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long favorite;
    private Long comment;
    private Long view;
    private Long like;

    // 从 Cat 实体转换的构造方法
    public CatResponse(Cat cat) {
        this.id = String.valueOf(cat.getId());
        this.name = cat.getName();
        this.breed = cat.getBreed();
        this.gender = cat.getGender();
        this.ageMonths = cat.getAgeMonths();
        this.healthStatus = cat.getHealthStatus();
        this.description = cat.getDescription();
        this.isNeutered = cat.getIsNeutered();
        this.vaccinationStatus = cat.getVaccinationStatus();
        this.status = cat.getStatus();
        this.shelterId = String.valueOf(cat.getShelterId());
        this.createdBy = String.valueOf(cat.getCreatedBy());
        this.createdAt = cat.getCreatedAt();
        this.updatedAt = cat.getUpdatedAt();
        this.favorite = cat.getFavorite();
        this.comment = cat.getComment();
        this.view = cat.getView();
        this.like = cat.getLike();

        // 转换 photos 字段
        if (cat.getPhotos() != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                this.photos = objectMapper.readValue(cat.getPhotos(), new TypeReference<>() {
                });
            } catch (Exception e) {
                this.photos = new ArrayList<>();
            }
        } else {
            this.photos = new ArrayList<>();
        }
    }
}