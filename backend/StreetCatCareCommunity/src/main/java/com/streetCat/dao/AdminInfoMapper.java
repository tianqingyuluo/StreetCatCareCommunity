package com.streetCat.dao;

import com.streetCat.pojo.AdminInfo;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AdminInfoMapper {
    @Insert("INSERT INTO sys_admin(phone, real_name, login_fail,role,password) " +
            "VALUES(#{phone}, #{realName}, #{loginFail},#{role},#{password})")
    void insert(AdminInfo adminInfo);

    @Select("SELECT EXISTS(SELECT 1 FROM sys_admin WHERE phone = #{phone})")
    boolean existsByPhone (String phone);

    @Select("SELECT * FROM sys_admin WHERE phone = #{phone}")
    AdminInfo getByPhone(String phone);
}
