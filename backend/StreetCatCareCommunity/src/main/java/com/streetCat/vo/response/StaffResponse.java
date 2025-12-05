package com.streetCat.vo.response;

import lombok.Data;

import java.util.Date;

@Data
public class StaffResponse {
    private String userId;
    private String shelterId;
    private String realName;
    private String phone;
    private String email;
    private Date hiredAt;
    private String id;
    private String hireStatus;
    private String createdAt;
    private String updatedAt;
}
