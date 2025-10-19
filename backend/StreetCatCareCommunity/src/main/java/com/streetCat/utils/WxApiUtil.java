package com.streetCat.utils;

import com.streetCat.vo.response.WxSessionResp;
import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class WxApiUtil {

    private static final String APPID  = "wx825206f77ee98a0d";
    private static final String SECRET = "0a2233d782ce7d6801e202b3deea81ff";

    public static WxSessionResp code2session(String code) {
        String url = UriComponentsBuilder
                .fromHttpUrl("https://api.weixin.qq.com/sns/jscode2session")
                .queryParam("appid", APPID)
                .queryParam("secret", SECRET)
                .queryParam("js_code", code)
                .queryParam("grant_type", "authorization_code")
                .toUriString();


        RestTemplate rest = new RestTemplate();
        return rest.getForObject(url, WxSessionResp.class);
    }


}