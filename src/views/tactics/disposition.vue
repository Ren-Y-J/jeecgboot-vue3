<template>
   <div class="allclustersBox">
		<a-card>
			<div class="title">
               
				<a-form  name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
					<a-row :gutter="1">
                        <a-col :md="1" :sm="5">
                            <div class="back" @click="goback"><left-outlined /><span>返回</span></div>
                        </a-col>   
                         <!-- <left-outlined /><span>返回</span> -->
						<a-col :md="6" :sm="24">
							<a-form-item style="margin-bottom: 0px" label="策略组名称" name="name" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
								<a-input placeholder="请输入策略组名称"  v-model:value="search"/>
							</a-form-item>
						</a-col>
						<a-col :md="3" :sm="5">
							<span style="display: inline-block; display: flex; flex-wrap: nowrap; margin-top: 0px">
								<div class="searchbtn">
									<a-button :style="{ margin: '0px 5px ' }" type="primary"  @click="handleQuery"> <search-outlined />搜索</a-button>
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
			<a-button :style="{ margin: '0px 8px 0px 0px ' }" type="primary" @click="addTactics"><plus-outlined />添加策略</a-button>
			<a-button :style="{ margin: '0px 8px ' }" type="primary" @click="editGroup"><edit-outlined />修改策略</a-button>
			<a-button :style="{ margin: '0px 8px ' }" type="primary" @click="deleteGroup"><delete-outlined />删除策略</a-button>
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
        <div>
            <!--  -->
            <a-table
				:columns="columns"
				:data-source="listData"
				:pagination="false"
				:row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }"
				:rowKey="(record) => record.policyId"
				bordered
			>
				<template #bodyCell="{ column, record }">
					<template v-if="column.dataIndex === 'policyStatus'">
						<div
							v-if="record.policyStatus == true"
							style="text-align: center; display: flex; justify-content: center; align-items: center"
						>
							启用
						</div>
						<div
							v-if="record.policyStatus == false"
							style="text-align: center; display: flex; justify-content: center; align-items: center"
						>
							未启用
						</div>
					</template>
					<!--  操作 -->
					<template v-if="column.dataIndex === 'operation'">
						<div>
							<button class="pointer" style="color: #2e7dff; margin-right: 8px" @click="disposition">配置策略</button>
							<button
								class="pointer"
								style="color: #2e7dff; margin-right: 8px"
								v-if="record.policyStatus == true"
								@click="stopService(record)"
								>停用</button>
							<button
								class="pointer"
								style="color: #2e7dff; margin-right: 8px"
								v-if="record.policyStatus == false"
								@click="enable(record)"
								>启用</button>
							
							<a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="confirm(record)" @cancel="cancel">
								<button class="pointer" style="color: #2e7dff; margin-right: 8px">删除</button>
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
</template>

<script setup>
import { router } from '/@/router';
import { message,Modal } from 'ant-design-vue';
import {list,dellistAll,dellist} from './disposition'
import {  SearchOutlined, ReloadOutlined,PlusCircleFilled,CloseCircleFilled,LeftOutlined,PlusOutlined,DeleteOutlined,EditOutlined  } from '@ant-design/icons-vue'
import { computed, defineComponent, reactive, toRefs, ref,createVNode,watch, toRef  } from 'vue';

const columns = [{
  title: '顺序',
  dataIndex: 'policySquence',
  width: 220,
  align: 'center'
}, {
  title: '策略名称',
  dataIndex: 'policyName',
  width: 220,
  align: 'center'
}, {
  title: '匹配源地址',
  dataIndex: 'matchSrc',
  width: 220,
  align: 'center'
},
{
  title: '匹配目的地址',
  dataIndex: 'matchDst',
  width: 220,
  align: 'center'
},
{
  title: '匹配域名',
  dataIndex: 'matchDomain',
  width: 220,
  align: 'center'

},
{
  title: '匹配查询类型',
  dataIndex: 'matchQueryType',
  width: 250,
  align: 'center'
},
{
  title: '应用主机',
  dataIndex: 'policyHostGroupName',
  width: 250,
  align: 'center'
},
{
  title: '状态',
  dataIndex: 'policyStatus',
  width: 250,
  align: 'center'
},
{
  title: '操作',
  dataIndex: 'operation',
  width: 400,
  align: 'center'
},
];

const data = reactive({
listData: [],
total: 0,
ids:[],
number: 0,
id:'',
pageNum: 1,
pageSize: 10,
search: '',
policyId:'',
visible_add:false,
 formState:{
    policiesName:'',
    policiesEnable:'',
    policiesTimeType:[],
    policiesTimeRange:[]
  },
})
const {
listData,
total,
ids,
number,
id,
pageNum,
pageSize,
formName,
search,
policyId,
visible_add,
formState
} = toRefs(data)


// 获取列表数据
const getcordList = () => {
    let url = location.search;
	id.value = url.replace('?', '');
	console.log(id.value,'id.value');
	list({
        policiesId: id.value,
		pageNum: pageNum.value,
		pageSize: pageSize.value,
    }).then((res) => {
        // console.log(res,'res');
		listData.value = res.records;
		total.value = res.total;
	});
};
	getcordList();

// 添加策略组按钮v
const addTactics =(evt)=>{
	let target = evt.target;
	if(target.nodeName == "SPAN"){
        target = evt.target.parentNode;
    }
    target.blur()
  	visible_add.value = true
  	// clearData()//清空表单数据
}

//点击页面搜索按钮
// const handleQuery = ()=>{
// 	console.log('111');
// 	let url = location.search;
// 	id.value = url.replace('?', '');
// 	list({
//         policiesId: id.value,
// 		pageNum: pageNum.value,
// 		pageSize: pageSize.value,
// 		policyName: search.value, //获取响应式记录名称
// 	}).then((res) => {
//         // console.log(res);
// 		listData.value = res.records; //把数据给到存放表单的数组中
// 		pageNum.value = 1;
// 		total.value = res.total; //总数
// 	});
// }

//重置按钮，把数据初始化
const AlldelFn = (evt) => {
	let target = evt.target;
	if(target.nodeName == "SPAN"){
        target = evt.target.parentNode;
    }
    target.blur()
	search.value = ''
    pageNum.value = 1;
    pageSize.value = 1;
	getcordList(); //刷新数据
};

// 删除按钮
const confirm = (record) => {
    // console.log(record);
	policyId.value = record.policyId;
	console.log(policyId.value, 'id');
	dellist({
		policyId: policyId.value,
	}).then((res) => {
		message.success('删除成功');
		getcordList();
	});
};

// 返回按钮
const goback = ()=>{
    router.push("/tactics")
}
// 分页v
const onShowSizeChange = (current, pageSize) => {
	//pageSize 变化的回调，传入当前页和每页条数
	Cordquery.value.pageSize = pageSize; //把pageSize给到响应式的Cordquery
	getcordList();
};
const changeFn = (P, Ps) => {
//页码或 pageSize 改变的回调，参数是改变后的页码及每页条数
	Cordquery.value.pageNum = P; //把获取的页码给到响应式的Cordquery
	getcordList();
};

//多选v
const state = reactive({
	selectedRowKeys: [],
});
const rowSelection = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRows,'selectedRows');
	state.selectedRowKeys = selectedRowKeys;
	ids.value = selectedRows.map((item) => item.policyId);
    // console.log(ids.value,'ids.value');
	number.value = ids.value.length;
};
const clearbtn = () => {
	ids.value = [];
	number.value = 0;
	state.selectedRowKeys = [];
};

// 批量删除策略组
const deleteGroup = (evt) => {	
    let target = evt.target;
	if(target.nodeName == "SPAN"){
        target = evt.target.parentNode;
    }
    target.blur()
	console.log(ids.value,'111');
	if (ids.value.length == 0) {
		message.error('请勾选需要删除的策略组');
	} else {
		dellistAll(ids.value).then((res) => {
			console.log(res,'shanchu');
			number.value = 0;
			message.success('删除成功');
			getcordList();
		});
	}
	
};
</script>

<style scoped lang="less">
.allclustersBox {
		padding: 10px;
		padding-bottom: 0px;
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
.back{
    margin-top: 5px;
    cursor: pointer;
}
.controls {
		background: #fff;
		margin: 10px;
		padding: 24px;
	}
.iconBtn {
		margin-top: -10px;
	}  
    .select {
		margin: 8px 0px 10px 0px;
	}
</style>