<template>
  <div class="aclInfo">
    <div class="nav">
      <a-card>
        <div class="title">
          <a-form :model="formData" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-row :gutter="1">
              <a-col :md="6" :sm="24">
                <a-form-item style="margin-bottom: 0px;" label="名称" name="aclRelName" :labelCol="{ span: 6 }"
                  :wrapperCol="{ span: 16 }">
                  <!-- -->
                  <a-input placeholder="请输入名称" v-model:value="formData.aclRelName" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item style="margin-bottom: 0px;" label="备注" name="status" :labelCol="{ span: 6 }"
                  :wrapperCol="{ span: 16 }">
                  <a-input placeholder="请输入备注" v-model:value="formData.remark" />
                </a-form-item>
              </a-col>
              <a-col :md="4" :sm="5">
                <span class="searchbtn" style="display: inline-block; display: flex;flex-wrap: nowrap; margin-top: 0px">
                  <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery">
                    <search-outlined />搜索</a-button>
                  <!-- <a-button :style="{ margin: '0px 5px ' }" type="primary"
                    @click="AlldelFn"><reload-outlined />重置</a-button> -->
                  <a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-card>
    </div>
    <div class="contion">
      <a-card>
        <!-- <a-button type="primary" style="margin-bottom: 10px;" @click="isOpen"><plus-outlined />添加</a-button> -->
        <!-- :row-selection="rowSelection" -->
        <a-table :columns="columns" :data-source="data" :pagination="false" borderednyaosha
          :scroll="{ x: 'calc(700px + 50%)', y: 510 }">

          <template #bodyCell="{ column, record }">


            <template v-if="column.dataIndex === 'aclRelName'">
              <div style="text-align: center; display: flex;   justify-content: center;  align-items: center;">
                <!-- a-popover宽度-->
                <a-popover :overlayStyle="{ width: '30%' }" trigger="hover">
                  <template #content>
                    {{ record.aclRelName }}
                  </template>

                  <p
                    style="width: 220;overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3;   -webkit-box-orient: vertical;">
                    {{ record.aclRelName }}</p>
                </a-popover>
              </div>
            </template>

            <template v-if="column.dataIndex === 'remark'">
              <!-- 这是备注有内容的时候展示备注里的东西 -->
              <!-- <div v-if="record.remark != ''">
                {{ record.remark }}
              </div> -->
              <!-- 这是备注没有东西的时候点击请编辑内容input框展示让用户输入内容&& record.id  这是放div的判断v-if="record.remark == '' && record.id"-->
              <div>
                <!-- <a-button v-if="!isEdit || isEditKey !== record.id" @click="handelClick(record.id)"
                  class="editable-add-btn" style="margin-bottom: 8px">
                  点击编辑<edit-two-tone />
                </a-button> -->
                <!-- <div v-show="isShow && record.remark == ''"> -->
                <a-button type="link" v-if="!isEdit || isEditKey !== record.id" @click="handelClick(record.id)"
                  class="editable-add-btn" style="margin-bottom: 8px">请输入名称</a-button>
                <!-- </div> -->
                <!-- <div v-show="isShow"> -->
                {{ record.remark }}
                <edit-two-tone />
                <a-input ref="RemarkInp" name="remark" @blur="save(record.id)" v-if="isEdit && (isEditKey == record.id)"
                  @pressEnter=" save(record.id)" v-model:value="fromaclRelNameinfo.remark" />
                <!-- </div> -->
              </div>
            </template>
            <template v-if="column.dataIndex === 'aclType'">
              <span v-if="record.aclType == 0">
                网络地址
              </span>
              <span v-else-if="record.aclType == 1">
                地理位置
              </span>
              <span v-else-if="record.aclType == 2">
                运营商
              </span>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <span v-if="record.status == 1">
                启用
              </span>
              <span v-else-if="record.status == 0">
                禁止
              </span>
            </template>

            <template v-if="column.dataIndex === 'operation'">
              <div>
                <a-popconfirm title="是否确认删除?" ok-text="是" cancel-text="否" @confirm="confirm(record)" @cancel="cancel">
                  <!-- <span class="del">删除</span> -->
                  <a-button type="link">删除</a-button>
                  <!--  @click="delFn(record)"  -->
                </a-popconfirm>
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
  </div>
</template>
<script name='aclInfo' setup>
import { aclIdinfoList, acldelInfo } from './disposition'
import { ref, defineComponent, reactive, computed, nextTick } from 'vue';
import { CheckOutlined, EditOutlined, EditTwoTone } from '@ant-design/icons-vue';
// import { is } from '/@/utils/is';
// import { left } from 'inquirer/lib/utils/readline';
import { getremark, updateremark } from './disposition'
const isEdit = ref(true)
const isEditKey = ref(null)
const editRemark = ref('')
const RemarkInp = ref(null)
const totals = ref(0)

// ---------------删除定义的字段
const values = ref([])
const commonEnty = ref({ values: [] })//// 对象包数组   dengyixia wokankan hao

// const aclInfoData = ref({
//   aclId: 0,
//   aclName: "",
//   aclRelName: "",
//   aclType: "0",
//   createTime: "",
//   createUserId: 0,
//   remark: "",
//   status: "0",
//   updateTime: "",
//   updateUserId: 0
// })
const fromaclRelNameinfo = ref({
  // remark: '星星',
  aclId: 0,
  id: 0,
  remark: "",
  aclName: "",
  aclType: "",
  id: "",
  status: ''


});
const fage = ref(true)
const isShow = () => {
  fage.value = !fage
}
const save = async (val) => {
  console.log(val, 'val');
  // console.log(editRemark.value);
  // if (val) {
  fromaclRelNameinfo.value.id = val
  let res = await updateremark(fromaclRelNameinfo.value)
  console.log(res);
  // fromaclRelNameinfo.value.remark = editRemark.value
  //自动获取焦点在这发送请求 请求在这写 
  isEdit.value = false
  isEditKey.value = null
  initData()
  // editRemark.value = ''
  // fromaclRelNameinfo.value.remark = ""
  // }

  // this.$refs.myInput.focus()  

}
const handelClick = async (val) => {
  console.log(val);
  let res = await getremark(`${val}`)
  console.log(res);
  fromaclRelNameinfo.value = res
  console.log(fromaclRelNameinfo.value);
  // if (val) {
  isEditKey.value = val
  isEdit.value = true
  await nextTick()
  RemarkInp.value.focus()
  // }


}

const columns = [
  {
    title: '名称',
    dataIndex: 'aclRelName',
    width: 220,
    align: 'center'
  },
  {
    title: '类型',
    dataIndex: 'aclType',
    width: 220,
    align: 'center'
  },
  {
    title: '启用/禁止',
    dataIndex: 'status',
    width: 220,
    align: 'center'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 220,
    align: 'center',//我看看文档
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 240,
    align: 'center'
  }
];
const formData = ref({
  aclId: 0,
  aclRelName: "",
  pageNum: 1,
  pageSize: 10,
  remark: ""
});
const data = ref([])
const initData = async () => {
  var url = location.search; //获取url中"?"符后的字串

  if (url.indexOf("?") != -1) {
    let aclId = url.split('?')[1]
    formData.value.aclId = aclId
    console.log(formData.value.aclId, 'formData.value.aclId');
    console.log(aclId);
    // commonEntyaclId.value.values.push(aclId)
    let res = await aclIdinfoList(formData.value)
    console.log(res, 'res');
    data.value = res.records
    totals.value = res.total
  }
}
initData()

const dataSource = ref([{
  key: '0',
  name: 'Edward King 0',
  age: 32,
  address: 'London, Park Lane no. 0',
}, {
  key: '1',
  name: 'Edward King 1',
  age: 32,
  address: 'London, Park Lane no. 1',
}]);
const count = computed(() => dataSource.value.length + 1);


const confirm = async (record) => {
  console.log(record);
  commonEnty.value.values.push(record.id)
  console.log(commonEnty.value, '  commonEnty.value.');
  // let res = await acldelInfo()
  acldelInfo(commonEnty.value).then(res => {
    console.log(res);
    initData()
  })

}
const changeFn = (P, Ps) => {
  formData.value.pageNum = P
  initData()
}
const onShowSizeChange = (current, pageSize) => {
  // console.log(pageSize, 'pageSize');
  formData.value.pageSize = pageSize

  initData()
};
const handleQuery = () => {
  formData.value.pageNum = 1
  initData()

};
const AlldelFn = () => {
  formData.value.aclRelName = ""
  formData.value.remark = ""
  formData.value.pageNum = 1
  initData()


}
</script>
<style scoped lang="less">
.aclInfo {
  padding: 10px;

  .nav {
    margin-bottom: 6px;

    .ant-card {
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
        padding: 12px 10px 13px 10px !important;
      }
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

    // 行高变高，一定是内容撑起来的 ，请检查 slot 插槽时有没有行高很高的组件或元素。
    /deep/ .ant-table-tbody>tr>td {
      padding: 4px !important;
    }

    /deep/ p {
      margin-top: 0;
      margin-bottom: 0em;
    }

    // 标题
    /deep/.ant-table-thead>tr>th,
    .ant-table-tbody>tr>td,
    .ant-table tfoot>tr>th,
    .ant-table tfoot>tr>td {
      padding: 7.5px 16px;
    }

    ::v-deep(.ant-card-body) {
      padding: 8px !important;
    }

    .pagination {
      margin: 10px 0 0 0;
      display: flex;
      justify-content: flex-end;
    }

  }
}
</style>