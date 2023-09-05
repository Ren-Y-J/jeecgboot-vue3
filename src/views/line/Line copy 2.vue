<template>
  <div class="line">
    <div class="btn">
      <!-- type="success" -->
      <div class="right">

      </div>
      <div class="left">
        <a-button style="color: #fff;background:#44b363" @click="isOpen">添加线路</a-button>
        <a-button type="primary">线路排序</a-button>
      </div>
    </div>
    <!-- :row-selection="rowSelection" -->
    <a-card>
      <a-table :columns="columns" :data-source="data"
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }" :pagination="false"
        :rowKey="(record) => record.lineId" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <div>
              <!-- <span :style="{ margin: '0px 8px ' }" @click="isOpen(record)" class="eait"
                  style=" color:#2E7DFF">编辑</span> -->
              <a-button type="link" @click="isOpen(record)">配置</a-button>
              <!-- <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="isOpen(record)">编辑</a-button> -->
              <a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="confirm(record)"
                @cancel="cancel">
                <a-button type="link">删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination :show-total="total => `共 ${total} 条数据`" v-model:current="formData.pageNum" :total="totals"
          v-model:pageSize="formData.pageSize" show-size-changer @showSizeChange="onShowSizeChange" @change="changeFn" />
      </div>
    </a-card>
    <div>

      <a-modal v-model:visible="visible" :title="opTitle" @ok="handleOk" @cancel="onCloseaclFn">
        <!-- :model="aclInfoData" -->
        <a-form ref='lineRef' name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <!-- :rules="fromaclinfoRules.lineName" -->
          <a-form-item label="线路名称" name="lineName" style='margin-top: 26px'>
            <a-input v-model:value="formState.lineName" placeholder="请输入线路名称" />
          </a-form-item>
          <!-- :rules="fromaclinfoRules.aclType" -->
          <a-form-item label="类型" name="aclType" style='margin-top: 26px'>
            <a-radio-group v-model:value="radiovalue" name="radioGroup" @change="changeradioFn">
              <!-- 这是strig 这是数字类型 -->
              <a-radio :value="0">所有地址</a-radio>
              <a-radio :value="1">ACL选择</a-radio>
            </a-radio-group>
          </a-form-item>
          <div v-show="radiovalue == 1">

            <div style="margin-left:130px ;">
              <a-form-item label="" name="" style='margin-top: 10px'>
                <a-space>
                  <a-select placeholder="请选择" ref="select" v-model:value="formState.aclId" style="width: 160px"
                    @focus="focus" @change="handleChange" mode="tags" :size="size">
                    <a-select-option :value="item.aclId" v-for="item in allaclId" :key="item.aclId
                      ">{{ item.aclName }}</a-select-option>
                  </a-select>
                </a-space>
              </a-form-item>
            </div>

          </div>
          <a-form-item label="所属主机" name="" style='margin-top: 26px'>
            <a-space>
              <a-select placeholder="请选择" ref="select" v-model:value="formState.host" style="width: 200px" @focus="focus"
                @change="handleChange">
                <a-select-option :value="item.hostId" v-for="item in allhostId" :key="item.hostId
                  ">{{ item.hostName }}</a-select-option>
              </a-select>
            </a-space>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>
<script name='line' setup>
import { ref, defineComponent, reactive } from 'vue'
import { list, gethostsAll, delline, getaclIdAll, addaclIdAll, lineInfo } from './line'

const columns = [{
  title: '顺序',
  dataIndex: 'sort',
  width: 100,
  align: 'center'
}, {
  title: '名称',
  dataIndex: 'lineName',
  width: 228,
  align: 'center'
}, {
  title: '主机IP',
  dataIndex: 'ipAddress',
  width: 228,
  align: 'center'
},
{
  title: 'ACL',
  dataIndex: 'aclId',
  width: 228,
  align: 'center'
},
{
  title: '使用状态',
  dataIndex: 'checkStatus',
  width: 230,
  align: 'center'

},
{
  title: '操作',
  dataIndex: 'operation',
  width: 240,
  align: 'center'
},

];
const data = ref([])
const totals = ref(0)
const allclusterId = ref([])
const number = ref(0)
const allhostId = ref([])
const allaclId = ref([])
const visible = ref(false)
const opTitle = ref('新增线路配置')

// -------------------
const radiovalue = ref(0);
// 新增
const formState = ref({
  aclId: [],
  host: null,//主机

  lineName: "",
})
const changeradioFn = (value) => {
  console.log(value, 'value');
  // radiovalue.value = value
  // console.log(radiovalue.value, 'value')
  formState.value.aclId = radiovalue.value
  if (formState.value.aclId == 0) {
    formState.value.aclId = []
  }
}
// ---------------删除定义的字段
const values = ref([])
const commonEnty = ref({ values: [] })//// 对象包数组
// 初始化
const formData = ref({
  pageNum: 1,
  pageSize: 10,
});
const state = reactive({
  selectedRowKeys: [],
});

const initData = () => {
  // console.log('搜索11111');
  list(formData.value).then(res => {
    console.log(res, 'res11');
    console.log(res.records, '#######');
    data.value = res.records
    totals.value = res.total
  });
}
initData()
//主机
const gethost = async () => {
  // console.log('搜索11111');
  let res = await gethostsAll()
  console.log(res, '获取主机res');
  // allhostId.value = res.map(item => item.hostId)
  allhostId.value = res
  console.log(allhostId.value);

}
gethost()
const getaclId = async () => {
  // console.log('搜索11111');
  let res = await getaclIdAll()
  console.log(res, 'res');
  // allaclId.value = res.map(item => item.aclId)
  allaclId.value = res


}
getaclId()
const isOpen = async (record) => {
  console.log(record, 'record197');
  console.log(record.lineId, 'record.lineId');
  visible.value = true
  opTitle.value = '新增线路配置'
  // lineId
  if (record.lineId) {
    let res = await lineInfo(`${record.lineId}`)
    formState.value = res
    console.log(res, 'recoed');
    opTitle.value = "修改线路配置"
  } else {
    opTitle.value = "新增线路配置"
  }

}
const handleOk = async () => {
  formState.value.aclId = JSON.stringify(formState.value.aclId);
  // console.log(formState.value.aclId)
  let res = await addaclIdAll(formState.value)
  console.log(res, 'resdata');
  initData()
  visible.value = false
}
const onCloseaclFn = () => {
  visible.value = false
  formState.value.lineName = ""
  formState.value.aclId = []
  formState.value.host = null
  // formRefinfo.value.resetFields()
}
// 删除逻辑功能
const delFn = async (record) => {
  // 拿到点击删除的id
  console.log(record, 'record1');
  console.log(record.lineId, 'record1lineId');

  // 错误的写法lists.value.push(record.clusterId)
  // 把id放到对象（包）数组
  commonEnty.value.values.push(record);
  console.log(commonEnty.value, 'lists.value');
  await delline(commonEnty.value)
  // 更新列表
  initData()
  message.success('删除成功')

}
const confirm = (record) => {
  console.log(record, 'record2');
  delFn(record.lineId)
  initData()
};

const rowSelection = async (selectedRowKeys, selectedRows) => {
  console.log(selectedRowKeys);
  console.log(selectedRows)
  state.selectedRowKeys = selectedRowKeys;
  // 对原数组元素进行运算后再赋值给新的数组
  allclusterId.value = selectedRows.map(item => item.lineId)
  // console.log(allclusterId.value);
  number.value = allclusterId.value.length
  //这个是勾选的id存放的位置 我点清空我id复空
}
//分页功能
const changeFn = (P, Ps) => {
  console.log(P);
  formData.value.pageNum = P
  initData()
}
const onShowSizeChange = (current, pageSize) => {
  console.log(pageSize, 'pageSize');
  formData.value.pageSize = pageSize
  initData()
};


</script>
<style scoped lang="less">
.line {
  padding: 10px;

  ::v-deep(.ant-card-body) {
    padding: 6px !important;
  }

  .btn {
    .left {
      .ant-btn {
        margin-right: 6px;

      }

      margin-bottom: 4px;
    }
  }

  // 标题
  /deep/ .ant-table.ant-table-bordered>.ant-table-container>.ant-table-content>table>thead>tr>th {
    padding: 7.5px !important;
  }

  // 内容
  /deep/ .ant-table-tbody>tr>td {
    padding: 8px !important;
  }

  .pagination {
    margin: 10px 0 0 0;
    display: flex;
    justify-content: flex-end;
  }

}
</style>