package com.streetCat.utils;

import com.streetCat.exception.BizCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class R<T> {
    private int code;
    private String msg;
    private T data;

    public static <T> R<T> ok(T data) {
        return new R<>(200, "success", data);
    }

    public static <T> R<T> creat_ok(T data) {
        return new R<>(201, "success_creat", data);
    }

    public static R<Void> delete_ok() {
        return new R<>(204, "success_delete",null);
    }

    public static <T> R<T> fail(int code, String msg) {
        return new R<>(code, msg, null);
    }

    public static <T> R<T> fail(BizCode bc) {
        return fail(bc.getCode(), bc.getMsg());
    }
}
