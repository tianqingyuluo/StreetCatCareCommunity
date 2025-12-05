package com.streetCat.pojo;

import lombok.Data;

import java.util.Date;

@Data
public class Staff {
    String id;
    String shelterId;
    String userId;
    String realName;
    String phone;
    String email;
    Date hiredAt;
    String hireStatus;
    String createdAt;
    String updatedAt;
}
