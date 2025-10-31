<template>
  <div class="home-container">
    <el-row :gutter="20" class="header-row">
      <el-col :span="24">
        <el-card class="welcome-card">
          <div class="welcome-content">
            <img src="@/assets/logo.png" alt="Logo" class="logo" />
            <div>
              <h2>欢迎回来，管理员！</h2>
              <p>祝您有美好的一天！</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="data-cards-row">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-content">
            <el-icon :size="30" color="#409EFF"><UserFilled /></el-icon>
            <div class="text-content">
              <div class="label">用户总数</div>
              <div class="value">1,234</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-content">
            <el-icon :size="30" color="#67C23A"><Goods /></el-icon>
            <div class="text-content">
              <div class="label">猫咪总数</div>
              <div class="value">567</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-content">
            <el-icon :size="30" color="#E6A23C"><OfficeBuilding /></el-icon>
            <div class="text-content">
              <div class="label">救护站数量</div>
              <div class="value">89</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-content">
            <el-icon :size="30" color="#F56C6C"><Document /></el-icon>
            <div class="text-content">
              <div class="label">待处理申请</div>
              <div class="value">12</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>近期活动</span>
            </div>
          </template>
          <div style="height: 200px;">这里可以放置图表或活动列表</div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>系统通知</span>
            </div>
          </template>
          <div style="height: 200px;">这里可以放置通知列表</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { UserFilled, Goods, OfficeBuilding, Document } from '@element-plus/icons-vue';

const title = ref('菜单首页');
</script>

<style scoped>
.home-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 60px); /* 假设头部高度为60px */
}

.header-row {
  margin-bottom: 20px;
}

.welcome-card {
  background: linear-gradient(to right, #409EFF, #79bbff);
  color: white;
  border: none;
}

.welcome-content {
  display: flex;
  align-items: center;
}

.welcome-content .logo {
  width: 60px;
  height: 60px;
  margin-right: 20px;
  border-radius: 50%;
  background-color: white;
  padding: 5px;
}

.welcome-content h2 {
  margin: 0 0 5px 0;
  color: white;
}

.welcome-content p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.data-cards-row {
  margin-bottom: 20px;
}

.data-card {
  text-align: center;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.card-content .text-content {
  margin-top: 10px;
}

.card-content .label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
}

.card-content .value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.chart-row .el-card {
  height: 280px; /* 统一卡片高度 */
}

.card-header {
  font-weight: bold;
  color: #303133;
}
</style>

