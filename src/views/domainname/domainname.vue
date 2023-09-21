<template>
  <div class="domainname">
    <div class="nav">
      <!-- <a-card> -->
      <a-tabs v-model:activeKey="activeKey" @change="changetabsFn">
        <a-tab-pane key="0" tab="域名库"> </a-tab-pane>
        <a-tab-pane key="1" tab="自定义分组" force-render forceRender> </a-tab-pane>
      </a-tabs>
      <!-- :model="formState" -->
      <!-- <a-form name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish"
        @finishFailed="onFinishFailed">
        <a-row :gutter="1">
          <a-col :md="6" :sm="24">
            <a-form-item style="margin-bottom: 0px;" label="名称" name="aclName" :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 16 }">

              <a-input placeholder="请输入名称" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="5">
            <span class="searchbtn" style="display: inline-block; display: flex;flex-wrap: nowrap; ">
              <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery">
                <search-outlined />搜索</a-button>
              <a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form> -->
      <a-form name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish"
        @finishFailed="onFinishFailed">
        <a-row :gutter="1">
          <a-col :md="6" :sm="24">
            <a-form-item v-if="activeKey == 0" style="margin-bottom: 0px;" label="域名" name="zone" :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 16 }">
              <!-- -->
              <a-input placeholder="请输入域名" v-model:value="formGData.zone" />
            </a-form-item>
            <a-form-item v-else style="margin-bottom: 0px;" label="分组名称" name="name" :labelCol="{ span: 6 }"
              :wrapperCol="{ span: 16 }">
              <!--  -->
              <a-input v-model:value="formGData.name" placeholder="请输入分组名称" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="5">
            <span class="searchbtn" style="display: inline-block; display: flex;flex-wrap: nowrap; ">
              <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="searchFn">
                搜索</a-button>
              <a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div v-if="falgeG">
      <Group ref="groupRef"></Group>
    </div>
    <div v-show="falgeL">
      <!-- :libname="formGData.name" -->
      <Library ref="libraryRef"></Library>
    </div>
  </div>
</template>
<script name='domainname' setup>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue'
import Group from "./group.vue"
import Library from "./library.vue"

const data = reactive({
  activeKey: '0',
  // libraryRef: null,
  // groupRef: null,
})
const { activeKey } = toRefs(data)
const formGData = reactive({
  zone: '',
  name: ''
})
const libraryRef = ref(null)
const groupRef = ref(null)
const falgeG = ref(true)
const falgeL = ref(false)
const searchFn = () => {
  console.log(1);
  console.log(libraryRef.value);
  console.log(libraryRef.value.initData)
  if (activeKey.value == '0') {
    groupRef.value.pageNum()
    groupRef.value.initData(formGData.zone)
  } else if (activeKey.value == '1') {
    // libraryRef.value.initData()
    libraryRef.value.pageNum()
    libraryRef.value.initData(formGData.name)

  }
}
const AlldelFn = () => {
  if (activeKey.value == '0') {
    formGData.zone = ''
    groupRef.value.initData('')
  } else if (activeKey.value == '1') {
    formGData.name = ''
    // console.log(formGData.name);
    // libraryRef.value.initData()
    libraryRef.value.initData('')

  }
}
const changetabsFn = (value) => {
  if (activeKey.value == '0') {
    falgeG.value = true
    falgeL.value = false
    // groupRef.value.initData()
    // console.log(falgeLibrary.value);
  } else if (activeKey.value == '1') {
    falgeL.value = true
    falgeG.value = false
    // libraryRef.value.initData()
    // console.log(falgeLibrary.value);
  }

}
</script>
<style scoped lang="less">
.domainname {
  padding: 10px;

  .nav {
    padding: 8px;
    background-color: #fff;
  }
}
</style>