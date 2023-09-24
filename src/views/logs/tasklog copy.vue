<template>
  <div class="tasklogBox">
    <div class="nav">
      <a-card>

        <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
          <!-- <a-row :gutter="1"> -->
          <!-- <a-col :md="3" :sm="24"> -->
          <div class="title">
            <div class="status">
              <a-form-item style="margin-bottom: 0px;" label="任务状态" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
                <!-- v-model:value="changesearch" -->
                <a-select ref="select" style="width: 120px" @focus="focus" @change="handleChange">
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="0">异常</a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <!-- </a-col> -->
            <!-- <a-col :md="3" :sm="24"> -->
            <div class="time">
              <a-form-item style="margin-bottom: 0px;" label="所有时间" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
                <a-space>
                  <a-range-picker v-model:value="value4" style="width: 400px" :disabled-date="disabledDate"
                    :disabled-time="disabledRangeTime" :show-time="{
                      hideDisabledOptions: true,
                      defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                    }" format="YYYY-MM-DD HH:mm:ss" />
                </a-space>
              </a-form-item>
            </div>
            <!-- </a-col> -->
            <!-- <a-col :md="3" :sm="24"> -->
            <div class="btn">
              <span style="display: inline-block; display: flex;flex-wrap: nowrap; margin-top: 0px"
                :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
                <div class="searchbtn">
                  <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery">
                    <search-outlined />搜索</a-button>
                  <a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
                </div>

              </span>
            </div>
            <!-- </a-col> -->
            <!-- </a-row> -->
          </div>
        </a-form>

      </a-card>
    </div>
    <a-card>
      <!-- datalist -->
      <a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns" :data-source=""
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
        <!-- <a-pagination :show-total="total => `共 ${total} 条数据`" v-model:current="queryParams.pageNum" :total="totals"
            v-model:pageSize="queryParams.pageSize" show-size-changer @showSizeChange="onShowSizeChange"
            @change="changeFn" /> -->
      </div>

    </a-card>
  </div>
</div></template>
<script name='tasklog' setup>
import dayjs from 'dayjs';
import { ref, defineComponent, reactive, } from 'vue'
import { taskloglist, gethostsAll } from "./tasklog.ts";
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
// 表格初始化
const initData = async () => {
  let res = await taskloglist(formData.value)
  console.log(res);
  // datalist.value = res.records
  // totals.value = res.total
}
initData()
const changesearch = ref('请选择')

const queryParams = ref({
  // 查询参数
  clusterName: "",
  hostNum: 0,
  remark: "",
  pageNum: 1,
  pageSize: 10,

})

const handleChange = async (value) => {
  // console.log(`selected ${value}`);
  // console.log(value, ' value这拿到的是status字符串 0 或1');
  queryParams.value.status = value
  // console.log(queryParams.value.status, '列表选择之后的status状态');
  // console.log(queryParams.value, 'value');
};
//所有主机
const gethost = async () => {
  // console.log('搜索11111');
  let res = await gethostsAll()
  console.log(res, 'res主机');
  // allhostId.value = res.map(item => item.hostId)
  allhostId.value = res
  // console.log(allhostId.value);


}
gethost()
const value4 = ref()
const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
const disabledDate = current => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};
const disabledRangeTime = (_, type) => {
  if (type === 'start') {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  };
};
// const onChange = (value, dateString) {
//   console.log('Selected Time: ', value)
//   console.log('Formatted Selected Time: ', dateString)
// }
// const onOk = (value) {
//   console.log('onOk: ', value)
// },


</script>
<style scoped lang="less">
.tasklogBox {
  padding: 10px;

  .nav {
    // display: flex;
    // flex-wrap: nowrap;

    .title {

      display: flex;


      .status {
        width: 20%
      }

      .time {
        width: 40%
      }

      .btn {
        width: 20%;

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
    }
  }


}
</style>