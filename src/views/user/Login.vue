<template>
  <div class="login-container">
    <el-card class="box">
      <template #header>
        <h1>登录</h1>
      </template>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item prop="phone">
          <el-input type="text" v-model="loginForm.phone" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { loginWeb } from '@/api/user'; // 导入用户API
import { useRouter } from 'vue-router'; // 导入 useRouter

export default {
  name: 'LoginPage',
  setup() {
    const loginFormRef = ref(null);
    const loginForm = reactive({
      phone: '',
      password: ''
    });
    const router = useRouter(); // 初始化 router

    const loginRules = {
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    };


const submitForm = () => {
  console.log("login");
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const result = await loginWeb({
          phone: loginForm.phone,
          password: loginForm.password
        });
        if (result) { // 确保返回值存在
          console.log('登录成功，返回数据:', result.data);
          const token = result.accessToken;
          const expiresIn = result.expiresIn;
          localStorage.setItem('token', token); // 存储 token 到 localStorage
          localStorage.setItem('tokenExpiresAt', (Date.now() + expiresIn * 1000).toString()); // 存储过期时间
          ElMessage.success('登录成功！');
          router.push('/home'); // 登录成功后跳转到首页
        } else {
          console.log('登录成功，返回数据:', result);
          ElMessage.error('登录失败：后端返回数据格式不正确');
        }
      } catch (error) {
        console.error('登录请求失败:', error);
        ElMessage.error('登录请求失败，请稍后再试！');
      }
    } else {
      ElMessage.error('请填写完整的登录信息！');
      return false;
    }
  });
};

    return {
      loginFormRef,
      loginForm,
      loginRules,
      submitForm
    };
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  background-image: url("../../assets/login-bg.png"); /* Adjusted path */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  color: #a0a5a8;
}

/* Now we will prepare our box. */
.box {
  border-radius: 50px;
  width: 350px;
  padding: 40px;
  background: #34495E;
  text-align: center;
}

/* With the box finished we can continue with the "Login" text. */
.box h1 {
  color: white;
  text-transform: uppercase;
  font-weight: 500;
}

/* Now we need to configure our inputs. */
/* Targeting Element Plus input's internal input element */
.box .el-input__inner {
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #3498db;
  padding: 14px 10px;
  width: 200px;
  outline: none;
  color: white;
  border-radius: 24px;
  transition: 0.25s;
}

.box .el-input__inner:focus {
  width: 280px;
  border-color: #2ecc71;
}

/* Targeting Element Plus button */
.box .el-button {
  background: none;
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid #2ECC71;
  padding: 14px 40px;
  outline: none;
  color: white;
  border-radius: 24px;
  transition: 1s;
  cursor: pointer;
}

.box .el-button:hover {
  background: #2ECC71;
}

/* Hide Element Plus form item label */
.el-form-item__label {
  display: none;
}
</style>