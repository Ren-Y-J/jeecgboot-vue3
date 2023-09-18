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
  <!-- 添加策略组弹框 -->
  <div>
    <a-modal  v-model:visible="visible_add" title="添加策略组" width="600px"  @ok="handleOk" @cancel="onCloseaclFn" >
        <a-form   name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <!--  -->
          <a-form-item label="策略组名称"  style='margin-top: 26px'>
            <a-input  placeholder="请输入策略组名称" />
          </a-form-item>
          <a-form-item label="策略组名称"  style='margin-top: 26px'>
            <a-button type="primary">配置启用时段</a-button>
            <a-alert message="配置启用时段" type="info" show-icon class="icon"/>
          </a-form-item>
          <!-- :rules="fromaclinfoRules.aclType" -->
          <a-form-item label="启用时段" name="aclType" style='margin-top: 26px'>
            <a-radio-group  @change="changeradioFn">
              <a-radio :value="0">启用</a-radio>
              <a-radio :value="1">停用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
    </a-modal>
  </div>
  <!-- 配置启用时段弹框 -->
  <div>
    <a-modal :scroll="{ x: 'calc(700px + 50%)', y: '510' }" :body-style="modalStyle" v-model:visible="visible_Time" title="配置启用时段" width="600px"  @ok="handleOk" @cancel="onCloseaclFn" >
       <a-form   name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
        <a-form-item label="启用周期" name="aclType" style='margin-top: 26px' class="lable_form">
            <a-radio-group  @change="changeradioFn" class="radio_right">
              <a-radio :value="0">周一</a-radio>
              <a-radio :value="1">周二</a-radio>
              <a-radio :value="0">周三</a-radio>
              <a-radio :value="1">周四</a-radio>
              <a-radio :value="0">周五</a-radio>
              <a-radio :value="1">周六</a-radio>
              <a-radio :value="0">周日</a-radio>
            </a-radio-group>
          </a-form-item>
          <!-- <a-form-item label="时段：" style='margin-top: 26px' ></a-form-item> -->
          <div class="label_text">时段：</div>
          <a-form-item class="form_time" v-for="item in formDataName" :key="item">
              <span >开始时间</span>
              <a-time-picker v-model:value="value" :minute-step="15" :second-step="10" style="margin: 0 10px 0 10px"/>
              <span>结束时间</span>
              <a-time-picker v-model:value="value" :minute-step="15" :second-step="10" style="margin: 0 10px 0 10px"/>
              <plus-circle-filled style="color:#BFBFBF" @click="addIconTime" v-show="item.id == 1"/>
               <close-circle-filled class="Xicon" @click="XiconBtn(item.id)" v-show="item.id!=1"/>
          </a-form-item>
      </a-form>
    </a-modal>
  </div>
  
</template>


<script setup>
import { message,Modal } from 'ant-design-vue';
import { list, listAll,dellist } from './tactics'
import {  SearchOutlined, ReloadOutlined,PlusCircleFilled,CloseCircleFilled  } from '@ant-design/icons-vue'
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
  listData: [],
  total: 0,
  listAllData: [],
  policiesId:{},
  number: 0,
  visible_add:false,
  visible_Time:true,
  formDataName:[{id:1}],
});
const {
  listData,
  total,
  listAllData,
  number,
  policiesId,
  visible_add,
  visible_Time,
  formDataName
} = toRefs(data)

const Cordquery = ref({
  pageNum: 1,
  pageSize: 10,

})
//列表数据
const getcordList = () => {
  list(Cordquery.value).then(res => {
    console.log(res.records,'shuju ');
    listData.value = res.records
    total.value = res.total
    console.log(listData.value, '0000');
  })
  
// const PolicyGroupId = listData.value.map(item=>item.policiesId)
// console.log(PolicyGroupId,'123');
}
getcordList()


// const geilistAll = () =>{
//   listAll(PolicyGroupId.value).then(res=>{
//     console.log(res,'geilistAll');
//   })
// }
// geilistAll()

// 添加策略组按钮
const addTactics =()=>{
  visible_add.value = true
}
// 分页
const onShowSizeChange = (current, pageSize) => {//pageSize 变化的回调，传入当前页和每页条数
    Cordquery.value.pageSize = pageSize //把pageSize给到响应式的Cordquery
		getcordList();
	};
	const changeFn = (P, Ps) => {//页码或 pageSize 改变的回调，参数是改变后的页码及每页条数
		Cordquery.value.pageNum = P //把获取的页码给到响应式的Cordquery
		getcordList();
	};

//点击配置启用时段的添加时间图标
  const addIconTime = ()=>{
      formDataName.value.push({
      id:new Date().getTime()
    })
  }
  
  //点击第二个弹框的取消按钮
  const modalStyle = ref({
  height:'450px',
  overflowY: 'auto',
})
   const XiconBtn = (id) => {
		// addRecord.value = false;
    console.log(id);
    // if(id === 1){
    //   delicon.value = false
    // }
    formDataName.value = formDataName.value.filter(item=>{
      return item.id != id
    })
    // if(formDataName.value.length == 1){
    //   modalStyle.value.height = '450px'
    // }
    
    // console.log(formDataName.value );

    // forEach(item=>{
    //   if(item.id == id){
    //     formDataName.value.splice
    //   }
    // })
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
  width: 600px;
  margin-left: 100px;
   /deep/ .ant-form-item-control-input{
  width: 600px;
}
}


</style>
