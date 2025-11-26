package com.streetCat.vo.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.OffsetDateTime;

@Data
public class FeedingStatRequest {
    @Schema(description = "猫ID，可选")
    private Long catId;

    @Schema(description = "开始时间，ISO 8601 格式", example = "2019-08-24T22:15:20+07:00")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private String start;

    @Schema(description = "结束时间，ISO 8601 格式", example = "2019-08-24T22:15:23+09:00")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private String end;
}