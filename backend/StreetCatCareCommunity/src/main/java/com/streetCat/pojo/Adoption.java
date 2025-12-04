package com.streetCat.pojo;

import lombok.Data;

@Data
public class Adoption {
    private String id; // 领养申请ID
    private String catId; // 猫咪ID
    private String applicantId; // 申请人ID
    private String shelterId; // 救助站ID
    private String name; // 申请人姓名
    private Integer age; // 申请人年龄
    private String phone; // 申请人电话
    private String address; // 申请人地址
    private String experience; // 申请人养猫经验
    private String reason; // 申请人领养原因
    private String status; // 领养申请状态
    private String reviewNotes; // 审核备注
    private String reviewerId; // 审核人ID
    private java.util.Date reviewedAt; // 审核时间
    private String contractUrl; // 领养合同URL
    private java.util.Date createdAt; // 创建时间
    private java.util.Date updatedAt; // 更新时间
}