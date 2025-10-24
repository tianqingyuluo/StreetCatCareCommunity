package com.streetCat.utils;

import cn.hutool.core.net.url.UrlBuilder;
import cn.hutool.http.HttpUtil;
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

        String url = UrlBuilder.of("https://api.weixin.qq.com/sns/jscode2session")
                .addQuery("appid", APPID)
                .addQuery("secret", SECRET)
                .addQuery("js_code", code)
                .addQuery("grant_type", "authorization_code")
                .build();

        System.out.println("实际访问路径: " + url);
        String response = HttpUtil.get(url);
        System.out.println("微信API原始响应: " + response);
        // 手动转换为对象
        return JSONUtil.toBean(response, WxSessionResp.class);
    }
}