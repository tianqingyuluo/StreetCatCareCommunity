<template>
  <div class="create-web-account">
    <h1>创建Web账户</h1>
    <el-form 
      :model="accountForm" 
      :rules="rules" 
      ref="accountFormRef" 
      label-width="120px"
      class="account-form"
    >
      <el-form-item label="真实姓名" prop="realName">
        <el-input 
          v-model="accountForm.realName" 
          placeholder="请输入真实姓名"
          maxlength="50"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="手机号" prop="phone">
        <el-input 
          v-model="accountForm.phone" 
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      
      <el-form-item label="账号角色" prop="role">
        <el-select v-model="accountForm.role" placeholder="请选择账号角色">
          <el-option label="救助站管理员" value="SHELTER_MANAGER"></el-option>
          <el-option label="系统管理员" value="SYSTEM_ADMIN"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm">创建账户</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createAccount } from '@/api/user'

// 定义表单数据
const accountForm = reactive({
  realName: '',
  phone: '',
  role: ''
})

// 定义表单引用
const accountFormRef = ref<FormInstance>()

// 表单验证规则
const rules = reactive<FormRules>({
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { max: 50, message: '真实姓名不能超过50个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择账号角色', trigger: 'change' }
  ]
})

// 提交表单
const submitForm = async () => {
  if (!accountFormRef.value) return

  await accountFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 调用API创建账户
        const response = await createAccount(accountForm)
        console.log('账户创建成功:', response)
        ElMessage.success('账户创建成功!')
        resetForm()
      } catch (error: unknown) {
        console.error('创建账户失败:', error)
        const errMsg = error instanceof Error ? error.message : String(error)
        ElMessage.error('账户创建失败: ' + (errMsg || '未知错误'))
      }
    } else {
      ElMessage.error('请检查填写信息')
    }
  })
}

// 重置表单
const resetForm = () => {
  if (!accountFormRef.value) return
  accountFormRef.value.resetFields()
}
</script>

<style scoped>
.create-web-account {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.account-form {
  margin-top: 20px;
}

h1 {
  text-align: center;
  color: #333;
}
</style>