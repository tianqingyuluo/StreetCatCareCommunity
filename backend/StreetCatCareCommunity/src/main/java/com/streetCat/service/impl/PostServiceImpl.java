package com.streetCat.service.impl;

import com.streetCat.dao.PostMapper;
import com.streetCat.pojo.Post;
import com.streetCat.service.PostService;
import com.streetCat.utils.RandomUtil;
import com.streetCat.vo.request.CreateNewPostRequest;
import com.streetCat.vo.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    @Override
    public ArrayList<Post> findPendingPosts() {
        return postmapper.findPendingPosts();
    }

    @Override
    public PageResponse<Post> listPosts(String keyword, String postType, String sort, Integer page, Integer size) {
        // 计算偏移量
        int offset = (page - 1) * size;

        // 查询数据
        List<Post> records = postmapper.listPosts(keyword, postType, sort, page, size, offset);

        // 查询总数
        Long total = postmapper.countPosts(keyword, postType);

        return new PageResponse<>(total, records);
    }
}
