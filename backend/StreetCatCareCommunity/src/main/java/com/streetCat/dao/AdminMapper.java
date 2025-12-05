package com.streetCat.dao;

import com.streetCat.pojo.Admin;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface AdminMapper {
    @Insert("INSERT INTO sys_admin(id,phone, real_name,role,password) " +
            "VALUES(#{id}, #{phone}, #{realName}, #{role}, #{password})")
    void insert(Admin admin);

    @Update("UPDATE sys_admin SET role = 'SHELTER_MANAGER' WHERE id = #{id}")
    void setShelterManager(String id);

    @Update("UPDATE sys_admin SET password = #{Password} WHERE id = #{id}")
    void setPassword(String id,String Password);

    void patchAdmin(String id,Admin admin);

    @Select("SELECT EXISTS(SELECT 1 FROM sys_admin WHERE phone = #{phone})")
    boolean existsByPhone (String phone);

    @Select("SELECT EXISTS(SELECT 1 FROM sys_admin WHERE id = #{id})")
    boolean existsById (String id);

    @Select("SELECT id, phone, real_name, '' AS login_fail, role, password AS password FROM sys_admin WHERE phone = #{phone}")
    Admin getByPhone(String phone);

    @Select("SELECT id, phone, real_name, '' AS login_fail, role, password AS password FROM sys_admin WHERE id = #{id}")
    Admin getById(String id);

    @Select("SELECT role FROM sys_admin where id = #{id}")
    String getRoleById (String id);

    @Select("SELECT password FROM sys_admin where id = #{id}")
    String getPasswordById (String id);
}
