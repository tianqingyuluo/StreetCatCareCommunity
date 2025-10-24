package com.streetCat.dao;

import com.streetCat.pojo.Post;
import com.streetCat.vo.request.CreateNewPostRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostMapper {

    int insertPost(@Param("id")        Long id,
                   @Param("userId")    Long userId,
                   @Param("request")   CreateNewPostRequest request);

    Post getPostById(@Param("id")      Long id);
}
