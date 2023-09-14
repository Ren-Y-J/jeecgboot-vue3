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
							<a-select-option value="1">删除</a-select-option>
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
          <a-alert show-icon style="margin-top: 8px; margin-bottom: 8px" type="info">
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
            <a-table :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :pagination="false" bordered
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
    <!-- 添加记录弹窗 v-model:visible="visible" style='margin-top: 26px'-->
   <div class="addlist">
  <a-modal  v-model:visible="visible" title="添加记录" width="900px" @ok="addFn" @cancel="onClose">
        <a-form ref='formRef' :model="rowData" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <a-form-item label="域名" :rules="formRules.DomainName"  name="DomainName" style='margin-top: 26px' >
            <a-space>
              <a-select placeholder="请选择域名" ref="select" v-model:value="rowData.DomainName" style="width: 245px"
                @focus="focus" @change="handleChangsort">
                <a-select-option value="A">1 </a-select-option>
              </a-select>
            </a-space>
          </a-form-item>
          <div class="line">
              <a-form-item label="记录名称" :rules="formRules.designation" name="designation" style='margin-top: 18px'>
                <a-input v-model:value="rowData.designation" placeholder="请输入记录名称" style='width:50%' />
              </a-form-item>
              <a-form-item label="类型" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }" :rules="formRules.type" name="type" style='margin-top: 0px'>
            <a-radio-group v-model:value="rowData.type" name="radioGroup" @change="changeradioFn">
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
              <a-form-item label="记录值" :rules="formRules.value" name="value" style='margin-top: 18px'>
                <a-input v-model:value="rowData.value" placeholder="请输入记录值" style='width:50%' />
              </a-form-item>
              <a-form-item label="TTL" :rules="formRules.ttl" name="ttl" style='margin-top: 18px'>
                <a-input v-model:value="rowData.ttl" placeholder="请输入TTL" style='width:50%' />
              </a-form-item>
              <a-form-item label="线路" :rules="formRules.line" name="line" style='margin-top: 18px'>
                <a-space>
              <a-select placeholder="请选择线路" ref="select" v-model:value="rowData.line" style="width: 150px"
                @focus="focus" @change="handleChangsort">
                <a-select-option value="A">1 </a-select-option>
              </a-select>
            </a-space>
              </a-form-item>
          </div>
          <div class="Addrecord line" @click="addline">
            <span >添加记录</span>
          </div>
          </a-form>
      </a-modal>
   </div>
   <!-- 修改弹框 @ok="btnOK"-->
   <div class="dellist">
      <a-modal  v-model:visible="visible_edit" title="记录修改" width="900px"  @ok="editOK">
        <a-form ref='lineRef' :model="rowData" name="basic" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <a-form-item label="域名" :rules="formRules.DomainName"  name="DomainName" style='margin-top: 26px' >
            <a-space>
              <a-select placeholder="请选择域名" ref="select" v-model:value="rowData.DomainName" style="width: 245px"
                @focus="focus" @change="handleChangsort">
                <a-select-option value="A">1 </a-select-option>
              </a-select>
            </a-space>
          </a-form-item>
          <div >
              <a-form-item label="记录名称" :rules="formRules.designation" name="designation" style='margin-top: 18px'>
                <a-input v-model:value="rowData.designation" placeholder="请输入记录名称" style='width:50%' />
              </a-form-item>
              <a-form-item label="类型" :labelCol="{ span: 4 }" :wrapperCol="{ span: 18 }" :rules="formRules.type" name="type" style='margin-top: 0px'>
            <a-radio-group v-model:value="rowData.type" name="radioGroup" @change="changeradioFn">
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
              <a-form-item label="记录值" :rules="formRules.value" name="value" style='margin-top: 18px'>
                <a-input v-model:value="rowData.value" placeholder="请输入记录值" style='width:50%' />
              </a-form-item>
              <a-form-item label="TTL" :rules="formRules.ttl" name="ttl" style='margin-top: 18px'>
                <a-input v-model:value="rowData.ttl" placeholder="请输入TTL" style='width:50%' />
              </a-form-item>
              <a-form-item label="线路" :rules="formRules.line" name="line" style='margin-top: 18px'>
                <a-space>
              <a-select placeholder="请选择线路" ref="select" v-model:value="rowData.line" style="width: 150px"
                @focus="focus" @change="handleChangsort">
                <a-select-option value="A">1 </a-select-option>
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
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
import { computed, defineComponent, reactive, toRefs, ref } from 'vue';
import { list, addlist,dellist,editlist,listAll} from "./cord"
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
  dataIndex: 'lineId',
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

const formRules = {
  DomainName: [{ required: true, message: "请选择域名" }],
  designation: [{ required: true, message: "请输入记录名称" }],
  type: [{ required: true, message: "请选择类型" }],
  value: [{ required: true, message: "请输入记录值,不可以是数字" }],
  ttl: [{ required: true, message: "请输入TTL,大于0的整数" }],
  line: [{ required: true, message: "请选择线路" }],
}

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
  number
} = toRefs(data)

const Cordquery = ref({
  pageNum:1,
  pageSize:10,
 
})

const formRef = ref(null)
const rowData = ref({
  zoneName: '',
  name: '',
  type:'',
  content:'',
  ttl:"",
  lineId:''
})
//新增
const addFn = async () => {
  // 校验表单
  try {
    await formRef.value.validate()
  } catch (error) {
    // console.log(error);
    return console.log(error)
  }
  // 提交表单
  visible.value = false
    message.success('添加成功')
  getcordList()
  onClose()
}
// 关闭弹框
const onClose = () => {
  visible.value = false;
  formRef.value.resetFields()
  rowData.value.zoneName = ""
  rowData.value.name = ""
  rowData.value.name = ""
  rowData.value.type = ""
  rowData.value.content = ""
  rowData.value.ttl = ""
  rowData.value.lineId = ""
  rowData.value = {}
};
const editId = ref({
  id:""
})
//修改
const editOK = async()=>{
  let res = await editlist(editId.value)
  // console.log(res,'987');
}
//域名
// const listAll = ref({})
const addlistAll = ()=>{
  listAll().then(res=>{
    console.log(res,'222');
  })
}
const queryParams = ref({
  // 查询参数
  name: "",
  pageNum: 1,
  pageSize: 10,
  type:""
});
//搜索
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
// const changesearch = ref('请选择')
//重置
const AlldelFn = () => {
  // console.log('1');
  queryParams.value.name = ''
  // changesearch.value = ''
  queryParams.value.type = ''
  queryParams.value.pageNum = 1
  queryParams.value.pageSize = 10
  getcordList()
  // changesearch.value = '请选择'
}

//列表数据
const getcordList = ()=>{
  list(Cordquery.value).then(res =>{
    // console.log(res);
    listData.value = res.records
    total.value = res.total
    // console.log(listData.value,'0000');
  })
}
getcordList()
const onShowSizeChange = (current, pageSize) => {
    Cordquery.value.pageSize = pageSize 
		getcordList();
	};
	const changeFn = (P, Ps) => {
		Cordquery.value.pageNum = P 
		getcordList();
	};

 const showModal = () => {
      visible.value = true;
      zoneName.value = "";
      name.value = "";
      type.value = "";
      content.value = ""
      ttl.value = ""
      lineId.value = ""
    };
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
//修改
const openmodal = (record)=>{
  visible_edit.value = true;
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

const addline = ()=>{
  // console.log('111');

}

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

</style>