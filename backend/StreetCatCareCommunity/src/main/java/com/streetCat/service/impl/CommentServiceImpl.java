package com.streetCat.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.streetCat.dao.CommentMapper;
import com.streetCat.pojo.Comment;
import com.streetCat.pojo.UserInfo;
import com.streetCat.service.CommentService;
import com.streetCat.utils.RandomUtil;
import com.streetCat.vo.request.CreateCommentRequest;
import com.streetCat.vo.response.CommentResp;
import com.streetCat.vo.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentMapper commentMapper;
    @Override
    public Comment createComment(String userId, CreateCommentRequest request) {
        if (request.getParentId() != null && request.getParentId().isEmpty()) {
            request.setParentId(null);
        }
        String id = String.valueOf(RandomUtil.nextId());
        commentMapper.insertComment(id, userId, request);
        return commentMapper.selectCommentById(id);
    }

    @Override
    public PageResponse<CommentResp> listComments(String targetType, String targetId) {
        // 1. 全部根评论
        List<Comment> roots = commentMapper.listRootComment(targetType, targetId);
        if (roots.isEmpty()) {
            return new PageResponse<>(0L, Collections.emptyList());
        }

        // 2. 一次性捞出所有子评论
        List<String> parentIds = roots.stream()
                .map(Comment::getId)
                .collect(Collectors.toList());
        List<Comment> children = commentMapper.listChildComment(targetType, targetId, parentIds);

        // 3. 按 parentId 分组
        Map<String, List<Comment>> childMap = children.stream()
                .collect(Collectors.groupingBy(Comment::getParentId));

        // 4. PO -> VO
        List<CommentResp> records = roots.stream()
                .map(r -> buildResp(r, childMap))
                .collect(Collectors.toList());

        return new PageResponse<>((long) records.size(), records);
    }

    /* 递归只到一层子评论 */
    private CommentResp buildResp(Comment po, Map<String, List<Comment>> childMap) {
        CommentResp vo = new CommentResp(po);          // 已有构造方法
        List<Comment> kids = childMap.getOrDefault(po.getId(), Collections.emptyList());
        vo.setChild(kids.stream()
                .map(CommentResp::new)  // 子评论不再挂孙子
                .collect(Collectors.toList()));
        return vo;
    }


    @Override
    public void deleteComment(String commentId, String userId) {

    }
}
