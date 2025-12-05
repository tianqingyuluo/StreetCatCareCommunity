package com.streetCat.vo.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Date;

@Data
public class StaffSaveRequest {
    @NotBlank(message = "用户Id不能为空")
    String userId;
    @NotBlank(message = "救助站Id不能为空")
    String ShelterId;
    @NotBlank(message = "员工姓名不能为空")
    String realName;
    String phone;
    String email;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    Date hiredAt;
}
