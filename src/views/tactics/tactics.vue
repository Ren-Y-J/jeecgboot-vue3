<template>
  <div class="allclustersBox">
    <a-card>
      <div class="title">
        <a-form :model="formData" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
          <a-row :gutter="1">
            <a-col :md="6" :sm="24">
              <a-form-item style="margin-bottom: 0px" label="策略组名称" name="name" :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 16 }">
                <a-input placeholder="请输入策略组名称" v-model:value="formData.policiesName"/>
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
      <a-button :style="{ margin: '0px 8px ' }" type="primary" @click="deleteGroup"><delete-outlined />删除策略组</a-button>
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
    </div>
 <!-- 列表数据 -->
    <div>
      <a-table :columns="columns" :data-source="listData"
            :pagination="false" :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }"
            :rowKey="(record) => record.policiesId"
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
                    <!--  操作 -->
                <template v-if="column.dataIndex === 'operation'">
                    <div>
                      <span  class="pointer" style="color: #2e7dff; margin-right: 8px">配置策略</span>
                      <span class="pointer"  style="color: #2e7dff; margin-right: 8px" v-if='record.policiesEnable == true' @click="stopService(record)">停用</span>
                      <span class="pointer"  style="color: #2e7dff; margin-right: 8px" v-if='record.policiesEnable == false' @click="enable(record)">启用</span>
                      <span class="pointer"  style="color: #2e7dff; margin-right: 8px" @click="editGroup(record)">修改</span>
                      <a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="confirm(record)" @cancel="cancel">
                      <span class="pointer"  style="color: #2e7dff; margin-right: 8px">删除</span>
                      </a-popconfirm>
                    </div>
                </template>
            </template>
        </a-table> 
    </div>
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
        <a-form ref='formRef' :model="formState"  name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <a-form-item label="策略组名称" :rules="[{ required: true, message: '请输入策略组名称!' }]" style='margin-top: 26px' name="policiesName">
            <a-input v-model:value="formState.policiesName" placeholder="请输入策略组名称" />
          </a-form-item>
          <a-form-item label="启用时段"  style='margin-top: 26px'>
            <a-button type="primary" @click="addTime">配置启用时段</a-button>
            <a-alert message="配置启用时段" type="info" show-icon class="icon"/>
          </a-form-item>
          <a-form-item label="启用状态" :rules="[{ required: true, message: '请选择启用状态!' }]" name="policiesEnable" style='margin-top: 26px'>
            <a-radio-group v-model:value="formState.policiesEnable"  @change="changeradioFn">
              <a-radio :value="true">启用</a-radio>
              <a-radio :value="false">停用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
    </a-modal>
  </div>
  <!-- 配置启用时段弹框 -->
  <div>
    <a-modal   :scroll="{ x: 'calc(700px + 50%)', y: '510' }" :body-style="modalStyle" style="top:200px"
    v-model:visible="visible_Time" title="配置启用时段" width="600px" @ok="handleadd" @cancel="reset">
       <a-form ref='formRef' :model="formState" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
        <a-form-item label="启用周期" name="policiesTimeType" style='margin-top: 26px' class="lable_form" :rules="[{ required: true, message: '请选择启用周期!' }]" >
          <a-checkbox-group v-model:value="formState.policiesTimeType"  style="width: 100%" @change="checkboxTime" class="radio_right">
            <a-row>
              <a-col :span="5">
                <a-checkbox value="1">周一</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="2">周二</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="3">周三</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="4">周四</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="5">周五</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="6">周六</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="7">周日</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
          </a-form-item>
          <div class="label_text">时段：</div>
          <a-form-item class="form_time" name="policiesTimeRange"  v-for="item in formDataName" :key="item" >
             <a-time-range-picker v-model:value="item.state_value" value-format="HH:mm:ss" :placeholder='placeholder' />
              <div class="addtimeform">
                <plus-circle-filled style="color:#BFBFBF" @click="addIconTime" v-show="item.id == 1" />
                <close-circle-filled class="Xicon" @click="XiconBtn(item.id)" v-show="item.id!=1"/>
              </div>
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

   <!-- 修改策略组弹框 -->
  <div>
    <a-modal  v-model:visible="visible_editsyn" title="修改策略组" width="600px" style="top:200px" @ok="Policyedit">
        <a-form  :model="formState_edit"  name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <a-form-item label="策略组名称"  style='margin-top: 26px' name="policiesName">
            <a-input v-model:value="formState_edit.policiesName" placeholder="请输入策略组名称" />
          </a-form-item>
          <a-form-item label="启用时段"  style='margin-top: 26px'>
            <a-button type="primary" @click="addTime_edit">配置启用时段</a-button>
            <a-alert message="配置启用时段" type="success" show-icon class="icon_edit"/>
          </a-form-item>
          <a-form-item label="启用状态" name="aclType" style='margin-top: 26px'>
            <a-radio-group v-model:value="formState_edit.policiesEnable" name="policiesEnable" @change="changeradioFn">
              <a-radio :value="true">启用</a-radio>
              <a-radio :value="false">停用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
    </a-modal>
  </div>
  <!-- 修改策略组的配置时段 -->
   <div>
    <a-modal   :scroll="{ x: 'calc(700px + 50%)', y: '510' }" :body-style="modalStyle" style="top:200px"
    v-model:visible="visible_Time_edit" title="修改策略组" width="600px" @ok="edit_time" >
       <a-form  :model="formState_edit" name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }"
          autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
        <a-form-item label="启用周期" name="aclType" style='margin-top: 26px' class="lable_form">
          <a-checkbox-group v-model:value="formState_edit.policiesTimeType" name="policiesTimeType" style="width: 100%" @change="checkboxTime" class="radio_right">
            <a-row>
              <a-col :span="5">
                <a-checkbox value="1">周一</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="2">周二</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="3">周三</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="4">周四</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="5">周五</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="6">周六</a-checkbox>
              </a-col>
              <a-col :span="5">
                <a-checkbox value="7">周日</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
          </a-form-item>
          <div class="label_text">时段：</div>
          <a-form-item class="form_time" name="policiesTimeRange"  v-for="item in formDataName_edit" :key="item" >
             <a-time-range-picker v-model:value="item.state_value" value-format="HH:mm:ss" :placeholder='placeholder'  />
              <div class="addtimeform">
                <plus-circle-filled style="color:#BFBFBF" @click="addIconTime" v-show="item.id == 1" />
                <close-circle-filled class="Xicon" @click="XiconBtn(item.id)" v-show="item.id!=1"/>
              </div>
          </a-form-item>
      </a-form>
    </a-modal>
  </div>
  
</template>


<script setup>
import dayjs from 'dayjs';
import moment from 'moment';
import { message,Modal } from 'ant-design-vue';
import { list,dellist,synclist,addlist,dellistAll,editlist,BackLine } from './tactics'
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
  dataIndex: 'validPolicyNum',
  width: 220,
  align: 'center'
},
{
  title: '总策略数',
  dataIndex: 'totalPolicyNum',
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
  policiesId:'',
  ids:[],
  number: 0,
  visible_add:false,
  visible_Time:false,
  visible_syn:false,
  visible_editsyn:false,
  visible_Time_edit:false,
  formDataName:[{id:1,state_value:''}],
  formDataName_edit:[{id:1,state_value:''}
  //   {id:1,state_value:[
  //   '12:00:00','13:00:00'
  // ]},{id:1,state_value:[
  //   '12:00:00','13:00:00'
  // ]}
  ],
  formName:{
     policiesName:'',
  },
  formState:{
    policiesName:'',
    policiesEnable:'',
    policiesTimeType:[],
    policiesTimeRange:[]
  },
   formState_edit:{
    policiesName:'',
    policiesEnable:'',
    policiesTimeType:[],
    policiesTimeRange:[


    ]
  },
  formData:{
    policiesName:'',
    policiesEnable:'',
    policiesTimeType:[],
    policiesTimeRange:[]
  },
  enable_edit:{
    policiesId:'',
    policiesEnable:'',
  },
   enable_start:{
    policiesId:'',
    policiesEnable:'',
  },
  timecycle:[],
  pageNum: 1,
	pageSize: 10,
  status_false:''
});
const {
  listData,
  total,
  listAllData,
  number,
  policiesId,
  ids,
  visible_add,
  visible_Time,
  visible_syn,
  visible_editsyn,
  formDataName,
  formDataName_edit,
  enable_edit,
  formState,
  formState_edit,
  enable_start,
  visible_Time_edit,
  policiesTimeRange,
  formData,
  timecycle,
  pageNum,
	pageSize, 
  status_false
} = toRefs(data)

const formRef = ref(null);//添加按钮弹框需要的ref

const Cordquery = ref({
  pageNum: 1,
  pageSize: 10,
})
const placeholder = ref(['开始时间', '结束时间'])
const timePicker = ref(null)
//列表数据v
const getcordList = () => {
  list(Cordquery.value).then(res => {
    listData.value = res.records
    total.value = res.total
  })
}
getcordList()

// 修改按钮
const editGroup = (record)=>{
  visible_editsyn.value = true
  BackLine(record.policiesId).then((res)=>{//回显接口
  console.log(res,'res');
  formState_edit.value.policiesId = res.policiesId
  formState_edit.value.policiesName = res.policiesName
  formState_edit.value.policiesEnable = res.policiesEnable
  formState_edit.value.policiesTimeType = JSON.parse(res.policiesTimeType)
  formState_edit.value.policiesTimeType = formState_edit.value.policiesTimeType.map(String)
 

  formState_edit.value.policiesTimeRange = res.policiesTimeRange.replace(/[\[\]"]/g, '').split('-').join(',')
  
  // //  formDataName_edit.value.state_value = formState_edit.value.policiesTimeRange
  // console.log(formState_edit.value.policiesTimeRange,'formState_edit.value.policiesTimeRange');
  let editpoliciesTime = []
  editpoliciesTime.push(formState_edit.value.policiesTimeRange)
console.log(editpoliciesTime,'editpoliciesTime');
  let transformedA = editpoliciesTime[0].split(',').map(item => item.trim());
  // let transformedA = editpoliciesTime.map(item => item.split(',').slice(0, 2).join(','));
    formDataName_edit.value.forEach((item)=>{
    item.state_value = transformedA
  })
  console.log(transformedA,'editpoliciesTime222222');
  })
}

// 停用按钮
const stopService = (record)=>{
  record.policiesEnable = false
  enable_edit.value.policiesId = record.policiesId
  enable_edit.value.policiesEnable = record.policiesEnable
editlist(enable_edit.value).then((res)=>{
    message.success("停用成功")
    getcordList()
})

}

// 启用按钮
const enable = (record)=>{
  record.policiesEnable = true
  enable_start.value.policiesId = record.policiesId
  enable_start.value.policiesEnable = record.policiesEnable
editlist(enable_start.value).then((res)=>{
    message.success("启用成功")
    getcordList()
})

}

// 修改时段确定按钮
const edit_time = ()=>{
    visible_Time_edit.value = false
    let dif_time = ''
    let editpoliciesTime = []
    // console.log(formDataName_edit.value,'formDataName_edit.value');
   formDataName_edit.value.forEach(item=>{   
     dif_time =item.state_value.toString()
     console.log(dif_time,'dif_time');
    let comma = dif_time.split(',')
    let comma_join = comma.join('-')
    editpoliciesTime.push(comma_join)
    formState_edit.value.policiesTimeRange = editpoliciesTime
    })
}

// 修改弹框确定按钮
const Policyedit = ()=>{
    editlist(formState_edit.value).then((res)=>{
      message.success('修改成功')
      getcordList()
    })
    visible_editsyn.value = false
}

//点击页面搜索按钮v
const handleQuery =()=>{
  list({
    pageNum: pageNum.value,
		pageSize: pageSize.value,
    policiesName:formData.value.policiesName,//获取响应式记录名称
  }).then((res)=>{
    listData.value = res.records//把数据给到存放表单的数组中
    pageNum.value = 1;
    total.value = res.total;//总数
  })
}

//重置按钮，把数据初始化v
const AlldelFn = () => {
  // console.log('1');
  formState.value.policiesName = ''
  Cordquery.value.pageNum = 1
  Cordquery.value.pageSize = 10
  getcordList()//刷新数据
}

// 添加策略组按钮v
const addTactics =()=>{
  visible_add.value = true
  clearData()//清空表单数据
}

// 配置启用时段按钮v
const addTime = ()=>{
  visible_Time.value = true
   placeholder.value = ['开始时间', '结束时间']
}
 
// 修改启用时段按钮v
const addTime_edit = ()=>{
  visible_Time_edit.value = true

}

// 添加策略组确定按钮v
const Policyadd = async()=>{
   try {
    await formRef.value.validate()
  } catch (error) {
    return console.log(error)
  }
  visible_add.value = false
  //给需要传的数据赋值
  formState.value.policiesTimeType = timecycle.value
  formData.value.policiesName = formState.value.policiesName
  formData.value.policiesEnable = formState.value.policiesEnable
  formData.value.policiesTimeType = formState.value.policiesTimeType
  formData.value.policiesTimeRange = formState.value.policiesTimeRange
  // 调用添加策略组接口
  // console.log(formData.value,'formData.value');
  addlist(formData.value).then((res=>{
    message.success("添加成功")
    getcordList()
  }))
 clearData()//清空表单数据
}

// 所有数据清空v
const clearData = () => {
	formData.value.policiesName = ''
  formData.value.policiesEnable = ''
  formData.value.policiesTimeType = []
  formData.value.policiesTimeRange = []
  formState.value.policiesName = ''
  formState.value.policiesEnable = ''
  formState.value.policiesTimeType = []
  formState.value.policiesTimeRange = []
  formDataName.value.forEach((item)=>{
    item.state_value = ''
  })
  timecycle.value = []
  placeholder.value = ['开始时间', '结束时间']
	};

//多选框内的选择的值，change事件v
const checkboxTime = (value)=>{
    timecycle.value = value
}

// 启用时段确定按钮v
const handleadd =async ()=>{
    try {
    await formRef.value.validate()
  //  await formRef_.value.validate()
  } catch (error) {
    // console.log(error);
    return console.log(error)
  }
  visible_Time.value = false
  let arrTime =''
  let policiesTime = []//获取的时间段的数组
  console.log(formDataName.value,'formDataName.value');
  let strCancel = formDataName.value.forEach(item=>{//数据是对象包数组的形式，遍历里面的每一项
  arrTime =item.state_value.toString()//用toString()转成字符串形式
  let arrToStr = arrTime.split(',')//逗号分隔
  let convertedTimeString  = arrToStr.join('-')//按照指定分隔符分割
  policiesTime.push(convertedTimeString) //push没有返回值，let变量需要在遍历之前；
  formState.value.policiesTimeRange = policiesTime
  })
}

// 启用时段重置按钮v
const reset = ()=>{
  formRef.value.resetFields()//触发表单验证
  formState.value.policiesTimeType = []
  formState.value.policiesTimeRange = []
  formDataName.value.forEach((item)=>{
    item.state_value = ''
  })
  // formDataName.value.state_value = []
  timecycle.value = []
  placeholder.value = ['开始时间', '结束时间']
}

// 同步策略组按钮v
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
  const addIconTime = ()=>{//添加时段
      formDataName.value.push({
      id:new Date().getTime()
    }),
    formDataName_edit.value.push({//修改时段
      id:new Date().getTime()
    })
  }
  
// 配置启用时段删除时间图标v
   const XiconBtn = (id) => {
    formDataName.value = formDataName.value.filter(item=>{
      return item.id != id
    })
    formDataName_edit.value = formDataName_edit.value.filter(item=>{
      return item.id != id
    })
	};

// 删除按钮v
const confirm = (record)=>{
  policiesId.value = record.policiesId
  console.log(policiesId.value,'id');
  dellist({
     policiesId:policiesId.value
   }).then((res)=>{
    message.success('删除成功')
    getcordList()
  })
}

//多选v
const state = reactive({
		selectedRowKeys: [],
	});
  const rowSelection = (selectedRowKeys, selectedRows) =>{
    state.selectedRowKeys = selectedRowKeys;
    ids.value = selectedRows.map((item) => item.policiesId);
		number.value = ids.value.length;
  }
  const clearbtn = () => {
		ids.value = [];
		number.value = 0;
		state.selectedRowKeys = [];
	};
// 批量删除策略组v
const deleteGroup = ()=>{
  // console.log(ids.value,'111');
  if(ids.value.length == 0){
    message.error('请勾选需要删除的策略组')
  }
  else{
	dellistAll(ids.value).then((res)=>{
	    // console.log(res,'shanchu');
	     number.value = 0
	    message.success('删除成功')
	    getcordList()
	  })
	}  
  }



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
  margin: 8px 0px 10px 0px;
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

.addtimeform{
  display: inline;
  margin-left: 30px;
}

.label_text{
  margin-left: 90px;
}
.form_time{
  width: 400px;
  margin-left: 100px;
   /deep/ .ant-form-item-control-input{
  width: 450px;
  margin-left: 30px;
}
}
.synOK{
  font-size: 18px;
  text-align: center;
  margin: 30px;
}
.icon_edit{
 
 
  display: inline-flex;
  ::v-deep(.ant-alert-icon){
    color: #2BDC70!important;
    margin-left: 30px!important;
  }
  /deep/ .ant-alert-message{
    color: #2BDC70;
  }
}
 /deep/ .ant-alert-success{
  background-color: #fff!important;
  border: #fff!important;
  }

</style>
