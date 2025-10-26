package com.streetCat.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streetCat.utils.JwtUtil;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class LoginInterceptor implements HandlerInterceptor {

    /* 需要放行的路径 */
    private static final String[] WHITE_LIST = {
            "/api/v1/auth/login-web",
            "/api/v1/admin/create-account",
            "/api/v1/auth/login-wechat"
    };

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        String uri = request.getRequestURI();

        // 1. 白名单直接放行
        for (String white : WHITE_LIST) {
            if (white.equals(uri)) {
                return true;
            }
        }

        // 2. 检查 Authorization 请求头
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || authHeader.isBlank()) {
            // 3. 缺少 token，返回 401 JSON
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());

            ObjectMapper mapper = new ObjectMapper();
            mapper.writeValue(response.getWriter(),
                    Map.of("code", 401, "msg", "权限不足，请先登录"));
            return false;
        }

        // 4. 提取 token（支持 Bearer 格式）
        String token;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else {
            token = authHeader;
        }

        // 5. 验证 token 有效性
        try {
            String userId = JwtUtil.parse(token);
            // 将解析出的用户ID存入请求属性，供后续使用
            request.setAttribute("userId", userId);
            return true;
        } catch (Exception e) {
            // token 解析失败
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());

            ObjectMapper mapper = new ObjectMapper();
            mapper.writeValue(response.getWriter(),
                    Map.of("code", 401, "msg", "无法解析token"));
            return false;
        }
    }
}