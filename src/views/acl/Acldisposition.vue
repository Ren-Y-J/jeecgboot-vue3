<template>
  <div class="allcal">
    <div class="nav">
      <a-card style="width: 1684px" class="nav">
        <a-form :model="formState" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed">
          <a-row :gutter="1">
            <a-col :md="6" :sm="24">
              <a-form-item style="margin-bottom: 0px;" label="名称" name="aclName" :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 16 }">
                <a-input v-model:value="queryParams.aclName" placeholder="请输入集群名称" />
              </a-form-item>
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
      <a-card style="width: 1684px">
        <a-button type="primary" style="margin-bottom: 10px;" @click="isOpen"><plus-outlined />添加</a-button>
        <!-- :row-selection="rowSelection" -->
        <a-table :columns="columns" :data-source="data" :pagination="false">
          <template #bodyCell="{ column, record }">
            <!-- <template #headerCell="{ column }">
            <template v-if="column.key === 'name'">
              <span>
                <smile-outlined />
                Name
              </span>
            </template>
          </template> -->
            <template v-if="column.dataIndex === 'operation'">
              <div>
                <span class="edit">修改</span>
                <span class="add">添加</span>
                <span class="del">删除</span>
                <span class="info">详情</span>
              </div>
            </template>
          </template>
        </a-table>
        <div class="pagination">
          <a-pagination :show-total="total => `共 ${total} 条数据`" v-model:current="queryParams.pageNum" :total="totals"
            v-model:pageSize="queryParams.pageSize" show-size-changer @showSizeChange="onShowSizeChange"
            @change="changeFn" />
        </div>
      </a-card>
    </div>
    <div class="model">
      <a-modal v-model:visible="visible" :title="opTitle" @ok="handleOk">
        <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed">
          <a-form-item label="ACL名称" name="aclName">
            <!-- :rules="[{ required: true, message: 'Please input your username!' }]" -->
            <a-input v-model:value="formState.aclName" />
          </a-form-item>


        </a-form>
      </a-modal>
    </div>
  </div>
</template>
<script name='Two-hosts' setup>
import { ref, defineComponent, reactive } from 'vue';
import { SmileTwoTone, HeartTwoTone, CheckCircleTwoTone, LeftOutlined, SearchOutlined, ReloadOutlined, PlusOutlined, RestOutlined } from '@ant-design/icons-vue'
import { acllist } from './disposition'
const columns = [
  {
    title: 'ACL名称',
    dataIndex: 'aclName',
    width: 220,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 240,
    align: 'center'
  }
];

const queryParams = ref({
  aclId: 0,
  aclName: "",
  pageNum: 1,
  pageSize: 5,
});
const data = ref([])
const totals = ref(0)
const opTitle = ref('新增')
const visible = ref(false)
const formState = ref({
  aclName: '',
});
const initData = () => {
  console.log('搜索11111');
  acllist(queryParams.value).then(res => {
    // console.log(res.records, 'res11');
    // console.log(res.total, 'res11');
    data.value = res.records
    totals.value = res.total
  });
}
initData()
const changeFn = (P, Ps) => {
  console.log(P, 'p');
  queryParams.value.pageNum = P
  initData()
}
const onShowSizeChange = (current, pageSize) => {
  console.log(pageSize, 'pageSize');
  queryParams.value.pageSize = pageSize
  initData()
};
const onFinish = values => {
  // console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  // console.log('Failed:', errorInfo);
};
const isOpen = () => {
  visible.value = true
  opTitle.value = '新增名称'
}
</script>
<style scoped lang="less">
.allcal {
  padding: 10px;

  .nav {
    margin-bottom: 6px;

    :deep(.ant-card-body) {

      padding: 12px 10px 13px 10px !important;
    }

    .ant-card-body {
      padding: 12px 10px 13px 10px !important;
    }

    .ant-card-body {
      padding: 12px 10px 13px 10px !important;
    }

    :deep(.ant-card-body) {
      padding: 12px 10px 13px 10px !important;
    }

    ::v-deep(.ant-card-body) {
      padding: 12px 10px 6px 10px !important;
    }



  }

  .contion {
    .ant-card-body {
      padding: 6px !important;
    }

    .ant-card-body {
      padding: 6px !important;
    }

    :deep(.ant-card-body) {
      padding: 6px !important;
    }

    ::v-deep(.ant-card-body) {
      padding: 6px !important;
    }

    .edit {
      color: #2E7DFF;
      padding: 0px 5px;
    }

    .add {
      color: #2E7DFF;
      padding: 0px 5px;
    }

    .info {
      color: #2E7DFF;
      padding: 0px 5px;
    }

    .del {
      color: #2E7DFF;
      padding: 0px 5px;
    }

    .pagination {
      margin: 10px 0 0 0;
      display: flex;
      justify-content: flex-end;
    }

  }
}
</style>