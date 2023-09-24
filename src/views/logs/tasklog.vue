<template>
  <div class="tasklogBox">
    <div class="contaion">
      <a-card>

        <a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns"
          :data-source="datalist" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'hostIp'">
              <p class="hostinfo" style="margin: 0" @click="selHostFn(record)">
                <span v-if="record.mystatus == 1"> <down-outlined /></span>
                <span v-else> <left-outlined /></span>{{ record.hostIp.length }}台主机
              </p>
              <ul v-if="record.mystatus == 1 && record.hostIp.length != 0">
                <li v-for="(   item, index   ) in    record.hostIp   " :key="index"
                  style="display: flex;align-items: center;justify-content: center; ">
                  <a v-if="record.status == 1" style="display: flex;align-items: center;">
                    <img src="../../assets/loginmini/icon/status-ok.png" alt="" style="width:16px;height: 16px;">
                    <a> {{ item }}</a>
                  </a>
                  <a v-else style=" display: flex; align-items: center;justify-content: center;">
                    <img src="../../assets/loginmini/icon/error.png" alt=""
                      style="width:16px;height: 16px; margin-top: 2px;">
                    {{ item }}
                  </a>
                </li>
                <!-- 1状态绿色 0红色 -->
                <!-- <li v-for=" array in AllhostIpNum   " :key="index"
                  style="display: flex;align-items: center;flex-wrap: wrap;padding-left: 65px; ">
                  <a v-if="array.status == 1" v-for=" (   ipAddress, index   ) in  array "
                    style="display: flex;align-items: center;">
                    <img src="../../assets/loginmini/icon/status-ok.png" alt=""
                      style="width:16px;height: 16px;display: flex;align-items: center;flex-wrap: wrap;">
                    <a> {{ ipAddress }}</a>
                  </a>
                  <a v-else v-for=" (   ipAddress, index   ) in  array " style=" display: flex;  padding-left: 0px;">
                    <img src="../../assets/loginmini/icon/error.png" alt=""
                      style="width:16px;height: 16px; margin-top: 2px;">
                    {{ ipAddress }}
                  </a>
                </li> -->
              </ul>
            </template>
            <!-- 操作 -->
            <template v-if="column.dataIndex === 'status'">
              <div v-if="record.status == '0'" type="link"> 待执行 </div>
              <div v-if="record.status == '1'"> 执行中 </div>
              <div v-if="record.status == '2'"> 成功 </div>
              <div v-if="record.status == '3'"> 失败 </div>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <div style="display: flex; justify-content: center; align-items: center">
                <div class="pointer" style="margin-right: 10px">
                  <a-button type="link" @click="isOpen(record)">调度日志</a-button>
                </div>
              </div>
            </template>
          </template>
        </a-table>
        <div class="pagination">
          <a-pagination :show-total="totals => `共 ${totals} 条数据`" v-model:current="formData.pageNum" :total="totals"
            v-model:pageSize="formData.pageSize" show-size-changer @showSizeChange="onShowSizeChange"
            @change="changeFn" />
        </div>
      </a-card>
    </div>
  </div>
</template>
<script name='tasklog' setup>
import dayjs from 'dayjs';
import { ref, defineComponent, reactive, toRefs } from 'vue'
import { taskloglist, gethostsAll } from "./tasklog.ts";
import { SmileOutlined, DownOutlined, LeftOutlined } from '@ant-design/icons-vue';


const columns = [

  {
    title: '任务ID',
    dataIndex: 'taskId',
    align: 'center',
  },
  {
    title: '任务状态',
    dataIndex: 'status',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '主机IP',
    dataIndex: 'hostIp',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
  },

];
const data = reactive({
  visible: false,
  datalist: "",

  totals: '',
  opTitle: "分组添加",
  formReflibrary: null
})
const { opTitle, datalist, totals, visible, formReflibrary } = toRefs(data);
const formData = ref({
  pageNum: 1,
  pageSize: 10,
})
const AllhostIpNum = ref()
// 表格初始化
const initData = async () => {
  let res = await taskloglist(formData.value)
  console.log(res, '1111');
  let data = res.records
  datalist.value = data.map(item => {
    item.mystatus = 0
    return item
  }
  )
  // [{}, {}][{ mystutas: 0, mystutas2: 0 }, {}]
  totals.value = res.total
}
initData()
const selhostIp = ref('')
const selHostFn = async (val) => {
  // val.mystatus = 1 1  2
  datalist.value.forEach(item => {
    if (item.taskId == val.taskId) {
      item.mystatus === 1 ? item.mystatus = 0 : item.mystatus = 1
    }
  })

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
</script>
<style scoped lang="less">
.tasklogBox {
  padding: 10px;

  .contaion {
    // padding: 10px;

    ::v-deep(.ant-card-body) {
      padding: 12px 10px 13px 10px !important;
    }

    .pagination {
      margin: 10px 0 0 0;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>