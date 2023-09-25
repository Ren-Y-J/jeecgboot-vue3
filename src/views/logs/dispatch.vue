<template>
  <div class="dispatchBox">
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
                  <!--  -->
                  <a-range-picker style="width: 400px" :disabled-date="disabledDate" :disabled-time="disabledRangeTime"
                    :show-time="{
                      hideDisabledOptions: true,
                      defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                    }" format="YYYY-MM-DD HH:mm:ss" @change="handleChangeSearchDate" />
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
                        ">{{ item.hostName }}</a-select-option>
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

            </template>
            <!-- 操作 -->
            <template v-if="column.dataIndex === 'action'">
              <div v-if="record.status == '001'" type="link"> 发送安装包</div>
              <div v-if="record.status == '002'"> -安装bind </div>
              <div v-if="record.status == '003'"> 曾换文件， </div>
              <div v-if="record.status == '004'"> 删除文件 </div>
              <div v-if="record.status == '005'"> 添加文件 </div>
              <div v-if="record.status == '006'"> 更新文件</div>
              <div v-if="record.status == '007'"> 启动ONS </div>
              <div v-if="record.status == '008'"> -量就配置 </div>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <!-- <div style="display: flex; justify-content: center; align-items: center">
                <div class="pointer" style="margin-right: 10px">
                  <a-button type="link" @click="GoDep(record)">调度日志</a-button>
                </div>
              </div> -->
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
const columns = [

  {
    title: '动作',
    dataIndex: 'taskId',
    align: 'center',
  },
  {
    title: '文件名',
    dataIndex: 'status',
    align: 'center',
  },
  {
    title: '主机IP',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '创肆时间',
    dataIndex: 'hostIp',
    align: 'center',
  },
  {
    title: '任务状态',
    dataIndex: 'hostIp',
    align: 'center',
  },
  {
    title: '执行结果',
    dataIndex: 'hostIp',
    align: 'center',
  },
  {
    title: '任务顺序',
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
  taskId: 0,
  status: "",
  pageNum: 1,
  pageSize: 10,

});

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
    data.value = res.records
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
// 查询区域存储值
const formState = ref({
  hostId: {},//主机
  // host: undefined,
  status: "",
  updateTime: "",
  createTime: ""
})

const handleChange = async (value) => {
  formState.value.status = value
};
function handleChangeSearchDate(_value, dateString) {
  formState.value.createTime = dateString[0];
  formState.value.updateTime = dateString[1];
  console.log(formState.createTime);
  console.log(formState.updateTime);

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