<template>
  <div>
    <a-card class="nav">
      <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
        <a-row :gutter="24">
          <a-col :span="4">
            <a-form-item label="集群名称" name="clusterName" :label-col="{ span: 6 }" :wrapper-col="{ span: 70 }">
              <a-input v-model:value="queryParams.clusterName" />
            </a-form-item>
          </a-col>
          <a-col :span="20">
            <a-form-item label="状态" name="status" :label-col="{ span: 1 }" :wrapper-col="{ span: 16 }">
              <a-space>
                <a-select ref="select" v-model:value="value" style="width: 120px" @focus="focus" @change="handleChange">
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="0">异常</a-select-option>
                </a-select>
              </a-space>
              <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery">搜索</a-button>
              <a-button :style="{ margin: '0px 5px ' }" type="primary">重置</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

    </a-card>

    <a-card class="contion">
      <a-button type="primary" style="margin-bottom: 10px;" @click="isOpen">添加集群</a-button>
      <span class="select">
        <a-space>
          <a-select ref="select" v-model:value="changevalue" style="width: 120px" @change="handlChangeFn">
            <a-select-option value="0">删除</a-select-option>
            <a-select-option value="1">导出</a-select-option>
          </a-select>
        </a-space>
      </span>
      <!-- <a-button type="primary" style="margin-bottom: 10px;" @click="delAllFn">批量删除</a-button> -->
      <!-- rowKey表格行 key 的取值，可以是字符串或一个函数 expand点击展开图标时触发 expandRowByClick通过点击行来展开子行 :expandedRowKeys="expandedRowKeys"   这个是负责控制行的展开与关闭，（这个变量是以数组的形式展示，谁的id在数组里就显示谁）-->
      <a-table :columns="columns" :row-selection="rowSelection" :data-source="data" :pagination="false"
        :rowKey="(record) => record.clusterId">
        <template #bodyCell="{ column, record }">
          <!-- expandedRowRender	额外的展开行 -->
          <template v-if="column.dataIndex === 'hostNum'">
            <p style="margin: 0" @click="selHostFn(record.clusterId)">
              <!-- 这个前面你自己弄个图标定义一个变量取反  用计算属性弄就-->
              <span v-if="selHostId === record.clusterId && AllHostNum.length"> <down-outlined /></span>
              <span v-else> <left-outlined /></span>{{ record.hostNum }}台主机
            </p>
            <ul v-if="selHostId === record.clusterId">
              <li v-for="(item, index) in AllHostNum" :key="index">{{ item }}</li>
            </ul>
          </template>
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
  <div>

    <a-modal :title="opTitle" v-model:visible="visible" @ok="addFn" @cancel="onClose" width="747px">

      <a-form :model="formState" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="名称" name="clusterName" :wrapper-col="{ offset: 2, span: 20 }">
          <!--   -->
          <div class="name"> <a-input v-model:value="rowData.clusterName" /></div>
        </a-form-item>
        <a-form-item label="备注" name="remark" :wrapper-col="{ offset: 2, span: 20 }">
          <!--   -->
          <a-input v-model:value="rowData.remark" />
        </a-form-item>

      </a-form>

    </a-modal>
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
<!-- 咋收图标这会议的  不知道，要回头在说那打字在这我领导在附件 -->
<script   name='One' setup>
import { ref, defineComponent } from 'vue'
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
import { list, addclusterList, editclusterList, clusterInfo, delclusterList, queryhost } from './cluster '
import { SmileTwoTone, HeartTwoTone, CheckCircleTwoTone, LeftOutlined, } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue';

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

},

];

const data = ref([])
const totals = ref(0)
const visible = ref(false)
const opTitle = ref('新增')
const lists = ref([])
const values = ref([])
// 对象包数组 
const commonEnty = ref({ values: [] })

const expandedRowKeys = ref([]);

const queryParams = ref({
  // 查询参数
  clusterName: "",
  hostNum: 0,
  remark: "",
  pageNum: 1,
  pageSize: 5,

});
const rowData = ref({
  remark: '',
  clusterName: ''
})

const current = ref(4)

const selHostId = ref('')
const AllHostNum = ref([])
const selHostFn = async (val) => {
  if (selHostId.value === val) {
    selHostId.value = ''
    return AllHostNum.value = []
  }
  let res = await queryhost({ value: val })
  let ipAddress = res.map(item => item.ipAddress)
  // console.log(ipAddress, 'ipAddress');
  selHostId.value = val
  AllHostNum.value = ipAddress
}

const changevalue = ref('批量操作')
const allclusterId = ref([])
const rowSelection = {
  onChange: async (selectedRowKeys, selectedRows) => {

    console.log('selectedRows: ', selectedRows);
    // selectedRows.forEach(item => { 
    //    item.clusterId 

    //   });
    // console.log(allclusterIds);
    // 对原数组元素进行运算后再赋值给新的数组
    allclusterId.value = selectedRows.map(it => it.clusterId)
    // console.log(allclusterId.value);

    // 　最后要穿的数据不是这个样的形式？

  },

}

// 初始化
const getList = () => {
  // console.log('搜索11111');
  list(queryParams.value).then(res => {
    // console.log(res.records, 'res11');
    data.value = res.records
    totals.value = res.total
  });
}
getList()


const isOpen = async (record) => {
  // console.log(record, 'record.createTime');
  visible.value = true
  // clusterId标题用rowdata里的id是否存在进行判断,页面关闭的时候也清空一下
  if (record.clusterId) {
    // console.log(record.clusterId)
    let res = await clusterInfo(`${record.clusterId}`)
    console.log(res);
    rowData.value = res
    // console.log(rowData.value);
    opTitle.value = "修改"
  } else {
    opTitle.value = "新增"
  }
}

const formState = ref({
  username: '',
});

//新增和修改
const addFn = async () => {
  if (rowData.value.clusterId) {
    console.log('编辑');
    // 换了rowData.value
    let res = await editclusterList(rowData.value)
    visible.value = false

  } else {
    console.log('新增');
    let res = await addclusterList(rowData.value)
    console.log(res, 'resadd');
    visible.value = false
  }
  getList()
  onClose()
}
// 关闭弹框
const onClose = () => {
  visible.value = false;
  rowData.value.remark = ""
  rowData.value.clusterName = ""
  rowData.value = {}
  opTitle.value = ""
};


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

}
// 批量删除
const handlChangeFn = async (val) => {
  if (val == '0') {
    let res = await delclusterList({ values: allclusterId.value })
    console.log(res);
    getList()
  }
}
// 批量删除
function delAllFn() {
  delclusterList({ values: allclusterId.value }).then(res => {
    console.log(res);
    getList()
  })

}
const confirm = (record) => {
  console.log(record.clusterId, 'record2');
  delFn(record.clusterId)
  getList()
};
const cancel = async (e) => {
  console.log(e, '	点击取消的回调');
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



</script>
<style scoped lang="less">
.contion {
  margin: 10px;
  display: flex;
  justify-content: start;
  flex-direction: column;

  .select {
    margin: 0 20px;
  }

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

.nav {
  // display: flex;
  // justify-content: start;
  margin: 10px;
  // display: flex;
  // justify-content: start;
}

.ant-form {
  box-sizing: border-box;
  margin: 0px;
  margin-top: 19px;
  margin-left: 36px;
  padding: 0;
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: tnum;
}

// :deep(.ant-col-16) {
//   display: block;
//   flex: 0 0 66.66666667%;
//   max-width: 90%;
// }

.ant-col-offset-2 {
  margin-left: 0;
}

.ant-form-item {
  margin-bottom: 19px;
}

:deep(.ant-col-offset-2) {
  margin-left: 0;
}

.ant-input {
  .name {
    width: 527px;
    height: 44px;

    :deep(.ant-input) {
      height: 44px;
      height: 100%;
    }
  }
}
</style>
