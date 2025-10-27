package com.streetCat.service;

import com.streetCat.pojo.Post;
import com.streetCat.pojo.PostWithUser;
import com.streetCat.vo.request.CreateNewPostRequest;
import com.streetCat.vo.request.UpdatePostStatusRequest;
import com.streetCat.vo.response.PageResponse;

import java.util.ArrayList;
import java.util.List;

public interface PostService {
    Post createNewPost(String userid, CreateNewPostRequest request);

    ArrayList<Post> findPendingPosts();

    PageResponse<PostWithUser> listPosts(String keyword, String postType, String sort, Integer page, Integer size);

    void updatePostStatus(String id,String userid, UpdatePostStatusRequest.PostStatus status, String remark);

    List<Post> listPostsByUserId(String userId);

    boolean isPostAuthor( String id, String userId);

    Post updatePost(String id, String userId, CreateNewPostRequest postSaveReq);

    void deletePost(String id);

    boolean isSysAdmin(String userId);

    void updatePostTopStatus(String id, Boolean isTop);

    void updatePostEliteStatus(String id, Boolean isElite);
}
