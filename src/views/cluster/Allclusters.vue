<template>
  <div>
    <a-card class="biaoti">
      <!-- :label-col="{ span: 12 }"{span: 3, offset: 12}labelCol="{ span: 3, offset: 12 }" :wrapper-col="{ span: 8 }" -->
      <a-form :model="formState" name="basic" :label-col="{ span: 1 }" :wrapper-col="{ span: 4 }" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="集群名称" name="clusterName">
          <a-input v-model:value="queryParams.clusterName" />
        </a-form-item>
      </a-form>

    </a-card>


    <a-card class="contion">
      <a-button type="primary" style="margin-bottom: 10px;" @click="isOpen">新增</a-button>
      <a-table :columns="columns" :row-selection="rowSelection" :data-source="data" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <a v-if="record.status == 1">
              <check-circle-two-tone two-tone-color="#52c41a" />
            </a>
            <a v-else> <smile-outlined :rotate="180" /></a>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <div>
              <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="isOpen(record)">编辑</a-button>
              <a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" @confirm="confirm(record)" @cancel="cancel">
                <a-button :style="{ margin: '0px 5px ' }" type="primary">删除</a-button>
              </a-popconfirm>
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
  <a-drawer v-model:visible="visible" class="custom-class" style="color: red" :title="opTitle" @close="onClose"
    placement="right">
    <!-- @after-visible-change="afterVisibleChange" -->
    <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
      @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="名称" name="clusterName">
        <a-input v-model:value="rowData.clusterName" />
      </a-form-item>
      <a-form-item label="备注" name="remark">
        <a-input v-model:value="rowData.remark" />
      </a-form-item>


      <!--回显要这个名称clusterName 备注:remark -->

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <!-- html-type="submit" -->
        <a-button type="primary" @click="addFn">{{ opTitle }}</a-button>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>
<script   name='One' setup>
import { ref } from 'vue'
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
import { list, addclusterList, editclusterList, clusterInfo, delclusterList } from './cluster '
import { SmileTwoTone, HeartTwoTone, CheckCircleTwoTone } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue';
// import { usePagination } from 'vue-request';
const columns = [{
  title: '状态',
  dataIndex: 'status',
  width: 220,
}, {
  title: '名称',
  dataIndex: 'clusterName',
  width: 228,
}, {
  title: '备注',
  dataIndex: 'remark',
  width: 228,
},
{
  title: '主机',
  dataIndex: 'hostNum',
  width: 228,

},
{
  title: '创建时间',
  dataIndex: 'createTime',
  width: 230,

},
{
  title: '更新时间',
  dataIndex: 'updateTime',
  width: 230,

},
{
  title: '操作',
  dataIndex: 'operation',
  width: 240,

}];
const data = ref([])
const totals = ref(0)
const visible = ref(false)
const opTitle = ref('新增')
const lists = ref([])
// const pageSize = ref(20);
const values = ref([])
// 对象包数组
const commonEnty = ref({ values: [] })
const queryParams = ref({
  // 查询参数
  clusterName: "",
  hostNum: 0,
  remark: "",
  pageNum: 1,
  pageSize: 10,
});
const rowData = ref({
  remark: '',
  clusterName: ''
})

const current = ref(4)

const rowSelection = ref({
  checkStrictly: true,
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows:11 ', selectedRows);

  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows, 'selectedRows:222 ');
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows, 'selectedRows:333');
  },
});
// 初始化
const getList = async () => {
  let { records, total } = await list(queryParams.value)
  console.log(records, '12');
  data.value = records
  totals.value = total

}
getList()


const isOpen = async (record) => {
  visible.value = true
  // queryParams.value = record
  // console.log(record.clusterId, 'record.clusterId');
  if (record.createTime) {

    let res = await clusterInfo(`${record.clusterId}`)
    rowData.value = res
    opTitle.value = "修改"
  }
}

const formState = ref({
  username: '',
});


const addFn = async () => {
  if (rowData.value.clusterId) {
    // 换了rowData.value
    let res = await editclusterList(rowData.value)
    visible.value = false
  } else {
    // Drawer.value = "添加集群"
    let res = await addclusterList(rowData.value)
    console.log(res, 'resadd');
  }
  getList()
  onClose()
}
// 关闭弹框
const onClose = () => {
  visible.value = false;
  rowData.value.remark = ""
  rowData.value.clusterName = ""
};
// 删除逻辑功能
const delFn = async (record) => {
  // 拿到点击删除的id
  // console.log(record, 'record1');
  // 错误的写法lists.value.push(record.clusterId)
  // 把id放到对象（包）数组
  commonEnty.value.values.push(record);
  console.log(lists.value, 'lists.value');
  // try {
  await delclusterList(commonEnty.value)
  // } catch (error) {
  //   onsole.log(error, 'error')
  // }
  // 更新列表
  getList()

}
// 捕获异常  
const confirm = (record) => {
  console.log(record.clusterId, 'record2');
  delFn(record.clusterId)
  getList()
};
const cancel = async (e) => {
  console.log(e, '	点击取消的回调');
  // message.error('Click on No');
};
//分页功能
const changeFn = (P, Ps) => {
  console.log(P);
  console.log(Ps, 'Ps');
  queryParams.value.pageNum = P
  getList()
}
const onShowSizeChange = (current, pageSize) => {
  console.log(pageSize, 'pageSize');
  queryParams.value.pageSize = pageSize
  getList()
};
</script>
<style scoped lang="less">
.contion {
  margin: 10px;
  display: flex;
  justify-content: start;
  flex-direction: column;

  .pagination {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
  }

  // .app {
  //   width: 100%;
  //   height: 60px;

  //   .a-pagination {
  //     width: 100%;
  //     height: 60px;
  //   }
  // }
}
</style>
