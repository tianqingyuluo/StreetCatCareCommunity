<!-- EditShelter.vue -->
<template>
  <el-dialog
    title="编辑救护站"
    v-model="dialogVisible"
    width="500px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="救护站名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contactPerson">
        <el-input v-model="formData.contactPerson"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="纬度" prop="location.lat">
        <el-input-number v-model="formData.location.lat" :precision="6" :step="0.000001"></el-input-number>
      </el-form-item>
      <el-form-item label="经度" prop="location.lng">
        <el-input-number v-model="formData.location.lng" :precision="6" :step="0.000001"></el-input-number>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="formData.address"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="formData.description"></el-input>
      </el-form-item>
      <el-form-item label="许可证号" prop="licenseNumber">
        <el-input v-model="formData.licenseNumber"></el-input>
      </el-form-item>
      <el-form-item label="负责人ID" prop="managerId">
        <el-input v-model="formData.managerId"></el-input>
      </el-form-item>
      <el-form-item label="容量" prop="capacity">
        <el-input-number v-model="formData.capacity" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="图片URL" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="/api/upload" <!-- 这里是你的上传接口 -->
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="formData.avatar" :src="formData.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { Shelter } from '@/types/shelter'
import request from '@/utils/request'

const props = defineProps<{
  visible: boolean
  shelterData: Shelter | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'shelter-updated'): void
}>()

const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref()

// 表单数据
const formData = reactive({
  name: '',
  contactPerson: '',
  phone: '',
  email: '',
  location: {
    lat: null,
    lng: null,
  },
  address: '',
  description: '',
  licenseNumber: '',
  managerId: '',
  capacity: 0,
  avatar: '',
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入救护站名称', trigger: 'blur' }],
  contactPerson: [], // 设为选填
  phone: [
    // 设为选填，但如果填写了则验证格式
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  email: [
    // 设为选填，但如果填写了则验证格式
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  'location.lat': [{ required: true, message: '请输入纬度', trigger: 'change' }],
  'location.lng': [{ required: true, message: '请输入经度', trigger: 'change' }],
  address: [], // 设为选填
  description: [], // 设为选填
  licenseNumber: [], // 设为选填
  managerId: [{ required: true, message: '请输入负责人ID', trigger: 'blur' }],
  capacity: [{ type: 'number', min: 0, message: '容量不能小于0', trigger: 'change' }],
  avator: [], // 设为选填
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal && props.shelterData) {
    // 初始化表单数据
    Object.assign(formData, props.shelterData)
  }
})

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false
  emit('update:visible', false)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    
    try {
      loading.value = true
      // 发送更新请求
      await request.put(`/shelters/${formData.id}`, formData)
      ElMessage.success('救护站更新成功')
      handleClose()
      emit('shelter-updated')
    } catch (error) {
      ElMessage.error('更新失败')
      console.error('更新救护站失败:', error)
    } finally {
      loading.value = false
    }
  })
}
</script>