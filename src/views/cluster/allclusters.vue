<template>
  <div class="allclustersBox">
    <div class="nav">
      <a-card>
        <div class="title">
          <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-row :gutter="1">
              <a-col :md="6" :sm="24">
                <a-form-item style="margin-bottom: 0px;" label="集群名称" name="clusterName" :labelCol="{ span: 6 }"
                  :wrapperCol="{ span: 16 }">
                  <a-input v-model:value="queryParams.clusterName" placeholder="请输入集群名称" />
                </a-form-item>
              </a-col>
              <a-col :md="3" :sm="24">
                <a-form-item style="margin-bottom: 0px;" label="状态" name="status" :labelCol="{ span: 7 }"
                  :wrapperCol="{ span: 10 }">
                  <a-space>
                    <a-select ref="select" v-model:value="changesearch" style="width: 120px" @focus="focus"
                      @change="handleChange">
                      <a-select-option value="1">正常</a-select-option>
                      <a-select-option value="0">异常</a-select-option>
                    </a-select>
                  </a-space>
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="5">
                <span style="display: inline-block; display: flex;flex-wrap: nowrap; margin-top: 0px">
                  <div class="searchbtn">
                    <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery">
                      <search-outlined />搜索</a-button>
                    <!-- <a-button :style="{ margin: '0px 5px ' }" type="primary"
                    @click="AlldelFn"><reload-outlined />重置</a-button> -->
                    <!-- <a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
                   -->
                    <a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
                  </div>

                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-card>
    </div>

    <div class="contion">
      <a-card>
        <div class="controls">
          <div class="select">
            <span class="select-option">
              <a-space>
                <a-select ref="select" v-model:value="changevalue" style="width: 120px" @select="handlChangeFn">
                  <!--这是静态写法 <a-select-option value="0"> <rest-outlined />删除</a-select-option> -->
                  <!-- <a-select-option value="1">以后要加别的导出</a-select-option> -->
                  <a-select-option v-for="option in options" :key="option.label" :value="option.label">{{ option.value
                  }}</a-select-option>
                </a-select>
              </a-space>
            </span>
            <a-button type="primary" style="margin-bottom: 4px;" @click="isOpen"><plus-outlined />添加集群</a-button>
          </div>
          <div class="icon">
            <span class="icon-sx">
              <img src="../../assets/loginmini/icon/sx.png" alt="" @click="AlldelFn">
              <!-- <reload-outlined /> -->
            </span>
            <span class="icon-kz"><img src="../../assets/loginmini/icon/kz.png" alt=""></span>
          </div>
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



        <!-- <a-button type="primary" style="margin-bottom: 10px;" @click="delAllFn">批量删除</a-button> -->
        <!-- rowKey表格行 key 的取值，可以是字符串或一个函数 expand点击展开图标时触发 expandRowByClick通过点击行来展开子行 :expandedRowKeys="expandedRowKeys"   这个是负责控制行的展开与关闭，（这个变量是以数组的形式展示，谁的id在数组里就显示谁）-->
        <!-- :row-selection="rowSelection"   -->
        <a-table :scroll="{ x: 'calc(700px + 50%)', y: 510 }" :columns="columns"
          :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }" :data-source="data"
          :pagination="false" :rowKey="(record) => record.clusterId" bordered>
          <template #bodyCell="{ column, record }">
            <!-- expandedRowRender	额外的展开行 -->
            <template v-if="column.dataIndex === 'hostNum'">
              <p class="hostinfo" style="margin: 0" @click="selHostFn(record.clusterId)">
                <!-- 这个前面你自己弄个图标定义一个变量取反  用计算属性弄就-->
                <span v-if="selHostId === record.clusterId && AllHostNum.length"> <down-outlined /></span>
                <span v-else> <left-outlined /></span>{{ record.hostNum }}台主机
              </p>
              <!-- && record.hostNum != 0"主机是0的时候不展示列表 -->
              <ul v-if="selHostId === record.clusterId && record.hostNum != 0">
                <li v-for="(   item, index   ) in    AllHostNum   " :key="index"
                  style="display: flex;align-items: center;padding-left: 65px; ">
                  <!-- padding-left: 36px; -->
                  <a v-if="item.status == 1" style="display: flex;align-items: center;">

                    <img src="../../assets/loginmini/icon/status-ok.png" alt="" style="width:16px;height: 16px;">
                    <!-- margin-top: 5px; -->
                    <!-- <check-circle-two-tone two-tone-color=" #52c41a" style="width:16px;height: 16px;" /> -->
                    <!-- {{ item }} -->
                    <a> {{ item.ipAddress }}</a>


                  </a>
                  <a v-else style=" display: flex;  padding-left: 0px;">
                    <img src="../../assets/loginmini/icon/error.png" alt=""
                      style="width:16px;height: 16px; margin-top: 2px;">
                    <!-- margin-top: 5px; -->
                    <!-- {{ item }} -->
                    {{ item.ipAddress }}

                  </a>
                  <!-- {{ item }} -->
                </li>
              </ul>
            </template>
            <!-- 0异常 1正常 -->
            <template v-if="column.dataIndex === 'status'">

              <a v-if="record.status == 1" style="width:100%;height: 100%;display: flex; justify-content: center;">
                <!-- <check-circle-two-tone two-tone-color="#52c41a" style="width:16px;height: 16px;" /> -->
                <img src="../../assets/loginmini/icon/status-ok.png" alt="" style="width:16px;height: 16px; ">
              </a>
              <a v-else style="width:100%;height: 100%;display: flex; justify-content: center;">
                <img src="../../assets/loginmini/icon/error.png" alt="" style="width:16px;height: 16px; ">
                <!-- <smile-outlined :rotate="180" /> -->
              </a>
            </template>
            <template v-if="column.dataIndex === 'clusterName'">
              <div style="text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
">
                <!-- a-popover宽度-->
                <a-popover :overlayStyle="{ width: '50%' }" trigger="hover">
                  <template #content>
                    {{ record.clusterName }}
                  </template>

                  <p
                    style="width: 228;overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3;   -webkit-box-orient: vertical;">
                    {{ record.clusterName }}</p>
                </a-popover>
              </div>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <div>
                <!-- <span :style="{ margin: '0px 8px ' }" @click="isOpen(record)" class="eait"
                  style=" color:#2E7DFF">编辑</span> -->
                <a-button type="link" @click="isOpen(record)">编辑</a-button>
                <!-- <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="isOpen(record)">编辑</a-button> -->
                <a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="confirm(record)"
                  @cancel="cancel">
                  <!-- <a-button :style="{ margin: '0px 5px ', border: '0px solid transparent', background: 'transparent' }"
                    type="primary">删除</a-button> -->
                  <a-button type="link">删除</a-button>
                  <!-- <span style="color:#2E7DFF"></span> -->
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

    <div class="modal">
      <a-modal :title="opTitle" v-model:visible="visible" @ok="addFn" @cancel="onClose" width="500px">
        <!-- padding: 58px 74px 30px 80px; -->
        <a-form ref='formRef' style="padding: 20px 43px 0px;margin-left: 0;" :model="rowData" validateTrigger='blur'>
          <a-row :gutter="8">
            <!-- style="margin-bottom: 12px" -->
            <a-col span="24">
              <!-- <div style="margin-bottom: 32px"> -->
              <a-form-item label="集群名称" :rules="formRules.clusterName"
                :labelCol="{ style: 'width:80px;height:32px;line-height: 32px;' }" name="clusterName"
                :wrapper-col="{ span: 20 }">
                <div class="name" margin-bottom="18px">
                  <a-input v-model:value="rowData.clusterName" placeholder="请输入集群名称" style="height:32px;width: 334px;" />
                </div>
              </a-form-item>
              <!-- </div> -->
            </a-col>
            <a-col span="24">
              <a-form-item label="备注" :rules="formRules.remark" name="remark" :labelCol="{ style: 'width:80px;' }"
                :wrapper-col="{ span: 24 }">
                <div class="remark" margin-bottom="20px">
                  <div class="remark" margin-bottom="20px">
                    <!-- <a-input v-model:value="rowData.remark" style="height:44px;width: 526px;" /> -->
                    <a-textarea v-model:value="rowData.remark" placeholder="请输入备注" style="height:54px;width: 526px;" />
                  </div>
                </div>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>

      </a-modal>
    </div>
    <!-- <div class="Tips " style=" border-bottom: none !important; border-top: none !important;border: none !important;">
      <a-modal v-model:visible="visibledel" @ok="handleOkdel" @cancel="onClosedel"
        style=" border-bottom: none !important; border-top: none !important;border: none !important;">
        <div class="Tips-img"
          style="display: flex;position: relative;justify-content: flex-start;align-items: center; height: 56px;padding-top: 24px; border-bottom: none !important; border-top: none !important;border: none !important;">
          <div class="line top"></div>
          <p><img src="../../assets/loginmini/icon/warning.png" alt=""
              style="width:22px;height: 22px;    margin-left: 20px;"></p>
          <p style=" margin-left: 16px;"> 删除</p>
          <div class="line bot"></div>
        </div>
        <p style=" margin-left: 57px;margin-top: 6px;">是否删除选中数据</p>
      </a-modal>
    </div> -->
  </div>

  <!-- 弹框 -->
  <!-- <a-drawer v-model:visible="visible" class="custom-class" style="color: red" :title="opTitle" @close="onClose"
    placement="right">
    <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
      @finish="onFinish" @finishFailed="onFinishFailed">
      <a-form-item label="名称" name="clusterName">
        <a-input v-model:value="rowData.clusterName" />
      </a-form-item>
     
      <a-form-item label="备注" name="remark">
        <a-input v-model:value="rowData.remark" />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" @click="addFn">{{ opTitle }}</a-button>
      </a-form-item>
    </a-form>
  </a-drawer> -->
</template>

<script   name='One' setup>
import { ref, defineComponent, reactive, } from 'vue'
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
import { list, addclusterList, editclusterList, clusterInfo, delclusterList, queryhost } from './cluster '
import { SmileTwoTone, HeartTwoTone, CheckCircleTwoTone, LeftOutlined, SearchOutlined, ReloadOutlined, PlusOutlined, RestOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
const columns = [{
  title: '状态',
  dataIndex: 'status',
  width: 220,
  align: 'center'
}, {
  title: '集群名称',
  dataIndex: 'clusterName',
  width: 228,
  align: 'center'
}, {
  title: '备注',
  dataIndex: 'remark',
  width: 228,
  align: 'center'
},
{
  title: '主机',
  dataIndex: 'hostNum',
  width: 228,
  align: 'center'
},
{
  title: '创建时间',
  dataIndex: 'createTime',
  width: 230,
  align: 'center'

},
{
  title: '更新时间',
  dataIndex: 'updateTime',
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
const formRules = {
  clusterName: [{ required: true, message: "请输入集群名称" }],
  remark: [{ required: true, message: "请输入备注" }],

}
const data = ref([])
const totals = ref(0)
const visible = ref(false)
const visibledel = ref(false)
const opTitle = ref('新增集群')
const lists = ref([])
const values = ref([])
const number = ref(0)
const selects = ref(0)

const options = ref([
  { label: '0', value: '删除' },

])
// 对象包数组 
const commonEnty = ref({ values: [] })

const expandedRowKeys = ref([]);

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

// const current = ref(4)
const formRef = ref(null)

const selHostId = ref('')
const AllHostNum = ref([])

const buttonWidth = ref(70)

const selHostFn = async (val) => {
  console.log(val, 'selHostId.value');
  if (selHostId.value === val) {
    selHostId.value = ''
    return AllHostNum.value = []
  }
  let res = await queryhost({ value: val })
  // console.log(res, 'res');
  //这个代码 let ipAddress = res.map(item => item.ipAddress)
  let ipAddress = res.map(item => item)
  // console.log(ipAddress, 'ipAddress');
  selHostId.value = val
  AllHostNum.value = ipAddress
  // console.log(AllHostNum.value, ' AllHostNum.valu');
}
const changevalue = ref('批量操作')
const changesearch = ref('请选择')
const allclusterId = ref([])


const state = reactive({
  selectedRowKeys: [],
});

const rowSelection = async (selectedRowKeys, selectedRows) => {
  // console.log(selectedRowKeys);
  // console.log(selectedRows)
  state.selectedRowKeys = selectedRowKeys;
  // 对原数组元素进行运算后再赋值给新的数组
  allclusterId.value = selectedRows.map(it => it.clusterId)
  // console.log(allclusterId.value);
  number.value = allclusterId.value.length
  //这个是勾选的id存放的位置 我点清空我id复空
}

// 初始化
const getList = () => {
  // console.log('搜索11111');
  list(queryParams.value).then(res => {
    console.log(res.records, 'res11');
    data.value = res.records
    totals.value = res.total
  });
}
getList()

// const info = () => {
//   messageApi.info('Hello, Ant Design Vue!');
// };
const isOpen = async (record) => {
  // console.log(record, 'record.createTime');
  visible.value = true
  // clusterId标题用rowdata里的id是否存在进行判断,页面关闭的时候也清空一下
  if (record.clusterId) {
    let res = await clusterInfo(`${record.clusterId}`)
    rowData.value = res
    opTitle.value = "修改集群"
  } else {
    opTitle.value = "新增集群"
  }
}

const formState = ref({
  username: '',
});

//新增和修改
const addFn = async () => {
  // 校验表单
  try {
    await formRef.value.validate()
  } catch (error) {
    // console.log(error);
    return console.log(error)
  }
  // 提交表单
  if (rowData.value.clusterId) {
    // console.log('编辑');
    // 换了rowData.value
    let res = await editclusterList(rowData.value)
    visible.value = false
    message.success('修改成功')
  } else {
    // console.log('新增');
    let res = await addclusterList(rowData.value)
    // console.log(res, 'resadd');
    visible.value = false
    message.success('添加成功')
  }
  getList()
  onClose()
}
// 关闭弹框
const onClose = () => {
  visible.value = false;
  formRef.value.resetFields()
  rowData.value.remark = ""
  rowData.value.clusterName = ""
  rowData.value = {}
  opTitle.value = ""
};
const onClosedel = () => {
  visibledel.value = false
}


// 删除逻辑功能
const delFn = async (record) => {
  // 拿到点击删除的id
  // console.log(record, 'record1');
  // 错误的写法lists.value.push(record.clusterId)
  // 把id放到对象（包）数组
  commonEnty.value.values.push(record);
  console.log(lists.value, 'lists.value');
  await delclusterList(commonEnty.value)
  // 更新列表
  getList()
  message.success('删除成功')

}
// 批量删除
const handlChangeFn = async (val) => {
  // visibledel.value = true
  console.log(val, 'val');
  // console.log(allclusterId.value.length, 'allclusterId.value');
  // if (allclusterId.value.length == 0) {
  //   message.error('请勾选要删除的名称')
  // }
  // if (val == '0' && !allclusterId.value.length == 0) {
  //   let res = await delclusterList({ values: allclusterId.value })
  //   // console.log(res, 'allclusterId');v
  //   getList()
  //   message.success('批量删除成功')
  // }

  selects.value = val//select点击删除的的value字段0字符串类型
  if (number.value == 0) { //number.value个数数字类型  allclusterId.value.length勾选的id是几个字符串类型
    message.error('请勾选需要删除的集群')
    changevalue.value = '批量删除'
  } else {
    // visibledel.value = true
    Modal.confirm({
      title: '删除',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', {
        style: 'color:rgba(0, 0, 0, 0.85);font-size: 14px;',
      }, '是否删除选中数据'),
      onOk() {
        console.log('OK');
        if (selects.value == '0' && !allclusterId.value.length == 0) {
          delclusterList({ values: allclusterId.value }).then(res => {
            // console.log(res);
            getList()
            message.success('批量删除成功')
            number.value = 0
            changevalue.value = '批量删除'
          })
          // console.log(res, 'allclusterId');


        }

      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test',
    });
  }

}
// const handleOkdel = async (val) => {
//   if (selects.value == '0' && !allclusterId.value.length == 0) {
//     let res = await delclusterList({ values: allclusterId.value })
//     // console.log(res, 'allclusterId');
//     getList()
//     message.success('批量删除成功')
//   }
//   visibledel.value = false
// }
// 批量删除handlChangeFn
function delAllFn() {
  delclusterList({ values: allclusterId.value }).then(res => {
    // console.log(res);
    getList()
    message.success('删除成功')
  })

}
const confirm = (record) => {
  console.log(record.clusterId, 'record2');
  delFn(record.clusterId)
  getList()
};
const cancel = async (e) => {
  // console.log(e, '	点击取消的回调');
  // message.error('Click on No');// 捕获异常
};
//分页功能
const changeFn = (P, Ps) => {
  queryParams.value.pageNum = P
  getList()
}
const onShowSizeChange = (current, pageSize) => {
  // console.log(pageSize, 'pageSize');
  queryParams.value.pageSize = pageSize
  getList()
};
/** 搜索按钮操作 */
// this.$message.success('更新成绩状态成功！')
const handleChange = async (value) => {
  // console.log(`selected ${value}`);
  // console.log(value, ' value这拿到的是status字符串 0 或1');
  queryParams.value.status = value
  // console.log(queryParams.value.status, '列表选择之后的status状态');
  // console.log(queryParams.value, 'value');
};
function handleQuery() {
  // console.log('搜索');
  queryParams.value.pageNum = 1;
  getList();
}

// 点击清空
const fn = () => {
  allclusterId.value = []
  number.value = 0
  state.selectedRowKeys = [];
}

const AlldelFn = () => {
  // console.log('1');
  queryParams.value.clusterName = ''
  changesearch.value = ''
  queryParams.value.status = ''
  queryParams.value.pageNum = 1
  queryParams.value.pageSize = 10
  getList()
  changesearch.value = '请选择'
}
</script>
<style scoped lang="less">
.allclustersBox {
  padding: 10px;

  .contion {
    display: flex;
    justify-content: start;
    flex-direction: column;

    // /deep/ .ant-alert-info {
    //   background-color: #e6f7ff;
    //   border: 1px solid #91d5ff;
    //   ;
    // }

    #components-popover-demo-placement .ant-btn {
      width: 70px;
      text-align: center;
      padding: 0;
      margin-right: 8px;
      margin-bottom: 8px;
    }

    // icon
    // /deep/ .ant-alert-info .ant-alert-icon {
    //   color: #4D85E1;
    // }

    .hostinfo {
      &:hover {
        cursor: pointer;
      }
    }

    .del {
      &:hover {
        cursor: pointer;
      }
    }

    .eait {
      &:hover {
        cursor: pointer;
      }
    }

    // 行高变高，一定是内容撑起来的 ，请检查 slot 插槽时有没有行高很高的组件或元素。

    /deep/ p {
      margin-top: 0;
      margin-bottom: 0em;
    }

    // 标题
    /deep/ .ant-table.ant-table-bordered>.ant-table-container>.ant-table-content>table>thead>tr>th {
      padding: 7.5px !important;
    }

    // 标题
    /deep/.ant-table-thead>tr>th,
    .ant-table-tbody>tr>td,
    .ant-table tfoot>tr>th,
    .ant-table tfoot>tr>td {
      padding: 7.5px 16px;
    }

    // /deep/ .ant-card-body {
    //   padding: 7.5px !important;
    // }

    /deep/ .ant-table-tbody>tr>td {
      padding: 6px !important;
    }

    th.class-center-sum,
    td.class-center-sum {
      text-align: center;
    }



    .select {
      margin: 0 20px 0 0;
    }

    .pagination {
      margin: 10px 0 0 0;
      display: flex;
      justify-content: flex-end;
    }

    .ant-card-body {
      padding: 6px !important;
    }

    // .ant-card-body {
    //   padding: 6px !important;
    // }

    // :deep(.ant-card-body) {
    //   padding: 6px !important;
    // }

    // ::v-deep(.ant-card-body) {
    //   padding: 6px !important;
    // }

    .controls {
      display: flex;
      justify-content: space-between;

      .select {
        .select-option {
          padding-right: 6px;
        }
      }

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

    .ant-alert {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5715;
      list-style: none;
      font-feature-settings: tnum;
      position: relative;
      display: flex;
      align-items: center;
      padding: 7px 15px;
      word-wrap: break-word;
      border-radius: 2px;
    }



  }

  .nav {
    margin-bottom: 6px;

    .title {
      // :deep(.ant-card-body) {

      //   padding: 12px 10px 13px 10px !important;
      // }

      // .ant-card-body {
      //   padding: 12px 10px 13px 10px !important;
      // }

      // .ant-card-body {
      //   padding: 12px 10px 13px 10px !important;
      // }

      // :deep(.ant-card-body) {
      //   padding: 12px 10px 13px 10px !important;
      // }

      // ::v-deep(.ant-card-body) {
      //   padding: 12px 10px 13px 10px !important;
      // }
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


  }


  ::v-deep(.ant-modal .ant-modal-body) {
    padding: 32px 56px;
  }

  /deep/ .ant-modal-title {
    font-size: 16px;
    line-height: 16px;
    font-size: 16px;
    font-weight: 500;
  }

  .ant-modal-title {
    font-size: 16px;
    line-height: 16px;
    font-size: 16px;
    font-weight: 500;
  }

  #vcDialogTitle2 {
    ont-size: 16px;
    font-weight: 500;
  }

  .ant-modal-content {
    ::v-deep(.ant-modal-title) {
      font-size: 16px;
      font-weight: 500;
    }
  }


  .modal {
    /deep/ .ant-modal-title {
      font-size: 16px;
      font-weight: bold;
      line-height: 16px;
      font-size: 16px;
      font-weight: 500;
    }

    .ant-modal-wrap {
      .ant-modal {
        .ant-modal-content {
          .ant-modal-body {
            // padding: 32px 56px !important;
            padding: 50px 74px 30px 78px !important;
          }
        }
      }
    }

    /deep/ .ant-form-item {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5715;
      list-style: none;
      font-feature-settings: tnum;
      margin-bottom: 32px;
      vertical-align: top;
    }

    /deep/ .ant-col-24 {
      padding-left: 0 !important;
      padding-right: 0 !important;
      margin-bottom: 32px;
    }

    .ant-form {
      box-sizing: border-box;
      margin: 0;
      padding: 32px 0px;
      color: rgba(0, 0, 0, 0.85);
      font-size: 14px;
      font-variant: tabular-nums;
      line-height: 1.5715;
      list-style: none;
      font-feature-settings: tnum;

      .ant-col-offset-2 {
        margin-left: 0 !important;
      }

      :deep(.ant-col-offset-2) {
        margin-left: 0 !important;
      }

      ::v-deep(.ant-col-offset-2) {
        margin-left: 0 !important;
      }

      // .ant-modal-body {
      //   padding: 32px 56px;
      //   padding: 50px 74px 30px 78px;

      //   .ant-col-offset-2 {
      //     margin-left: 0;
      //   }
      // }

      ::v-deep(.ant-modal .ant-modal-body) {
        // padding: 32px 56px;
        padding: 50px 74px 30px 78px;
      }
    }
  }
}
</style>

<!-- <style scoped>
.line {
  height: 2px;
  width: 100%;
  background-color: #fff;
  position: absolute;
}

.top {
  top: -1px;
}

.bot {
  bottom: -1px
}
</style> -->
