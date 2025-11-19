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
      <el-form-item label="救护站" prop="shelterId">
        <el-select 
          v-model="newStaffForm.shelterId" 
          placeholder="请选择救护站" 
          style="width: 100%"
        >
          <el-option
            v-for="shelter in shelterList"
            :key="shelter.id"
            :label="shelter.name"
            :value="shelter.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入职日期" prop="hiredAt">
        <el-date-picker
          v-model="newStaffForm.hiredAt"
          type="date"
          placeholder="选择日期"
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
import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage, ElForm, ElFormItem, ElInput, ElButton, ElInputNumber, ElDatePicker } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { createStaff } from '@/api/staff';
import { createAccount } from '@/api/user';
import type { CreateStaffParams } from '@/types/Staff/CreateStaff';
import { getShelterList } from '@/api/shelter';
import type { Shelter } from '@/types/shelter'

// 获取所有的 shelterList
const shelterList = ref<Shelter[]>([]);

// 获取救护站列表
const fetchShelterList = async () => {
  try {
    const response = await getShelterList();
    shelterList.value = response;
  } catch (error) {
    console.error('获取救护站列表失败:', error);
    ElMessage.error('获取救护站列表失败！');
  }
};

// 组件挂载时获取救护站列表
onMounted(() => {
  fetchShelterList();
});

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
const newStaffForm = reactive<CreateStaffParams>({
  realName: '',
  phone: '',
  email: '',
  shelterId: 0,  // 注意：这里从 null 改为 0，因为类型要求是 number
  hiredAt: undefined,
  userId: 0,     // 添加 userId 字段
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


// 在 submitNewStaffForm 成功后也重置表单
const submitNewStaffForm = async () => {
  if (!newStaffFormRef.value) return;
  try {
    // 验证表单数据
    await newStaffFormRef.value.validate();

    // 第一步：调用 createAccount 创建账户并获取 userId
    const accountData = {
      realName: newStaffForm.realName,
      phone: newStaffForm.phone,
      role: 'SHELTER_MEMBER'
    };
    
    const accountResponse = await createAccount(accountData);
    const userId = accountResponse.id;

    // 第二步：格式化日期并设置 userId，然后调用 createStaff 创建员工档案
    const formatDate = (date: Date | string | undefined): string | undefined => {
      if (!date) return undefined;
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }
      if (typeof date === 'string' && date.includes('T')) {
        return date.split('T')[0];
      }
      return date;
    };

    const staffData = {
      realName: newStaffForm.realName,
      phone: newStaffForm.phone,
      email: newStaffForm.email,
      shelterId: newStaffForm.shelterId,
      hiredAt: formatDate(newStaffForm.hiredAt),
      userId: userId
    };

    await createStaff(staffData);

    ElMessage.success('新增员工成功！');
    dialogVisible.value = false;
    resetNewStaffForm(); // 重置表单并重新获取数据
    emit('staff-added');
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
    shelterId: undefined, // 改为 undefined 以匹配下拉选择
    hiredAt: undefined,
    userId: 0,
  });

  // 重新获取救护站列表确保数据是最新的
  fetchShelterList();
};

</script>

<style>
</style>