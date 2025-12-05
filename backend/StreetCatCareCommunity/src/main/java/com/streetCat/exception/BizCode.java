package com.streetCat.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum BizCode {
    SUCCESS(200, "成功"),
    INVALID_DATA(400,"非法数据"),
    AUTH_FAIL(401,"认证失败"),
    UNAUTHORIZED(401, "请先登录或重新登录"),
    FORBIDDEN(403,"权限不足"),
    UNFOUND(404,"无法找到对应的必须参数（非路由问题）"),
    DUPLICATE_RESOURCE(409, "重复的资源"),
    DB_ERROR(500, "数据库异常");

    private final int code;
    private final String msg;
}
