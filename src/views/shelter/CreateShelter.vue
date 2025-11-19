<template>
  <el-dialog
    v-model="newShelterDialogVisible"
    title="新增救护站"
    width="50%"
    @close="resetNewShelterForm"
  >
    <el-form
      :model="newShelterForm"
      :rules="newShelterRules"
      ref="newShelterFormRef"
      label-width="100px"
    >
      <el-form-item label="救护站名称" prop="name">
        <el-input v-model="newShelterForm.name"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contactPerson">
        <el-input v-model="newShelterForm.contactPerson"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="newShelterForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="newShelterForm.email"></el-input>
      </el-form-item>
      <el-form-item label="纬度" prop="location.lat">
        <el-input-number v-model="newShelterForm.location.lat" :precision="6" :step="0.000001"></el-input-number>
      </el-form-item>
      <el-form-item label="经度" prop="location.lng">
        <el-input-number v-model="newShelterForm.location.lng" :precision="6" :step="0.000001"></el-input-number>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="newShelterForm.address"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="newShelterForm.description"></el-input>
      </el-form-item>
      <el-form-item label="许可证号" prop="licenseNumber">
        <el-input v-model="newShelterForm.licenseNumber"></el-input>
      </el-form-item>
      <el-form-item label="负责人ID" prop="managerId">
        <el-input v-model="newShelterForm.managerId"></el-input>
      </el-form-item>
      <el-form-item label="容量" prop="capacity">
        <el-input-number v-model="newShelterForm.capacity" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item label="图片URL" prop="avatar">
        <el-upload
          class="avatar-uploader"
          action="/api/upload" 
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="newShelterForm.avatar" :src="newShelterForm.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="newShelterDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitNewShelterForm">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue';
import { ElMessage, ElForm, ElFormItem, ElInput, ElButton, ElInputNumber, ElDatePicker } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { createShelter } from '@/api/shelter';

interface NewShelterForm {
    name: string 
    contactPerson: string 
    phone: string 
    email: string 
    location: {
        lat: number | null;
        lng: number | null;
    };
    address: string 
    description: string 
    licenseNumber: string 
    managerId: string 
    capacity?: number
    avatar: string

}

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(['update:visible', 'shelter-added']);

const newShelterDialogVisible = ref(props.visible);

watch(() => props.visible, (newVal) => {
  newShelterDialogVisible.value = newVal;
});

watch(newShelterDialogVisible, (newVal) => {
  emit('update:visible', newVal);
});

const newShelterFormRef = ref<FormInstance>();
const newShelterForm = reactive<NewShelterForm>({
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
  avatar: ''
});

const newShelterRules = reactive<FormRules>({
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
  avatar: [{ required: true, message: '请上传图片', trigger: 'change' }]
});

const submitNewShelterForm = async () => {
  if (!newShelterFormRef.value) return;
  try {
    await newShelterFormRef.value.validate();
    console.log('发送的新救护站数据:', newShelterForm);
    await createShelter(newShelterForm);
    ElMessage.success('新增救护站成功！');
    newShelterDialogVisible.value = false;
    resetNewShelterForm();
    emit('shelter-added'); // 通知父组件救护站已添加
  } catch (error) {
    console.error('新增救护站失败:', error);
    ElMessage.error('新增救护站失败，请检查表单信息！');
  }
};

const resetNewShelterForm = () => {
  if (newShelterFormRef.value) {
    newShelterFormRef.value.resetFields();
  }
  // nextTick(() => {
  //   newShelterFormRef.value?.clearValidate();
  // });
  Object.assign(newShelterForm, {
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
    avatar: ''
  });
};

// 添加这两个函数在 resetNewShelterForm 函数之前或之后

const handleAvatarSuccess = (response: any, file: File) => {
  // 根据实际的API响应结构调整
  newShelterForm.avatar = response.data.url || response.url;
};

const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!');
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!');
  }
  return isJPG && isLt2M;
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>