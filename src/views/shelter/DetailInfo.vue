<template>
  <!-- 代码未动，仅样式升级 -->
  <div v-if="response" class="detail-card">
    <el-descriptions
      class="custom-descriptions"
      border
      :column="3"
      size="large"
      label-width="160px"
    >
      <template #title>
        <span class="title">救护站详情</span>
      </template>

      <el-descriptions-item label="名称">{{ response.name }}</el-descriptions-item>
      <el-descriptions-item label="图片">
        <img 
          v-if="response.avatar" 
          :src="response.avatar" 
          alt="救护站图片" 
          style="max-width: 200px; max-height: 200px; border-radius: 8px;"
        />
        <span v-else>未上传图片</span>
      </el-descriptions-item>
      <el-descriptions-item label="地址">{{ response.address || '未填写' }}</el-descriptions-item>
      <el-descriptions-item label="联系人">{{ response.contactPerson || '未填写' }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ response.phone || '未填写' }}</el-descriptions-item>
      <el-descriptions-item label="容量">{{ response.capacity }}</el-descriptions-item>
      <el-descriptions-item label="当前猫数">{{ response.currentCatNumber || '未填写' }}</el-descriptions-item>

      <el-descriptions-item label="创建时间">{{ response.createdAt }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ response.updatedAt }}</el-descriptions-item>
      <el-descriptions-item label="位置">
        纬度 {{ response.location?.lat || '未知' }}，经度 {{ response.location?.lng || '未知' }}
      </el-descriptions-item>
      <el-descriptions-item label="负责人ID">{{ response.managerId || '未填写' }}</el-descriptions-item>
      <el-descriptions-item label="描述">{{ response.description || '未填写' }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ response.status || '未填写' }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ApifoxModel } from '@/types/shelter';
import request from '@/utils/request';
import type { Shelter } from '@/types/shelter';
import { useRoute } from 'vue-router';

const response = ref<Shelter | null>(null); // 使用 response 替代 shelter
let id: string | number;
const route = useRoute();
const rawId = route.params.id;
console.log("rawId:", rawId);
id = rawId as string;

// 获取单个救护站详细信息
const getShelterDetail = async (id: string): Promise<Shelter> => {
  return await request.get(`/shelters/${id}`);
};

onMounted(async () => {
  try {
    console.log("Fetching shelter detail with ID:", id); // 确认 id 是否有效
    const apiResponse = await getShelterDetail(id);
    console.log("API Response Data:", apiResponse); // 打印 API 响应数据
    if (apiResponse) {
      response.value = apiResponse; // 将 API 响应赋值给 response
      console.log('Shelter Detail:', response.value);
    } else {
      console.error('API returned an empty response');
    }
  } catch (error) {
    console.error('Error fetching shelter detail:', error);
  }
});
</script>

<style scoped>
/*==== 直接替换你原来的 <style scoped> 里最外层 .detail-card 即可 ====*/
/* 1. 先把 body 区域占满，去掉纯白 */
body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff8f3 0%, #ffefe0 100%);
  /* 颗粒噪点：取消就删掉下面一行 */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
}

/* 2. 卡片再提一点层级 */
.detail-card {
  max-width: 980px;
  margin: 80px auto 60px;
  padding: 48px 56px 56px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-radius: 24px;
  box-shadow: 0 20px 50px -10px rgba(255, 150, 72, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.detail-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 60px -10px rgba(255, 150, 72, 0.25);
}

.title {
  display: inline-block;
  margin: 0 auto 24px;
  padding: 10px 32px;
  font-size: 26px;
  font-weight: 600;
  color: #1e80c1;
  background: rgba(225, 240, 255, 0.65);
  backdrop-filter: blur(6px);
  border-radius: 12px;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(30, 128, 193, 0.15);
}
@keyframes fade {
  from { filter: drop-shadow(0 0 2px rgba(255, 103, 0, 0.3)); }
  to   { filter: drop-shadow(0 0 6px rgba(255, 103, 0, 0.5)); }
}

/* 4. 描述列表细节（沿用你之前即可，这里只补一个圆角） */
.custom-descriptions {
  border-radius: 16px;
  overflow: hidden;
}
</style>