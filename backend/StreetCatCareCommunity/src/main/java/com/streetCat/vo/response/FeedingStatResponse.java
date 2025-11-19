package com.streetCat.vo.response;

import com.streetCat.pojo.Feeding;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class FeedingStatResponse {
    @Schema(description = "查询的猫ID")
    private String catId;

    @Schema(description = "统计开始时间戳")
    private String start;

    @Schema(description = "统计结束时间戳")
    private String end;

    @Schema(description = "总投喂次数")
    private Integer totalCount;

    @Schema(description = "总食物量（单位视业务而定）")
    private Integer totalFoodAmount;

    @Schema(description = "区间内投喂记录明细")
    private List<Feeding> records;
}