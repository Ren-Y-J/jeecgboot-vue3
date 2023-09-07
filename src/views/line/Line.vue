<template>
  <div class="line">
    <div class="btn">
      <!-- type="success" -->
      <div class="left">
        <a-button style="color: #fff;background:#44b363" @click="isOpen">添加线路</a-button>
        <a-button type="primary">线路排序</a-button>
      </div>
      <div class="right">
        <a-form-item label="所有主机" name="" style='display: flex;' :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
          <a-space>
            <a-select placeholder="请选择" ref="select" v-model:value="formState.host" style="width: 160px" @focus="focus"
              @change="handleChangeFn">
              <a-select-option :value="item.hostId" v-for="item in allhostId" :key="item.hostId
                ">{{ item.hostName }}</a-select-option>
            </a-select>
          </a-space>
        </a-form-item>
      </div>

    </div>
    <!-- :row-selection="rowSelection" -->
    <a-card>
      <a-table :columns="columns" :data-source="data"
        :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }" :pagination="false"
        :rowKey="(record) => record.lineId" bordered>
        <template #bodyCell="{ column, record }">

          <!-- <template v-if="column.dataIndex === 'index'">
            {{ record }}
          </template> -->
          <template v-if="column.dataIndex === 'status'">

            <div v-if='record.status == 1'
              style="text-align: center; display: flex;   justify-content: center;  align-items: center;">
              <a-tag color="green">已启用</a-tag>
            </div>
            <div v-if='record.status == 0'
              style="text-align: center; display: flex;   justify-content: center;  align-items: center;">
              <a-tag color="green">警用</a-tag>
            </div>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <div>
              <a-button type="link" @click="editisOpen(record)">配置</a-button>
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
      <!-- 新增弹出层 -->
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
              <!-- 这是strig 这是数字类型 点所有地址,后端说传数组 -->
              <a-radio :value="0">所有地址</a-radio>
              <a-radio :value="1">ACL选择</a-radio>
            </a-radio-group>
          </a-form-item>
          <div v-show="radiovalue == 1">
            <!-- 这块显示的时候是点击>ACL选择，他要传的字段是数组包字符还要stringify这是昨天新增试出来的 -->
            <div style="margin-left:130px ;">
              <a-form-item label="" name="" style='margin-top: 10px'>
                <a-space>
                  <a-select placeholder="请选择" ref="select" v-model:value="formState.aclId" style="width: 160px"
                    @focus="focus" @change="handleChange" mode="tags" :size="size" :options="allaclId"
                    :field-names="{ label: 'aclName', value: 'aclId' }">
                    <!-- <a-select-option :value="item.aclId" v-for="item in allaclId" :key="item.aclId
                      ">{{ item.aclName }}</a-select-option> -->
                  </a-select>
                </a-space>
              </a-form-item>
            </div>

          </div>
          <a-form-item label="所属主机" name="" style='margin-top: 26px'>
            <a-space>
              <a-select placeholder="请选择" ref="select" v-model:value="formState.host" style="width: 160px" @focus="focus"
                @change="handleChangehost">
                <a-select-option :value="item.hostId" v-for="item in allhostId" :key="item.hostId
                  ">{{ item.hostName }}</a-select-option>
              </a-select>
            </a-space>
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 编辑 -->
      <a-modal v-model:visible="editvisible" :title="editopTitle" @ok="edithandleOk" @cancel="editonCloseaclFn">

        <a-form ref='lineRef' name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>

          <a-form-item label="线路名称" name="lineName" style='margin-top: 26px'>
            <a-input v-model:value="editformState.lineName" placeholder="请输入线路名称" />
          </a-form-item>

          <a-form-item label="类型" name="aclType" style='margin-top: 26px'>
            <a-radio-group v-model:value="editradiovalue" name="radioGroup" @change="editchangeradioFn">

              <a-radio :value="0">所有地址</a-radio>
              <a-radio :value="1">ACL选择</a-radio>
            </a-radio-group>
          </a-form-item>
          <div v-show="editradiovalue == 1">

            <div style="margin-left:130px ;">
              <a-form-item label="" name="" style='margin-top: 10px'>
                <a-space>
                  <a-select placeholder="请选择" ref="select" v-model:value="editformState.aclId" style="width: 160px"
                    @focus="focus" @change="handleChange" mode="tags" :size="size" :options="allaclId"
                    :field-names="{ label: 'aclName', value: 'aclId' }">

                  </a-select>
                </a-space>
              </a-form-item>

            </div>

          </div>
          <a-form-item label="所属主机" name="" style='margin-top: 26px'>
            <a-space>
              <a-select placeholder="请选择" ref="select" v-model:value="editformState.host" style="width: 160px"
                @focus="focus" @change="handleChangehost">
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
import { list, gethostsAll, delline, getaclIdAll, addaclIdAll, lineInfo, editline } from './line'
import { message } from 'ant-design-vue';
// 我没引入
const columns = [{
  title: '顺序',
  dataIndex: 'index',
  width: 100,
  align: 'center',
  key: "index",
  customRender: (e) => {
    return (
      (formData.value.pageNum - 1) * formData.value.pageSize + e.index + 1
    )
  }
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
  dataIndex: 'status',
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
const lineIds = ref('')

// -------------------
const radiovalue = ref(0);

const formState = ref({
  aclId: [],
  host: null,//主机
  lineName: "",
})
const changeradioFn = (value) => {
  // console.log(value, 'value');
  // console.log(formState.value.aclId, 99999)
  // if (formState.value.aclId == 0) {
  //   formState.value.aclId = []
  // }你等下  == 1传的是这个 formState.value.aclId = JSON.stringify(formState.value.aclId); JSON.stringif一定要这样昨天那个后端试的

  // 这个aclid不能等于=[] 这个等于[]那个formState.value.aclId == 0的aclId
  // 0的时候传【】数组，1的时候传formState.value.aclId = JSON.stringify(formState.value.aclId);数组包id还stringify
  // 是0的时候传什么[]数组空数组

  if (radiovalue.value == 1 && formState.value.aclId.length == 0) { //1不能传【】 1要是传【】，那0传啥
    formState.value.aclId = []
  }
}
// ---------------删除定义的字段
const values = ref([])
const commonEnty = ref({ values: [] })//// 对象包数组
const formData = ref({
  pageNum: 1,
  pageSize: 10,
  host: 0

});
const state = reactive({
  selectedRowKeys: [],
});

const initData = async () => {
  // console.log('搜索11111');这是formData
  let { records, total } = await list(formData.value)

  data.value = records
  totals.value = total
}
initData()
const handleChangeFn = async (value) => {
  // console.log(formState.host, 'value');
  // console.log(value, '66');
  // formData.value.host = value
  // console.log(formData.value, ' formData.value.host');
  // initData(formData.value)
  // let cloneArr = JSON.parse(JSON.stringify(data.value))
  await initData()
  data.value = data.value.filter(it => {
    return it.host == value
  })
  totals.value = data.value.length

}
const gethost = async () => {
  // console.log('搜索11111');
  let res = await gethostsAll()
  // console.log(res, 'res主机');
  // allhostId.value = res.map(item => item.hostId)
  allhostId.value = res
  // console.log(allhostId.value);


}
gethost()
const getaclId = async () => {
  // console.log('搜索11111');
  let res = await getaclIdAll()
  console.log(res, 'resACL选择1111');
  // allaclId.value = res.map(item => item.aclId)
  allaclId.value = res


}
getaclId()
const isOpen = async (record) => {
  console.log(record, 'record');
  visible.value = true
  opTitle.value = '新增线路配置'
  // 这是把路线的id参数还起请求
  if (record.lineId) {
    let res = await lineInfo(`${record.lineId}`)
    console.log(res, '回显999');
    formState.value = res

    // 等于字符串你Jparse干嘛，转成数组为啥要转呐，而且我一开始在这做的判断0传
    // 不是，你那个接口0还是1都是json字符串，我0是空数组，你的意思是0 的时候传 1是
    // 这边是回显，理论上不要做判断，保险起见还是判断一下，不能保证数据格式
    if (typeof (res.aclId) == 'string') {
      formState.value.aclId = JSON.parse(res.aclId)//这是1是吗

    } else {
      formState.value.aclId = [] //这是0
    }
    opTitle.value = "修改线路配置"
  } else {
    opTitle.value = "新增线路配置"
  }

}
const handleOk = async () => {
  // 这写新增和配置路线
  // if (formState.value.aclId == []) {
  // formState.value.aclId = JSON.parse(formState.value.aclId);
  // }

  console.log(lineIds.value, 'id');
  console.log(formState.value.formState, '//')
  // 这个在1的时候后端说要加 JSON.stringify 。
  //这些编辑
  formState.value.aclId = JSON.stringify(formState.value.aclId);
  // 那个我这块要是判断是配置还是新增，你看这样有问题嘛formState.value.aclId == [] 走新增或者走配置编辑我注释掉了，因为当时老报数据重复
  let res = await addaclIdAll(formState.value)
  console.log(res, 'resdata');
  initData()
  visible.value = false
  message.success('添加成功')
}

const handleChange = (value) => {
  // 这是拿acl的id的路线
  console.log(value, '11');
  // formState.value.aclRelName = value
}
const handleChangehost = (value) => {
  // 这是拿主机的id
  console.log(value, '11');
  // formState.value.host = value
}
// 
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
  formData.value.pageNum = P
  initData()
}
const onShowSizeChange = (current, pageSize) => {
  // console.log(pageSize, 'pageSize');
  formData.value.pageSize = pageSize
  initData()
};
// 这块是配置(编辑的弹出层提交事件)-------------------
const editvisible = ref(false) //
const editradiovalue = ref(0);
const editopTitle = ref('修改线路配置')
const editformState = ref({
  aclId: [],
  host: null,//主机
  lineName: "",
})
const editisOpen = async (record) => {
  editvisible.value = true
  console.log(record, 'record');

  editopTitle.value = '修改线路配置'
  // 这是把路线的id参数还起请求
  if (record.lineId) {
    let res = await lineInfo(`${record.lineId}`)
    console.log(res, '回显999');
    editformState.value = res

    // 等于字符串你Jparse干嘛，转成数组为啥要转呐，而且我一开始在这做的判断0传
    // 不是，你那个接口0还是1都是json字符串，我0是空数组，你的意思是0 的时候传 1是
    // 这边是回显，理论上不要做判断，保险起见还是判断一下，不能保证数据格式
    if (typeof (res.aclId) == 'string') {
      editformState.value.aclId = JSON.parse(res.aclId)//这是1是吗

    } else {
      editformState.value.aclId = [] //这是0
    }
    editopTitle.value = "修改线路配置"
  } else {
    editopTitle.value = "新增线路配置"
  }
}
const editonCloseaclFn = async () => {
  editvisible.value = false
  editformState.value.lineName = ""
  editformState.value.aclId = []
  editformState.value.host = null
}
// 编辑提交
const edithandleOk = async () => {
  editformState.value.aclId = JSON.stringify(editformState.value.aclId);
  let res = await editline(editformState.value)
  console.log(res, 'resdata');
  initData()
  editvisible.value = false
  message.success('修改成功')
}
const editchangeradioFn = (value) => {
  console.log(value, 'value');
  if (editradiovalue.value == 1 && editformState.value.aclId.length == 0) { //1不能传【】 1要是传【】，那0传啥
    editformState.value.aclId = []
  }
}

</script>
<style scoped lang="less">
.line {
  padding: 10px;

  ::v-deep(.ant-card-body) {
    padding: 6px !important;
  }

  .btn {
    display: flex;
    justify-content: space-between;
    height: 40px;

    .left {
      .ant-btn {
        margin-right: 6px;

      }

      // margin-bottom: 4px;
    }

    .right {
      display: flex;
      margin-right: 8px;
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