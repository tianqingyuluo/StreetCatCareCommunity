package com.streetCat.vo.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "更新用户位置信息请求")
public class PutUserLocationRequest {

    @Schema(description = "经度", example = "121.473701")
    private Double lon;

    @Schema(description = "纬度", example = "31.230416")
    private Double lat;

    @Schema(description = "地址文字描述", example = "上海市黄浦区南京东路")
    private String address;
}
