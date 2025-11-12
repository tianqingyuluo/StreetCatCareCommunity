package com.streetCat.utils;

import cn.hutool.core.net.url.UrlBuilder;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONUtil;
import com.streetCat.vo.response.WxSessionResp;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class WxApiUtil {

    private static String APPID;
    private static String SECRET;

    @Value("${wx.app.appid}")
    private String appid;

    @Value("${wx.app.secret}")
    private String secret;

    @PostConstruct
    public void init() {
        APPID = this.appid;
        SECRET = this.secret;
    }

    public static WxSessionResp code2session(String code) {
        String url = UrlBuilder.of("https://api.weixin.qq.com/sns/jscode2session")
                .addQuery("appid", APPID)
                .addQuery("secret", SECRET)
                .addQuery("js_code", code)
                .addQuery("grant_type", "authorization_code")
                .build();

        String response = HttpUtil.get(url);
        System.out.println("微信API原始响应: " + response);

        return JSONUtil.toBean(response, WxSessionResp.class);
    }
}