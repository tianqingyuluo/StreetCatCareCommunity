package com.streetCat.service.impl;

import cn.hutool.db.PageResult;
import com.streetCat.dao.PostMapper;
import com.streetCat.pojo.Post;
import com.streetCat.pojo.PostWithUser;
import com.streetCat.service.PostService;
import com.streetCat.utils.RandomUtil;
import com.streetCat.vo.request.CreateNewPostRequest;
import com.streetCat.vo.request.UpdatePostStatusRequest;
import com.streetCat.vo.response.PageResponse;
import com.streetCat.vo.response.PostWithUserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostMapper postmapper;


    @Override
    public Post createNewPost(String userid, CreateNewPostRequest request) {
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
    public PageResponse<PostWithUserResponse> listPosts(String keyword, String postType, String sort, Integer page, Integer size) {
        // 计算偏移量
        int offset = (page - 1) * size;

        // 查询数据
        PageResult<PostWithUser> records = postmapper.listPosts(keyword, postType, sort, page, size, offset);
        List<PostWithUserResponse> responseList = records.stream()
                .map(PostWithUserResponse::new)
                .collect(Collectors.toList());

        // 查询总数
        Long total = postmapper.countPosts(keyword, postType);

        return new PageResponse<>(total, responseList);
    }

    @Override
    public void updatePostStatus(String id,String userid, UpdatePostStatusRequest.PostStatus status, String remark) {
//        if (!postmapper.isSysAdmin(userid)) {
//            throw new RuntimeException("无权限操作");
//        }
        postmapper.updatePostStatus(id,status,remark);
    }

    @Override
    public List<Post> listPostsByUserId(String userId) {
        return postmapper.listPostsByUserId(userId);
    }

    @Override
    public boolean isPostAuthor(String id, String userId) {
        return postmapper.isPostAuthor(id,userId);
    }

    @Override
    public Post updatePost(String id, String userId, CreateNewPostRequest postSaveReq) {
        postmapper.updatePost(id,userId,postSaveReq);
        return postmapper.getPostById(Long.valueOf(id));
    }

    @Override
    public void deletePost(String id) {
        postmapper.deletePost(id);
    }

    @Override
    public boolean isSysAdmin(String userId) {
        return postmapper.isSysAdmin(userId);
    }

    @Override
    public void updatePostTopStatus(String id, Boolean isTop) {
        postmapper.updatePostTopStatus(id,isTop);
    }

    @Override
    public void updatePostEliteStatus(String id, Boolean isElite) {
        postmapper.updatePostEliteStatus(id,isElite);
    }

}
