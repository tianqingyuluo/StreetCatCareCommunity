package com.streetCat.dao;
import com.streetCat.pojo.Post;
import com.streetCat.pojo.PostWithUser;
import com.streetCat.vo.request.CreateNewPostRequest;
import com.streetCat.vo.request.UpdatePostStatusRequest;
import com.streetCat.vo.response.PageResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;
import java.util.List;

@Mapper
public interface PostMapper {

    int insertPost(@Param("id")        Long id,
                   @Param("userId")    String userId,
                   @Param("status")    String status,
                   @Param("request")   CreateNewPostRequest request);

    Post getPostById(@Param("id")      Long id);

    ArrayList<Post> findPendingPosts();

    List<PostWithUser> listPosts(
            @Param("keyword") String keyword,
            @Param("postType") String postType,
            @Param("sort") String sort,
            @Param("page") Integer page,
            @Param("size") Integer size,
            @Param("offset") Integer offset
    );
    Long countPosts(@Param("keyword")String keyword, @Param("postType")String postType);


    void updatePostStatus(@Param("id") String id,
                          @Param("status") UpdatePostStatusRequest.PostStatus status,
                          @Param("remark") String remark);

    boolean isSysAdmin(@Param("id") String userid);
    List<Post> listPostsByUserId(@Param("userid") String userId);

    boolean isPostAuthor(@Param("id") String id, @Param("userId") String userId);

    void updatePost(@Param("id") String id,@Param("userid") String userId,@Param("request") CreateNewPostRequest postSaveReq);
    void deletePost(@Param("id") String id);
    void updatePostTopStatus(@Param("id") String id, @Param("isTop") Boolean isTop);
    void updatePostEliteStatus(@Param("id") String id, @Param("isElite") Boolean isElite);

    void updateCountField(Long targetId, String fieldName, Integer count);
}
