<template>
  <div class="header-container">
    <div class="left-section">
      <el-icon class="collapse-icon" @click="collapase"><fold /></el-icon>
    </div>

    <div class="title-section">
      <span>欢迎来到流浪猫领养系统</span>
    </div>

    <div class="right-section">
      <span class="admin-text">管理员</span>
      <el-dropdown>
        <el-icon class="dropdown-icon"><arrow-down /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="toUser">个人中心</el-dropdown-item>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { User, ArrowDown, Fold } from '@element-plus/icons-vue'
import { defineEmits } from 'vue'
import { ref } from 'vue'

const emit = defineEmits(['doCollapse'])
const isCollapse = ref(false)

const collapase = () => {
  emit('doCollapse', isCollapse.value)
}

const toUser = () => {
  console.log('toUser');
}

const logout = () => {
  console.log('logout');
}
</script>

<style scoped>
.header-container {
  display: flex;
  align-items: center;
  height: 60px; /* 固定头部高度 */
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 0 20px;
}

.left-section {
  display: flex;
  align-items: center;
}

.collapse-icon {
  font-size: 24px;
  cursor: pointer;
  color: #333;
  margin-right: 20px;
}

.collapse-icon:hover {
  color: #409EFF;
}

.title-section {
  flex: 1;
  text-align: center;
}

.title-section span {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.right-section {
  display: flex;
  align-items: center;
}

.admin-text {
  font-size: 16px;
  color: #606266;
  margin-right: 10px;
}

.dropdown-icon {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}

.dropdown-icon:hover {
  color: #409EFF;
}
</style>