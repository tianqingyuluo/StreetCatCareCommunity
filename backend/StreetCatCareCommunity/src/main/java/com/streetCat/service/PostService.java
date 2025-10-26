package com.streetCat.service;

import cn.hutool.db.PageResult;
import com.streetCat.pojo.Post;
import com.streetCat.vo.request.CreateNewPostRequest;
import com.streetCat.vo.response.PageResponse;

import java.util.ArrayList;

public interface PostService {
    Post createNewPost(Long userid, CreateNewPostRequest request);

    ArrayList<Post> findPendingPosts();

    PageResponse<Post> listPosts(String keyword, String postType, String sort, Integer page, Integer size);
}
