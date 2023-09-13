<template>
    <div class="myname">
        <div class="Record">
            <!-- placeholder="Basic usage" v-model:value="Cordquery.name" :rules="formList.cordName" style="width: 100%"-->
            <span>记录名称：</span><a-input placeholder="请输入集群名称" />
        </div>
        <div class="type">
            <span>类型：</span>
            <a-select v-model:value="value17" style="width: 100%" placeholder="请选择">
                    <a-select-option value="A">A</a-select-option>
                    <a-select-option value="AAAA">AAAA</a-select-option>
                    <a-select-option value="CNAME">CNAME</a-select-option>
                    <a-select-option value="NS">NS </a-select-option>
                    <a-select-option value="MX">MX </a-select-option>
                    <a-select-option value="CAA">CAA </a-select-option>
                    <a-select-option value="SRV">SRV </a-select-option>
                    <a-select-option value="TXT">TXT </a-select-option>
                    <a-select-option value="PTR">PTR </a-select-option>
                    <a-select-option value="反向域的NS">反向域的NS</a-select-option>
                    <a-select-option value="子网">子网</a-select-option>
                    <a-select-option value="其他">其他</a-select-option>
            </a-select>
        </div>
    </div>
    <div class="controls">
        <div class="batch">
          <a-space>
						<a-select
							ref="select"
							style="width: 120px; margin-right: 8px"
							@focus="focus"
							@change="handleChange"
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
            <a-alert message="未选中任何数据" type="info" show-icon />
        </div>
        <!-- table表格 -->
        <div class="table">
           <span style="margin-left: 8px"></span>
            <a-table :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :pagination="false" bordered
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: rowSelection }"
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
                      <span @click="openmodal(record)" class="pointer" style="color: #2e7dff; margin-right: 8px">编辑</span>
                      <a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="confirm(record)"
                        @cancel="cancel">
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
    <!-- 添加记录弹窗 v-model:visible="visible" style='margin-top: 26px'-->
   <div class="addlist">
  <a-modal  v-model:visible="visible" title="添加记录" width="985px" @ok="btnOK">
        <a-form ref='lineRef' name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" autocomplete="off"
          @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger='blur'>
          <a-form-item label="域名" :rules="formRules.DomainName"  name="DomainName" style='margin-top: 26px' >
            <a-space>
              <a-select placeholder="请选择域名" ref="select" v-model:value="value17" style="width: 245px"
                @focus="focus" @change="handleChangsort">
                <a-select-option value="A">1 </a-select-option>
              </a-select>
            </a-space>
          </a-form-item>
          <div class="line">
              <a-form-item label="记录名称" :rules="formRules.designation" name="designation" style='margin-top: 18px'>
                <a-input v-model:value="value17" placeholder="请输入记录名称" style='width:50%' />
              </a-form-item>
              <a-form-item label="类型" :rules="formRules.type" name="type" style='margin-top: 0px'>
            <a-radio-group v-model:value="radiovalue" name="radioGroup" @change="changeradioFn">
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
                <a-input v-model:value="value17" placeholder="请输入记录值" style='width:50%' />
              </a-form-item>
              <a-form-item label="TTL" :rules="formRules.ttl" name="ttl" style='margin-top: 18px'>
                <a-input v-model:value="value17" placeholder="请输入TTL" style='width:50%' />
              </a-form-item>
              <a-form-item label="线路" :rules="formRules.line" name="line" style='margin-top: 18px'>
                <a-space>
              <a-select placeholder="请选择线路" ref="select" v-model:value="value17" style="width: 150px"
                @focus="focus" @change="handleChangsort">
                <a-select-option value="A">1 </a-select-option>
              </a-select>
            </a-space>
              </a-form-item>
          </div>
          <div class="Addrecord line">
            <span>添加记录</span>
          </div>
          </a-form>
      </a-modal>
   </div>
</template>


<script setup>
import { message } from 'ant-design-vue';
import { computed, defineComponent, reactive, toRefs, ref } from 'vue';
import { list, addlist} from "./cord"
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
} = toRefs(data)

const Cordquery = ref({
  pageNum:1,
  pageSize:10
})
const getcordList = ()=>{
  list(Cordquery.value).then(res =>{
    console.log(res);
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
const options = ([
      { value: 'jack', label: 'Jack' },
      { value: 'lucy', label: 'Lucy' },
      { value: 'tom', label: 'Tom' },
    ]);
// const openadd = ()=>{
//   visible.value = true;
// }
 const showModal = () => {
      visible.value = true;
      zoneName.value = "";
      name.value = "";
      type.value = "";
      content.value = ""
      ttl.value = ""
      lineId.value = ""
    };
    const confirm = (record) => {
  // console.log(record, 'record2');
  delFn(record.lineId)
  getcordList()
};
    // const btnOK = () => {
    //   const regs = /^[1-9]\d*$/;//TTL 需要检验为 大于0的整数
    //   const reg = /[\u4E00-\u9FA5]/g;//记录值需要校验不能输入汉字
    //   if(zoneName.value == ""){
    //       message.error('请选择域名')
    //   } else if (name.value == ""){
    //       message.error('请填写记录名称')
    //   } else if (type.value == ""){
    //     message.error('请选择类型')
    //   } else if (!reg.test(content.value)){
    //     message.error('请正确填写记录值')
    //   } else if (!regs.test(ttl.value)){
    //     message.error('请正确填写TTL')
    //   } else if (lineId.value == ""){
    //     message.error('请选择线路')
    //   } else {
    //       addlist({
    //         name:name.value,
    //         zoneName:zoneName.value,
    //         type:type.value,
    //         content:content.value,
    //         ttl:ttl.value,
    //         lineId:lineId.value
    //       })
    //   }
    // };
// const state = reactive({
// 		selectedRowKeys: [],
// 	});
// 	const allclusterId = ref([]);
// 	const rowSelection = (selectedRowKeys, selectedRows) => {
// 		state.selectedRowKeys = selectedRowKeys;
// 		console.log(selectedRowKeys, 'allclusterId');
// 		// 对原数组元素进行运算后再赋值给新的数组

// 		allclusterId.value = selectedRows.map((item) => item.zoneId);

// 		number.value = allclusterId.value.length;
// 	};
// 	const clearbtn = () => {
// 		allclusterId.value = [];
// 		number.value = 0;
// 		state.selectedRowKeys = [];
// 	};

</script>

<style scoped lang="less">
.myname{
    background: #fff;
    padding: 12px;
    margin: 10px;
    display: flex;
    // flex-wrap: nowrap;
}
.Record{
    margin-right: 50px;
    padding-left: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    span{
      width: 100px;
      
    }
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
    width: 825px;
    margin: 0 auto;
    box-shadow: 1px 1px 8px 5px #F1F1F1;
    border-radius: 10px;
    padding: 8px 0 8px 0;
}
.Addrecord{
    margin-top: 15px;
    text-align: center;
}
</style>