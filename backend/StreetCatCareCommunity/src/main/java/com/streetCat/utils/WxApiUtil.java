package com.streetCat.utils;

import com.streetCat.vo.response.WxSessionResp;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

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
        String url = buildUrl(code);
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("微信API原始响应: " + response.body());

            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(response.body(), WxSessionResp.class);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    private static String buildUrl(String code) {
        String baseUrl = "https://api.weixin.qq.com/sns/jscode2session";
        Map<String, String> params = new HashMap<>();
        params.put("appid", APPID);
        params.put("secret", SECRET);
        params.put("js_code", code);
        params.put("grant_type", "authorization_code");

        StringBuilder urlBuilder = new StringBuilder(baseUrl);
        urlBuilder.append("?");
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (urlBuilder.indexOf("?") != -1) {
                urlBuilder.append("&");
            }
            urlBuilder.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8));
            urlBuilder.append("=");
            urlBuilder.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
        }

        return urlBuilder.toString();
    }
}