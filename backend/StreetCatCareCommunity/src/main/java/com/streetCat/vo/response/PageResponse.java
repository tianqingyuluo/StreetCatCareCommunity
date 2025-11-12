// PageResult.java
package com.streetCat.vo.response;

import com.streetCat.pojo.Post;
import lombok.Data;
import java.util.List;

@Data
public class PageResponse<T> {
    private Long total;
    private List<T> records;

    public PageResponse(Long total, List<T> records) {
        this.total = total;
        this.records = records;
    }
    public static <T> PageResponse<T> of(List<T> records) {
        return new PageResponse<>((long) records.size(), records);
    }
}