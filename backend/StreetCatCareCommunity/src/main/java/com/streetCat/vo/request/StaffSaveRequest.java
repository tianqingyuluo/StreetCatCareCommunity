package com.streetCat.vo.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Date;

@Data
public class StaffSaveRequest {
    @NotBlank(message = "用户Id不能为空")
    Long userId;
    @NotBlank(message = "救助站Id不能为空")
    Long ShelterId;
    @NotBlank(message = "员工姓名不能为空")
    String realName;
    @NotBlank(message = "手机号不能为空")
    String phone;
    String email;
    @NotBlank(message = "入职日期不能为空")
    Date hiredAt;
}
