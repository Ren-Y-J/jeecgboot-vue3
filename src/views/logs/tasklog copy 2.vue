<template>
  <div class="tasklogBox">
    <div class="contaion">
      <a-card>

        <a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns"
          :data-source="datalist" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'hostIp'">
              <p class="hostinfo" style="margin: 0" @click="selHostFn(record.hostIp)">
                <!-- 这个前面你自己弄个图标定义一个变量取反  用计算属性弄就-->
                <span v-if="selhostIp === record.hostIp && AllhostIpNum.length"> <down-outlined /></span>
                <span v-else> <left-outlined /></span>{{ AllhostIpNum.length }}台主机
              </p>
              <!-- && record.hostNum != 0"主机是0的时候不展示列表 -->
              <ul v-if="selhostIp === record.hostIp && record.hostIp != 0">
                <!-- <li v-for="(   item, index   ) in    AllhostIpNum   " :key="index"
                  style="display: flex;align-items: center;padding-left: 65px; ">
                  <a v-if="item.status == 1" style="display: flex;align-items: center;">
                    <img src="../../assets/loginmini/icon/status-ok.png" alt="" style="width:16px;height: 16px;">
                    <a> {{ item }}</a>
                  </a>
                  <a v-else style=" display: flex;  padding-left: 0px;">
                    <img src="../../assets/loginmini/icon/error.png" alt=""
                      style="width:16px;height: 16px; margin-top: 2px;">
                    {{ item }}
                  </a>
                </li> -->
                <!-- 1状态绿色 0红色 -->
                <li v-for=" array in AllhostIpNum   " :key="index"
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
                </li>
              </ul>
            </template>
            <!-- 操作 -->
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
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
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
  datalist.value = res.records
  let hostIps = res.records.map(item => item.hostIp)
  console.log(hostIps, 'hostIps');
  AllhostIpNum.value = hostIps
  console.log(AllhostIpNum.value, ' AllhostIpNum.value ');
  totals.value = res.total
}
initData()
const selhostIp = ref('')
const selHostFn = async (val) => {
  console.log(val, 'hostIp.value');
  // if (selhostIp.value === val) {
  //   selhostIp.value = ''
  //   return AllhostIpNum.value = []
  // }
  // let res = await queryhost({ value: val })
  // // console.log(res, 'res');
  // //这个代码 let ipAddress = res.map(item => item.ipAddress)
  // let ipAddress = res.map(item => item)
  // console.log(ipAddress, 'ipAddress');
  // selhostIp.value = val
  // console.log(selhostIp.value, ' selhostIp.value');
  // const ipAddress = val;
  // const foundData = AllhostIpNum.value.find(array => array.includes(ipAddress))
  // console.log(foundData);

  // const ipAddress = '159.33.66.11';

  // const foundData = hostIp.find(array => array.includes(ipAddress));
  // console.log(foundData);
  // AllHostNum.value = ipAddress
  // console.log(AllHostNum.value, ' AllHostNum.valu');
}
</script>
<style scoped lang="less">
.tasklogBox {
  padding: 10px;

  .contaion {
    padding: 10px;

    .pagination {
      margin: 10px 0 0 0;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>