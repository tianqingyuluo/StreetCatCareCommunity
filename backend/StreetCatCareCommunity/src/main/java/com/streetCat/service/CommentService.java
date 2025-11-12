package com.streetCat.service;

import com.streetCat.pojo.Comment;
import com.streetCat.vo.request.CreateCommentRequest;
import com.streetCat.vo.response.CommentResp;
import com.streetCat.vo.response.PageResponse;

public interface CommentService {

    /**
     * 发布评论
     */
    Comment createComment(String userId, CreateCommentRequest request);

    /**
     * 获取评论列表
     */
    PageResponse<CommentResp> listComments(String targetType, String targetId);

    /**
     * 删除评论
     */
    void deleteComment(String commentId, String userId);


}