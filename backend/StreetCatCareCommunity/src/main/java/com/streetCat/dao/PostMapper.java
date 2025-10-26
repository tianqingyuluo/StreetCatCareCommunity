package com.streetCat.dao;

import cn.hutool.db.PageResult;
import com.streetCat.pojo.Post;
import com.streetCat.vo.request.CreateNewPostRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;
import java.util.List;

@Mapper
public interface PostMapper {

    int insertPost(@Param("id")        Long id,
                   @Param("userId")    Long userId,
                   @Param("request")   CreateNewPostRequest request);

    Post getPostById(@Param("id")      Long id);

    ArrayList<Post> findPendingPosts();

    PageResult<Post> listPosts(
            @Param("keyword") String keyword,
            @Param("postType") String postType,
            @Param("sort") String sort,
            @Param("page") Integer page,
            @Param("size") Integer size,
            @Param("offset") Integer offset
    );

    Long countPosts(@Param("keyword")String keyword, @Param("postType")String postType);
}
