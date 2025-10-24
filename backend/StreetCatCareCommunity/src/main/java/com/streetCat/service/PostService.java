package com.streetCat.service;

import com.streetCat.pojo.Post;
import com.streetCat.vo.request.CreateNewPostRequest;

public interface PostService {
    Post createNewPost(Long userid, CreateNewPostRequest request);
}
