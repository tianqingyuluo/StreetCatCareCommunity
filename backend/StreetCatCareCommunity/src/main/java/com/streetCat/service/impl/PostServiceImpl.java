package com.streetCat.service.impl;

import com.streetCat.dao.PostMapper;
import com.streetCat.pojo.Post;
import com.streetCat.service.PostService;
import com.streetCat.utils.RandomUtil;
import com.streetCat.vo.request.CreateNewPostRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostMapper postmapper;


    @Override
    public Post createNewPost(Long userid, CreateNewPostRequest request) {
        Long id = RandomUtil.nextId();
        int updated = postmapper.insertPost(id,userid,request);
        if (updated == 0) {
            throw new RuntimeException("更新失败");
        }
        return  postmapper.getPostById(id);
    }
}
