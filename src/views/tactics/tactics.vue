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
      <a-button :style="{ margin: '0px 8px 0px 0px ' }" type="primary" @click="addTactics"
        ><plus-outlined />添加策略组</a-button>
      <a-button :style="{ margin: '0px 8px ' }" type="primary" ><edit-outlined />修改策略组</a-button>
      <a-button :style="{ margin: '0px 8px ' }" type="primary" @click="handlChangeFn"><delete-outlined />删除策略组</a-button>
      <a-button :style="{ margin: '0px 8px ' }" type="primary" @click="synOK"><reload-outlined />同步策略组</a-button>
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
  <!-- 添加策略组弹框 -->
  <div>
    <a-modal  v-model:visible="visible_add" title="添加策略组" width="600px" style="top:200px" @ok="Policyadd">
        <a-form  :model="formState"  name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <!--  -->
          <a-form-item label="策略组名称"  style='margin-top: 26px' name="policiesName">
            <a-input v-model:value="formState.policiesName" placeholder="请输入策略组名称" />
          </a-form-item>
          <a-form-item label="启用时段"  style='margin-top: 26px'>
            <a-button type="primary" @click="addTime">配置启用时段</a-button>
            <a-alert message="配置启用时段" type="info" show-icon class="icon"/>
          </a-form-item>
          <!-- :rules="fromaclinfoRules.aclType" -->
          <a-form-item label="启用状态" name="aclType" style='margin-top: 26px'>
            <a-radio-group v-model:value="formState.policiesEnable" name="policiesEnable" @change="changeradioFn">
              <a-radio value="0">启用</a-radio>
              <a-radio value="1">停用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
    </a-modal>
  </div>
  <!-- 配置启用时段弹框 -->
  <div>
    <a-modal cancelText="重置" :scroll="{ x: 'calc(700px + 50%)', y: '510' }" :body-style="modalStyle" style="top:200px"
    v-model:visible="visible_Time" title="配置启用时段" width="600px" @ok="handleadd">
       <a-form  :model="formState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
        <a-form-item label="启用周期" name="aclType" style='margin-top: 26px' class="lable_form">
            <a-radio-group v-model:value="formState.policiesTimeType	" name="policiesTimeType	" @change="changeradioFn" class="radio_right">
              <a-radio value="0">周一</a-radio>
              <a-radio value="1">周二</a-radio>
              <a-radio value="2">周三</a-radio>
              <a-radio value="3">周四</a-radio>
              <a-radio value="4">周五</a-radio>
              <a-radio value="5">周六</a-radio>
              <a-radio value="6">周日</a-radio>
            </a-radio-group>
          </a-form-item>
          <!-- <a-form-item label="时段：" style='margin-top: 26px' ></a-form-item> -->
          <div class="label_text">时段：</div>
          <a-form-item class="form_time" name="policiesTimeRange" v-model:value="formState.policiesTimeRange"  v-for="item in formDataName" :key="item">
              <span >开始时间</span>
              <!-- <a-form-item-rest> -->
              <a-time-picker  v-model:value="formState.policiesTimeRange.state_value" value-format="HH:mm:ss" :minute-step="15" :second-step="10" style="margin: 0 10px 0 10px" @change="getstart"/>
              <!-- </a-form-item-rest> -->
              <span>结束时间</span>
              <!-- <a-form-item-rest> -->
              <a-time-picker v-model:value="formState.policiesTimeRange.end_value" value-format="HH:mm:ss" :minute-step="15" :second-step="10" style="margin: 0 10px 0 10px" @change="getstart"/>
              <!-- </a-form-item-rest> -->
              <plus-circle-filled style="color:#BFBFBF" @click="addIconTime" v-show="item.id == 1"/>
               <close-circle-filled class="Xicon" @click="XiconBtn(item.id)" v-show="item.id!=1"/>
          </a-form-item>
      </a-form>
    </a-modal>
  </div>
  <!-- 同步策略组弹框 -->
  <div>
    <a-modal  style="top:200px" v-model:visible="visible_syn" title="同步策略组" width="600px"  @ok="syncGroup" >
        <a-form  name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
        <div class="synOK">确定同步策略组？</div>
        </a-form>
    </a-modal>
  </div>
  
</template>


<script setup>
import { message,Modal } from 'ant-design-vue';
import { list,dellist,synclist,addlist } from './tactics'
import {  SearchOutlined, ReloadOutlined,PlusCircleFilled,CloseCircleFilled  } from '@ant-design/icons-vue'
import { computed, defineComponent, reactive, toRefs, ref,createVNode,watch  } from 'vue';

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
  dataIndex: 'num_sta',
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
  listData: [],
  total: 0,
  listAllData: [],
  policiesId:{},
  number: 0,
  visible_add:false,
  visible_Time:false,
  visible_syn:false,
  formDataName:[{id:1}],
  formState:{
    policiesName:'',
    policiesEnable:'',
    policiesTimeType:[],
    policiesTimeRange:[{
      state_value:'',
      end_value:''
    }]
  },
  
});
const {
  listData,
  total,
  listAllData,
  number,
  policiesId,
  visible_add,
  visible_Time,
  visible_syn,
  formDataName,
  formState,
 
} = toRefs(data)

const Cordquery = ref({
  pageNum: 1,
  pageSize: 10,

})
//列表数据
const getcordList = () => {
  list(Cordquery.value).then(res => {
    // console.log(res,'shuju ');
    listData.value = res.records
    total.value = res.total
    let status_able = listData.value.map(item=>item.policiesEnable)
    // console.log(status_able,'1254');
    // console.log(listData.value, '0000');
  })
  

}
getcordList()

let formData = []
// 添加策略组按钮
const addTactics =()=>{
  visible_add.value = true

}

// 配置启用时段按钮
const addTime = ()=>{
  visible_Time.value = true
}
const getstart = ()=>{//通过change事件获取到的时间
  // console.log(formState.value.policiesTimeRange.state_value,'sj');
  let startTime = formState.value.policiesTimeRange
  console.log(startTime,'111');
}
// 添加策略组确定按钮
const Policyadd = ()=>{
  visible_add.value = false
  // console.log(formState.value.policiesTimeRange,'时间');
  formData.push(formState.value.policiesName,formState.value.policiesEnable)
  // console.log(formData,'数据');
  addlist(formData).then((res=>{
    console.log(res,'ann ');
  }))

}
// 启用时段确定按钮
const handleadd = ()=>{
   visible_Time.value = false
   formData.push(startTime)
}

// 同步策略组按钮
const synOK = ()=>{
  visible_syn.value = true
}
// 同步策略组确定按钮v
const syncGroup =()=>{
  synclist().then(res=>{
     message.success('同步成功')
  })
   visible_syn.value = false
}
// 分页v
const onShowSizeChange = (current, pageSize) => {//pageSize 变化的回调，传入当前页和每页条数
    Cordquery.value.pageSize = pageSize //把pageSize给到响应式的Cordquery
		getcordList();
	};
	const changeFn = (P, Ps) => {//页码或 pageSize 改变的回调，参数是改变后的页码及每页条数
		Cordquery.value.pageNum = P //把获取的页码给到响应式的Cordquery
		getcordList();
	};

  //配置启用时段的弹框滚动条和高度v
  const modalStyle = ref({
  height:'230px',
  overflowY: 'auto',
  overflowX:'hidden'
})

//点击配置启用时段的添加时间图标v
  const addIconTime = ()=>{
      formDataName.value.push({
      id:new Date().getTime()
    })
  }
  
// 配置启用时段删除时间图标v
   const XiconBtn = (id) => {
    console.log(id);
    formDataName.value = formDataName.value.filter(item=>{
      return item.id != id
    })
	};

// 删除

// const delFn = async (record) =>{
//   console.log(record,"shuju ");
// id已经获取到，没有传进去
//   policiesId.value = record
//   // console.log(policiesId,'idn');
//   await dellist()
//   getcordList()
//   message.success('删除成功')
 
// }
//  const confirm = (record) => {
// //  console.log(record, 'record2');
//  let dataId = record.policiesId
// //  console.log(dataId,'id');
//   delFn(dataId)
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
  .icon{
    background-color: #fff;
    border: #fff;
   display: inline-flex;
  ::v-deep(.ant-alert-icon){
    color: #E7785F!important;
    margin-left: 30px!important;
  }
  /deep/ .ant-alert-message{
    color: #E7785F;
  }
  }
.lable_form{
  /deep/ .ant-form-item-label > label {
    align-items: start;
  }
}
.radio_right{
  .ant-radio-wrapper{
    margin-right: 18px;
  }
}
.label_text{
  margin-left: 90px;
}
.form_time{
  width: 400px;
  margin-left: 100px;
   /deep/ .ant-form-item-control-input{
  width: 600px;
}
}
.synOK{
  font-size: 18px;
  text-align: center;
  margin: 30px;
}

</style>
