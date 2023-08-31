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
              <span style="display: inline-block; display: flex;flex-wrap: nowrap; margin-top: 0px">
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
        <a-table :columns="columns" :data-source="data" :pagination="false">
          <template #bodyCell="{ column, record }">
            <!-- <template #headerCell="{ column }">
            <template v-if="column.key === 'name'">
              <span>
                <smile-outlined />
                Name
              </span>
            </template>
          </template> -->
            <template v-if="column.dataIndex === 'operation'">
              <div>
                <span class="edit" @click="isOpen(record)">修改</span>
                <span class="add" @click="addaclRelNameFn(record)">添加</span>
                <a-popconfirm title="是否确认删除?" ok-text="是" cancel-text="否" @confirm="confirm(record)" @cancel="cancel">
                  <span class="del">删除</span>
                  <!--  @click="delFn(record)" -->
                </a-popconfirm>

                <span class="info" @click="onGoToaclInfo(record)">详情</span>
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
          <a-form-item :rules="fromaclinfoRules.aclRelName" label="ACL名称" name="aclRelName" style='margin-top: 26px'>
            <!-- :rules="[{ required: true, message: 'Please input your username!' }]" -->
            <a-input v-model:value="aclInfoData.aclRelName" placeholder="请输入ACL名称" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>
<script name='Two-hosts' setup>
import { ref, defineComponent, reactive } from 'vue';
import { SmileTwoTone, HeartTwoTone, CheckCircleTwoTone, LeftOutlined, SearchOutlined, ReloadOutlined, PlusOutlined, RestOutlined } from '@ant-design/icons-vue'
import { acllist, addaclList, editaclname, aclnameInfo, delcalList, addInfo } from './disposition'
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
  aclRelName: [{ required: true, message: "请输入ACL名称" }]
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
  status: "1",
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
const addaclRelNameFn = async (record) => {
  let aclId = record.aclId
  console.log(aclId);
  aclInfoData.value.aclId = aclId
  console.log(aclInfoData.value.aclId);
  visibleinfo.value = true
  opTitles.value = "新增ACL详情"

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
  message.error('Click on No');
};

const handleQuery = () => {
  formData.value.pageNum = 1
  initData()

};
const AlldelFn = () => {
  formData.value.aclName = ""
  initData()
}
function onGoToaclInfo(record) {
  console.log(record);
  console.log(record.aclId);
  let aclId = record.aclId
  router.push(`/acl/aclInfo?${aclId}`)
  // router.push('/acl/aclInfo')
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
      padding: 13px !important;
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