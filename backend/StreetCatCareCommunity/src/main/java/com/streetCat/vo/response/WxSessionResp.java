package com.streetCat.vo.response;

import lombok.Data;

@Data
public class WxSessionResp {
    private String openid;
    private String session_key;
    private String unionid;
    private Integer errCode;
    private String errMsg;
}