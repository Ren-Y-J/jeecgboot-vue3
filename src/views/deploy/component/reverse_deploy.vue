<template>
	<div style="padding: 10px">
		<div class="page">
			<a-form>
				<div style="display: flex">
					<a-form-item label="名称" :labelCol="{ span: 6 }" :wrapperCol="{ span: 23 }">
						<a-input v-model:value="search" placeholder="按名称搜索"></a-input>
					</a-form-item>
					<a-button @click="searchBtn" type="primary" style="margin-right: 10px; margin-left: 10px"><search-outlined />搜索</a-button>
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
						<span v-show="record.type == 10">GENERATE</span>
					</template>
					<!-- 应用线路 -->
					<template v-if="column.dataIndex === 'lineName'">
						<div style="display: flex; justify-content: center; align-items: center">
							<div v-for="(item, index) in record.lineName" key="index" class="iplist_data" style="margin-right: 10px">
								<span> {{ item }} </span>
							</div>
						</div>
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
									<span v-show="record.status == 1" style="color: #1890ff">禁用</span>
									<span v-show="record.status == 0" style="color: #1890ff">启用</span>
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
	<a-modal v-model:visible="visible" title="添加记录" @ok="handleOk">
		<div style="max-height: 700px; overflow: auto">
			<a-form
				v-for="(item, index) in formState"
				style="margin-top: 10px"
				ref="formRef_"
				:model="formState"
				name="basic"
				:label-col="{ span: 3 }"
				:wrapper-col="{ span: 20 }"
				autocomplete="off"
				validateTrigger="blur"
			>
				<div class="pointer" v-if="item.id !== '1'" @click="XiconBtn(index)">
					<close-circle-filled class="Xicon" />
				</div>
				<a-form-item :label="item.label_name" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
					<a-input placeholder="记录" v-model:value="item.name" />
				</a-form-item>

				<a-form-item label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
					<a-radio-group @change="radioChange" v-model:value="item.type" style="width: 100%">
						<a-radio value="9">反向域的NS</a-radio>
						<a-radio value="8">PTR</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="线路发布" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
					<a-select v-model:value="item.lineId" mode="multiple" style="width: 100%" placeholder="请选择" :options="groupData"></a-select>
				</a-form-item>
				<a-form-item label="记录值" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
					<a-input placeholder="记录值" v-model:value="item.content" />
				</a-form-item>
			</a-form>
			<div style="display: flex; justify-content: center; align-items: center; margin-bottom: 10px">
				<a-button type="dashed" style="width: 80%" @click="addRecordBtn">增加记录</a-button>
			</div>
		</div>
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
				</a-radio-group>
			</a-form-item>
			<a-form-item label="线路发布" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-select
					v-model:value="formState_edit.lineId"
					mode="multiple"
					style="width: 100%"
					placeholder="请选择"
					:options="groupData"
				></a-select>
			</a-form-item>
			<a-form-item label="记录值" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="记录值" v-model:value="formState_edit.content" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script setup>
	import { GetList, DelList, GetLine, AddList, EditList, BackLine, stopStatus } from './reverse_deploy.ts';
	import { reactive, toRefs, ref, watchEffect, watch } from 'vue';
	import { SearchOutlined, ReloadOutlined, PlusOutlined, CloseCircleFilled } from '@ant-design/icons-vue'; //icon引入
	import { message } from 'ant-design-vue';

	const props = defineProps({
		//子组件接收父组件传递过来的值
		info: String,
	});
	//使用父组件传递过来的值
	const { info } = toRefs(props);

	watch(
		() => props.workOrder,
		(newValue, oldValue) => {
		},
		{ immediate: true, deep: true }
	);
	const data = reactive({
		id: '',
		pageNum: 1,
		pageSize: 10,
		initdata: '',
		total: 0,
		visible: false,
		addRecord: false,
		formState: [
			{
				label_name: '名称',
				id: '1',
				name: '',
				type: '',
				lineId: undefined,
				content: '',
				zoneId: '',
				status: '1',
			},
		],
		formState_1: {
			name: '',
			type: '',
			lineId: undefined,
			content: '',
			zoneId: '',
		},
		formState_edit: {
			name: '',
			type: '',
			lineId: undefined,
			content: '',
			id: '',
			zoneId: '',
			status: '1',
		},
		search: '',
		groupData: [],
		edit_visible: false,
	});
	const { id, pageNum, pageSize, initdata, total, visible, formState, groupData, addRecord, formState_1, edit_visible, formState_edit, search } =
		toRefs(data);
	const columns = [
		{
			title: '名称',
			dataIndex: 'name',
			align: 'center',
		},
		{
			title: '类型',
			dataIndex: 'type',
			align: 'center',
		},
		{
			title: '值',
			dataIndex: 'content',
			align: 'center',
		},
		{
			title: '应用线路',
			dataIndex: 'lineName',
			align: 'center',
		},
		{
			title: '状态',
			dataIndex: 'status',
			align: 'center',
		},

		{
			title: '操作',
			dataIndex: 'operation',
			align: 'center',
		},
	];

	const getData = () => {
		// id.value = url.replace('?', '');

		id.value = localStorage.getItem('zoneId');

		formState_1.value.zoneId = id.value;
		formState.value.zoneId = id.value;
		formState_edit.value.zoneId = id.value;

		let url = location.search;
		let hostid = url.replace('?', '');

		GetList({
			hostId: hostid,
			zoneId: id.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		}).then((res) => {
			initdata.value = res.records;
			total.value = res.total;
		});
	};
	getData();
	const addRecordBtn = () => {
		formState.value.push({
			name: '',
			type: '',
			lineId: undefined,
			ttl: '',
			content: '',
			zoneId: '',
			status: '1',
			label_name: '名称',
		});

		addRecord.value = true;
	};
	const radioChange = () => {
		formState.value.forEach((item) => {
			if (item.type == 3) {
				item.label_name = '名称';
			}
			if (item.type == 8) {
				item.label_name = '地址';
			}
			if (item.type == 10) {
				item.label_name = '名称';
			}
		});
	};
	const XiconBtn = (index) => {
		formState.value.splice(index, 1);
	};
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
	const handleOk = async () => {
		for (let i = 0; i < formState.value.length; i++) {
			if (formState.value[i].name == '') {
				message.error('请输入第' + (i + 1) + '条记录名称');
				return;
			}
			if (formState.value[i].type == '') {
				message.error('请选择第' + (i + 1) + '条类型');
				return;
			}
			if (formState.value[i].lineId == undefined) {
				message.error('请选择第' + (i + 1) + '条线路发布');
				return;
			}
			if (formState.value[i].content == '') {
				message.error('请输入第' + (i + 1) + '条记录值');
				return;
			}

			if (typeof formState.value[i].lineId !== 'string') {
				formState.value[i].lineId = JSON.stringify(formState.value[i].lineId);
			}
			formState.value[i].zoneId = id.value;
		}

		AddList(formState.value).then((res) => {
			message.success('添加成功');
			visible.value = false;
			clearData();
			getData();
		});
	};

	const editEploy = (record) => {
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
		formState_edit.value.id = record.id;
		BackLine(`${record.id}`).then((res) => {
			formState_edit.value.name = res.name;
			formState_edit.value.type = res.type;
			formState_edit.value.content = res.content;
			formState_edit.value.lineId = JSON.parse(res.lineId);
			formState_edit.value.lineId = formState_edit.value.lineId.replace(/\\/g, '');
		});
		edit_visible.value = true;
	};
	const clearData = () => {
		formState.value.forEach((item) => {
			item.name = '';
			item.type = '';
			item.lineId = undefined;
			item.ttl = '';
			item.content = '';
			item.zoneId = '';
			item.status = '1';
		});
		formState.value.length = 1;
	};
	const handleOk_edit = () => {
		formState_edit.value.lineId = JSON.stringify(formState_edit.value.lineId);
		EditList(formState_edit.value).then((res) => {
			message.success('操作成功');
			getData();
			edit_visible.value = false;
		});
	};

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
	const searchBtn = () => {
		GetList({
			name: search.value,
			zoneId: id.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		}).then((res) => {
			initdata.value = res.records;
			total.value = res.total;
		});
	};
	const resetbtn = () => {
		pageNum.value = 1;
		pageSize.value = 10;
		search.value = '';
		getData();
	};
</script>

<style scoped lang="less">
	// 标题
	/deep/.ant-table-thead > tr > th,
	.ant-table-tbody > tr > td,
	.ant-table tfoot > tr > th,
	.ant-table tfoot > tr > td {
		padding: 7.5px 16px;
	}
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
		font-size: 15px;
	}
</style>
