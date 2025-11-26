package com.streetCat.pojo;

import java.time.OffsetDateTime;
import lombok.Data;

@Data
public class Feeding {

    private String catId;
    private String shelterId;
    private String userId;
    private OffsetDateTime feedingTime;
    private String foodType;
    private Integer foodAmount;
    private String notes;

    private String id;                // 主键
    private OffsetDateTime createdAt; // 创建时间
}