<template>
  <div class="staff-list-container">
    <!-- 搜索区 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.key"
            placeholder="姓名 / 手机 / 邮箱"
            clearable
            style="width:220px"
          />
        </el-form-item>

        <el-form-item label="救护站">
          <el-select v-model="searchForm.shelterId" placeholder="请选择" clearable>
            <el-option
              v-for="item in shelterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区 -->
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
          <el-button type="danger" plain @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>批量删除 ({{ selectedStaff.length }})
          </el-button>
        </div>
      </div>

      <el-table
        :data="currentPageData"
        style="width: 98%"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="userId" label="用户ID" width="120" />
        <el-table-column prop="shelterId" label="救护站ID" width="120" />
        <el-table-column label="头像" width="100">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="真实姓名" width="100" />
        <el-table-column prop="phone" label="电话" width="150" />
        <el-table-column prop="email" label="邮箱" width="150" />
        <el-table-column prop="hiredAt" label="入职日期" width="150" />
        <el-table-column prop="hireStatus" label="状态" width="120">
          <template #default="{ row }">
            <el-select 
              v-model="row.hireStatus" 
              @change="handleStatusChange(row, $event)"
              size="small"
            >
              <el-option 
                v-for="(item, key) in statusMap" 
                :key="key" 
                :label="item.text" 
                :value="key"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ $index, row }">
            <el-button circle @click="handleView($index, row)">
              <el-icon><View /></el-icon>
            </el-button>
            <el-button circle type="danger" @click="handleDelete($index, row)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filterTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增弹窗 -->
    <CreateStaff
      :visible="newStaffDialogVisible"
      @update:visible="newStaffDialogVisible = $event"
      @staff-added="handleStaffAdded"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Download, Delete, View } from '@element-plus/icons-vue'
import CreateStaff from './createStaff.vue'
import { getStaffList, removeStaff } from '@/api/staff'
import { getShelterList } from '@/api/shelter'
import type { StaffResponse1 } from '@/types/Staff/StaffList'
import type { Shelter } from '@/types/shelter'

import { updateStaffStatus } from '@/api/staff'

// 添加状态修改处理函数
const handleStatusChange = async (row: StaffResponse1, newStatus: string) => {
  try {
    await updateStaffStatus(row.id!, newStatus)
    ElMessage.success('状态更新成功')
    // 更新本地数据
    const staffIndex = staffData.value.findIndex(item => item.id === row.id)
    if (staffIndex !== -1) {
      staffData.value[staffIndex].hireStatus = newStatus
      filterInFront() // 重新过滤和分页
    }
  } catch (error) {
    // 恢复原状态
    const staffIndex = staffData.value.findIndex(item => item.id === row.id)
    if (staffIndex !== -1) {
      staffData.value[staffIndex].hireStatus = row.hireStatus
    }
    ElMessage.error('状态更新失败')
  }
}

// 在<script>部分添加状态映射
const statusMap = {
  ONBOARD: { text: '在职', color: 'success' },
  RESIGNED: { text: '离职', color: 'danger' },
  SUSPENDED: { text: '暂停', color: 'warning' }
}

/* ---------------- 搜索条件 ---------------- */
const searchForm = reactive({ key: '', shelterId: '' })
const shelterOptions = ref<{ value: string; label: string }[]>([])

/* ---------------- 表格数据 ---------------- */
const staffData = ref<StaffResponse1[]>([])        // 后端原始全量数据
const displayData = ref<StaffResponse1[]>([])     // 过滤后总数据
const currentPageData = ref<StaffResponse1[]>([]) // 当前要展示的切片
const selectedStaff = ref<StaffResponse1[]>([])

/* ---------------- 分页 ---------------- */
const currentPage = ref(1)
const pageSize = ref(10)
const filterTotal = ref(0)

/* ---------------- 获取救护站下拉 ---------------- */
const fetchShelterList = async () => {
  try {
    const list: Shelter[] = await getShelterList()
    shelterOptions.value = list.map(v => ({ value: v.id, label: v.name }))
  } catch {
    ElMessage.error('获取救护站列表失败')
  }
}

/* ---------------- 获取员工全量数据 ---------------- */
const fetchStaffList = async () => {
  try {
    // 一次性拉回所有数据（size 给大一点）
    const params = searchForm.shelterId
      ? { shelterId: searchForm.shelterId, page: 1, size: 9999 }
      : { page: 1, size: 9999 }
    const res = await getStaffList(params)
    staffData.value = res.records
    filterInFront() // 触发前端过滤+分页
  } catch {
    ElMessage.error('获取员工列表失败')
  }
}

/* ---------------- 前端过滤 + 分页 ---------------- */
function filterInFront() {
  const key = searchForm.key.trim().toLowerCase()
  const sid = searchForm.shelterId

  // 过滤
  const tmp = staffData.value.filter(item =>
    (!sid || item.shelterId === sid) &&
    (!key ||
      item.realName.toLowerCase().includes(key) ||
      item.phone.includes(key) ||
      item.email.toLowerCase().includes(key))
  )

  filterTotal.value = tmp.length

  // 切片
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  currentPageData.value = tmp.slice(start, end)
}

/* ---------------- 监听条件变化 ---------------- */
watch([() => searchForm.key, () => searchForm.shelterId], () => {
  currentPage.value = 1
  filterInFront()
})
watch([currentPage, pageSize], filterInFront)

/* ---------------- 事件回调 ---------------- */
const handleSelectionChange = (rows: StaffResponse1[]) => (selectedStaff.value = rows)
const handleQuery = () => fetchStaffList()
const handleReset = () => {
  searchForm.key = ''
  searchForm.shelterId = ''
  currentPage.value = 1
  fetchStaffList()
}

const newStaffDialogVisible = ref(false)
const handleNew = () => (newStaffDialogVisible.value = true)
const handleStaffAdded = () => {
  newStaffDialogVisible.value = false
  fetchStaffList()
}
const handleExport = () => console.log('导出')
const handleView = (idx: number, row: StaffResponse1) => console.log('查看', idx, row)

const handleDelete = async (idx: number, row: StaffResponse1) => {
  if (!row.id) return ElMessage.warning('无效ID')
  try {
    await removeStaff(row.id)
    ElMessage.success('删除成功')
    fetchStaffList()
  } catch {
    ElMessage.error('删除失败')
  }
}

const handleBatchDelete = async () => {
  if (!selectedStaff.value.length) return ElMessage.warning('请先选择员工')
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedStaff.value.length} 个员工？`, '提示', { type: 'warning' })
    await Promise.all(selectedStaff.value.map(v => removeStaff(v.id!)))
    ElMessage.success('批量删除成功')
    fetchStaffList()
  } catch {
    ElMessage.error('批量删除失败')
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}
const handleCurrentChange = (val: number) => (currentPage.value = val)

/* ---------------- 初始化 ---------------- */
onMounted(() => {
  fetchShelterList()
  fetchStaffList()
})
</script>

<style scoped>
/* 与你原来一致，无需改动 */
.staff-list-container {
  padding: 20px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 50px);
}
.search-card,
.table-card {
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