<template>
  <div class="tasklogBox">
    <div class="nav">
      <a-form class="form" :model="formState">
        <div style="display: flex;">
          <a-form-item style="" label="任务状态" :labelCol="{ span: 18 }" :wrapperCol="{ span: 15 }">
            <a-select ref="select" style="width: 120px" @focus="focus" @change="handleChange"
              v-model:value="changesearch">
              <a-select-option value="0">待执行</a-select-option>
              <a-select-option value="1">执行中</a-select-option>
              <a-select-option value="2">成功</a-select-option>
              <a-select-option value="3">失败</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item style="" label="创建时间" :labelCol="{ span: 10 }" :wrapperCol="{ span: 50 }">
            <!-- <a-space>
              <a-range-picker style="width: 400px" :disabled-date="disabledDate" :disabled-time="disabledRangeTime"
                :show-time="{
                  hideDisabledOptions: true,
                  defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                }" format="YYYY-MM-DD HH:mm:ss" @change="handleChangeSearchDate" @ok="onOk"
                v-model="formStates.timeRanges" showTime />
            </a-space> -->
            <a-range-picker style="width: 400px" v-model:value="formState.timeRange" show-time />
          </a-form-item>
          <a-form-item label="所有主机" :labelCol="{ span: 30 }" :wrapperCol="{ span: 30 }">
            <a-space>
              <a-select placeholder="请选择" ref="select" v-model:value="formState.hostId" style="width: 160px"
                @focus="focus" @change="handleChangehost">
                <a-select-option :value="item.hostId" v-for="item in allhostId" :key="item.hostId
                  ">{{ item.ipAddress }}</a-select-option>
              </a-select>
            </a-space>
          </a-form-item>
          <div class="searchbtn" style="display: flex;flex-wrap: nowrap;margin-left: 192px;">
            <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery">
              <search-outlined />搜索</a-button>
            <a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
          </div>
        </div>
      </a-form>
    </div>
    <div class="contaion">
      <a-card>
        <a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns"
          :data-source="datalist" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'hostIp'">
              <p class="hostinfo" style="margin: 0" @click="selHostFn(record)">
                <span v-if="record.mystatus == 1"> <down-outlined /></span>
                <span v-else> <left-outlined /></span>{{ record.hostIp ? record.hostIp.length : 0 }}台主机
              </p>
              <ul v-if="record.mystatus == 1 && record.hostIp.length != 0">
                <li v-for="(   item, index   ) in    record.hostIp   " :key="index"
                  style="display: flex;align-items: center;justify-content: center; ">
                  <a v-if="record.status == 1" style="display: flex;align-items: center;">
                    <!-- <img src="../../assets/loginmini/icon/status-ok.png" alt="" style="width:16px;height: 16px;"> -->
                    <a> {{ item }}</a>
                  </a>
                  <a v-else style=" display: flex; align-items: center;justify-content: center;">
                    <!-- <img src="../../assets/loginmini/icon/error.png" alt="" -->
                    <!-- style="width:16px;height: 16px; margin-top: 2px;"> -->
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
                  <a-button type="link" @click="GoDep(record)">调度日志</a-button>
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
import { router } from '/@/router';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
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
  formReflibrary: null,

  changesearch: '请选择'

})
const { changesearch, opTitle, datalist, totals, visible, formReflibrary } = toRefs(data);
const formData = ref({
  pageNum: 1,
  pageSize: 10,
})
const AllhostIpNum = ref()
const valuetime = ref([]);
const dateFormatList = 'YYYY-MM-DD HH:mm:ss'
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
  // console.log(datalist.value);
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
  formData.value.pageSize = pageSize
  initData()
};
// 获取主机
const allhostId = ref([])
const gethost = async () => {
  // console.log('搜索11111');
  let res = await gethostsAll()
  // console.log(res, 'res主机');
  allhostId.value = res
  // console.log(allhostId.value);


}
gethost()

// 查询区域的参数
const formState = ref({
  hostId: null,//主机
  // host: undefined,
  status: null,
  timeRange: [],
  pageNum: 1,
  pageSize: 10,
})


function handleChangeSearchDate(_value, dateString) {
  // console.log(dateString);
  // formState.timeRange = dateString
  // formState.value.createTime = dateString[0];
  // formState.value.updateTime = dateString[1];
  // console.log(formState.createTime);
  // console.log(formState.timeRange);

}
const handleChange = async (value) => {
  formState.status = value

};
const handleQuery = async () => {
  // （深拷贝不破坏原数据类型，时间选择器能正常打开）
  const params = JSON.parse(JSON.stringify(formState.value))
  //params.timeRange必要有值   params数组 params.timeRange.length
  if (params.timeRange && params.timeRange.length) {
    const startTime = dayjs(params.timeRange[0]).format(dateFormatList)
    const endtTime = dayjs(params.timeRange[1]).format(dateFormatList)
    params.timeRange = [startTime, endtTime]
  }
  let res = await taskloglist(params)
  console.log(res, '1111');
  datalist.value = res.records
  totals.value = res.total

}
// const onOk = (value) => {
//   console.log('onOk: ', value);
// }

// 清空
const AlldelFn = async () => {
  formState.value.hostId = null;
  formState.value.status = null
  formState.value.timeRange = []
  formState.value.pageNum = 1
  let res = await taskloglist(formState.value)
  // console.log(res, '1111');
  datalist.value = res.records
  totals.value = res.total
  changesearch.value = '请选择'
}
const GoDep = (record) => {
  let taskId = record.taskId
  console.log(record.taskId);
  router.push(`/logs/dispatch?${taskId}`)
};
</script>
<style scoped lang="less">
.tasklogBox {
  padding: 10px;

  .form {
    // max-width: 600px;
    height: 31px;
    // margin: 0 auto;
  }

  .nav {
    margin-bottom: 6px;
    padding: 8px;
    background-color: #fff;
    width: 100%;

    ::v-deep(.ant-card-body) {
      padding: 12px 10px 13px 10px !important;
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


  // .nav {

  //   // flex-wrap: nowrap;
  //   .form {
  //     max-width: 600px;
  //     margin: 0 auto;
  //   }

  //   .title {



  //     .status {
  //       width: 20%
  //     }

  //     .time {
  //       width: 30%
  //     }

  //     .hostId {
  //       width: 30%
  //     }

  //     .btn {
  //       width: 20%;

  //       .searchbtn {
  //         display: flex;
  //         flex-wrap: nowrap;
  //       }

  //       @media screen and (max-width: 800px) {
  //         .searchbtn {
  //           margin-top: 10px;
  //         }
  //       }
  //     }
  //   }
  // }

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