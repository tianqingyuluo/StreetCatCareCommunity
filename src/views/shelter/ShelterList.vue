<template>
  <div class="shelter-list-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="名称/地址模糊搜索" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="开放" value="ACTIVE"></el-option>
            <el-option label="关闭" value="INACTIVE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div class="table-header">
        <h3>救护站列表</h3>
        <div class="table-actions">
          <el-button type="primary" @click="handleNew">
            <el-icon><Plus /></el-icon>新增救护站
          </el-button>
        </div>
      </div>

      <el-table :data="shelterData" style="width: 100%" border stripe>
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="name" label="名称" width="120" />
        <el-table-column prop="avatar" label="图片" width="100">
          <template #default="scope">
            <img 
              v-if="scope.row.avatar" 
              :src="scope.row.avatar" 
              alt="救护站图片" 
              style="max-width: 100px; max-height: 100px; border-radius: 4px;"
            />
            <span v-else>无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" width="180">
          <template #default="scope">
            {{ scope.row.address || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="270">
          <template #default="scope">
            {{ scope.row.phone || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column prop="contactPerson" label="联系人" width="170">
          <template #default="scope">
            {{ scope.row.contactPerson || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'ACTIVE' ? 'success' : 'danger' " >
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作"  fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.$index, scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          :small="false"
          :disabled="false"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalShelters"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-card>
     <!--新增救护站-->
    <CreateShelter :visible="newShelterDialogVisible" 
      @update:visible="newShelterDialogVisible = $event" 
      @shelter-added="handleShelterAdded" 
      />

     <!-- 编辑救护站组件 -->
    <EditShelter 
      :visible="editShelterDialogVisible" 
      :shelter-data="currentEditingShelter"
      @update:visible="editShelterDialogVisible = $event" 
      @shelter-updated="handleShelterUpdated" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { getShelterList } from '@/api/shelter';
import type { ApifoxModel } from '@/types/shelter';
import { Status } from '@/types/shelter'; // 从 src/types/shelter.ts 导入类型
import type { Shelter } from '@/types/shelter';
import CreateShelter from './CreateShelter.vue'; // 导入 CreateShelter 组件
import { useRouter } from 'vue-router';
import {  ElMessageBox } from 'element-plus';
import request from '@/utils/request';
import EditShelter from './EditShelter.vue'

interface SearchForm {
  keyword: string;
  status: 'ACTIVE' | 'INACTIVE' | undefined;
}

const searchForm = reactive<SearchForm>({
  keyword: '',
  status: undefined,
});

const shelterData = ref<Shelter[]>();
const currentPage = ref(1);
const pageSize = ref(10);
const totalShelters = ref(10); // 初始化为模拟数据的长度
const router = useRouter();

const allShelterData = ref<Shelter[]>([]); // 存储所有数据

const fetchShelterList = async () => {
  try {
    // 构造查询参数
    const params: any = {};
    
    // 添加关键词搜索条件
    if (searchForm.keyword) {
      params.keyword = searchForm.keyword;
    }
    
    // 添加状态搜索条件
    if (searchForm.status) {
      params.status = searchForm.status;
    }
    
    const response = await getShelterList(params);
    
    if (response) {
      allShelterData.value = response as Shelter[];
    } else {
      console.error('返回的数据格式不正确:', response);
      ElMessage.error('获取救护站列表失败：返回的数据格式不正确');
      return;
    }
    totalShelters.value = allShelterData.value.length;
    handlePagination();
  } catch (error) {
    console.error('获取救护站列表失败:', error);
    ElMessage.error('获取救护站列表失败');
  }
};

// 分页逻辑
const handlePagination = () => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  shelterData.value = allShelterData.value.slice(start, end); // 使用 slice 进行分页
};

// 查询逻辑
const handleQuery = () => {
  currentPage.value = 1; // 查询时重置到第一页
  fetchShelterList();
};

// 重置搜索表单
const handleReset = () => {
  searchForm.keyword = '';
  searchForm.status = undefined;
  currentPage.value = 1;
  fetchShelterList();
};

const newShelterDialogVisible = ref(false); // 控制新增救护站对话框的显示

const handleNew = () => {
  console.log('新增救护站');
  newShelterDialogVisible.value = true; // 显示新增救护站对话框
};

//新增救护站后进行刷新
const handleShelterAdded = () => {
  fetchShelterList(); // 救护站添加成功后刷新列表
};

import { getShelterDetail } from '@/mock/shelter';

const handleView = async (index: number, row: Shelter) => {
  if (row.id !== undefined) {
    const detail = await getShelterDetail(String(row.id));
    router.push(`/shelters/${row.id}`);
  } else {
    console.error('row.id is undefined');
  }
};

const editShelterDialogVisible = ref(false)
const currentEditingShelter = ref<Shelter | null>(null)// 编辑救护站/修改救护站信息
// 编辑救护站
const handleEdit = (index: number, row: Shelter) => {
  console.log('编辑', index, row)
  currentEditingShelter.value = { ...row } // 深拷贝避免直接修改原数据
  editShelterDialogVisible.value = true
}

// 添加编辑完成后刷新列表的处理函数
const handleShelterUpdated = () => {
  ElMessage.success('救护站更新成功')
  fetchShelterList() // 救护站更新成功后刷新列表
}

// 删除救护站
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个救护站吗？此操作不可恢复',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    // 发送删除请求
    await request.delete(`/shelters/${id}`);
    
    ElMessage.success(`删除救护站 ID ${id} 成功`);
    fetchShelterList(); // 刷新列表
  } catch (error) {
    // 如果不是用户取消操作，则显示错误消息
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error('删除失败');
      console.error('删除救护站失败:', error);
    }
  }
};

// 分页逻辑
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  console.log('每页条数:', val);
  handlePagination();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  console.log('当前页:', val);
  handlePagination();
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return '开放';
    case 'INACTIVE':
      return '关闭';
    default:
      return '未知';
  }
};

onMounted(() => {
  fetchShelterList(); // 获取列表数据
});
</script>

<style scoped>
.shelter-list-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 50px); /* 减去头部高度 */
}

.search-card, .table-card {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.table-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>