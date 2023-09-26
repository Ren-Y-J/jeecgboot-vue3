<template>
  <div class="dispatchBox">
    <div class="nav">
      <!-- <a-card> -->

      <a-form class="form" :model="formState">
        <div style="display: flex;">
          <!-- <a-row :gutter="16">
            <a-col :span="6" :md="4" :sm="5"> -->

          <a-form-item style="margin-bottom: 0px;" label="任务状态" :labelCol="{ span: 18 }" :wrapperCol="{ span: 15 }">
            <a-select ref="select" style="width: 120px" @focus="focus" @change="handleChange"
              v-model:value="changesearch">
              <a-select-option value="0">待执行</a-select-option>
              <a-select-option value="1">执行中</a-select-option>
              <a-select-option value="2">成功</a-select-option>
              <a-select-option value="3">失败</a-select-option>
            </a-select>
          </a-form-item>
          <!-- </a-col> -->

          <!-- <a-col :span="7"> 用的是antd嘛 我看下文旦  默认值是什么？要做成什么样的 做成和任务日志一样？-->

          <a-form-item style="" label="创建时间" :labelCol="{ span: 10 }" :wrapperCol="{ span: 22 }">
            <a-space>
              <!--
                 defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                -->
              <!-- <a-range-picker style="width: 400px" :disabled-date="disabledDate" 
                :show-time="{
                  hideDisabledOptions: true,
                  defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                }" format="YYYY-MM-DD HH:mm:ss" @change="handleChangeSearchDate" /> -->
              <a-range-picker style="width: 400px" v-model:value="formState.dateTime" show-time />
            </a-space>
          </a-form-item>

          <!-- </a-col> -->

          <!-- <a-col :span="5"> -->
          <!-- <a-col class="gutter-row"> -->
          <a-form-item label="所有主机" style='' :labelCol="{ span: 28 }" :wrapperCol="{ span: 8 }">
            <a-space>
              <a-select placeholder="请选择" ref="select" v-model:value="formData.hostId" style="width: 160px" @focus="focus"
                @change="handleChangehost">
                <a-select-option :value="item.hostId" v-for="item in allhostId" :key="item.hostId
                  ">{{ item.ipAddress }}</a-select-option>
              </a-select>
            </a-space>
          </a-form-item>
          <!-- </a-col> -->
          <!-- </a-col> -->

          <!-- <a-col :span="6" :md="4" :sm="5"> -->
          <div class="searchbtn" style=" display: flex;flex-wrap: nowrap;margin-left: 192px; ">
            <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery">
              <search-outlined />搜索</a-button>
            <a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
          </div>
          <!-- </a-col>
          </a-row> -->
        </div>

      </a-form>

      <!-- </a-card> -->
    </div>

    <div class="contaion">
      <a-card>
        <a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns"
          :data-source="datalist" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'hostIp'">

            </template>
            <!-- 动作 -->
            <template v-if="column.dataIndex === 'action'">
              <div v-if="record.action == '001'" type="link"> 发送安装包</div>
              <div v-if="record.action == '002'"> 安装bind </div>
              <div v-if="record.action == '003'"> 曾换文件 </div>
              <div v-if="record.action == '004'"> 删除文件 </div>
              <div v-if="record.action == '005'"> 添加文件 </div>
              <div v-if="record.action == '006'"> 更新文件</div>
              <div v-if="record.action == '007'"> 启动DNS </div>
              <div v-if="record.action == '008'"> 重新配置</div>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <div v-if="record.status == '0'" type="link"> 待执行</div>
              <div v-if="record.status == '1'"> 执行中 </div>
              <div v-if="record.status == '2'"> 成功 </div>
              <div v-if="record.status == '3'"> 失败 </div>

            </template>
            <template v-if="column.dataIndex === 'msg'">
              <!-- <div v-if="record.msg == null" type="link"> 空</div> -->
              <!-- <div v-else type="link">{{ record.msg }}</div> -->
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
<script name='dispatch' setup>
import dayjs from 'dayjs';
import { ref, defineComponent, reactive, toRefs } from 'vue';
import { dispatchlist, gethostsAll } from "./dispatch.ts"
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
const columns = [

  {
    title: '动作',
    dataIndex: 'action',
    align: 'center',
  },
  {
    title: '文件名',
    dataIndex: 'fileName',
    align: 'center',
  },
  {
    title: '主机IP',
    dataIndex: 'hostIp',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '任务状态',
    dataIndex: 'status',
    align: 'center',
  },
  {
    title: '执行结果',
    dataIndex: 'msg',
    align: 'center',
  },
  {
    title: '任务顺序',
    dataIndex: 'sort',
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
  taskId: '',
  hostId: undefined,
  status: "",
  pageNum: 1,
  pageSize: 10,
  timeRange: []

});
const dateFormatList = 'YYYY-MM-DD HH:mm:ss'
const initData = async () => {
  var url = location.search; //获取url中"?"符后的字串
  console.log(url);
  if (url.indexOf("?") != -1) {
    let taskId = url.split('?')[1]
    formData.value.taskId = taskId
    console.log(formData.value.taskId, 'formData.value.hostId');
    console.log(taskId);
    let res = await dispatchlist(formData.value)
    console.log(res, 'res');
    datalist.value = res.records
    console.log(data.value);
    totals.value = res.total
  }
}
initData()
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
// 查询区域存储值
const formState = ref({
  hostId: '',//主机
  // host: undefined,字段自己改就行了

  status: "",
  timeRange: [],
  dateTime: []
})

const handleChange = async (value) => {
  formData.value.status = value
};
// 获取时间
function handleChangeSearchDate(_value, dateString) {
  console.log(dateString);
  formData.value.timeRange = dateString
  console.log(formData.value.timeRange);

}
const handleQuery = async () => {
  const startTime = dayjs(formState.value.dateTime[0]).format(dateFormatList)
  const endtTime = dayjs(formState.value.dateTime[1]).format(dateFormatList)
  console.log(startTime, endtTime);
  formData.value.timeRange = [startTime, endtTime]
  formData.value.pageNum = 1
  // initData(formData.value)
  let res = await initData(formData.value)
  // console.log(res.records, '1111');
  datalist.value = res.records
  totals.value = res.total
  formState.value.timeRange = []
}
// 这是清空事件  好了，你自己试试ia能力 我说让你试试 行了吧嗯嗯
const AlldelFn = () => {
  formData.value.taskId = '',
    formData.value.hostId = undefined,
    formData.value.status = "",
    formData.value.pageNum = 1,
    formState.value.dateTime = []
  formState.value.timeRange = []
  initData()
  changesearch.value = '请选择'
}

</script>
<style scoped lang="less">
.dispatchBox {
  padding: 10px;

  .form {
    height: 31px;
    margin: 0 auto;
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