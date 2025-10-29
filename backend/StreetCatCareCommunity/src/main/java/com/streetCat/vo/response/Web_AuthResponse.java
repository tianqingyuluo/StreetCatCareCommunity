package com.streetCat.vo.response;

import com.streetCat.pojo.AdminInfo;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Web_AuthResponse {
    private AdminInfo adminInfo;
    private String accessToken;
    private Integer expiresIn;
}
