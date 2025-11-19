package com.streetCat.vo.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CatSaveRequest {
    private String name;
    private String breed;
    private String gender;          // MALE / FEMALE
    private Integer ageMonths;
    private String healthStatus;    // HEALTHY,SICK,INJURED,CRITICAL
    private String description;
    private String photos;    // uri 字符串列表
    private Boolean isNeutered;
    private String vaccinationStatus; // NONE,PARTIAL,COMPLETE
    private String status;          // ACTIVE,ADOPTED,DECEASED,REMOVED
    private String shelterId;
    private String createdBy;
}