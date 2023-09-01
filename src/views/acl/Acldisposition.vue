<template>
  <div class="allcal">
    <div class="nav">
      <a-card class="nav">
        <a-form :model="formState" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed">
          <a-row :gutter="1">
            <a-col :md="6" :sm="24">
              <a-form-item style="margin-bottom: 0px;" label="名称" name="aclName" :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 16 }">
                <a-input v-model:value="formData.aclName" placeholder="请输入ACL名称" />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="5">
              <span class="searchbtn" style="display: inline-block; display: flex;flex-wrap: nowrap; ">
                <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery">
                  <search-outlined />搜索</a-button>
                <!-- <a-button :style="{ margin: '0px 5px ' }" type="primary"
                  @click="AlldelFn"><reload-outlined />重置</a-button> -->
                <a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </a-card>

    </div>
    <div class="contion">
      <a-card>
        <a-button type="primary" style="margin-bottom: 4px;" @click="isOpen"><plus-outlined />添加</a-button>
        <!-- :row-selection="rowSelection" -->
        <a-table :columns="columns" :data-source="data" :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 440 }">
          <template #bodyCell="{ column, record }">
            <!-- <template #headerCell="{ column }">
            <template v-if="column.key === 'name'">
              <span>
                <smile-outlined />
                Name
              </span>
            </template>
          </template> -->
            <template v-if="column.dataIndex === 'aclName'">
              <div style="text-align: center; display: flex;   justify-content: center;  align-items: center;">
                <!-- a-popover宽度-->
                <a-popover :overlayStyle="{ width: '50%' }" trigger="hover">
                  <template #content>
                    {{ record.aclName }}
                  </template>

                  <p
                    style="width: 220;overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3;   -webkit-box-orient: vertical;">
                    {{ record.aclName }}</p>
                </a-popover>
              </div>
            </template>
            <template v-if="column.dataIndex === 'operation'">
              <div>
                <a-button type="link" @click="isOpen(record)">修改</a-button>
                <a-button type="link" @click="addaclRelNameFn(record)">添加</a-button>
                <!-- <span class="edit" @click="isOpen(record)">修改</span>
                <span class="add" @click="addaclRelNameFn(record)">添加</span> -->
                <a-popconfirm title="是否确认删除?" ok-text="是" cancel-text="否" @confirm="confirm(record)" @cancel="cancel">
                  <!-- <span class="del">删除</span> -->
                  <a-button type="link">删除</a-button>
                  <!--  @click="delFn(record)" -->
                </a-popconfirm>
                <a-button type="link" @click="onGoToaclInfo(record)">详情</a-button>
                <!-- <span class="info" @click="onGoToaclInfo(record)">详情</span> 1697083862184730626-->
              </div>
            </template>
          </template>
        </a-table>
        <div class="pagination">
          <a-pagination :show-total="total => `共 ${total} 条数据`" v-model:current="formData.pageNum" :total="totals"
            v-model:pageSize="formData.pageSize" show-size-changer @showSizeChange="onShowSizeChange"
            @change="changeFn" />
        </div>
      </a-card>
    </div>

    <div class="model">
      <a-modal v-model:visible="visible" :title="opTitle" @ok="handleOk" @cancel="onClose">
        <a-form :model="formState" ref='formRef' name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <a-form-item :rules="formRules.aclName" label="ACL名称" name="aclName" style='margin-top: 26px'>
            <!-- :rules="[{ required: true, message: 'Please input your username!' }]" -->
            <a-input v-model:value="formState.aclName" placeholder="请输入ACL名称" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <div class="modelinfo">
      <a-modal v-model:visible="visibleinfo" :title="opTitles" @ok="handleOkaclRelNameFn" @cancel="onCloseaclFn">
        <a-form :model="aclInfoData" ref='formRefinfo' name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <a-form-item :rules="fromaclinfoRules.aclType" label="类型" name="aclType" style='margin-top: 26px'>
            <a-radio-group v-model:value="radiovalue" name="radioGroup" @change="changeradioFn(value)">
              <!-- 这是strig 这是数字类型 -->
              <a-radio :value="0">网络地址</a-radio>
              <a-radio :value="1">地理位置</a-radio>
              <a-radio :value="2">运营商</a-radio>
            </a-radio-group>

          </a-form-item>

          <!-- radiovalue == 0这个判断-->
          <div v-show="radiovalue === 0">
            <a-form-item label="策略" name="status" style='margin-top: 26px'>
              <!-- :rules="[{ required: true, message: 'Please input your username!' }]" -->
              <a-radio-group v-model:value="value" name="radioGroup" @change="changstatusFn(value)">
                <a-radio value="1">启用</a-radio>
                <a-radio value="0">禁用</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item :rules="fromaclinfoRules.aclRelName" label="网络地址" name="aclRelName" style='margin-top: 26px'>
              <a-input v-model:value="aclInfoData.aclRelName" placeholder="请输入网络地址" />
            </a-form-item>
            <a-form-item :rules="fromaclinfoRules.remark" label="备注" name="remark" style='margin-top: 26px'>
              <a-input v-model:value="aclInfoData.remark" placeholder="备注" />
            </a-form-item>
          </div>
          <div v-show="radiovalue === 1">
            <a-form-item label="策略" name="status" style='margin-top: 26px'>
              <!-- :rules="[{ required: true, message: 'Please input your username!' }]" -->
              <a-radio-group v-model:value="value" name="radioGroup" @change="changstatusFn(value)">
                <a-radio value="0">禁用</a-radio>
                <a-radio value="1">启用</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item :rules="fromaclinfoRules.aclRelName" label="地理位置" name="aclRelName" style='margin-top: 26px'>
              <!-- :rules="[{ required: true, message: 'Please input your username!' }]" -->
              <!-- <a-input v-model:value="aclInfoData.aclRelName" placeholder="请输入地理位置" 你要打字z/> 
             在之内别动嗯嗯这个我没定义刚刚那个是selsed的value 现在没问题了有我这v-model要绑定的是最后一个字段name
: 
"石家庄市"把选中的市放到参数aclInfoData.value.aclRelName 然后发起请求传给后端 -->
              <!-- 这个value的值就是code，是的但是要把code 赋值给aclInfoData.value.aclRelName然后就发起请求传给后端 
你再看看吧
那个没赋值我都没拿到code咋赋值了刚刚是selse的value
v你现在看看
好了我要130110数组最后一个

-->
              <a-cascader v-model:value="aclInfoData.aclRelName" :options="getdistrictList"
                :fieldNames="{ label: 'name', value: 'code', children: 'child' }" placeholder="请选择"
                @change="changecodeFn" />
            </a-form-item>
            <a-form-item :rules="fromaclinfoRules.remark" label="备注" name="remark" style='margin-top: 26px'>
              <!-- :rules="[{ required: true, message: 'Please input your username!' }]" -->
              <a-input v-model:value="aclInfoData.remark" placeholder="备注" />
            </a-form-item>
          </div>
          <div v-show="radiovalue === 2">
            <a-form-item label="策略" name="status" style='margin-top: 26px'>
              <!-- :rules="[{ required: true, message: 'Please input your username!' }]" -->
              <a-radio-group v-model:value="value" name="radioGroup" @change="changstatusFn(value)">
                <a-radio value="0">禁用</a-radio>
                <a-radio value="1">启用</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item :rules="fromaclinfoRules.aclRelName" label="运营商" name="aclRelName" style='margin-top: 26px'>
              <!-- :rules="[{ required: true, message: 'Please input your username!' }]" -->
              <a-space>
                <a-select ref="select" v-model:value="aclInfoData.aclRelName" style="width: 120px" @focus="focus"
                  @change="handleChange">
                  <a-select-option :value="item.name" v-for="item in getoperatorList" :key="item.type
                    ">{{ item.name }}</a-select-option>
                </a-select>


              </a-space>
            </a-form-item>
            <a-form-item :rules="aclInfoData.remark" label="备注" name="remark" style='margin-top: 26px'>
              <!-- :rules="[{ required: true, message: 'Please input your username!' }]" -->
              <a-input v-model:value="aclInfoData.remark" placeholder="备注" />
            </a-form-item>
          </div>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>
<script name='Two-hosts' setup>
import { ref, defineComponent, reactive } from 'vue';
import { SmileTwoTone, HeartTwoTone, CheckCircleTwoTone, LeftOutlined, SearchOutlined, ReloadOutlined, PlusOutlined, RestOutlined } from '@ant-design/icons-vue'
import { acllist, addaclList, editaclname, aclnameInfo, delcalList, addInfo, getoperator, getdistrict } from './disposition'
import { message } from 'ant-design-vue';
import { router } from '/@/router';
const columns = [
  {
    title: 'ACL名称',
    dataIndex: 'aclName',
    width: 220,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 240,
    align: 'center'
  }
];
const formRules = {
  aclName: [{ required: true, message: "请输入ACL名称" }]
}
const fromaclinfoRules = {
  aclRelName: [{ required: true, message: "请输入内容" }]
}

const formData = ref({
  aclId: 0,
  aclName: "",
  pageNum: 1,
  pageSize: 10,
});
const aclInfoData = ref({
  aclId: 0,
  aclName: "",
  aclRelName: "",
  aclType: "0",
  createTime: "",
  createUserId: 0,
  remark: "",
  status: "0",
  updateTime: "",
  updateUserId: 0
})
const formRef = ref(null)
const formRefinfo = ref(null)
const data = ref([])
const totals = ref(0)
const opTitle = ref('新增ACL配置')
const opTitles = ref('新增ACL详情')
const visible = ref(false)
const visibleinfo = ref(false)
const formState = ref({
  aclName: '',
});
const fromaclRelNameinfo = ref({
  aclRelName: '',
});

// ---------------删除定义的字段
const values = ref([])
const commonEnty = ref({ values: [] })//// 对象包数组 
//---------
// import { defineComponent, reactive, ref } from 'vue';
const radiovalue = ref(0);
const value = ref('0');
const isShow = ref(false);
const isShownetwork = ref(false); //网络
const isShowGeography = ref(false);//地理
const isShowoperator = ref(false);//运营商
const getoperatorList = ref([])//运营商selse的接口数据
const getdistrictList = ref([])
const options = ref([])

const changstatusFn = (value) => {
  console.log(value, '网');
  console.log(typeof value, '网string');
  aclInfoData.value.status = value
  console.log(aclInfoData.value.status, '要传递的参数');
  console.log(typeof aclInfoData.value.status, '要传递的参数');
}
const getoperatorintData = async () => {
  let res = await getoperator()
  console.log(res, '运营商');
  getoperatorList.value = res
  console.log(getoperatorList);
}
getoperatorintData()

const getdistrictintData = async () => {
  let res = await getdistrict()
  console.log(res, '国家地区数据在这');
  getdistrictList.value = res
  console.log(getdistrictList);
}
getdistrictintData()

const changecodeFn = (value) => {
  console.log(value, '地区');
  let lastElement = value.pop();
  console.log(lastElement);
  aclInfoData.value.aclRelName = lastElement
}
const handleChange = (value) => {
  console.log(value, '运营商');
  aclInfoData.value.aclRelName = value
}
const changeradioFn = (value) => {
  console.log(value, 'value');
  // radiovalue.value = value
  console.log(radiovalue.value, value)
  aclInfoData.value.aclType = radiovalue.value
  // console.log(value, 'value');
  // // isShow.value = values
  // console.log(typeof value, 'value');
  // if (value == '0') {
  //   isShownetwork.value = true
  //   isShowGeography.value = false
  //   isShowoperator.value = false
  // } else if (value == '1') {
  //   isShowGeography.value = true
  //   isShownetwork.value = false
  //   isShowoperator.value = false
  // } else if (value == '2') {
  //   isShowoperator.value = true
  //   isShownetwork.value = false
  //   isShowGeography.value = false

  // } else {
  //   isShownetwork.value = true
  //   // isShowGeography.value = true
  //   // isShowoperator.value = true
  // }
}
const addaclRelNameFn = async (record) => {
  let aclId = record.aclId
  console.log(aclId);
  aclInfoData.value.aclId = aclId
  // console.log(aclInfoData.value.aclId);
  visibleinfo.value = true
  opTitles.value = "新增ACL详情"

  // let aclId = record.aclId

  // router.push(`/acl/addaclInfo?${aclId}`)
}
const handleOkaclRelNameFn = async () => {
  try {
    await formRefinfo.value.validate()
  } catch (error) {
    // console.log(error);
    return console.log(error)
  }

  let res = await addInfo(aclInfoData.value)
  console.log(res, 'res');
  visibleinfo.value = false
  message.success('添加成功')
}
//----------------


const initData = async () => {
  console.log('搜索11111');
  acllist(formData.value).then(res => {
    // console.log(res.records, 'res11');
    // console.log(res.total, 'res11');
    data.value = res.records
    totals.value = res.total
  });
}
initData()
const changeFn = (P, Ps) => {
  // console.log(P, 'p');
  formData.value.pageNum = P
  initData()
}
const onShowSizeChange = (current, pageSize) => {
  // console.log(pageSize, 'pageSize');
  formData.value.pageSize = pageSize
  initData()
};
const onFinish = values => {
  // console.log('Success:', values);
};
// const onFinishFailed = errorInfo => {
//   // console.log('Failed:', errorInfo);
// };
const isOpen = async (record) => {
  console.log(record, 'record');
  visible.value = true
  // opTitle.value = '新增名称'
  if (record.aclId) {
    let res = await aclnameInfo(`${record.aclId}`)
    formState.value = res
    console.log(res, 'recoed');
    opTitle.value = "修改ACL配置"
  } else {
    opTitle.value = "新增ACL配置"
  }

}


const handleOk = async () => {
  try {
    await formRef.value.validate()
  } catch (error) {
    // console.log(error);
    return console.log(error)
  }
  if (formState.value.aclId) {
    let res = await editaclname(formState.value)
    console.log(res, '1');
    visible.value = false
    message.success('修改成功')
  } else {
    let res = await addaclList(formState.value)
    console.log(res, '新增1');
    visible.value = false
    message.success('添加成功')
  }

  initData()
  onClose()
}
// 关闭弹框
const onClose = () => {
  visible.value = false;
  formRef.value.resetFields()
  formState.value.aclName = ""
  formState.value = {}
  opTitle.value = ""
};
const onCloseaclFn = () => {
  visibleinfo.value = false
  // aclInfoData.value = {}
  fromaclRelNameinfo.value.aclRelName = ""
  formRefinfo.value.resetFields()
}
const delFn = async (record) => {
  console.log(record, '删除');
  commonEnty.value.values.push(record)
  console.log(commonEnty.value, '  commonEnty.value.');
  await delcalList(commonEnty.value)
  // 更新列表
  initData()
  message.success('删除成功')
}
const confirm = (recoed) => {
  console.log(recoed.aclId);
  delFn(recoed.aclId)
  initData()
};
const cancel = e => {
  console.log(e);
  // message.error('Click on No');
};

const handleQuery = () => {
  formData.value.pageNum = 1
  initData()

};
const AlldelFn = () => {
  formData.value.aclName = ""
  formData.value.pageNum = 1
  initData()

}
function onGoToaclInfo(record) {
  console.log(record);
  console.log(record.aclId);
  let aclId = record.aclId
  // router.push(`/acl/aclInfo?${aclId}`)
  router.push(`/acl/aclInfos?${aclId}`)

  // /acl/aclInfos
  // router.push('/acl/aclInfo')
  ///acl/aclInfo?1697083862184730626
}
</script>
<style scoped lang="less">
.allcal {
  padding: 10px;

  .nav {
    margin-bottom: 6px;

    :deep(.ant-card-body) {

      padding: 12px 10px 13px 10px !important;
    }

    .ant-card-body {
      padding: 12px 10px 13px 10px !important;
    }

    .ant-card-body {
      padding: 12px 10px 13px 10px !important;
    }

    :deep(.ant-card-body) {
      padding: 12px 10px 13px 10px !important;
    }

    ::v-deep(.ant-card-body) {
      padding: 12px 10px 6px 10px !important;
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

  .contion {
    .ant-card-body {
      padding: 6px !important;
    }

    .ant-card-body {
      padding: 6px !important;
    }

    :deep(.ant-card-body) {
      padding: 6px !important;
    }

    ::v-deep(.ant-card-body) {
      padding: 6px !important;
    }

    // 行高变高，一定是内容撑起来的 ，请检查 slot 插槽时有没有行高很高的组件或元素。
    /deep/ .ant-table-tbody>tr>td {
      padding: 6px !important;
    }

    /deep/ p {
      margin-top: 0;
      margin-bottom: 0em !important;
    }

    // 标题
    /deep/.ant-table-thead>tr>th,
    .ant-table-tbody>tr>td,
    .ant-table tfoot>tr>th,
    .ant-table tfoot>tr>td {
      padding: 7.5px 16px;
    }

    .edit {
      color: #2E7DFF;
      padding: 0px 5px;

      &:hover {
        cursor: pointer;
      }
    }

    .add {
      color: #2E7DFF;
      padding: 0px 5px;

      &:hover {
        cursor: pointer;
      }
    }

    .info {
      color: #2E7DFF;
      padding: 0px 5px;

      &:hover {
        cursor: pointer;
      }
    }

    .del {
      color: #2E7DFF;
      padding: 0px 5px;

      &:hover {
        cursor: pointer;
      }
    }

    .pagination {
      margin: 10px 0 0 0;
      display: flex;
      justify-content: flex-end;
    }

  }
}
</style>