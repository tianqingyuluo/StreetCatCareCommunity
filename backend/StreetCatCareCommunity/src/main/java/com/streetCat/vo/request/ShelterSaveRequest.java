package com.streetCat.vo.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
public class ShelterSaveRequest {
    @NotBlank(message = "救护站名称不能为空")
    String name;
    String contactPerson;
    String phone;
    String email;
    @NotNull(message = "经纬度地址不能为空")
    Location location;
    String address;
    String description;
    String licenseNumber;
    @NotBlank(message = "管理者Id不能为空")
    String managerId;
    @NotBlank(message = "救护站图片不能为空")
    String avatar;
    int capacity;
    @Data
    @NoArgsConstructor      // 必须
    @AllArgsConstructor
    public static class Location {
        private Double lat;
        private Double lng;
    }
}
