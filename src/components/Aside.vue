<template>
        <el-menu 
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="height: 100vh;"
        default-active="/Home"
        :collapse="isCollapse"
        :collapse-transition="true"
        router
        >
        
          <el-menu-item index="/Home">
            <el-icon><house /></el-icon>
            <span>首页</span>
          </el-menu-item>

          <el-sub-menu index="/User">
            <template #title>
              <el-icon><message /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item-group title="人员信息管理">
              <el-menu-item index="user">用户列表</el-menu-item>
              <el-menu-item index="staff-list">员工列表</el-menu-item>
              <el-menu-item index="addadmin">新增管理员</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu index="/Shelter">
            <template #title>
              <el-icon><icon-menu /></el-icon>
              <span>救护站管理</span>
            </template>
            <el-menu-item-group title="救护站信息管理">
              <el-menu-item index="shelter/list">救护站信息</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu index="/Cat">
            <template #title>
              <el-icon><setting /></el-icon>
              <span>流浪猫管理</span>
            </template>
            <el-menu-item-group title="流浪猫信息管理">
              <el-menu-item index="cat">流浪猫信息</el-menu-item>
              <el-menu-item index="adopt">领养信息</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu index="/User-info">
            <template #title>
              <el-icon><user /></el-icon>
              <span>用户资料</span>
            </template>
            <el-menu-item-group title="领养信息管理">
              <el-menu-item index="change-password">修改密码</el-menu-item>
              <el-menu-item index="personal-info">个人信息</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
</template>

<script  lang="ts" setup>
import { Menu as IconMenu, Message, Setting, House, User } from '@element-plus/icons-vue'
const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: true
  }
})
</script>

<style>
.el-menu--collapse .el-menu-item span,
.el-menu--collapse .el-sub-menu__title span {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
}

.el-menu:not(.el-menu--collapse) .el-menu-item span,
.el-menu:not(.el-menu--collapse) .el-sub-menu__title span {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s ease-in, visibility 0.3s ease-in;
}
</style>