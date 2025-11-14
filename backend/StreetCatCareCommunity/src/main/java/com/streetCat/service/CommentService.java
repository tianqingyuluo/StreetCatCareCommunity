package com.streetCat.service;

import com.streetCat.pojo.Comment;
import com.streetCat.vo.request.CreateCommentRequest;
import com.streetCat.vo.response.CommentResp;
import com.streetCat.vo.response.PageResponse;

import java.util.List;

public interface CommentService {

    /**
     * 发布评论
     */
    Comment createComment(String userId, CreateCommentRequest request);

    /**
     * 获取评论列表
     */
    PageResponse<CommentResp> listComments(String targetType, String targetId);



    void deleteComments(List<String> ids, String userId);
}