package com.streetCat.vo.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.OffsetDateTime;
@Data
public class CreateFeedingRequest {
    @NotNull
    private String catId;

    @NotNull
    private String shelterId;

    @NotNull
    private String userId;

    @NotNull
    private OffsetDateTime feedingTime; // ISO-8601 例：2025-11-19T14:15:22.123Z

    @NotNull
    private String foodType;   // 鸡肉罐头 / 干粮 …

    private Integer foodAmount; // 50g / 1罐 … 允许空

    private String notes;      // 备注，允许空
}