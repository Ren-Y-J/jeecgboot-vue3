<template>
  <div class="nav">
    <a-card style="width: 1684px" class="nav">
      <a-form :model="formState" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed">
        <a-row :gutter="1">
          <a-col :span="6">
            <div class="gutter-box">
              <a-form-item label="状态" name="username">
                <!-- :rules="[{ required: true, message: 'Please input your username!' }]" -->
                <a-input v-model:value="formState.status" />
              </a-form-item>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="gutter-box">
              <a-form-item label="集群名称" name="password">
                <!-- :rules="[{ required: true, message: 'Please input your password!' }]" -->

                <a-input v-model:value="formState.hostName" />
              </a-form-item>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="gutter-box-button">
              <!-- <a-form-item> -->
              <span>
                <a-button class="search" size="large" type="primary" html-type="submit">搜索</a-button></span>
              <a-button type="primary" size="large" html-type="submit">重置</a-button>
              <!-- </a-form-item> -->
            </div>
          </a-col>
        </a-row>
      </a-form>

    </a-card>
    <!-- <a-card class="contion" style="width: 300px">
      <a-button type="primary" style="margin-bottom: 10px;" @click="isOpen">添加主机</a-button>
    </a-card> -->
  </div>
</template>
<script name='Two-hosts' setup>
import { defineComponent, reactive } from 'vue';
const formState = reactive({
  username: '',
  password: '',
  remember: true,
});
const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
const isOpen = () => {

}
</script>
<style scoped lang="less">
.nav {
  margin: 10px;

  // display: flex;s
  .gutter-box {
    background: #00a0e9;
    padding: 5px 0;
  }

  .gutter-box-button {
    display: flex;
    // flex-direction: column;
    align-items: center;
    height: 100%;

    .search {
      margin-right: 10px;
    }
  }
}
</style>