package com.streetCat.vo.request;

import lombok.Data;

@Data
public class AdoptionRequest {
    private String name;       // 申请人的姓名
    private int age;          // 申请人的年龄
    private String phone;      // 申请人的电话号码
    private String address;    // 申请人的地址
    private String experience; // 申请人的养猫经验
    private String reason;     // 申请人领养猫咪的原因
    private String catId;      // 被领养的猫咪的唯一标识符
}