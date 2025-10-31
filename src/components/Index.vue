<template>
  <el-container class="layout-container-demo" style="height: 100%">
    <el-aside :width="aside_width" style="background-color: rgb(238, 241, 246);height: 100%;">
      <el-scrollbar>
        <Aside :isCollapse="isCollapse"></Aside>
      </el-scrollbar>
    </el-aside>

    <el-container style="height: 100%">
      <el-header style="text-align: right;border-bottom: darkgray 1px solid;">
        <Header @doCollapse="doCollapse"></Header>
      </el-header>

      <el-main style="height: 100%;">
        <Main></Main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Aside from './Aside.vue'
import Header from './Header.vue'
import Main from './Main.vue'
import { ref } from 'vue'
import { ElIcon } from 'element-plus'

const isCollapse = ref(false)
const aside_width = ref('220px')
const icon = ref('fold')
const doCollapse = (val: boolean) => {
  isCollapse.value = !isCollapse.value
  if(!isCollapse.value) {//open
    aside_width.value = '200px'
    icon.value = 'fold'
  } else {//close
    aside_width.value = '60px'
    icon.value = 'unfold'
  }
}

</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: white;
  color: #333;
  line-height: 60px;
}
.layout-container-demo .el-aside {
  background: white;
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding-left: 0;
  background-color: white;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  height: 100%;
  right: 20px;
}
</style>
