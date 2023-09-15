<template>
  <div class="contaion" style="margin-top:6px">
    <span class="select-option">
      <a-space style="padding-right: 6px;">
        <a-select ref="select" v-model:value="changevalue" style="width: 120px" @select="handlChangeFn">
          <!--这是静态写法 <a-select-option value="0"> <rest-outlined />删除</a-select-option> -->
          <!-- <a-select-option value="1">以后要加别的导出</a-select-option> -->
          <a-select-option v-for="option in options" :key="option.label" :value="option.label">{{ option.value
          }}</a-select-option>
        </a-select>
      </a-space>
    </span>
    <a-button type="primary" style="margin-bottom: 4px;" @click="isOpen"><plus-outlined />添加</a-button>
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

    <a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns" :data-source="datalist"
      :rowKey="(record) => record.id" :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }"
      bordered>
      <template #bodyCell="{ column, record }">
        <!-- 操作 -->
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
      <a-pagination :show-total="totals => `共 ${totals} 条数据`" v-model:current="formData.pageNum" :total="totals"
        v-model:pageSize="formData.pageSize" show-size-changer @showSizeChange="onShowSizeChange" @change="changeFn" />
    </div>
    <div class="modal">

      <a-modal v-model:visible="visible" :title="opTitle" @ok="addoreditFn" @cancel="onClose">
        <a-form :model="rowData" ref='fromRefgroup' name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <a-form-item :rules="formRules.zone" label="域名" name="zone" style='margin-top: 26px'>

            <a-input v-model:value="rowData.zone" placeholder="请输入域名" />
          </a-form-item>
          <a-form-item label="分组" :validateTrigger="['change', 'blur']" :rules="formRules.dnId" name="dnId"
            style='margin-top: 10px'>
            <a-space>
              <a-select placeholder="请选择" ref="select" v-model:value="rowData.dnId" style="width: 160px" @focus="focus"
                @change="handleChanges" :options="libraryallList" :field-names="{ label: 'name', value: 'dnId' }">

              </a-select>
            </a-space>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>
<script name='group' setup>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { grouplist, libraryAll, addgroup, editgroup, groupInfo, delgroup } from "./group.ts"
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
const columns = [
  {
    title: '域名',
    dataIndex: 'zone',
    align: 'center',
  },
  {
    title: '分组',
    dataIndex: 'libName',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
];
const formRules = {
  zone: [{ required: true, message: "请输入分组名称" }],
  dnId: [{ required: true, message: "请选择" }],

}
const data = reactive({

  datalist: "",
  pageNum: 1,
  pageSize: 10,
  totals: '',
  number: 0,
  allclusterId: [],
  libraryallList: [],
  visible: false,
  opTitle: "域名添加",
  fromRefgroup: null,
  alldnId: [],
  changevalue: '批量操作',
  selects: 0

})
const { number, pageNum, pageSize, datalist, totals, allclusterId, libraryallList, visible, opTitle, fromRefgroup, changevalue, selects } = toRefs(data);
const formData = ref({
  libName: "",
  pageNum: 1,
  pageSize: 10,
})
const rowData = ref({
  zone: "",
  dnId: ''


})
const options = ref([
  { label: '0', value: '删除' },

])
const initData = async () => {
  let res = await grouplist(formData.value)
  console.log(res.records);
  datalist.value = res.records
  totals.value = res.total
}
initData()
const getlibraryAll = async () => {
  let res = await libraryAll()
  console.log(res);
  libraryallList.value = res
}
getlibraryAll()
const state = reactive({
  selectedRowKeys: [],
});

const rowSelection = async (selectedRowKeys, selectedRows) => {
  state.selectedRowKeys = selectedRowKeys;
  // 对原数组元素进行运算后再赋值给新的数组
  allclusterId.value = selectedRows.map(it => it.id)
  // console.log(allclusterId.value);
  number.value = allclusterId.value.length
  //这个是勾选的id存放的位置 我点清空我id复空
}
const isOpen = async (record) => {
  console.log(record, 'record.createTime');
  visible.value = true
  // clusterId标题用rowdata里的id是否存在进行判断,页面关闭的时候也清空一下

  if (record.id) {
    let res = await groupInfo(`${record.id}`)
    console.log(res);
    rowData.value = res
    opTitle.value = "域名修改"
  } else {
    opTitle.value = "域名添加"
  }
}
const addoreditFn = async () => {
  if (rowData.value.id) {
    await editgroup(rowData.value)
    visible.value = false
    message.success('修改成功')
  } else {
    await addgroup(rowData.value)
    visible.value = false
    message.success('添加成功')
  }

}
const handleChanges = (value) => {
  console.log(value);
  console.log(rowData.dnId);
  console.log(typeof rowData.dnId);
}
const changeFn = (P, Ps) => {
  formData.value.pageNum = P
  initData()
}
const onShowSizeChange = (current, pageSize) => {
  formData.value.pageSize = pageSize
  initData()

}
// 批量删除
const handlChangeFn = async (val) => {
  // visibledel.value = true
  console.log(val, 'val');
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
          delgroup({ values: allclusterId.value }).then(res => {
            // console.log(res);
            initData()
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
const delFn = async (record) => {
  // 拿到点击删除的id
  // console.log(record, 'record1');
  // 错误的写法lists.value.push(record.clusterId)
  // 把id放到对象（包）数组
  commonEnty.value.values.push(record);
  // console.log(lists.value, 'lists.value');
  await delgroup(commonEnty.value)
  // 更新列表
  getList()
  message.success('删除成功')

}
const confirm = (record) => {
  console.log(record.clusterId, 'record2');
  delFn(record.id)
  initData()
};
</script>
<style scoped lang="less">
.contaion {
  padding: 6px;
  background-color: #fff;

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

  .pagination {
    margin: 10px 0 0 0;
    display: flex;
    justify-content: flex-end;
  }

}
</style>