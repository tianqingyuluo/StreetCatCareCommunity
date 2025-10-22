package com.streetCat.utils;

import cn.hutool.http.HttpRequest;
import cn.hutool.json.JSONUtil;
import com.streetCat.vo.response.WxSessionResp;
import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;

@Component
public class WxApiUtil {

    private static final String APPID  = "wx825206f77ee98a0d";
    private static final String SECRET = "0a2233d782ce7d6801e202b3deea81ff";

    public static WxSessionResp code2session(String code) {
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("appid", APPID);
        paramMap.put("secret", SECRET);
        paramMap.put("js_code", code);
        paramMap.put("grant_type", "authorization_code");

        // 使用 Hutool 发送请求
        String response = HttpRequest.get("https://api.weixin.qq.com/sns/jscode2session")
                .form(paramMap)
                .execute()
                .body();

        // 手动转换为对象
        return JSONUtil.toBean(response, WxSessionResp.class);
    }
}