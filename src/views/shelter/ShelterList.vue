<template>
  <div class="shelter-list-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="名称/地址模糊搜索" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="开放" :value="Status.OPEN"></el-option>
            <el-option label="关闭" :value="Status.CLOSED"></el-option>
            <el-option label="已满" :value="Status.FULL"></el-option>
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
        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column prop="address" label="地址" width="200">
          <template #default="scope">
            {{ scope.row.address || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column prop="contactPhone" label="电话" width="270">
          <template #default="scope">
            {{ scope.row.contactPhone || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="170">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作"  fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.$index, scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :small="false"
          :disabled="false"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalShelters"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <CreateShelter :visible="newShelterDialogVisible" @update:visible="newShelterDialogVisible = $event" @shelter-added="handleShelterAdded" />
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

interface SearchForm {
  keyword: string;
  status: Status | undefined;
}

const searchForm = reactive<SearchForm>({
  keyword: '',
  status: undefined,
});

const shelterData = ref<Shelter[]>([
  {
    id: 1,
    name: '爱心救护站A',
    address: '北京市朝阳区',
    contactPerson: '张三',
    contactPhone: '13812345678',
    capacity: 100,
    currentOccupancy: 50,
    status: Status.OPEN,
    createTime: '2023-01-01 10:00:00',
    updateTime: '2023-01-01 10:00:00',
    location: { lat: 39.9042, lng: 116.4074 },
  },
  {
    id: 2,
    name: '希望之家B',
    address: '上海市浦东新区',
    contactPerson: '李四',
    contactPhone: '13987654321',
    capacity: 80,
    currentOccupancy: 80,
    status: Status.FULL,
    createTime: '2023-01-02 11:00:00',
    updateTime: '2023-01-02 11:00:00',
    location: { lat: 31.2304, lng: 121.4737 },
  },
  {
    id: 3,
    name: '温暖港湾C',
    address: '广州市天河区',
    contactPerson: '王五',
    contactPhone: '13700001111',
    capacity: 120,
    currentOccupancy: 30,
    status: Status.CLOSED,
    createTime: '2023-01-03 12:00:00',
    updateTime: '2023-01-03 12:00:00',
    location: { lat: 23.1291, lng: 113.2644 },
  },
]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalShelters = ref(shelterData.value.length); // 初始化为模拟数据的长度

// 获取救护站列表
const fetchShelterList = async () => {
  try {
    const params = {
      ...searchForm,
      page: currentPage.value,
      pageSize: pageSize.value,
    };
    const response = await getShelterList(); // 调用 API（无参版本）
    shelterData.value = response.data; // ApifoxModel 的 data 字段直接是 Shelter[]
    totalShelters.value = response.data.total; // ApifoxModel 的 total 字段在 data 中
  } catch (error) {
    console.error('获取救护站列表失败:', error);
    ElMessage.error('获取救护站列表失败');
  }
};

const handleQuery = () => {
  currentPage.value = 1; // 查询时重置到第一页
  fetchShelterList();
};

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

const handleShelterAdded = () => {
  fetchShelterList(); // 救护站添加成功后刷新列表
};

const handleView = (index: number, row: Shelter) => {
  console.log('查看', index, row);
  // TODO: 实现查看逻辑
};

const handleEdit = (index: number, row: Shelter) => {
  console.log('编辑', index, row);
  // TODO: 实现编辑逻辑
};

const handleDelete = (index: number, row: Shelter) => {
  console.log('删除', index, row);
  // TODO: 实现删除逻辑
  ElMessage.success(`删除救护站 ${row.name} 成功`);
  fetchShelterList(); // 刷新列表
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchShelterList();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchShelterList();
};

const getStatusText = (status: Status) => {
  switch (status) {
    case Status.OPEN:
      return '开放';
    case Status.CLOSED:
      return '关闭';
    case Status.FULL:
      return '已满';
    default:
      return '未知';
  }
};

const getStatusTagType = (status: Status) => {
  switch (status) {
    case Status.OPEN:
      return 'success';
    case Status.CLOSED:
      return 'danger';
    case Status.FULL:
      return 'warning';
    default:
      return 'info';
  }
};

onMounted(() => {
  fetchShelterList(); // 组件挂载时获取列表数据
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