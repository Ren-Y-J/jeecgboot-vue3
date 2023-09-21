<template>
  <div class="line">
    <div class="nav">
      <a-card class="nav">
        <a-form :model="formState" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed">
          <a-row :gutter="1">
            <a-col :md="6" :sm="24">
              <a-form-item style="margin-bottom: 0px;" label="名称" name="lineName" :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 16 }">
                <a-input v-model:value="formData.lineName" placeholder="请输入ACL名称" />
              </a-form-item>

            </a-col>
            <a-col :md="3" :sm="24">
              <a-form-item label="主机组" name="" style='display: flex;' :label-col="{ span: 7 }"
                :wrapper-col="{ span: 10 }">
                <a-space>
                  <a-select placeholder="请选择" ref="select" v-model:value="formData.groupId" style="width: 160px"
                    @focus="focus" @change="handleChangeFn">
                    <a-select-option :value="item.groupId" v-for="item in allhostIds" :key="item.groupId
                      ">{{ item.groupName }}</a-select-option>
                  </a-select>
                </a-space>
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
        </a-form>
      </a-card>

    </div>

    <div class="contion">
      <a-card>
        <div class="btn">
          <div class="left">
            <a-button type="primary" @click="isOpen">添加线路</a-button>
            <a-button type="primary" @click="isOpensort">线路排序</a-button>
          </div>
          <div class="right">
            <div class="icon">
              <span class="icon-sx">
                <img src="../../assets/loginmini/icon/sx.png" alt="" @click="AlldelFn">
                <!-- <reload-outlined /> -->
              </span>
              <span class="icon-kz"><img src="../../assets/loginmini/icon/kz.png" alt=""></span>
            </div>
          </div>
          <!-- <div class="right">
            <a-form-item label="所有主机" name="" style='display: flex;' :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
              <a-space>
                <a-select placeholder="请选择" ref="select" v-model:value="formData.host" style="width: 160px" @focus="focus"
                  @change="handleChangeFn">
                  <a-select-option :value="item.hostId" v-for="item in allhostId" :key="item.hostId
                    ">{{ item.ipAddress }}</a-select-option>
                </a-select>
              </a-space>
            </a-form-item>
          </div> -->

        </div>
        <a-alert show-icon class="alert" style="margin-bottom: 8px" type="info">
          <!-- Ant Design Vue 的Alert使用 z这块我点清空我那些勾选的东西都取消 number是勾选的个数 type="info"-->
          <template #message>
            <template v-if="number > 0">
              <span>已选定 {{ number }} 条记录(可跨页)</span>
              <a-divider type="vertical" />
              <a @click="fn" style="color:#4D85E1;">清空</a>
            </template>
            <template v-else>
              <span>未选中任何数据</span>
            </template>
          </template>

        </a-alert>
        <a-table :columns="columns" :data-source="data"
          :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }" :pagination="false"
          :rowKey="(record) => record.lineId" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'aclId'">
              <!-- border-bottom: 1px solid #109eff; -->
              <div v-if="record.aclId == null" type="link"> 不限地址段 </div>
              <div v-else>{{ record.aclId }}</div>

            </template>
            <template v-if="column.dataIndex === 'groupId'">
              <!-- <a-button type="primary" ghost @click="GoDep(record)"
                style="cursor:pointer;border: none;border-bottom: 1px solid; ">
                {{ record.ipAddress }}
              </a-button> -->
              <div style="display: flex; justify-content: center; align-items: center">
                <span style="text-decoration: underline; text-decoration-color: blue; color: blue;cursor:pointer"
                  @click='GoDep(record)'>{{ record.groupName }}

                </span>
              </div>
            </template>

            <template v-if="column.dataIndex === 'status'">

              <div v-if='record.status == 1'
                style="text-align: center; display: flex;   justify-content: center;  align-items: center;">
                <a-tag color="green">已启用</a-tag>
              </div>
              <div v-if='record.status == 0'
                style="text-align: center; display: flex;   justify-content: center;  align-items: center;">
                <a-tag color="green">禁用</a-tag>
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
                <a-popconfirm title="是否确认？" ok-text="是" cancel-text="否" @confirm="SwitchFn(record)">
                  <a-button v-show="record.status == 0" type="link">启用</a-button>
                  <a-button v-show="record.status == 1" type="link">禁用</a-button>
                </a-popconfirm>
              </div>
            </template>

          </template>
        </a-table>
        <div class="pagination">
          <a-pagination :show-total="total => `共 ${total} 条数据`" v-model:current="formData.pageNum" :total="totals"
            v-model:pageSize="formData.pageSize" show-size-changer @showSizeChange="onShowSizeChange"
            @change="changeFn" />
        </div>
      </a-card>
    </div>

    <div>
      <!-- 新增弹出层 -->
      <a-modal v-model:visible="visible" :title="opTitle" @ok="handleOk" @cancel="onCloseaclFn">
        <!-- :model="aclInfoData" -->
        <a-form ref='formlineRef' :model="formState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <!--  -->
          <a-form-item label="线路名称" :rules="fromlineRules.lineName" name="lineName" style='margin-top: 26px'>
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
          <div v-if="radiovalue == 1">
            <!-- 这块显示的时候是点击>ACL选择，传的字段是数组包字符还要stringify -->
            <div style="margin-left:130px ;">
              <!--  -->
              <a-form-item :validateTrigger="['change', 'blur']"
                :rules="[{ required: (radiovalue == 1), message: '请选择' }]" label="" name="aclId" style='margin-top: 10px'>
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
          <a-form-item label="所属主机" :rules="fromlineRules.groupId" name="groupId" style='margin-top: 26px'>
            <a-space>
              <a-select placeholder="请选择" ref="select" v-model:value="formState.groupId" style="width: 160px"
                @focus="focus" @change="handleChange">
                <a-select-option :value="item.groupId" v-for="item in allhostIds" :key="item.groupId
                  ">
                  {{ item.groupName }}
                </a-select-option>
              </a-select>
            </a-space>
          </a-form-item>
        </a-form>
      </a-modal>
      <!-- 编辑 -->
      <a-modal v-model:visible="editvisible" :title="editopTitle" @ok="edithandleOk" @cancel="editonCloseaclFn">
        <a-form ref='editlineRef' :model="editformState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>

          <a-form-item label="线路名称" :rules="editlineRules.lineName" name="lineName" style='margin-top: 26px'>
            <a-input v-model:value="editformState.lineName" placeholder="请输入线路名称" />
          </a-form-item>

          <a-form-item label="类型" name="aclType" style='margin-top: 26px'>
            <a-radio-group v-model:value="editradiovalue" name="radioGroup" @change="editchangeradioFn">

              <a-radio :value="0">所有地址</a-radio>
              <a-radio :value="1">ACL选择</a-radio>
            </a-radio-group>
          </a-form-item>

          <div v-if="editradiovalue == 1">
            <div style="margin-left:130px ;">
              <a-form-item label="" :validateTrigger="['change', 'blur']" :rules="editlineRules.aclId" name="aclId"
                style='margin-top: 10px'>
                <a-space>
                  <a-select placeholder="请选择" ref="select" v-model:value="editformState.aclId" style="width: 160px"
                    @focus="focus" @change="handleChanges" mode="tags" :size="size" :options="allaclId"
                    :field-names="{ label: 'aclName', value: 'aclId' }">
                  </a-select>
                </a-space>
              </a-form-item>
            </div>
          </div>
          <!-- <a-form-item label="所属主机" :rules="editlineRules.host" name="host" style='margin-top: 26px'>
            <a-space>
              <a-select placeholder="请选择" ref="select" v-model:value="editformState.host" style="width: 160px"
                @focus="focus" @change="handleChangehost">
                <a-select-option :value="item.hostId" v-for="item in allhostId" :key="item.hostId
                  ">{{ item.hostName }}</a-select-option>
              </a-select>
            </a-space>
          </a-form-item> -->
        </a-form>
      </a-modal>
      <!-- 线路排序 -->
      <div class="sort">
        <a-modal v-model:visible="sortvisible" :title="sorttopTitle" @ok="sorthandleOk" @cancel="sortCloseaclFn">
          <a-form ref='sortlineRef' :model="editformState" name="basic" :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed"
            :validateTrigger="['change']">
            <a-form-item label="所属主机" :rules="sortlineRules.groupId" name="groupId" style='margin-top: 26px'>
              <a-space>
                <a-select placeholder="请选择" ref="select" v-model:value="editformState.groupId" style="width: 160px"
                  @focus="focus" @change="handleChangsort">
                  <a-select-option :value="item.groupId" v-for="item in allhostIds" :key="item.groupId
                    ">{{ item.groupName }}</a-select-option>
                </a-select>

              </a-space>

            </a-form-item>
            <ul v-for="(item, index) in lineNameList" style="padding-left: 56px;">
              <span
                style="border-top:0.5px solid #EBEBEB;border-bottom:0.5px solid #EBEBEB; width: 404px;display: inline-block;padding-top: 6px;padding-bottom: 6px;">
                <li class="itemlineName" style='display: flex;height: 32px;line-height: 32px;padding-left: 4px;'>
                  <span class="spnname" style='display: flex;width: 260px;'> {{ item.lineName }} </span>
                  <span class="spnbtn" style="display: flex;justify-content: start;">
                    <a-button type="primary" @click="moveup(index)" :disabled="index === 0"
                      style='margin-right:6px;'>上移</a-button>
                    <a-button @click="moveDown(index)" :disabled="index === lineNameList.length - 1">下移</a-button>
                  </span>

                </li>
              </span>
            </ul>
          </a-form>
        </a-modal>
      </div>

    </div>
  </div>
</template>
<script name='line' setup>
import { ref, defineComponent, reactive, watch } from 'vue'
import { list, gethostsAll, gethostsAlls, delline, getaclIdAll, addaclIdAll, lineInfo, editline, getinfolineName, getinfolineNames, sortlineName, upswitch } from './line'
import { SearchOutlined, ReloadOutlined, PlusOutlined, CloseCircleFilled } from '@ant-design/icons-vue'; //icon引入
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
  title: '主机组',
  dataIndex: 'groupId',
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
// 校验规则
const formlineRef = ref(null)
const editlineRef = ref(null)
const sortlineRef = ref(null)
const fromlineRules = {//新增的ruls校验验证     
  lineName: [{ required: true, message: "请输入线路名称" }],
  groupId: [{ required: true, message: "请选择" }],
}
const editlineRules = {
  lineName: [{ required: true, message: "请输入线路名称" }],
  host: [{ required: true, message: "请选择" }],
  aclId: [{ required: true, message: "请选择" }]

}
const sortlineRules = {
  groupId: [{ required: true, message: "请选择" }]
}
const data = ref([])
const totals = ref(0)
const allclusterId = ref([])
const number = ref(0)
const allhostId = ref([])
const allhostIds = ref([]) //获取所有主机组数据
const allaclId = ref([])
const visible = ref(false)
const opTitle = ref('新增线路配置')
const lineIds = ref('')

// -------------------
const radiovalue = ref(0);
//---------------
const formState = ref({
  aclId: [],
  groupId: null,//主机
  lineName: "",
})
const changeradioFn = (value) => {

  // 就是选acl的时候，对应的内容清空
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
  groupId: undefined,
  lineName: ''

});
const state = reactive({
  selectedRowKeys: [],
});

const initData = async () => {
  let { records, total } = await list(formData.value)
  data.value = records
  totals.value = total
}
initData()

const SwitchFn = async (record) => {
  console.log(record);
  if (record.status == 1) {
    // let res = await upswitch({
    //   status: 0,
    //   lineId: record.lineId
    // })
    // console.log(res);
    upswitch({
      status: 0,
      lineId: record.lineId
    }).then(res => {
      message.success('操作成功')
      initData()
    })
  }
  if (record.status == 0) {
    upswitch({
      status: 1,
      lineId: record.lineId
    }).then(res => {
      message.success('操作成功')
      initData()
    })
  }
}
const GoDep = (record) => {
  let id = record.groupId;
  window.open('/deploy?' + id);
};
const handleChangeFn = async (value) => {
  console.log(value, '66');
  formData.value.groupId = value
  // 代码抽离出去
  // formData.value.pageNum = 1
  // initData(formData.value)

  // data.value = data.value.filter(it => {
  //   return it.host == value
  // })
  // totals.value = data.value.length

}
const handleQuery = async () => {
  // console.log('1');
  formData.value.pageNum = 1
  initData(formData.value)
}
const AlldelFn = () => {
  formData.value.pageNum = 1
  formData.value.groupId = undefined
  formData.value.lineName = ''
  initData()

}
//所有主机
const gethost = async () => {
  // console.log('搜索11111');
  let res = await gethostsAll()
  // console.log(res, 'res主机');
  allhostId.value = res
  console.log(allhostId.value);


}
gethost()
const gethosts = async () => {
  // console.log('搜索11111');
  let res = await gethostsAlls()
  // console.log(res, '获取所有主机组');
  allhostIds.value = res
  console.log(allhostIds.value);
}
gethosts()
// resACL选择
const getaclId = async () => {
  // console.log('搜索11111');
  let res = await getaclIdAll()
  console.log(res, 'resACL选择1111');
  // allaclId.value = res.map(item => item.aclId)
  allaclId.value = res
  console.log(allaclId.value);


}
getaclId()
const isOpen = async (record) => {
  // console.log(record, 'record');
  visible.value = true
  opTitle.value = '新增线路配置'
  // 这是把路线的id参数还起请求
  if (record.lineId) {
    let res = await lineInfo(`${record.lineId}`)
    // console.log(res, '回显999');
    formState.value = res


    // 接口0还是1都是json字符串，0是空数组，1是数组包字符串
    // 这边是回显，理论上不要做判断，保险起见还是判断一下，不能保证数据格式
    if (typeof (res.aclId) == 'string') {
      console.log(formState.value.aclId);
      formState.value.aclId = JSON.parse(res.aclId)//这是1是吗
      console.log(formState.value.aclId);

    } else {
      formState.value.aclId = [] //这是0
    }
    opTitle.value = "修改线路配置"
  } else {
    opTitle.value = "新增线路配置"
  }

}
const handleOk = async () => {
  // 这写新增路线
  // 校验表单
  try {
    await formlineRef.value.validate()
  } catch (error) {
    console.log(error);
    return
  }
  console.log(lineIds.value, 'id');
  console.log(formState.value.formState, '//')
  // 这个在1的时候类型要加 JSON.stringify 。
  formState.value.aclId = JSON.stringify(formState.value.aclId);
  let res = await addaclIdAll(formState.value)
  // console.log(res, 'resdata');
  initData()
  visible.value = false
  message.success('添加成功')
  onCloseaclFn()
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
  formlineRef.value.resetFields()
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
  // console.log(record, 'record2');
  delFn(record.lineId)
  initData()
};

const rowSelection = async (selectedRowKeys, selectedRows) => {
  console.log(selectedRowKeys);
  console.log(selectedRows)
  state.selectedRowKeys = selectedRowKeys;
  // 对原数组元素进行运算后再赋值给新的数组
  allclusterId.value = selectedRows.map(item => item.lineId)
  console.log(allclusterId.value);
  number.value = allclusterId.value.length
  //这个是勾选的id存放的位置 我点清空我id复空
}
// 点击清空
const fn = () => {
  allclusterId.value = []
  number.value = 0
  state.selectedRowKeys = [];
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
  host: undefined,//主机
  lineName: "",
})

const editisOpen = async (record) => {
  editvisible.value = true
  editopTitle.value = '修改线路配置'
  // 这是把路线的id参数还起请求
  console.log(editlineRules.aclId);
  console.log(allaclId.value, 'allaclId.value');
  if (record.lineId) {
    let res = await lineInfo(`${record.lineId}`)
    console.log(res.aclId, '回显999');

    editformState.value = res
    if (res.aclId != '[]') {
      editradiovalue.value = 1
    } else {
      editradiovalue.value = 0
    }
    // 那个接口0还是1都是json字符串
    if (typeof (res.aclId) == 'string') {
      console.log(editformState.value.aclId, '这是编辑配置的aclId');
      editformState.value.aclId = JSON.parse(res.aclId)//这是1是对象包字符串
      console.log(editformState.value.aclId, '这是编辑配置的aclId');
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
  editlineRef.value.resetFields()
}
// 编辑提交
const edithandleOk = async () => {
  // 校验表单
  try {
    await editlineRef.value.validate()
  } catch (error) {
    // console.log(error);
    return console.log(error)
  }
  if (editradiovalue.value == 0) {
    editformState.value.aclId = []
  }
  editformState.value.aclId = JSON.stringify(editformState.value.aclId);
  let res = await editline(editformState.value)
  console.log(res, 'resdata');
  initData()
  editvisible.value = false
  message.success('修改成功')
  editonCloseaclFn()
}
const editchangeradioFn = (value) => {
  // console.log(value, 'value这是拿acl的id的路线'); // 就是选acl的时候，对应的内容清空
  if (editradiovalue.value == 1 && editformState.value.aclId.length == 0) { //那0传的是数组
    editformState.value.aclId = []
  }
}
const handleChanges = (value) => {
  console.log(value, 'aaa');

}
// 这块写的是线路排序
const sortvisible = ref(false)
const sorttopTitle = ref('排序')
const sortformState = ref({
  hostName: "",
  ipAddress: "",
  port: "",
  rootSec: "",
  clusterId: "",
  role: "",
  floor: ""
})
const lineNameList = ref([])


const handleChangsort = async (value) => {
  console.log(value, 'ipAddress');
  let id = value
  // let res = await getinfolineName({ value })
  let res = await getinfolineNames({ value })
  console.log(res, 'res518');
  lineNameList.value = res
  // let res1 = allhostId.value.map(item => {
  //   console.log(item);
  //   if (allhostId.value.find(val => val == id)) {
  //     console.log(val);
  //   }
  //   // if (id.find(val => val == item.hostId)) {
  //   //   return item
  //   // }
  // })
  // console.log(res1);
}
const lineObjects = ref([])
const isOpensort = () => {
  sortvisible.value = true
}
const sorthandleOk = async () => {
  // 校验表单
  try {
    await sortlineRef.value.validate()
  } catch (error) {
    // console.log(error);
    return console.log(error)
  }
  let res = await sortlineName(lineObjects.value)
  console.log(res, 'res531s');
  // initData()
  sortvisible.value = false
  delAll()
}
const moveup = async (index) => {
  console.log(index);
  // console.log(item.lineId);
  // let index = item.lineId
  lineNameList.value.splice(index - 1, 1, ...lineNameList.value.splice(index, 1, lineNameList.value[index - 1]))
  lineObjects.value = lineNameList.value.map((line, index) => ({
    lineId: line.lineId,
    sort: index + 1,
  }));

}
const moveDown = async (index) => {
  console.log(index);
  lineNameList.value.splice(index, 1, ...lineNameList.value.splice(index + 1, 1, lineNameList.value[index]))
  console.log(lineNameList.value, '下');
  lineObjects.value = lineNameList.value.map((line, index) => ({
    lineId: line.lineId,
    sort: index + 1,
  }));
}
const sortCloseaclFn = () => {
  delAll()
}
const delAll = () => {
  editformState.value.host = ""
  lineNameList.value = []
  initData()
  sortlineRef.value.resetFields()
}
</script>
<style scoped lang="less">
.line {
  padding: 10px;


  .nav {
    margin-bottom: 6px;

    ::v-deep(.ant-form-item) {

      margin-bottom: 0px !important;

    }

    ::v-deep(.ant-card-body) {
      // padding: 12px 10px 6px 10px !important;
      padding: 8px !important;
    }

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

  .contion {
    ::v-deep(.ant-card-body) {
      padding: 6px !important;
    }

    .examPaper_header::after {
      content: '';
      width: 100%;
      height: 1px;
      display: block;
      margin: 4px auto;
      // #109eff
      // border-bottom: 1px solid rgba(0, 0, 0, 0.09);
      border-bottom: 1px solid #109eff;
    }

  }



  .btn {
    display: flex;
    justify-content: space-between;
    height: 36px;

    .left {
      .ant-btn {
        margin-right: 6px;

      }

      // margin-bottom: 4px;
    }

    .right {
      display: flex;
      margin-right: 8px;

      .icon {
        height: 32px;
        display: flex;
        align-items: center;
        margin-top: 4px;

        .icon-sx {
          width: 22px;
          height: 16px;
          display: inline-block;

          img {
            width: 100%;
            height: 100%;
          }

          &:hover {
            cursor: pointer;
          }
        }

        .icon-kz {
          display: inline-block;
          width: 16px;
          height: 16px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        span:nth-child(1) {
          padding-right: 7px;

        }
      }
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