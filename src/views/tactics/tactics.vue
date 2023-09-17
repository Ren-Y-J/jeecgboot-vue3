<template>
  <div class="allclustersBox">
    <a-card>
      <div class="title">
        <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
          <a-row :gutter="1">
            <a-col :md="6" :sm="24">
              <a-form-item style="margin-bottom: 0px" label="策略组名称" name="name" :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 16 }">
                <a-input placeholder="请输入策略组名称" />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="5">
              <span style="display: inline-block; display: flex;flex-wrap: nowrap; margin-top: 0px">
                <div class="searchbtn">
                  <a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery">
                    <search-outlined />搜索</a-button>
                  <a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
                </div>

              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
  </div>
  <div class="controls">
    <div class="iconBtn">
      <a-button :style="{ margin: '0px 8px 0px 0px ' }" type="primary"
        ><plus-outlined />添加策略组</a-button>
      <a-button :style="{ margin: '0px 8px ' }" type="primary" ><edit-outlined />修改策略组</a-button>
      <a-button :style="{ margin: '0px 8px ' }" type="primary" @click="handlChangeFn"><delete-outlined />删除策略组</a-button>
      <a-button :style="{ margin: '0px 8px ' }" type="primary" ><reload-outlined />同步策略组</a-button>
    </div>
    <div class="select">
      <a-alert show-icon style="margin-top: 8px" type="info">
        <template #message>
          <template v-if="number > 0">
            <span>已选定 {{ number }} 条记录(可跨页)</span>
            <a-divider type="vertical" />
            <a @click="clearbtn">清空</a>
            <a-divider type="vertical" />
          </template>
          <template v-else>
            <span>未选中任何数据</span>
          </template>
        </template>
      </a-alert>
      <!-- <a-alert message="未选中任何数据" type="info" show-icon /> -->
    </div>
    <!-- :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }" :rowKey="(record) => record.lineId"-->
    <a-table :columns="columns" :data-source="listData"
           :pagination="false" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: rowSelection }"
            :rowKey="(record) => record.id"
           bordered>
           <template #bodyCell="{ column,record }">
            <template v-if="column.dataIndex === 'policiesEnable'">
                    <div v-if='record.policiesEnable == true'
                      style="text-align: center; display: flex;   justify-content: center;  align-items: center;">
                      启用
                    </div>
                    <div v-if='record.policiesEnable == false'
                      style="text-align: center; display: flex;   justify-content: center;  align-items: center;">
                      未启用
                    </div>
                  </template>
        <template v-if="column.dataIndex === 'operation'">
          <!--   -->
                    <div>
                      <span  class="pointer" style="color: #2e7dff; margin-right: 8px">配置策略</span>
                      <!-- confirm点击确认的回调  @confirm="confirm(record)"-->
                      <span class="pointer"  style="color: #2e7dff; margin-right: 8px">停用</span>
                      <span class="pointer"  style="color: #2e7dff; margin-right: 8px">修改</span>
                       <a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="confirm(record)"
                        @cancel="cancel">
                      <span class="pointer"  style="color: #2e7dff; margin-right: 8px">删除</span>
                      </a-popconfirm>
                    </div>
        </template>
          </template>


        </a-table> 
    <!-- 分页 -->
        <div style="padding: 10px; display: flex; justify-content: flex-end">
				<a-pagination
					:show-total="(total) => `共 ${total} 条数据`"
					v-model:current="pageNum"
					:total="total"
					v-model:pageSize="pageSize"
					show-size-changer
					@showSizeChange="onShowSizeChange"
					@change="changeFn"
				/>
			</div> 

  </div>
</template>


<script setup>
import { message,Modal } from 'ant-design-vue';
import { list, listAll,dellist } from './tactics'
import { SmileOutlined, DownOutlined,CloseCircleFilled,ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { SmileTwoTone, PlusCircleOutlined,HeartTwoTone, CheckCircleTwoTone, LeftOutlined, SearchOutlined, ReloadOutlined, PlusOutlined, RestOutlined } from '@ant-design/icons-vue'
import { computed, defineComponent, reactive, toRefs, ref,createVNode } from 'vue';

const columns = [{
  title: '策略组名称',
  dataIndex: 'policiesName',
  width: 220,
  align: 'center'
}, {
  title: '匹配时段',
  dataIndex: 'policiesTimeRange',
  width: 220,
  align: 'center'
}, {
  title: '有效策略数',
  dataIndex: 'content',
  width: 220,
  align: 'center'
},
{
  title: '总策略数',
  dataIndex: 'zoneName',
  width: 220,
  align: 'center'
},
{
  title: '状态',
  dataIndex: 'policiesEnable',
  width: 220,
  align: 'center'

},
{
  title: '操作',
  dataIndex: 'operation',
  width: 250,
  align: 'center'
},
];
const data = reactive({
  listData: '',
  total: 0,
  listAllData: [],
  commonEnty:{},
  number: 0,
  policiesId:'',
});
const {
  listData,
  total,
  listAllData,
  commonEnty,
  number,
  policiesId,
} = toRefs(data)

const Cordquery = ref({
  pageNum: 1,
  pageSize: 10,

})
//列表数据
const getcordList = () => {
  list(Cordquery.value).then(res => {

    console.log(res.records);
    listData.value = res.records
  //   let policiesIdName = listData.value.map(item=>{
  //     return{
  //       value:'item.policiesId'
  //     }
  //   })
  // policiesId.value = policiesIdName
  // console.log(policiesId.value,'id');
   
    total.value = res.total
    console.log(listData.value, '0000');
  })
  // listAll(policiesId)

}
getcordList()

// 分页
const onShowSizeChange = (current, pageSize) => {//pageSize 变化的回调，传入当前页和每页条数
    Cordquery.value.pageSize = pageSize //把pageSize给到响应式的Cordquery
		getcordList();
	};
	const changeFn = (P, Ps) => {//页码或 pageSize 改变的回调，参数是改变后的页码及每页条数
		Cordquery.value.pageNum = P //把获取的页码给到响应式的Cordquery
		getcordList();
	};
// 删除
//   const delFn = async (record) =>{
//      console.log(record,'111');
//     // console.log(record.lineId,'232');
//   commonEnty.value = record;
//   console.log(commonEnty.value,'252');
//   await dellist(commonEnty.value)
//   getcordList()
//   message.success('删除成功')
//   }
//   const confirm = (record) => {
//  console.log(record, 'record2');
//   delFn(record.policiesId)
//   getcordList()
// };

// //多选
// const state = reactive({
// 		selectedRowKeys: [],
// 	});
//  const allclusterId = ref([]);
//   const rowSelection = (selectedRowKeys, selectedRows) =>{
//     state.selectedRowKeys = selectedRowKeys;
// 		console.log(selectedRowKeys, 'allclusterId');
//     allclusterId.value = selectedRows.map((item) => item.id);
// 		number.value = allclusterId.value.length;
//   }
//   const clearbtn = () => {
// 		allclusterId.value = [];
// 		number.value = 0;
// 		state.selectedRowKeys = [];
// 	};



</script>
<style scoped lang="less">
.allclustersBox {
  padding: 10px;
  padding-bottom: 0px;
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
  padding: 12px 10px 13px 10px !important;
}

.controls {
  background: #fff;
  margin: 10px;
  padding: 24px;
}

.title {

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

.select {
  margin: 8px 0px 0px 0px;
}

.iconBtn {
  margin-top: -10px;
}
.pointer {
		cursor: pointer;
	}
</style>
