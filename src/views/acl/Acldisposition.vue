<template>
  <div class="allcal">
    {{ 1 }}
    <!-- <div class="nav">
      <a-card style="width: 1684px" class="nav">
        <a-form :model="formState" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed">
          <a-row :gutter="1">
            <a-col :span="6">
             
            </a-col>
            <a-col :span="6">
              <div class="gutter-box">
                <a-form-item label="名称" name="hostName">
                

                  <a-input v-model:value="queryParams.hostName" />
                </a-form-item>
              </div>
            </a-col>
            <a-col :md="4" :sm="5">
              <span style="display: inline-block; display: flex;flex-wrap: nowrap; margin-top: 0px">
                <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery">
                  <search-outlined />搜索</a-button>
                <a-button :style="{ margin: '0px 5px ' }" type="primary"
                  @click="AlldelFn"><reload-outlined />重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </a-card>

    </div>
    <div class="contion">
      <a-card class="contion" style="width: 1684px">
        <a-button type="primary" style="margin-bottom: 10px;" @click="isOpen"><plus-outlined />添加主机</a-button>
        <a-table :columns="columns" :data-source="data" :row-selection="rowSelection">

          <template #headerCell="{ column }">
            <template v-if="column.key === 'name'">
              <span>
                <smile-outlined />
                Name
              </span>
            </template>
          </template>
        </a-table>
      </a-card>
    </div> -->
  </div>
</template>
<script name='Two-hosts' setup>
import { ref, defineComponent, reactive } from 'vue';
import { SmileTwoTone, HeartTwoTone, CheckCircleTwoTone, LeftOutlined, SearchOutlined, ReloadOutlined, PlusOutlined, RestOutlined } from '@ant-design/icons-vue'
// import { list } from './hosts'


const columns = [
  {
    name: '名称',
    dataIndex: 'Name',
    width: 220,
    align: 'center'
  }];

const queryParams = ref({
  hostName: '',
  hostId: 0,
  port: 0,
  rootSec: '',
  clusterId: 0,
  pageNum: 1,
  pageSize: 5,
});
const data = ref([])
const totals = ref(0)
const initData = () => {
  // console.log('搜索11111');
  // list(queryParams.value).then(res => {
  //   console.log(res, 'res11');
  //   data.value = res.records
  //   totals.value = res.total
  // });
}
// initData()
const onFinish = values => {
  // console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  // console.log('Failed:', errorInfo);
};
const isOpen = () => {

}
</script>
<style scoped lang="less">
.allcal {
  padding: 10px;

  .nav {
    margin-bottom: 6px;

    :deep(.ant-card-body) {

      padding: 12px 10px 6px 10px !important;
    }

    .ant-card-body {
      padding: 12px 10px 6px 10px !important;
    }

    .ant-card-body {
      padding: 12px 10px 6px 10px !important;
    }

    :deep(.ant-card-body) {
      padding: 12px 10px 6px 10px !important;
    }

    ::v-deep(.ant-card-body) {
      padding: 12px 10px 6px 10px !important;
    }



  }
}
</style>