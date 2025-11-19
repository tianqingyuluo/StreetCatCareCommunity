package com.streetCat.pojo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class Cat {

    private Long id;
    private String name;
    private String breed;
    private String gender;
    private Integer ageMonths;
    private String healthStatus;
    private String description;
    private String photos;
    private Boolean isNeutered;
    private String vaccinationStatus;
    private String status;
    private Long shelterId;
    private Long createdBy;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Long favorite;
    private Long comment;
    private Long view;
    private Long like;
}