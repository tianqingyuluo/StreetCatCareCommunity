package com.streetCat.dao;
import org.apache.ibatis.annotations.Mapper;
import com.streetCat.pojo.User;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    /** 查询：返回嵌套 User */
    User selectByOpenid(@Param("openid") String openid);
    void insertUser(Long uid,String openid,String unionid,String nickname);

}