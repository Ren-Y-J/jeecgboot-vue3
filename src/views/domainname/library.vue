<template>
  <div class="domainname">
    <div class="contaion">
      <!-- <a-card> -->
      <a-button type="primary" style="margin-bottom: 4px;" @click="isOpen"><plus-outlined />添加</a-button>
      <a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns" :data-source="datalist"
        bordered>
        <template #bodyCell="{ column, record }">
          <!-- 操作 -->
          <template v-if="column.dataIndex === 'operation'">
            <div style="display: flex; justify-content: center; align-items: center">
              <div class="pointer" style="margin-right: 10px">
                <a-button type="link" @click="isOpen(record)">编辑</a-button>
              </div>
              <div class="pointer" style="margin-right: 10px">
                <a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="confirm(record)">
                  <a-button type="link">删除</a-button>
                </a-popconfirm>
              </div>
              <div class="pointer" style="margin-right: 10px">
                <a-popconfirm title="是否确认？" ok-text="是" cancel-text="否" @confirm="stopBtn(record)">
                  <span v-show="record.status == 1" style="color: #1890ff">禁用</span>
                  <span v-show="record.status == 0" style="color: #1890ff">启用</span>
                </a-popconfirm>
              </div>
            </div>
          </template>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination :show-total="totals => `共 ${totals} 条数据`" v-model:current="formData.pageNum" :total="totals"
          v-model:pageSize="formData.pageSize" show-size-changer @showSizeChange="onShowSizeChange" @change="changeFn" />
      </div>
      <!-- </a-card> -->
    </div>
    <div class="modal">

      <a-modal v-model:visible="visible" :title="opTitle" @ok="addoreditFn" @cancel="onClose">
        <a-form :model="rowData" ref='formReflibrary' name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <a-form-item :rules="formRules.name" label="分组名称" name="name" style='margin-top: 26px'>
            <a-input v-model:value="rowData.name" placeholder="请输入分组名称" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>
<script name='library' setup>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { librarylist, libraryInfo, addlibrary, editlibrary, dellibrary } from "./library.ts"
import { message } from 'ant-design-vue';
const columns = [

  {
    title: '分组',
    dataIndex: 'name',
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
  name: [{ required: true, message: "请输入分组名称" }],


}
const data = reactive({
  visible: false,
  datalist: "",

  totals: '',
  opTitle: "分组添加",
  formReflibrary: null
})
const { opTitle, datalist, totals, visible, formReflibrary } = toRefs(data);
const formData = ref({
  name: "",
  pageNum: 1,
  pageSize: 10,
})
const rowData = ref({
  name: '',
  systemFlag: '0'//	是否系统内置 0-否 1-是
})
// ---------------删除定义的字段
const values = ref([])
const commonEnty = ref({ values: [] })//// 对象包数组 
// const props = defineProps({
//   libname: {
//     type: String,
//     default: ''
//   }
// })
// console.log(props.libname);
// props:{
//   libname:
// }
// 表格初始化
const initData = async (name) => {
  // let res = await librarylist({ ...formData.value, name: props.libname })
  let res = await librarylist({ ...formData.value, name })
  console.log(res);
  datalist.value = res.records
  totals.value = res.total
}
initData('')
// 問題 搜索的时候没有重新给参数赋值导致的
// 解決方案 在子页面写一个方法，把pageNum赋值1，然后在父组件搜索的时候调用那个方法
const pageNum = () => {
  formData.value.pageNum = '1'
}

const isOpen = async (record) => {
  // console.log(record, 'record.createTime');
  visible.value = true
  // clusterId标题用rowdata里的id是否存在进行判断,页面关闭的时候也清空一下
  if (record.dnId) {
    let res = await libraryInfo(`${record.dnId}`)
    rowData.value = res
    // console.log(rowData.value, 'rowData.value');
    // console.log(rowData.value.dnId, 'rowData.value')
    // console.log(typeof rowData.value.dnId, 'rowData.value')
    opTitle.value = "分组修改"
  } else {
    opTitle.value = "分组添加"
  }
}
const addoreditFn = async () => {
  try {
    await formReflibrary.value.validate()
  } catch (error) {
    // console.log(error);
    return console.log(error)
  }
  // console.log(rowData);
  if (rowData.value.dnId) {
    await editlibrary(rowData.value)
    visible.value = false
    message.success('修改成功')
    initData('')
    onClose()
  } else {
    await addlibrary(rowData.value)
    visible.value = false
    message.success('添加成功')
    initData('')
    onClose()
  }


}
const delFn = async (record) => {
  // console.log(record, '删除');
  commonEnty.value.values.push(record)
  // console.log(commonEnty.value, '  commonEnty.value.');
  await dellibrary(commonEnty.value)
  pageNum()
  // 更新列表
  initData('')
  message.success('删除成功')

}
// 关闭弹框
const onClose = () => {
  visible.value = false;
  formReflibrary.value.resetFields()
  rowData.value.name = ""
  formData.value.name = ""
  opTitle.value = ""
  rowData.value.dnId = ''
};
const confirm = (recoed) => {
  // console.log(recoed.dnId);
  pageNum()
  delFn(recoed.dnId)
  initData('')
};
const cancel = e => {
  console.log(e);
  // message.error('Click on No');
};

const changeFn = (P, Ps) => {
  formData.value.pageNum = P
  initData('')
}
const onShowSizeChange = (current, pageSize) => {
  formData.value.pageSize = pageSize
  initData('')

}
// 将变量暴露出去 ， 父组件才能传值进来 ， 并且defineExpose也可以暴露方法供父组件调用(子组件方法暴露出去的名字一样也没有事)
defineExpose({ initData, pageNum })
</script>
<style scoped lang="less">
.domainname {
  margin-top: 6px;
  background-color: #fff;

  .contaion {
    padding: 8px;

    .pagination {
      margin: 10px 0 0 0;
      display: flex;
      justify-content: flex-end;
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


  }


}
</style>