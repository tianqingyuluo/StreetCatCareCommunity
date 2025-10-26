// PageResult.java
package com.streetCat.vo.response;

import com.streetCat.pojo.Post;
import lombok.Data;
import java.util.List;

@Data
public class PageResponse<Post> {
    private Long total;
    private List<Post> records;

    public PageResponse(Long total, List<Post> records) {
        this.total = total;
        this.records = records;
    }
}