<template>
  <div class="contaion" style="margin-top:6px">
    <a-alert show-icon class="alert" style="margin-bottom: 8px" type="info">
      <!-- Ant Design Vue 的Alert使用 z这块我点清空我那些勾选的东西都取消 number是勾选的个数 type="info"-->
      <!-- <template #message>
        <template v-if="number > 0">
          <span>已选定 {{ number }} 条记录(可跨页)</span>
          <a-divider type="vertical" />
          <a @click="fn" style="color:#4D85E1;">清空</a>
        </template>
        <template v-else>
          <span>未选中任何数据</span>
        </template>
      </template> -->

    </a-alert>
    <a-table :pagination="false" :columns="columns" data-source="datalist" bordered>

    </a-table>
    <div class="pagination">
      <!-- <a-pagination :show-total="totals => `共 ${totals} 条数据`" v-model:current="queryParams.pageNum" :total="totals"
        v-model:pageSize="queryParams.pageSize" show-size-changer @showSizeChange="onShowSizeChange" @change="changeFn" /> -->
    </div>
  </div>
</template>
<script name='group' setup>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { grouplist } from "./group.ts"
const columns = [
  {
    title: '域名',
    dataIndex: 'zoneName',
    align: 'center',
  },
  {
    title: '分组',
    dataIndex: 'lineId',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'remark',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },
];

const data = reactive({

  datalist: "",
  totals: '',
  number: 0
})
const { number, pageNum, pageSize, datalist, totals } = toRefs(data);
const formData = ref({
  libName: "",
  pageNum: 1,
  pageSize: 10,
})
const initData = async () => {
  let res = await grouplist(formData.value)
  console.log(res);
  datalist.value = res.records
  totals.value = res.total
}
initData()
const AlldelFn = () => {

}
const handleQuery = () => {

}
</script>
<style scoped lang="less">
.contaion {
  padding: 8px;
  background-color: #fff;

  .pagination {
    margin: 10px 0 0 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>