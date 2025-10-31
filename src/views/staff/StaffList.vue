<template>
  <div class="staff-list-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="text" @click="handleExpand">展开</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <div class="table-header">
        <h3>用户数据表格</h3>
        <div class="table-actions">
          <el-button type="primary" @click="handleNew">
            <el-icon><Plus /></el-icon>新增
          </el-button>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
          <el-button @click="handleImport">
            <el-icon><Upload /></el-icon>导入 Excel
          </el-button>
          <el-button type="danger" plain @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>批量删除 ({{ selectedStaff.length }})
          </el-button>
          <el-dropdown>
            <el-button>
              <el-icon><Setting /></el-icon>自定义列表列
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>列1</el-dropdown-item>
                <el-dropdown-item>列2</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="table-tools">
            <el-button circle><el-icon><Refresh /></el-icon></el-button>
            <el-button circle><el-icon><Operation /></el-icon></el-button>
            <el-button circle><el-icon><FullScreen /></el-icon></el-button>
            <el-button circle><el-icon><Setting /></el-icon></el-button>
          </div>
        </div>
      </div>

      <el-table :data="staffData" style="width: 98%" border stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="userId" label="用户ID" width="80" />
        <el-table-column prop="shelterId" label="救护站ID" width="120" />
        <el-table-column label="头像" width="100">
          <template #default="scope">
            <el-avatar :size="40" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="真实姓名" width="160" />
        <el-table-column prop="phone" label="电话" width="170" />
        <el-table-column prop="email" label="邮箱" width="230" />
        <el-table-column prop="hiredAt" label="入职日期" width="170" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button size="small" circle @click="handleView(scope.$index, scope.row)">
              <el-icon><View /></el-icon>
            </el-button>
            <el-button size="small" circle type="primary" @click="handleEdit(scope.$index, scope.row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button size="small" circle type="danger" @click="handleDelete(scope.$index, scope.row)">
              <el-icon><Delete /></el-icon>
            </el-button>
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
          :total="totalStaff"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <CreateStaff :visible="newStaffDialogVisible" @update:visible="newStaffDialogVisible = $event" @staff-added="handleStaffAdded" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus, Download, Upload, Delete, Setting, Refresh, Operation, FullScreen, View, Edit } from '@element-plus/icons-vue';
import CreateStaff from './createStaff.vue';
import { getStaffList } from '@/api/employee'; // 导入获取员工列表的API

interface Staff {
  userId: number;
  shelterId: number;
  realName: string;
  phone: string;
  email: string;
  hiredAt: string;
  avatar: string; // Add avatar field
}

const searchForm = reactive({
  username: '',
  phone: '',
});

const staffData = ref<Staff[]>([
  {
    userId: 1,
    shelterId: 101,
    realName: 'Anna',
    phone: '18726855272',
    email: 'v.olqmhj@fcwggqcbt.cu',
    hiredAt: '2023-01-15',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // Default avatar
  },
  {
    userId: 2,
    shelterId: 102,
    realName: 'Jeffrey',
    phone: '15432151089',
    email: 'q.xysxehwdn@slwl.is',
    hiredAt: '2022-11-01',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // Default avatar
  },
  {
    userId: 3,
    shelterId: 101,
    realName: 'Melissa',
    phone: '15448522189',
    email: 'q.mzmfeh@sll.sy',
    hiredAt: '2024-03-20',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // Default avatar
  },
]); // 初始化为空数组
const selectedStaff = ref<Staff[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalStaff = ref(staffData.value.length); // 初始化为0

const isExpanded = ref(false); // 控制搜索区域展开/收起状态

// 获取员工列表
const fetchStaffList = async () => {
  try {
    const params = {
      username: searchForm.username,
      phone: searchForm.phone,
      page: currentPage.value,
      pageSize: pageSize.value,
    };
    const response = await getStaffList(params);
    staffData.value = response.data.list;
    totalStaff.value = response.data.total;
  } catch (error) {
    console.error('获取员工列表失败:', error);
    ElMessage.error('获取员工列表失败');
  }
};

const handleSelectionChange = (val: Staff[]) => {
  selectedStaff.value = val;
};

const handleQuery = () => {
  currentPage.value = 1; // 查询时重置到第一页
  fetchStaffList();
};

const handleReset = () => {
  searchForm.username = '';
  searchForm.phone = '';
  currentPage.value = 1; // 重置时也回到第一页
  fetchStaffList();
};

const handleExpand = () => {
  isExpanded.value = !isExpanded.value;
  console.log('展开状态:', isExpanded.value);
};

onMounted(() => {
  fetchStaffList(); // 组件挂载时获取列表数据
});

const newStaffDialogVisible = ref(false);

const handleNew = () => {
  newStaffDialogVisible.value = true;
};

const handleStaffAdded = () => {
  newStaffDialogVisible.value = false;
  // 刷新员工列表，例如重新调用 handleQuery()
  // handleQuery();
};

const handleExport = () => {
  console.log('导出');
  // 实现导出逻辑
};

const handleImport = () => {
  console.log('导入 Excel');
  // 实现导入逻辑
};

const handleBatchDelete = () => {
  console.log('批量删除', selectedStaff.value);
  // 实现批量删除逻辑
};

const handleView = (index: number, row: Staff) => {
  console.log('查看', index, row);
  // 实现查看逻辑
};

const handleEdit = (index: number, row: Staff) => {
  console.log('编辑', index, row);
  // 实现编辑逻辑
};

const handleDelete = (index: number, row: Staff) => {
  console.log('删除', index, row);
  // 实现删除逻辑
  staffData.value.splice(index, 1);
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  console.log(`${val} items per page`);
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  console.log(`current page: ${val}`);
};
</script>

<style scoped>
.staff-list-container {
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

.table-tools {
  display: flex;
  gap: 5px;
  margin-left: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>