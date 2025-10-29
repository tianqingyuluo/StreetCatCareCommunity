package com.streetCat.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum BizCode {
    SUCCESS(200, "成功"),
    AUTH_FAIL(401,"认证失败"),
    DUPLICATE_RESOURCE(409, "重复的资源"),
    DB_ERROR(500, "数据库异常");

    private final int code;
    private final String msg;
}
