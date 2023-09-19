<template>
	<div style="padding: 10px">
		<div class="page">
				<a-form>
					<div style='display: flex;'>
				
				<a-form-item label="名称" :labelCol="{ span: 6 }" :wrapperCol="{ span: 23 }">
					<a-input v-model:value="search" placeholder="按名称搜索"></a-input>
				</a-form-item>
					<a-button @click="searchBtn" type="primary" style="margin-right: 10px;margin-left: 10px"><search-outlined />搜索</a-button>
					<a-button @click="resetbtn">
						<reload-outlined />
						重置
					</a-button>
					</div>
				</a-form>
			
			
			<div style="margin-bottom: 8px">
				<a-button @click="addBtn" type="primary"><plus-outlined />添加</a-button>
			</div>
		</div>
		<div class="page" style="margin-top: 8px">
			<a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns" :data-source="initdata" bordered>
				<template #bodyCell="{ column, record }">
					<!-- 状态 -->
					<template v-if="column.dataIndex === 'status'">
						<span v-show="record.status == 0">禁用</span>
						<span v-show="record.status == 1">启用</span>
					</template>
					<!-- 域类型 -->
					<template v-if="column.dataIndex === 'type'">
						<span v-show="record.type == 0">A</span>
						<span v-show="record.type == 1">AAAA</span>
						<span v-show="record.type == 2">CNAME </span>
						<span v-show="record.type == 3">NS </span>
						<span v-show="record.type == 4">MX </span>
						<span v-show="record.type == 5">CAA </span>
						<span v-show="record.type == 6">SRV </span>
						<span v-show="record.type == 7">TXT </span>
						<span v-show="record.type == 8">PTR</span>
						<span v-show="record.type == 9">反向域的NS</span>
						<span v-show="record.type == 10">子网</span>
					</template>
					<!-- 操作 -->
					<template v-if="column.dataIndex === 'operation'">
						<div style="display: flex; justify-content: center; align-items: center">
							<div class="pointer" style="margin-right: 10px">
								<a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="delBtn(record)">
									<span style="color: #1890ff">删除</span>
								</a-popconfirm>
							</div>
							<div class="pointer" style="margin-right: 10px" @click="editEploy(record)">
								<span style="color: #1890ff">编辑</span>
							</div>
							<div class="pointer" style="margin-right: 10px">
								<a-popconfirm title="是否确认？" ok-text="是" cancel-text="否" @confirm="stopBtn(record)">
									<span v-show="record.status == 0" style="color: #1890ff">禁用</span>
									<span v-show="record.status == 1" style="color: #1890ff">启用</span>
								</a-popconfirm>
							</div>
						</div>
					</template>
				</template>
			</a-table>
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
	</div>
<!-- 添加 -->
	<a-modal v-model:visible="visible" title="添加" @ok="handleOk">
		<a-form
			style="margin-top: 10px"
			ref="formRef_"
			:model="formState"
			name="basic"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 20 }"
			autocomplete="off"
			validateTrigger="blur"
		>
			<a-form-item
			 :rules="[{ required: true, message: '请输入记录名称!' }]"
			 name="name"
			 label="记录名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="记录名称" v-model:value="formState.name" />
			</a-form-item>

			<a-form-item  :rules="[{ required: true, message: '请选择类型!' }]"
			 	 name="type"
			 label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-radio-group v-model:value="formState.type" style="width: 100%">
					<a-radio value="9">反向域的NS</a-radio>
					<a-radio value="8">PTR</a-radio>
					<a-radio value="10">子网</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="线路发布" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-select v-model:value="formState.lineId" mode="multiple" style="width: 100%" placeholder="请选择" :options="groupData"></a-select>
			</a-form-item>
			<a-form-item label="记录值" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="记录值" v-model:value="formState.content" />
			</a-form-item>
		</a-form>

		<div style="display: flex; justify-content: center; align-items: center; margin-bottom: 10px">
			<a-button type="dashed" style="width: 80%" @click="addRecordBtn">增加记录</a-button>
		</div>
		<a-form
			v-show="addRecord == true"
			style="margin-top: 10px"
			ref="formRef"
			:model="formState_1"
			name="basic"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 20 }"
			autocomplete="off"
			validateTrigger="blur"
		>
			<div @click='XiconBtn' style='padding:15px'>
				<close-circle-filled class='Xicon' />
			</div>

			<a-form-item label="记录名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="记录名称" v-model:value="formState_1.name" />
			</a-form-item>

			<a-form-item label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-radio-group v-model:value="formState_1.type" style="width: 100%">
					<a-radio value="9">反向域的NS</a-radio>
					<a-radio value="8">PTR</a-radio>
					<a-radio value="10">子网</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="线路发布" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-select v-model:value="formState_1.lineId" mode="multiple" style="width: 100%" placeholder="请选择" :options="groupData"></a-select>
			</a-form-item>
			<a-form-item label="记录值 " :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="记录值" v-model:value="formState_1.content" />
			</a-form-item>
		</a-form>
	</a-modal>
	<!-- 编辑 -->
	<a-modal v-model:visible="edit_visible" title="编辑" @ok="handleOk_edit">
		<a-form
			style="margin-top: 10px"
			ref="formRef"
			:model="formState_edit"
			name="basic"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 20 }"
			autocomplete="off"
			validateTrigger="blur"
		>
			<a-form-item label="记录名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="记录名称" v-model:value="formState_edit.name" />
			</a-form-item>
	
			<a-form-item label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-radio-group v-model:value="formState_edit.type" style="width: 100%">
					<a-radio value="9">反向域的NS</a-radio>
					<a-radio value="8">PTR</a-radio>
					<a-radio value="10">子网</a-radio>
				</a-radio-group>
			</a-form-item>
			<a-form-item label="线路发布" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-select v-model:value="formState_edit.lineId" mode="multiple" style="width: 100%" placeholder="请选择" :options="groupData"></a-select>
			</a-form-item>
			<a-form-item label="记录值" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="记录值" v-model:value="formState_edit.content" />
			</a-form-item>
		</a-form>
	</a-modal>
	
	
</template>

<script setup>
	import { GetList, DelList, GetLine,AddList,EditList,BackLine,stopStatus } from './reverse_deploy.ts';
	import { reactive, toRefs, ref ,watchEffect} from 'vue';
	import { SearchOutlined, ReloadOutlined, PlusOutlined, CloseCircleFilled } from '@ant-design/icons-vue'; //icon引入
	import { message } from 'ant-design-vue';
	const data = reactive({
		id: '',
		pageNum: 1,
		pageSize: 10,
		initdata: '',
		total: 0,
		visible: false,
		addRecord: false,
		formState: {
			name: '',
			type: '',
			lineId: undefined,
			content: '',
			zoneId:'',
				stauts:'1'
		},
		formState_1: {
			name: '',
			type: '',
			lineId: undefined,
			content: '',
			zoneId:'',
		},
		formState_edit: {
			name: '',
			type: '',
			lineId: undefined,
			content: '',
			id:'',
			zoneId:'',
			stauts:'1'
		},
		search:'',
		groupData: [],
		edit_visible:false
	});
	const { id, pageNum, pageSize, initdata, total, visible, formState, groupData,  addRecord,formState_1,edit_visible,formState_edit,search } = toRefs(data);
	const columns = [
		{
			title: '反向域名',
			dataIndex: 'name',
			align: 'center',
		},
		{
			title: '状态',
			dataIndex: 'status',
			align: 'center',
		},
		{
			title: '域类型',
			dataIndex: 'type',
			align: 'center',
		},
		{
			title: '操作',
			dataIndex: 'operation',
			align: 'center',
		},
	];

	const getData = () => {
		let url = location.search;
		// id.value = url.replace('?', '');


	id.value = localStorage.getItem('zoneId');


		formState_1.value.zoneId=id.value
		formState.value.zoneId=id.value
		formState_edit.value.zoneId=id.value
		
		
		
		
		GetList({
			zoneId: id.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		}).then((res) => {
			initdata.value = res.records;
			total.value = res.total;
			console.log(res, '---');
		});
	};
	getData();
	const addRecordBtn = () => {
		addRecord.value = true;
	};
	const XiconBtn = ()=>{
			addRecord.value = false;
	}
	const delBtn = (record) => {
		let values1 = [record.id];
		DelList({
			values: values1,
		}).then((res) => {
			message.success('删除成功');
			getData(); 
		});
	};
	const addBtn = () => {
		// 获取线路
		GetLine(`${id.value}`).then((res) => {
			let transformedData = res.map((item) => {
				return {
					value: item.lineId,
					label: item.lineName,
				};
			});
			groupData.value = transformedData;
		});
		visible.value = true;
	};
	const formRef_ = ref(null);
	const handleOk = async()=>{
		// 校验表单
		try {
			await formRef_.value.validate();
		} catch (error) {
			console.log(error);
			return;
		}
		
		
		
	let formData = [];
	if (addRecord.value == true) {
	  formData.push(formState.value, formState_1.value);
	}
	if (addRecord.value == false) {
	  formData.push(formState.value);
	}
	
	formData.forEach((item) => {
	  item.lineId = JSON.stringify(item.lineId);
	  // 添加 zoneId 字段，值为 id.value
	  item.zoneId = id.value;
	});
	
	AddList(formData).then((res) => {
	  message.success("添加成功");
	  visible.value = false;
	  clearData();
	  getData();
	});

	}
	
	const editEploy = (record)=>{
		console.log(record,'record')
		// 获取线路
		GetLine(`${id.value}`).then((res) => {
			let data = JSON.parse(res.lineId);
			console.log(data, 'res999');
			let transformedData = data.map((item) => {
				return {
					value: item,
					label: item,
				};
			});
			groupData.value = transformedData;
		});
		formState_edit.value.id=record.id
		BackLine(`${record.id}`).then((res) => {
			formState_edit.value.name=res.name
			formState_edit.value.type=res.type
			formState_edit.value.content=res.content
				formState_edit.value.lineId=JSON.parse(res.lineId)
				formState_edit.value.lineId= formState_edit.value.lineId.replace(/\\/g, '');
		});
		edit_visible.value=true
	}
	const clearData = ()=>{
		formState.value.name=''
		formState.value.type=''
		formState.value.lineId=undefined
		formState.value.content=''
		formState.value.zoneId=''
		formState_1.value.name=''
		formState_1.value.type=''
		formState_1.value.lineId=undefined
		formState_1.value.content=''
		formState_1.value.zoneId=''
	}
	const handleOk_edit = () =>{
	formState_edit.value.lineId=JSON.stringify(formState_edit.value.lineId)
		EditList(formState_edit.value).then(res=>{
			message.success('操作成功');
			getData();
			edit_visible.value=false
		})
		
	}
	
	const stopBtn = (record) => {
		if (record.status == 1) {
			stopStatus({
				status: 0,
				id: record.id,
			}).then((res) => {
				message.success('操作成功');
				getData();
			});
		}
		if (record.status == 0) {
			stopStatus({
				status: 1,
				id: record.id,
			}).then((res) => {
				message.success('操作成功');
				getData();
			});
		}
	};
	watchEffect(() => {
		if (visible.value == false) {
			clearData();
		}
	});
	const searchBtn = ()=>{
		GetList({
			name:search.value,
			zoneId: id.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		}).then((res) => {
			initdata.value = res.records;
			total.value = res.total;
		});
		
	}
	const resetbtn = () => {
		pageNum.value = 1;
		pageSize.value = 10;
		search.value = '';
		getData();
	};
</script>

<style>
	.page {
		background-color: #fff;
		padding: 8px;
	}
	.search {
		display: flex;
	}
	.pointer {
		cursor: pointer;
	}
	.Xicon {
		color: red;
		cursor: pointer;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: flex-start;
		font-size:15px
	}
</style>
