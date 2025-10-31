<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增员工"
    width="50%"
    @close="resetNewStaffForm"
  >
    <el-form
      :model="newStaffForm"
      :rules="newStaffRules"
      ref="newStaffFormRef"
      label-width="100px"
    >
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="newStaffForm.realName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="newStaffForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="newStaffForm.email"></el-input>
      </el-form-item>
      <el-form-item label="救护站ID" prop="shelterId">
        <el-input-number v-model="newStaffForm.shelterId" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="入职日期" prop="hiredAt">
        <el-date-picker
          v-model="newStaffForm.hiredAt"
          type="date"
          placeholder="选择日期"
          value-format="YYYY-MM-DD"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitNewStaffForm">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElMessage, ElForm, ElFormItem, ElInput, ElButton, ElInputNumber, ElDatePicker } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { createEmployee } from '@/api/employee';

interface NewStaffForm {
  realName: string;
  phone: string;
  email: string;
  shelterId: number | null;
  hiredAt: string;
}

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits(['update:visible', 'staff-added']);

const dialogVisible = ref(props.visible);

watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal;
});

watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal);
});

const newStaffFormRef = ref<FormInstance>();
const newStaffForm = reactive<NewStaffForm>({
  realName: '',
  phone: '',
  email: '',
  shelterId: null,
  hiredAt: '',
});

const newStaffRules = reactive<FormRules>({
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  shelterId: [{ required: true, message: '请输入救护站ID', trigger: 'change' }],
  hiredAt: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
});

const submitNewStaffForm = async () => {
  if (!newStaffFormRef.value) return;
  try {
    await newStaffFormRef.value.validate();
    console.log('发送的新员工数据:', newStaffForm);
    await createEmployee(newStaffForm);
    ElMessage.success('新增员工成功！');
    dialogVisible.value = false;
    resetNewStaffForm();
    emit('staff-added'); // 通知父组件员工已添加
  } catch (error) {
    console.error('新增员工失败:', error);
    ElMessage.error('新增员工失败，请检查表单信息！');
  }
};

const resetNewStaffForm = () => {
  if (newStaffFormRef.value) {
    newStaffFormRef.value.resetFields();
  }
  Object.assign(newStaffForm, {
    realName: '',
    phone: '',
    email: '',
    shelterId: null,
    hiredAt: '',
  });
};
</script>

<style>
</style>