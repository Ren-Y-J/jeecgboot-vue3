<template>
  <div class="tasklogBox">
    <div class="nav">
      <a-card>
        <a-form class="form" :model="formState" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" name="basic"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
          <a-row :gutter="16">
            <a-col :span="6" :md="4" :sm="5">
              <a-form-item style="margin-bottom: 0px;" label="任务状态" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
                <!-- v-model:value="changesearch" -->
                <a-select ref="select" style="width: 120px" @focus="focus" @change="handleChange"
                  v-model:value="changesearch">
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="0">异常</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="7">
              <a-form-item style="" label="创建时间" :labelCol="{ span: 4 }" :wrapperCol="{ span: 22 }">
                <a-space>
                  <a-range-picker style="width: 400px" :disabled-date="disabledDate" :disabled-time="disabledRangeTime"
                    :show-time="{
                      hideDisabledOptions: true,
                      defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                    }" format="YYYY-MM-DD HH:mm:ss" @change="handleChangeSearchDate" v-model="formState.timeRange"
                    showTime />
                </a-space>
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-col class="gutter-row">
                <a-form-item label="所有主机" style='' :labelCol="{ span: 4 }" :wrapperCol="{ span: 5 }">
                  <a-space>
                    <a-select placeholder="请选择" ref="select" v-model:value="formState.hostId" style="width: 160px"
                      @focus="focus" @change="handleChangehost">
                      <a-select-option :value="item.hostId" v-for="item in allhostId" :key="item.hostId
                        ">{{ item.ipAddress }}</a-select-option>
                    </a-select>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-col>
            <a-col :span="6" :md="4" :sm="5">
              <span class="searchbtn" style="display: inline-block; display: flex;flex-wrap: nowrap; margin-top: 0px">
                <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery">
                  <search-outlined />搜索</a-button>
                <a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </div>

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
// 点击切换展示主机Ip
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
// 获取主机
const allhostId = ref([])
const gethost = async () => {
  // console.log('搜索11111');
  let res = await gethostsAll()
  // console.log(res, 'res主机');
  allhostId.value = res
  console.log(allhostId.value);


}
gethost()

// 搜索查询的参数
const formState = ref({
  hostId: undefined,//主机
  // host: undefined,
  status: "",
  timeRange: [],
  pageNum: 1,
  pageSize: 10,
})

// const formState = ref({
//   hostId: undefined,//主机
//   // host: undefined,
//   status: "",
//   timeRange: [],
//   pageNum: 1,
//   pageSize: 10,
// })
// 拿到创建时间
function handleChangeSearchDate(_value, dateString) {
  console.log(dateString);
  formState.value.timeRange = dateString
  // formState.value.createTime = dateString[0];
  // formState.value.updateTime = dateString[1];
  // console.log(formState.createTime);
  // console.log(formState.updateTime);

}
// 拿到任务状态
const handleChange = async (value) => {
  formState.value.status = value
};
// 搜索功能
const handleQuery = async () => {

  let res = await taskloglist(formState.value)
  console.log(res, '1111');
  datalist.value = res.records
  totals.value = res.total
}
// 清空
const AlldelFn = () => {
  formState.value.hostId = '',
    formState.value.status = '',
    // let arr = formState.value.timeRange
    // formState.value.timeRange = [],
    // formState.timeRange = undefined
    formState.value.timeRange = []
  console.log(11112, formState.value.timeRange)
  // 是不是很奇怪你还在嘛
  // formState.value.timeRange.forEach((element, index) => {
  //   console.log(formState.value.timeRange[index]);
  //   element[index] = ''
  //   console.log(element[index]);
  // });

  // formState.value.pageNum = 1,
  // initData()
  // changesearch.value = '请选择'
}
// 
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
    margin: 0 auto;
  }

  .nav {
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