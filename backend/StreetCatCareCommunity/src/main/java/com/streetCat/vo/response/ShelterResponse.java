package com.streetCat.vo.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ShelterResponse {
    private String name;
    private String contactPerson;
    private String phone;
    private String email;
    private Location location;
    private String address;
    private String description;
    private String licenseNumber;
    private String managerId;
    private String avatar;
    private int capacity;
    @Data
    @NoArgsConstructor      // 必须
    @AllArgsConstructor
    public static class Location {
        private Double lat;
        private Double lng;
    }
    private String id;
    private String createdAt;
    private String updatedAt;
    private Double distance;
    private int currentCatNumber;
    private String status;
}
