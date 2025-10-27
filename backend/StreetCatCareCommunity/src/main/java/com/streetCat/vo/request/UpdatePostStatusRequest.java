package com.streetCat.vo.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdatePostStatusRequest {

    @NotNull(message = "状态不能为空")
    private PostStatus status;

    @Size(max = 500, message = "备注长度不能超过500字符")
    private String remark;

    public enum PostStatus {
        PUBLISHED,
        PENDING,
        REJECTED
    }
}