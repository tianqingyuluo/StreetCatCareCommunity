package com.streetCat.dao;
import com.streetCat.pojo.Comment;
import com.streetCat.vo.request.CreateCommentRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {
    void insertComment(@Param("id")String id,@Param("userId") String userId, @Param("request") CreateCommentRequest request);
    Comment selectCommentById(@Param("id")String id);
    List<Comment> listRootComment(@Param("targetType") String targetType,
                                            @Param("targetId")   String targetId);
    /**
     * 查询某一批根评论下的全部子评论（parent_id in (...)）并携带作者信息
     */
    List<Comment> listChildComment(@Param("targetType") String targetType,
                                             @Param("targetId")   String targetId,
                                             @Param("parentIds") List<String> parentIds);

    /** 根据 parent_id 批量删除 */
    void deleteByParentIds(@Param("parentIds") List<String> parentIds);

    /** 单条删除 */
    void deleteById(@Param("id") String id);
}
