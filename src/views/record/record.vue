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
                
                <a-form-item style="margin-bottom: 0px;" label="类型" name="type" :labelCol="{ span: 7 }" placeholder="请输入" 
                  :wrapperCol="{ span: 10 }" v-model:value="queryParams.type" >
                  <a-space>
                    <a-select ref="select"  style="width: 120px" @focus="focus" 
                      @change="handleChange"  v-model:value="queryParams.type">
                      <a-select-option :value="0">A</a-select-option>
                    <a-select-option :value="1">AAAA</a-select-option>
                    <a-select-option :value="2">CNAME</a-select-option>
                    <a-select-option :value="3">NS </a-select-option>
                    <a-select-option :value="4">MX </a-select-option>
                    <a-select-option :value="5">CAA </a-select-option>
                    <a-select-option :value="6">SRV </a-select-option>
                    <a-select-option :value="7">TXT </a-select-option>
                    <a-select-option :value="8">PTR </a-select-option>
                    <a-select-option :value="9">反向域的NS</a-select-option>
                    <a-select-option :value="10">子网</a-select-option>
                    <a-select-option :value="11">其他</a-select-option>
                    
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
        <!-- @change="handleChange" -->
    </div>
    <div class="controls">
        <div class="batch">
          <a-space>
						<a-select
							ref="select"
							style="width: 120px; margin-right: 8px"
							@focus="focus"
							@select="handlChangeFn"
							v-model="delselect"
							placeholder="批量操作"
						>
							<a-select-option value="0">删除</a-select-option>
						</a-select>
					</a-space>
            <!-- <a-select v-model:value="value17" style="width: 20%" placeholder="批量操作" class="Con-Bat">
                <a-select-option value="1">删除</a-select-option>
                
            </a-select> -->
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
            <!-- <a-alert message="未选中任何数据" type="info" show-icon /> -->
        </div>
        <!-- table表格 -->
        <div class="table">
           <span style="margin-left: 8px"></span>
            <a-table :scroll="{ x: 'calc(700px + 50%)', y: 510 }" :pagination="false" bordered
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }"
                :rowKey="(record) => record.id"
                :columns="columns"
                :data-source="listData" >
                
               <!-- 操作 @click="Delbtn(record)" @click="GoDep(record)"-->
               <template #bodyCell="{ column,record }">
                  <template v-if="column.dataIndex === 'status'">
                    <div v-if='record.status == 1'
                      style="text-align: center; display: flex;   justify-content: center;  align-items: center;">
                      <a-tag color="green">已启用</a-tag>
                    </div>
                    <div v-if='record.status == 0'
                      style="text-align: center; display: flex;   justify-content: center;  align-items: center;">
                      <a-tag color="green">警用</a-tag>
                    </div>
                  </template>
                  <template v-if="column.dataIndex === 'operation'">
                    <div>
                      <span @click="openmodal(record)" class="pointer" style="color: #2e7dff; margin-right: 8px">修改</span>
                      <a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="confirm(record)"
                        @cancel="cancel">
                      <span class="pointer"  style="color: #2e7dff; margin-right: 8px">删除</span>
                      </a-popconfirm>
                    </div>
                  </template> 
                <template v-if="column.dataIndex === 'type'">
                    <div v-if='record.type == 0'>A</div>
                    <div v-if='record.type == 1'>AAAA </div>
                    <div v-if='record.type == 2'>CNAME </div>
                    <div v-if='record.type == 3'>NS </div>
                    <div v-if='record.type == 4'>MX </div>
                    <div v-if='record.type == 5'>CAA </div>
                    <div v-if='record.type == 6'>SRV </div>
                    <div v-if='record.type == 7'>TXT </div>
                    <div v-if='record.type == 8'>PTR </div>
                    <div v-if='record.type == 9'>反向域的NS</div>
                    <div v-if='record.type == 10'>子网</div>
                    <div v-if='record.type == 11'>其他</div>
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
    <!-- !!!!!添加记录弹窗 v-model:visible="visible" style='margin-top: 26px'-->
   <div class="addlist">
      <a-modal  v-model:visible="visible" title="添加记录" width="900px" @ok="addFn" @cancel="onClose">
        <a-form ref='formRef' :model="formState" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <a-form-item label="域名" :rules="[{ required: true, message:'请选择域名' }]"  name="zoneId" style='margin-top: 26px' >
            <a-space>
              <a-select placeholder="请选择域名" ref="select" v-model:value="formState.zoneId" style="width: 245px"
                @focus="focus" @change="changeNames" :options="listAllData" >
              </a-select>
            </a-space>
          </a-form-item>
          <div class="line">
              <a-form-item label="记录名称" :rules="[{ required: true, message:'请输入记录名称' }]" name="name" style='margin-top: 18px'>
                <a-input v-model:value="formState.name" placeholder="请输入记录名称" style='width:50%' />
              </a-form-item>
              <a-form-item label="类型" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }" :rules="[{ required: true, message:'请选择类型' }]" name="type" style='margin-top: 0px'>
              <a-radio-group v-model:value="formState.type" name="radioGroup" @change="changeradioFn">
              <a-radio :value="0">A</a-radio>
              <a-radio :value="1">AAAA</a-radio>
              <a-radio :value="2">CNAME </a-radio>
              <a-radio :value="3">NS</a-radio>
              <a-radio :value="4">MX </a-radio>
              <a-radio :value="5">CAA </a-radio>
              <a-radio :value="6">SRV </a-radio>
              <a-radio :value="7">TXT </a-radio>
              </a-radio-group>
              </a-form-item>
              <a-form-item label="记录值" :rules="[{ required: true, message:'请输入记录值' }]" name="content" style='margin-top: 18px'>
                <!-- <a-input v-model:value="formState.content" placeholder="请输入记录值" style='width:50%' /> -->
                <a-input-number
							:formatter="(value) => Math.floor(value)"
							:parser="(value) => value.replace(/\D/g, '')"
							precision="0"
							min="0"
							style="width:50%"
							placeholder="请输入记录值"
							v-model:value="formState.content"
						></a-input-number>
              </a-form-item>
              <a-form-item label="TTL" :rules="[{ required: true, message:'请输入大于0的整数,'}]" name="ttl" style='margin-top: 18px'>
                <!-- <a-input v-model:value="formState.ttl" placeholder="请输入TTL" style='width:50%' /> -->
                <a-input-number
							:formatter="(value) => Math.floor(value)"
							:parser="(value) => value.replace(/\D/g, '')"
							precision="0"
							min="1"
							style="width:50%"
							placeholder="请输入大于0的TTL"
							v-model:value="formState.ttl"
						></a-input-number>
              </a-form-item>
              <a-form-item label="线路" :rules="[{ required: true, message:'请选择线路' }]" name="lineId" style='margin-top: 18px'>
                <a-space>
              <a-select placeholder="请选择线路" ref="select" v-model:value="formState.lineId" style="width: 150px"
                @focus="focus" @change="handleChangsortadd" :options="groupData" mode="tags" :size="size" :field-names="{ label: 'lineName', value: 'lineId' }">
              </a-select>
              </a-space>
              </a-form-item>
          </div>
          </a-form>
          <div class="Addrecord line" style="margin-bottom: 10px"  @click="addRecordBtn">
            <plus-circle-outlined /><span >添加记录</span>
          </div>
<!-- 第二个表格 :rules="formRules.designation" :rules="formRules.type"  :rules="formRules.value"  :rules="formRules.ttl" :rules="formRules.line"-->
          <a-form v-show="addRecord == true" :rules="formAdd" ref='formRef_' :model="formState_1" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          
          <div class="line">
            <div @click="XiconBtn" style="padding: 15px;padding-bottom:0px;margin-bottom:-30px">
				      <close-circle-filled class="Xicon" @click="XiconBtn"/>
			    </div>
              <a-form-item label="记录名称"  name="name" style='margin-top: 18px'>
                <a-input v-model:value="formState_1.name" placeholder="请输入记录名称" style='width:50%' />
              </a-form-item>
              <a-form-item label="类型"  :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }"  name="type" style='margin-top: 0px'>
            <a-radio-group v-model:value="formState_1.type" name="radioGroup" @change="changeradioFn">
              <a-radio :value="0">A</a-radio>
              <a-radio :value="1">AAAA</a-radio>
              <a-radio :value="2">CNAME </a-radio>
              <a-radio :value="3">NS</a-radio>
              <a-radio :value="4">MX </a-radio>
              <a-radio :value="5">CAA </a-radio>
              <a-radio :value="6">SRV </a-radio>
              <a-radio :value="7">TXT </a-radio>
            </a-radio-group>
          </a-form-item>
              <a-form-item label="记录值"  name="content" style='margin-top: 18px'>
                <a-input v-model:value="formState_1.content" placeholder="请输入记录值" style='width:50%' />
                	<!-- <a-input-number
							:formatter="(value) => Math.floor(value)"
							:parser="(value) => value.replace(/\D/g, '')"
							precision="0"
							min="0"
							style="width:50%"
							placeholder="请输入记录值"
							v-model:value="formState_1.content"
						></a-input-number> -->
              </a-form-item>
              <a-form-item label="TTL"  name="ttl" style='margin-top: 18px'>
                <a-input v-model:value="formState_1.ttl" placeholder="请输入TTL" style='width:50%' />
                <!-- <a-input-number
							:formatter="(value) => Math.floor(value)"
							:parser="(value) => value.replace(/\D/g, '')"
							precision="0"
							min="1"
							style="width:50%"
							placeholder="请输入大于0的TTL"
							v-model:value="formState_1.ttl"
						></a-input-number> -->
              </a-form-item>
              <a-form-item label="线路"  name="lineId" style='margin-top: 18px'>
                <a-space>
              <a-select placeholder="请选择线路" ref="select" v-model:value="formState_1.lineId" style="width: 150px"
                @focus="focus" @change="handleChangsort" :options="groupData"  mode="tags" :size="size" :field-names="{ label: 'lineName', value: 'lineId' }" >
              </a-select>
            </a-space>
              </a-form-item>
          </div>
          </a-form>
      </a-modal>
   </div>
   <!-- 修改弹框 -->
   <div class="dellist">
      <a-modal  v-model:visible="visible_edit" title="记录修改" width="900px"  @ok="editOK">
        <a-form ref='formRef' :model="formState_edit" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" autocomplete="off"
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
              <a-form-item label="类型" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }" :rules="[{ required: true, message: '请选择类型!' }]" name="type" style='margin-top: 0px'>
            <a-radio-group v-model:value="formState_edit.type" name="radioGroup" @change="changeradioFn">
              <a-radio :value="0">A</a-radio>
              <a-radio :value="1">AAAA</a-radio>
              <a-radio :value="2">CNAME </a-radio>
              <a-radio :value="3">NS</a-radio>
              <a-radio :value="4">MX </a-radio>
              <a-radio :value="5">CAA </a-radio>
              <a-radio :value="6">SRV </a-radio>
              <a-radio :value="7">TXT </a-radio>
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
              <a-select placeholder="请选择线路" ref="select" v-model:value="formState_edit.lineId" style="width: 150px"
                @focus="focus"  :options="groupData" mode="tags" :size="size" :field-names="{ label: 'lineName', value: 'lineId' }">
              </a-select>
            </a-space>
              </a-form-item>
              </div>
              </a-form>
      </a-modal>
   </div>
</template>


<script setup>
import { message } from 'ant-design-vue';
import { SmileOutlined, DownOutlined,CloseCircleFilled } from '@ant-design/icons-vue';
import { SmileTwoTone, PlusCircleOutlined,HeartTwoTone, CheckCircleTwoTone, LeftOutlined, SearchOutlined, ReloadOutlined, PlusOutlined, RestOutlined } from '@ant-design/icons-vue'
import { computed, defineComponent, reactive, toRefs, ref } from 'vue';
import { list, addlist,dellist,editlist,listAll,GetLine,BackLine} from "./cord"
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';

const columns = [{
  title: '记录名称',
  dataIndex: 'name',
  width: 220,
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

// const formRules = {
//   DomainName: [{ required: true, message: "请选择域名" }],
//   designation: [{ required: true, message: "请输入记录名称" }],
//   type: [{ required: true, message: "请选择类型" }],
//   value: [{ required: true, message: "请输入记录值,不可以是数字" }],
//   ttl: [{ required: true, message: "请输入TTL,大于0的整数" }],
//   line: [{ required: true, message: "请选择线路" }],
// }

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
  lineId:"",
  pageNum: 1,
	pageSize: 10,
  commonEnty:{values:[]},
  visible_edit: false,
  number: 0,
  groupData: [],
  listAllData:[],
  addRecord: false,
  selects : 0,
  formState: {
			name: '',
			type: '',
			lineId: [],
      // 先放到数组在stry
			ttl: '',
			content: '',
			zoneId:''
		},
		formState_1: {
			name: '',
			type: '',
			lineId: undefined,
			ttl: '',
			content: '',
			
		},
    formState_edit: {
			name: '',
			type: '',
			lineId: undefined,
			ttl: '',
			content: '',
			zoneId:'',
      id:''
		},
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
  number,
  groupData,
  listAllData,
  addRecord,
  formState,
  formState_1,
  formState_edit,
  selects,
} = toRefs(data)

const Cordquery = ref({
  pageNum:1,
  pageSize:10,
 
})

const formRef = ref(null);
const formRef_ = ref(null)
const rowData = ref({
  zoneName: '',
  name: '',
  type:'',
  content:'',
  ttl:"",
  lineId:''
})
//新增
const formAdd = ref([])
const formAdd_ = ref([])
const addFn = async () => {
  
  // 校验表单
  try {
    await formRef.value.validate()
   await formRef_.value.validate()
  } catch (error) {
    // console.log(error);
    return console.log(error)
  }
  // 提交表单
  let formData = [];
 if (addRecord.value == true) {
			formData.push(formState.value, formState_1.value);
      formAdd = formRef.value.validate()
		}
    if (addRecord.value == false) {
			formData.push(formState.value);

		}
    // console.log(formData.value.lineId,'formData.value.lineId');
    // formData.value.lineId
      // formData.value.aclId = JSON.stringify(formState.value.aclId);
    // formData.forEach((item) => {
		// 	item.lineId = JSON.stringify(item.lineId);
		// 	// 添加 zoneId 字段，值为 id.value
		// 	// item.zoneId = id.value;
		// });
     formState.value.lineId = JSON.stringify( formState.value.lineId);
     formState_1.value.lineId = JSON.stringify( formState_1.value.lineId);
    //  console.log( formState.value.lineId);
    // console.log( formState.value.lineId,'ok');
    addlist(formData).then((res) => {
			message.success('添加成功');
			visible.value = false;
			onClose();
			getcordList();
		});

}
const handleChangsortadd =(value) =>{
    // console.log(value,'handleChangsortadd');
    formState.value.lineId=value
  //   console.log(formState.value.lineId);
  // console.log( formState.value.lineId ,'handleChangsortadd22');

}


// 关闭弹框
const onClose = () => {
  visible.value = false;
  formRef.value.resetFields()
  formState.value = {}
  formState_1.value = {}
};
const addRecordBtn = () => {
		addRecord.value = true;
	};
   const XiconBtn = () => {
		addRecord.value = false;
	};



const queryParams = ref({
  // 查询参数
  name: "",
  pageNum: 1,
  pageSize: 10,
  type:""
});
//点击搜索
const handleQuery =()=>{
  list({
    pageNum: pageNum.value,
		pageSize: pageSize.value,
    type: queryParams.value.type,
    name:queryParams.value.name,
  }).then((res)=>{
    console.log(res);
    listData.value = res.records
    total.value = res.total;
  //  getcordList()
  })
}

//重置
const AlldelFn = () => {
  // console.log('1');
  queryParams.value.name = ''
  // changesearch.value = ''
  queryParams.value.type = ''
  queryParams.value.pageNum = 1
  queryParams.value.pageSize = 10
  getcordList()
 
}

//列表数据
const getcordList = ()=>{
  
  console.log(Cordquery.value,'252');
  list(Cordquery.value).then(res =>{
    
    // console.log(res);
    listData.value = res.records
    total.value = res.total
    // console.log(listData.value,'0000');
  })
  
}
getcordList()



// 分页
const onShowSizeChange = (current, pageSize) => {
    Cordquery.value.pageSize = pageSize 
		getcordList();
	};
	const changeFn = (P, Ps) => {
		Cordquery.value.pageNum = P 
		getcordList();
	};
//添加按钮
 const showModal = () => {
  
      visible.value = true;
     
      zoneName.value = "";
      name.value = "";
      type.value = "";
      content.value = ""
      ttl.value = ""
      // lineId.value = ""
      // 获取线路
     listAll().then(res=>{
    console.log(res,);
    let listData = res.map((item)=>{
      return {
        value: item.zoneId,
				label: item.zoneName,
      }
    })
  listAllData.value = listData
  //  console.log(listAllData.value,'listAllData.value');
  })
		
		visible.value = true;
    };
// 添加弹框选择域名
    const changeNames = (value)=>{
      // console.log(formState.value.zoneName,'125');
      console.log(value,'id');
      formState.value.zoneId =value
      GetLine(formState.value.zoneId).then((res) => {
			console.log(res,'9-9---9-8-')
			// let transformedData = res.map((item) => {
			// 	return {
			// 		value: item.lineId,
			// 		label: item.lineName,
			// 	};
			// });
			groupData.value = res;
		});
    }
    // 修改获取线路
    const changeName_edit = (value)=>{
      console.log(value,'id');
      formState_edit.value.zoneId = value
      // console.log(formState_edit.value.zoneName,'125');
       GetLine(formState_edit.value.zoneId).then((res) => {
			console.log(res,'9-9---9-9-')
			// let transformedData = res.map((item) => {
			// 	return {
			// 		value: item.lineId,
			// 		label: item.lineName,
			// 	};
			// });
			groupData.value = res;
		});
   
    }
  
// 删除
  const delFn = async (record) =>{
    // console.log(record,'111');
    // console.log(record.lineId,'232');
  commonEnty.value.values.push(record);
  // console.log(commonEnty.value,'252');
  await dellist(commonEnty.value)
  getcordList()
  message.success('删除成功')
  }
    const confirm = (record) => {
  // console.log(record, 'record2');
  delFn(record.id)
  getcordList()
};
//批量删除
const handlChangeFn = (val) =>{
  console.log(val,'val');
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
        console.log('OK');
        if (selects.value == '0' && !allclusterId.value.length == 0) {
          dellist({ values: allclusterId.value }).then(res => {
            // console.log(res);
            getcordList()
            message.success('批量删除成功')
            number.value = 0
            // changevalue.value = '批量删除'
          })
          // console.log(res, 'allclusterId');


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
  visible_edit.value = true;
  // console.log(record,"123456");
    // 获取线路
     listAll().then(res=>{
    // console.log(res,"2222");
    let listData = res.map((item)=>{
      return {
        value: item.zoneId,
				label: item.zoneName,
      }
    })
  listAllData.value = listData
  // console.log(listAllData.value,'listAllData.value');
  })
   formState_edit.value.id = record.id;
  //  console.log(formState_edit.value.id,"1111");
    	BackLine(`${record.id}`).then((res) => {
        console.log(res,"2321");
			formState_edit.value.name = res.name;
			formState_edit.value.type = res.type;
			formState_edit.value.ttl = res.ttl;
			formState_edit.value.content = res.content;
			formState_edit.value.lineId = JSON.parse(res.lineId);
			// formState_edit.value.lineId = formState_edit.value.lineId.replace(/\\/g, '');
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
    padding: 10px;
    padding-bottom: 0px;
}

.controls{
    background: #fff;
    margin: 10px;
    padding: 24px;
}
.btn{
    margin-left: 20px;
}
.select{
    margin:8px 0px 0px 0px;
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
    margin: 0 auto;
    box-shadow: 1px 1px 8px 5px #F1F1F1;
    border-radius: 10px;
    padding: 8px 0 8px 0;
   
}
.Addrecord{
    margin-top: 15px;
    text-align: center;
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

</style>