<template>
    <div class="allclustersBox">
      <a-card>
        <div class="title">
          <a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
            <a-row :gutter="1">
              <a-col :md="6" :sm="24">
                <a-form-item style="margin-bottom: 0px;" label="记录名称" name="name" :labelCol="{ span: 6 }"
                  :wrapperCol="{ span: 16 }">
                  <a-input  placeholder="请输入记录名称" v-model:value="queryParams.name"/>
                </a-form-item>
              </a-col>
              <a-col :md="3" :sm="24" >
                <a-form-item style="margin-bottom: 0px;" label="类型" name="type" :labelCol="{ span: 7 }" 
                  :wrapperCol="{ span: 10 }" v-model:value="queryParams.type" >
                  <a-space>
                    <a-select ref="select"  style="width: 130px" @focus="focus" placeholder="请选择" 
                      @change="handleChange"  v-model:value="queryParams.type">
                      <a-select-option value="0">A</a-select-option>
                      <a-select-option value="1">AAAA</a-select-option>
                      <a-select-option value="2">CNAME</a-select-option>
                      <a-select-option value="3">NS </a-select-option>
                      <a-select-option value="4">MX </a-select-option>
                      <a-select-option value="5">CAA </a-select-option>
                      <a-select-option value="6">SRV </a-select-option>
                      <a-select-option value="7">TXT </a-select-option>
                      <a-select-option value="8">PTR </a-select-option>
                      <a-select-option value="9">反向域的NS</a-select-option>
                      <a-select-option value="10">GENERATE</a-select-option>
                      
                    </a-select>
                  </a-space>
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
        <div class="batch">
          <a-space>
						<a-select ref="select" style="width: 120px; margin-right: 8px" @focus="focus" @select="handlChangeFn" v-model="delselect" placeholder="批量操作">
							<a-select-option value="0">删除</a-select-option>
						</a-select>
					</a-space>
            <span class="btn">
                <a-button type="primary" @click="showModal">添加</a-button>
            </span>
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
        <!-- table表格 -->
        <div class="table">
           <span style="margin-left: 8px"></span>
            <a-table :scroll="{ x: 'calc(700px + 50%)', y: 510 }" :pagination="false" bordered
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }"
                :rowKey="(record) => record.id"
                :columns="columns"
                :data-source="listData" >
               <!-- 操作 -->
               <template #bodyCell="{ column,record }">
                  <template v-if="column.dataIndex === 'status'">
                    <div v-if="record.status == 1 || record.status == null"
                      style="text-align: center; display: flex;   justify-content: center;  align-items: center;">
                      <a-tag color="green">已启用</a-tag>
                    </div>
                    <div v-if='record.status == 0'
                      style="text-align: center; display: flex;   justify-content: center;  align-items: center;">
                      <a-tag color="green">禁用</a-tag>
                    </div>
                  </template>
                  <template v-if="column.dataIndex === 'operation'">
                    <div v-if="record.type != 10 ">
                      <span @click="openmodal(record)" class="pointer" style="color: #2e7dff; margin-right: 8px">修改</span>
                      <a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="confirm(record)"
                        @cancel="cancel">
                      <span class="pointer"  style="color: #2e7dff; margin-right: 8px">删除</span>
                      </a-popconfirm>
                    </div>
                  </template> 
                <template v-if="column.dataIndex === 'type'">
                    <span v-show='record.type == 0'>A</span>
                    <span v-show='record.type == 1'>AAAA </span>
                    <span v-show='record.type == 2'>CNAME </span>
                    <span v-show='record.type == 3'>NS </span>
                    <span v-show='record.type == 4'>MX </span>
                    <span v-show='record.type == 5'>CAA </span>
                    <span v-show='record.type == 6'>SRV </span>
                    <span v-show='record.type == 7'>TXT </span>
                    <span v-show='record.type == 8'>PTR </span>
                    <span v-show='record.type == 9'>反向域的NS</span>
                    <span v-show='record.type == 10'>GENERATE</span>
              </template>
              <!-- 线路 -->
					<template v-if="column.dataIndex === 'lineName'">
						<div style="display: flex; justify-content: center; align-items: center">
							<div v-for="(item, index) in record.lineName" :key="index" class="iplist_data" style="margin-right: 10px">
								<span> {{ item }} </span>
							</div>
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
    <!-- 添加记录弹窗 -->
   <div class="addlist">
      <a-modal class="mydialog"  :scroll="{ x: 'calc(700px + 50%)', y: '510' }" style="top: 100px" :body-style="modalStyle" v-model:visible="visible" title="添加记录" width="900px" @ok="addFn" @cancel="onClose">
        <a-form ref='formRef' :model="formState"  :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <a-form-item label="域名" :rules="[{ required: true }]"   style='margin-top: 26px' >
            <a-space>
              <a-select ref="select" style="width: 245px" @focus="focus" placeholder="请选择域名"  v-model:value="formState.zoneId" 
                 @change="changeNames" :options="listAllData" >
              </a-select>
            </a-space>
          </a-form-item>
          <div class="line"  v-for="(item,index) in formDataName" :key="index">
            <div  style="padding: 15px;padding-bottom:0px;margin-bottom:-30px">
				      <close-circle-filled class="Xicon" @click="XiconBtn(index)" v-if="item.id !== '1'"/>
            </div>
              <a-form-item label="记录名称"  :rules="[{ required: true}]"  style='margin-top: 18px'>
                <a-input @change="chengeInput" v-model:value="item.name" placeholder="请输入记录名称" style='width:50%' />
              </a-form-item>
              <a-form-item label="类型" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }" :rules="[{ required: true }]"  style='margin-top: 0px'>
              <a-radio-group v-model:value="item.type" >
              <a-radio value="0">A</a-radio>
              <a-radio value="1">AAAA</a-radio>
              <a-radio value="2">CNAME </a-radio>
              <a-radio value="3">NS</a-radio>
              <a-radio value="4">MX </a-radio>
              <a-radio value="5">CAA </a-radio>
              <a-radio value="6">SRV </a-radio>
              <a-radio value="7">TXT </a-radio>
              </a-radio-group>
              </a-form-item>
              <a-form-item label="记录值" :rules="[{ required: true }]"  style='margin-top: 18px'>
                <a-input v-model:value="item.content" placeholder="请输入记录值" style='width:50%' />
              </a-form-item>
              <a-form-item label="TTL" :rules="[{ required: true}]" style='margin-top: 18px'>
                <a-input-number  :parser="(value) => value.replace(/\D/g, '')" precision="0"
							    min="1" style="width:50%" placeholder="请输入大于0的TTL" v-model:value="item.ttl" >
                </a-input-number>
              </a-form-item>
              <a-form-item label="线路" :rules="[{ required: true }]"  style='margin-top: 18px'>
                <a-space>
              <a-select placeholder="请选择线路"  v-model:value="item.lineId" style="width: 150px" mode="multiple"
                @focus="focus" @change="handleChangsortadd" :options="groupData"  :size="size" :field-names="{ label: 'lineName', value: 'lineId' }">
              </a-select>
              </a-space>
              </a-form-item>
          </div>
          </a-form>
          <div class="Addrecord line" style="margin-bottom: 10px"  @click="addRecordBtn">
            <div class="addtimeform">
              <plus-circle-outlined />
            </div>
            <span >添加记录</span>
          </div>
      </a-modal>
   </div>
   <!-- 修改弹框 -->
   <div class="dellist" >
      <a-modal  v-model:visible="visible_edit" title="记录修改" width="900px"  @ok="editOK" >
        <a-form ref='formRef' :model="formState_edit"  :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <a-form-item label="域名" :rules="[{ required: true, message:'请选择域名' }]"  name="zoneId" style='margin-top: 26px' >
            <a-space>
              <a-select placeholder="请选择域名" ref="select" v-model:value="formState_edit.zoneId" style="width: 245px"
                @focus="focus" @change="changeName_edit" :options="listAllData">
                
              </a-select>
            </a-space>
          </a-form-item>
          <div >
              <a-form-item label="记录名称" :rules="[{ required: true, message: '请输入记录名称!' }]" name="name" style='margin-top: 18px'>
                <a-input v-model:value="formState_edit.name" placeholder="请输入记录名称" style='width:50%' />
              </a-form-item>
              <a-form-item label="类型" :labelCol="{ span: 4 }"  :wrapperCol="{ span: 18 }" 
              :rules="[{ required: true, message: '请选择类型!' }]" name="type" style='margin-top: 0px'>
            <a-radio-group v-model:value="formState_edit.type"  >
              <a-radio value="0">A</a-radio>
              <a-radio value="1">AAAA</a-radio>
              <a-radio value="2">CNAME </a-radio>
              <a-radio value="3">NS</a-radio>
              <a-radio value="4">MX </a-radio>
              <a-radio value="5">CAA </a-radio>
              <a-radio value="6">SRV </a-radio>
              <a-radio value="7">TXT </a-radio>
            </a-radio-group>
          </a-form-item>
              <a-form-item label="记录值" :rules="[{ required: true, message: '请输入记录值!' }]" name="content" style='margin-top: 18px'>
                <a-input v-model:value="formState_edit.content" placeholder="请输入记录值" style='width:50%' />
              </a-form-item>
              <a-form-item label="TTL" :rules="[{ required: true, message: '请输入TTL!' }]" name="ttl" style='margin-top: 18px'>
                <a-input v-model:value="formState_edit.ttl" placeholder="请输入TTL" style='width:50%' />
              </a-form-item>
              <a-form-item label="线路" :rules="[{ required: true, message: '请选择线路!' }]" name="lineId" style='margin-top: 18px'>
                <a-space>
              <a-select placeholder="请选择线路" ref="select" v-model:value="formState_edit.lineId" style="width: 225px"
                @focus="focus"  :options="groupData_edit" mode="multiple" :size="size" :field-names="{ label: 'lineName', value: 'lineId' }">
              </a-select>
            </a-space>
              </a-form-item>
              </div>
              </a-form>
      </a-modal>
   </div>
   <!-- 修改弹框 -->
   <a-modal v-model:visible="edit_visible" title="编辑" @ok="handleOk_edit">
		<a-form
			style="margin-top: 10px"
			ref="formRef"
			:model="formState_edit_type"
			name="basic"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 20 }"
			autocomplete="off"
			validateTrigger="blur"
		>
			<a-form-item label="记录名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="记录名称" v-model:value="formState_edit_type.name" />
			</a-form-item>

			<a-form-item label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-radio-group v-model:value="formState_edit_type.type" style="width: 100%">
					<a-radio value="9">反向域的NS</a-radio>
					<a-radio value="8">PTR</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="线路发布" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-select
					v-model:value="formState_edit_type.lineId"
					mode="multiple"
					style="width: 100%"
					placeholder="请选择"
					:options="groupData_edit" :field-names="{ label: 'lineName', value: 'lineId' }"
				></a-select>
			</a-form-item>
			<a-form-item label="记录值" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="记录值" v-model:value="formState_edit_type.content" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>



<script setup>
import { message,Modal } from 'ant-design-vue';
import { PlusCircleOutlined, SearchOutlined, ReloadOutlined,ExclamationCircleOutlined,CloseCircleFilled } from '@ant-design/icons-vue'
import { list, addlist,dellist,editlist,listAll,GetLine,BackLine} from "./cord"
import { computed, defineComponent, reactive, toRefs, ref,createVNode,watch  } from 'vue';

// tab表格对应的数据
const columns = [{
  title: '记录名称',
  dataIndex: 'name',
  width: 200,
  align: 'center'
}, {
  title: '类型',
  dataIndex: 'type',
  width: 220,
  align: 'center'
}, {
  title: '记录值',
  dataIndex: 'content',
  width: 220,
  align: 'center'
},
{
  title: '域名',
  dataIndex: 'zoneName',
  width: 220,
  align: 'center'
},
{
  title: '线路',
  dataIndex: 'lineName',
  width: 220,
  align: 'center'

},
{
  title: '使用状态',
  dataIndex: 'status',
  width: 200,
  align: 'center'

},
{
  title: '操作',
  dataIndex: 'operation',
  width: 220,
  align: 'center'
},

];

const modalStyle = ref({
  height:'450px',
  overflowY: 'auto',
})


const data = reactive({
  name:"",
  type:"",
  content:"",
  zoneName:"",
  status:"",
  listData:"",
  zoneId:"",
  total:0,
  visible:false,
  ttl:"",
  lineId:undefined,
  pageNum: 1,
	pageSize: 10,
  commonEnty:{values:[]},
  visible_edit: false,
  edit_visible: false,
  number: 0,
  groupData: [],
  groupData_edit:[],
  listAllData:[],
  addRecord: false,
  selects : 0,
  formDataName:[{id:"1",name:'',type:'',content:'',ttl:'',lineId:undefined,zoneId:''}],
  delicon:true,
  formState: {
			name: '',
			type: '',
			lineId: undefined,
			ttl: '',
			content: '',
			zoneId:undefined
		},
    formStateData:[],
    formState_edit: {
			name: '',
			type: '',
			lineId: undefined,
			ttl: '',
			content: '',
			zoneId:'',
      id:'',
      zoneName:''
		},
    formState_edit_type:{
      name: '',
			type: '',
			lineId: undefined,
			content: '',
      
    }
});
const {
  name,
  type,
  content,
  zoneName,
  status,
  listData,
  zoneId,
  total,
  visible,
  ttl,
  lineId,
  pageNum,
	pageSize,
  commonEnty,
  visible_edit,
  edit_visible,
  number,
  groupData,
  groupData_edit,
  listAllData,
  addRecord,
  formState,
  formState_edit,
  selects,
  formDataName,
  delicon,
  formStateData,
  formState_edit_type
} = toRefs(data)

const formRef = ref(null);//添加按钮弹框需要的ref

const addFn = (evt) => {//点击确定按钮
    let target = evt.target;
	 if(target.nodeName == "SPAN"){
            target = evt.target.parentNode;
        }
        target.blur()

formDataName.value.forEach((item)=>{
  item.zoneId = formState.value.zoneId
 })
  for(let i=0;i<formDataName.value.length;i++){
    if(formDataName.value[i].zoneId == ""){
    message.error('请选择域名')
 }
  if(formDataName.value[i].name == ''){
   message.error('请填写第' + (i + 1) +'表单记录名称')
   return;
 }
  if(formDataName.value[i].type == ''){
   message.error('请选择第' + (i + 1) +'表单类型')
   return;
 }
  if(formDataName.value[i].content == ''){
   message.error('请填写第' + (i + 1) +'表单记录值')
   return;
 }
  if(formDataName.value[i].ttl == ''){
   message.error('请填写第' + (i + 1) +'表单TTL')
   return;
 }
  if(formDataName.value[i].lineId == undefined){
   message.error('请选择第' + (i + 1) +'表单线路') 
   return; 
 }
 for (let i = 0; i < formDataName.value.length; i++) {
    if (typeof formDataName.value[i].lineId !== 'string'){
      formDataName.value[i].lineId = JSON.stringify(formDataName.value[i].lineId);
    }
}
}


 addlist(formDataName.value).then((res) => {//调用新增表单的接口，把存放表单的数据传进去
			message.success('添加成功');
			visible.value = false;//关闭弹框
			onClose();
			getcordList();
	}); 
}

// 添加弹框内的change事件
const handleChangsortadd =(value) =>{
    formState.value.lineId=value    
}

// 关闭弹框
const onClose = () => {//点击取消的回调
  visible.value = false;//关闭弹框
  formState.value = {}//第一个表单数据清空 
  formDataName.value.forEach((item)=>{
    item.name='',
    item.type='',
    item.content='',
    item.ttl='',
    item.lineId=undefined,
    item.zoneId=''
  })
};

const queryParams = ref({ // 查询参数，响应式
  name: "",
  pageNum: 1,
  pageSize: 10,
  type:undefined
});

const Cordquery = ref({//获取列表需要的数据
  pageNum:1,
  pageSize:10,
})

//获取列表数据
const getcordList = ()=>{ 
  list(Cordquery.value).then(res =>{//调用接口，传入列表需要的数据
    listData.value = res.records//把数据放进存放表单的地方
    total.value = res.total//总数
  })
  
}
getcordList()//调用列表数据

//添加按钮，让里面的数据清空
 const showModal = (evt) => {
      let target = evt.target;
	 if(target.nodeName == "SPAN"){
            target = evt.target.parentNode;
        }
        target.blur()
      visible.value = true;//显示弹框
      
     formDataName.value.name = ''
     formDataName.value.type = ''
     formDataName.value.content = ''
     formDataName.value.ttl = ''
     formDataName.value.lineId = undefined
     formDataName.value.zoneId = ''
     listAll().then(res=>{ // 调用获取域名接口的数据，显示域名
    let listData = res.map((item)=>{//对域名的数据格式化
      return {
        value: item.zoneId,
				label: item.zoneName,
      }
    })
  listAllData.value = listData//获取的数据给到域名的下拉框内
  })
    };

// 添加弹框选择域名，触发change时间，当input框发生变化就触发
    const changeNames = (value)=>{//value是id 
      formState.value.zoneId =value//获取的id传给新增表单的数据中
      GetLine(formState.value.zoneId).then((res) => {//调用获取线路的数据，传入域名的id
			groupData.value = res;//把获取到的数据存放groupData中
		});
    }

    // 修改弹框里面选择域名的change时间，获取线路
    const changeName_edit = (value)=>{
      // console.log(value,'id');
      formState_edit.value.zoneId = value
       GetLine(formState_edit.value.zoneId).then((res) => {//调用获取线路的数据，传入域名的id
			groupData_edit.value = res;
		});
   
    }

//点击添加记录按钮，出现第二个弹框 
const addRecordBtn = () => {
    formDataName.value.push({
      id:new Date().getTime(),
      name: '',
			type: '',
			lineId: undefined,
			ttl: '',
			content: '',
			zoneId:''
    })
	};
  
//点击第二个弹框的取消按钮
const XiconBtn = (index) => {
    formDataName.value .splice(index,1)
};

//点击页面搜索按钮
const handleQuery =(evt)=>{
      let target = evt.target;
	 if(target.nodeName == "SPAN"){
            target = evt.target.parentNode;
        }
        target.blur()
  list({
    pageNum: pageNum.value,
		pageSize: pageSize.value,
    type: queryParams.value.type,//获取响应式类型
    name:queryParams.value.name,//获取响应式记录名称
  }).then((res)=>{
    listData.value = res.records//把数据给到存放表单的数组中
    pageNum.value = 1;
    total.value = res.total;//总数
  })
}


//重置按钮，把响应式的queryParams里面的数据初始化
const AlldelFn = (evt) => {
  let target = evt.target;
	if(target.nodeName == "SPAN"){
      target = evt.target.parentNode;
  }
  target.blur()
  queryParams.value.name = ''
  queryParams.value.type = undefined
  queryParams.value.pageNum = 1
  queryParams.value.pageSize = 10
  getcordList()//刷新数据
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

// 删除
  const delFn = async (record) =>{
  commonEnty.value.values.push(record);
   console.log(commonEnty.value,'252');
  await dellist(commonEnty.value)
  getcordList()
  message.success('删除成功')
  }
  const confirm = (record) => {
    console.log(record,record);
  delFn(record.id)
  getcordList()
};


//批量删除
const handlChangeFn = (val) =>{
  selects.value = val
  if(number.value == 0){
    message.error('请勾选需要删除的集群')
  }else{
    Modal.confirm({
      title: '删除',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', {
        style: 'color:rgba(0, 0, 0, 0.85);font-size: 14px;',
      }, '是否删除选中数据'),
      onOk() {
        if (selects.value == '0' && !allclusterId.value.length == 0) {
          dellist({ values: allclusterId.value }).then(res => {
            getcordList()
            message.success('批量删除成功')
            number.value = 0
          })
        }
      },
      onCancel() {
        console.log('Cancel');
      },
      class: 'test',
    });
  }
}

//修改按钮
const openmodal = (record)=>{
  // console.log(record,'record');
  if(record.type == '8' || record.type == '9'){
    edit_visible.value = true
  }else{
    visible_edit.value = true;
  }
  
  GetLine(record.zoneId).then((res=>{
    groupData_edit.value = res;

  }))
    // 获取线路
     listAll().then(res=>{
    let listData = res.map((item)=>{
      return {
        value: item.zoneId,
				label: item.zoneName,
      }
    })
  listAllData.value = listData
  })
   formState_edit.value.id = record.id;
    	BackLine(formState_edit.value.id).then((res) => {//点击修改回显数据
      formState_edit.value.zoneId = res.zoneId
			formState_edit.value.name = res.name;
			formState_edit.value.type = res.type;
			formState_edit.value.ttl = res.ttl;
			formState_edit.value.content = res.content;
			formState_edit.value.lineId = JSON.parse(res.lineId);
      formState_edit_type.value.name = res.name;
      formState_edit_type.value.type = res.type;
      formState_edit_type.value.content = res.content;
			formState_edit_type.value.lineId = JSON.parse(res.lineId);
		});
}
//修改确定按钮
const editOK = ()=>{
  formState_edit.value.lineId = JSON.stringify(formState_edit.value.lineId);
		editlist(formState_edit.value).then((res) => {
      console.log(res,formState_edit.value.lineId,'qd');
			message.success('操作成功');
			getcordList();
			visible_edit.value = false;
		});
}
//多选
const state = reactive({
		selectedRowKeys: [],
	});
 const allclusterId = ref([]);
  const rowSelection = (selectedRowKeys, selectedRows) =>{
    state.selectedRowKeys = selectedRowKeys;
		console.log(selectedRowKeys, 'allclusterId');
    allclusterId.value = selectedRows.map((item) => item.id);
		number.value = allclusterId.value.length;
  }
  const clearbtn = () => {
		allclusterId.value = [];
		number.value = 0;
		state.selectedRowKeys = [];
	};



</script>

<style scoped lang="less">
.allclustersBox{
    padding: 8px;
    padding-bottom: 0px;
}

.controls{
    background: #fff;
    margin: 8px ;
    padding: 24px;
}
.btn{
    margin-left: 20px;
}
.select{
    margin:8px 0px -10px 0px;
}
.type{
  display: flex;
  align-items: center;
 width: 260px;
 span{
  width: 60px;
 }
}
.pointer {
		cursor: pointer;
	}
  .addlist{
    width: 985px!important
  }
.line{
    width: 717px;
    margin: 20px auto;
    box-shadow: 1px 1px 8px 5px #F1F1F1;
    border-radius: 10px;
    padding: 8px 0 8px 0;

}
.Addrecord{
    margin-top: 15px;
    text-align: center;
    cursor: pointer;
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
   
 .table{
     display: block;
  }
 .Xicon {
		color: red;
		cursor: pointer;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: flex-start;
		font-size: 15px;
	}
  .iplist_data {
		cursor: pointer;
		padding: 3px;
		border: 1px solid #249ff3;
		display: flex;
		float: left;
		span {
			color: #249ff3;
		}
	}
  .addlist{
    ::v-deep(.ant-modal-body){
   height: 500px!important;
  }
  }
 /deep/ .ant-modal-body{
    height: 500px!important;
    
 }

.addtimeform{
  display: inline;
   margin-right: 10px;
   cursor: pointer;
}



</style>