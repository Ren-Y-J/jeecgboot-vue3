<template>
  <div class="allclustersBox">
    <a-card>
      <div class="title">
        <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
          <a-row :gutter="1">
            <a-col :md="6" :sm="24">
              <a-form-item style="margin-bottom: 0px" label="策略组名称" name="name" :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 16 }">
                <a-input placeholder="请输入策略组名称" />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="5">
              <span style="display: inline-block; display: flex;flex-wrap: nowrap; margin-top: 0px">
                <div class="searchbtn">
                  <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery">
                    <search-outlined />搜索</a-button>
                  <a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
                </div>

              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
  </div>
  <div class="controls">
    <div class="iconBtn">
      <a-button :style="{ margin: '0px 8px 0px 0px ' }" type="primary"
        @click="handleQuery"><plus-outlined />添加策略组</a-button>
      <a-button :style="{ margin: '0px 8px ' }" type="primary" @click="AlldelFn"><edit-outlined />修改策略组</a-button>
      <a-button :style="{ margin: '0px 8px ' }" type="primary" @click="handleQuery"><delete-outlined />删除策略组</a-button>
      <a-button :style="{ margin: '0px 8px ' }" type="primary" @click="AlldelFn"><reload-outlined />同步策略组</a-button>
    </div>
    <div class="select">
      <a-alert show-icon style="margin-top: 8px" type="info">
        <template #message>
          <template v-if="number > 0">
            <span>已选定 {{ number }} 条记录(可跨页)</span>
            <a-divider type="vertical" />
            <a @click="clearbtn">清空</a>
            <a-divider type="vertical" />
          </template>
          <template v-else>
            <span>未选中任何数据</span>
          </template>
        </template>
      </a-alert>
      <!-- <a-alert message="未选中任何数据" type="info" show-icon /> -->
    </div>
    <!-- <a-table :columns="columns" :data-source="listData"
          :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }" :pagination="false"
          :rowKey="(record) => record.lineId" bordered>

        </a-table>  -->


  </div>
</template>


<script setup>
import { list, listAll } from './tactics'
import { SmileOutlined, DownOutlined, CloseCircleFilled } from '@ant-design/icons-vue';
import { SearchOutlined, ReloadOutlined, DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons-vue'
import { computed, defineComponent, reactive, toRefs, ref } from 'vue';

// const columns = [{
//   title: '策略组名称',
//   dataIndex: 'policiesName',
//   width: 220,
//   align: 'center'
// }, {
//   title: '匹配时段',
//   dataIndex: 'policiesTimeRange',
//   width: 220,
//   align: 'center'
// }, {
//   title: '有效策略数',
//   dataIndex: 'content',
//   width: 220,
//   align: 'center'
// },
// {
//   title: '总策略数',
//   dataIndex: 'zoneName',
//   width: 220,
//   align: 'center'
// },
// {
//   title: '状态',
//   dataIndex: 'policiesEnable',
//   width: 220,
//   align: 'center'

// },
// {
//   title: '操作',
//   dataIndex: 'operation',
//   width: 220,
//   align: 'center'
// },
// ];
const data = reactive({
  listData: '',
  total: 0,
  listAllData: []
});
const {
  listData,
  total,
  listAllData
} = toRefs(data)

const Cordquery = ref({
  pageNum: 1,
  pageSize: 10,

})
//列表数据
const getcordList = () => {
  list(Cordquery.value).then(res => {

    // console.log(res.records);
    listData.value = res.records
    total.value = res.total
    console.log(listData.value, '0000');
  })

}
getcordList()



</script>
<style scoped lang="less">
.allclustersBox {
  padding: 10px;
  padding-bottom: 0px;
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
  padding: 12px 10px 13px 10px !important;
}

.controls {
  background: #fff;
  margin: 10px;
  padding: 24px;
}

.title {

  .searchbtn {
    display: flex;
    flex-wrap: nowrap;
  }

  @media screen and (max-width: 800px) {
    .searchbtn {
      margin-top: 10px;
    }
  }
}

.select {
  margin: 8px 0px 0px 0px;
}

.iconBtn {
  margin-top: -10px;
}</style>
