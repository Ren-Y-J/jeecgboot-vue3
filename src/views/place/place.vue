<template>
	<div style="padding: 8px">
		<div class="page">
			<a-tabs @change="changetabs" v-model:activeKey="activeKey">
				<a-tab-pane key="0" tab="正向域"> </a-tab-pane>
				<a-tab-pane key="1" tab="反向域" force-render> </a-tab-pane>
			</a-tabs>
			<div class="search">
				<a-form-item :labelCol="{ span: 5 }" :wrapperCol="{ span: 23 }">
					<a-input v-model:value="search" placeholder="按名称搜索"></a-input>
				</a-form-item>
				<a-button @click="searchBtn" type="primary" style="margin-right: 10px"><search-outlined />搜索</a-button>
				<a-button @click="resetbtn">
					<reload-outlined />
					重置
				</a-button>
			</div>
			<div style="margin-bottom: 8px">
				<a-button @click="addBtn" type="primary"><plus-outlined />添加</a-button>
			</div>
		</div>
		<div class="page" style="margin-top: 8px" >
			<a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns" :data-source="initdata" bordered>
				<template #bodyCell="{ column, record }">
					<!-- 操作 -->
					<template v-if="column.dataIndex === 'operation'">
						<div style="display: flex; justify-content: center; align-items: center">
							<div class="pointer" style="margin-right: 10px">
								<a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="delBtn(record)">
									<span style="color: #1890ff">删除</span>
								</a-popconfirm>
							</div>
							<div class="pointer" style="margin-right: 10px" @click="Godeploy(record)">
								<span style="color: #1890ff">配置</span>
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
	<!-- 正向域 -->
	<a-modal v-model:visible="visible" title="添加域" @ok="handleOk">
		<a-form
			style="margin-top: 10px"
			ref="formRef"
			:model="formState"
			name="basic"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 20 }"
			autocomplete="off"
			validateTrigger="blur"
		>
			<a-form-item
				label="域名"
				:labelCol="{ span: 5 }"
				:wrapperCol="{ span: 15 }"
				:rules="[{ required: true, message: '请输入域名!' }]"
				name="name"
			>
				<a-input placeholder="不要包含主机名，如www" v-model:value="formState.name" />
			</a-form-item>

			<a-form-item label="线路选择" :labelCol="{ span: 5 }">
				<a-select v-model:value="formState.lineId" mode="multiple" style="width: 150px" placeholder="请选择" :options="groupData"></a-select>
			</a-form-item>
			<a-form-item label="主机" :labelCol="{ span: 5 }">
				<a-select ref="select" v-model:value="hosts" style="width: 150px" placeholder="请选择主机">
					<a-select-option v-for="(item, index) in HostsData" key="index" :value="item.hostId" value="3">{{item.hostName}}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="子域名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="请输入子域名" v-model:value="formState.childZone" />
			</a-form-item>
			<a-form-item label="备注" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-textarea v-model:value="formState.remark" placeholder="备注" :rows="4" />
			</a-form-item>
		</a-form>
	</a-modal>
	<!-- 反向域 -->
	<a-modal v-model:visible="visible_1" title="添加域" @ok="handleOk_">
		<a-form
			style="margin-top: 10px"
			ref="formRef_"
			:model="formState_"
			name="basic"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 20 }"
			autocomplete="off"
			validateTrigger="blur"
		>
			<a-form-item label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-select ref="select" v-model:value="type_1" style="width: 150px" placeholder="请选择类型" @focus="focus" @change="handleChange">
					<a-select-option value="3">v4反向解析</a-select-option>
					<a-select-option value="4">v6反向解析</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="主机" :labelCol="{ span: 5 }">
				<a-select ref="select" v-model:value="hosts" style="width: 150px" placeholder="请选择主机">
					<a-select-option v-for="(item, index) in HostsData" key="index" :value="item.hostId" value="3">{{item.hostName}}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item
				:rules="[{ required: true, message: '请输入域名!' }]"
				name="IP"
				label="网络地址"
				:labelCol="{ span: 5 }"
				:wrapperCol="{ span: 15 }"
			>
				<a-input placeholder="请输入网络地址" v-model:value="formState_.IP" />
			</a-form-item>
			<a-form-item label="所属域" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="所属域" v-model:value="formState_.childZone" />
			</a-form-item>
			<a-form-item label="应用线路" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-select v-model:value="formState_.lineId" mode="multiple" style="width: 150px" placeholder="请选择" :options="groupData"></a-select>
			</a-form-item>
			<a-form-item label="备注" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-textarea v-model:value="formState_.remark" placeholder="备注" :rows="4" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script setup>
	import { GetList, GetLine, AddLine, GetReverseList, DelLine, AddReverseList, stopStatus,GetHostsAll } from './place.ts';
	import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue'; //icon引入
	import { reactive, ref, toRefs, watchEffect } from 'vue';
	import { message } from 'ant-design-vue';
	import { router } from '/@/router';
	const columns = [
		{
			title: '名称',
			dataIndex: 'zoneName',
			align: 'center',
		},
		{
			title: '线路',
			dataIndex: 'lineId',
			align: 'center',
		},
		{
			title: '备注',
			dataIndex: 'remark',
			align: 'center',
		},
		{
			title: '操作',
			dataIndex: 'operation',
			align: 'center',
		},
	];
	const data = reactive({
		activeKey: '0',
		type: 0,
		pageNum: 1,
		pageSize: 10,
		initdata: '',
		visible: false,
		visible_1: false,
		formState: {
			name: '',
			lineId: [],
			childZone: '',
			remark: '',
			IP: '',
		},
		formState_: {
			lineId: [],

			IP: '',
			childZone: '',
			remark: '',
		},
		type_1: undefined,
		groupData: [],
		search: '',
		placetype: '0',
		total: '',
		status: 1,
		HostsData:'',
		hosts:undefined
	});
	const {
		type,
		activeKey,
		pageNum,
		pageSize,
		initdata,
		visible,
		formState,
		groupData,
		search,
		placetype,
		total,
		status,
		visible_1,
		formState_,
		type_1,
		HostsData,
		hosts
	} = toRefs(data);
	const changetabs = () => {
		placetype.value = activeKey.value;
		if (placetype.value == '0') {
			GetList({
				type: 0,
				pageNum: pageNum.value,
				pageSize: pageSize.value,
			}).then((res) => {
				initdata.value = res.records;
				total.value = res.total;
			});
		}
		if (placetype.value == '1') {
			GetReverseList({
				type: 0,
				pageNum: pageNum.value,
				pageSize: pageSize.value,
			}).then((res) => {
				initdata.value = res.records;
				total.value = res.total;
			});
		}
	};
	const getData = () => {
		GetHostsAll({
			
		}).then(res=>{
			HostsData.value=res
		})
		if (placetype.value == '0') {
			GetList({
				type: 0,
				pageNum: pageNum.value,
				pageSize: pageSize.value,
			}).then((res) => {
				initdata.value = res.records;
				total.value = res.total;
			});
		}
		if (placetype.value == '1') {
			GetReverseList({
				type: 0,
				pageNum: pageNum.value,
				pageSize: pageSize.value,
			}).then((res) => {
				initdata.value = res.records;
				total.value = res.total;
			});
		}
	};
	getData();
	//分页功能
	const changeFn = (P, Ps) => {
		pageNum.value = P;
		getData();
	};
	const resetbtn = () => {
		pageNum.value = 1;
		pageSize.value = 10;
		search.value = '';
		getData();
	};
	const onShowSizeChange = (current, pageSize) => {
		pageSize.value = pageSize;
		getData();
	};
	const addBtn = () => {
		// 获取线路
		GetLine({}).then((res) => {
			const transformedData = res.map(({ lineId: value, lineName: label }) => ({ value, label }));
			groupData.value = transformedData;
		});

		if (placetype.value == '0') {
			visible.value = true;
		}
		if (placetype.value == '1') {
			visible_1.value = true;
		}
	};
	const searchBtn = () => {
		if (placetype.value == '0') {
			GetList({
				zoneName: search.value,
				pageNum: pageNum.value,
				pageSize: pageSize.value,
			}).then((res) => {
				initdata.value = res.records;
			});
		}
		if (placetype.value == '1') {
			GetReverseList({
				zoneName: search.value,
				pageNum: pageNum.value,
				pageSize: pageSize.value,
			}).then((res) => {
				initdata.value = res.records;
			});
		}
	};
	const formRef = ref(null);
	const handleOk = async () => {
		// 校验表单
		try {
			await formRef.value.validate();
		} catch (error) {
			console.log(error);
			return;
		}
		AddLine({
			hostId:hosts.value,
			type: 0,
			zoneName: formState.value.name,
			lineId: JSON.stringify(formState.value.lineId),
			childZone: formState.value.childZone,
			remark: formState.value.remark,
		}).then((res) => {
			visible.value = false;
			message.success('添加成功');
			clearData();
			getData();
		});
	};
	// 反向域
	const formRef_ = ref(null);
	const handleOk_ = async () => {
		try {
			await formRef_.value.validate();
		} catch (error) {
			// console.log(error);
			console.log(error);
			return;
		}
		AddReverseList({
				hostId:hosts.value,
			type: type_1.value,
			reverseIpAddr: formState_.value.IP,
			lineId: JSON.stringify(formState_.value.lineId),
			remark: formState_.value.remark,
			childZone: formState_.value.childZone,
		}).then((res) => {
			visible_1.value = false;
			message.success('添加成功');
			clearData();
			getData();
		});
	};
	const clearData = () => {
		formState.value.name = '';
		formState.value.lineId = [];
		formState.value.childZone = '';
		formState.value.remark = '';
		type_1.value = undefined;
		formState_.value.lineId = [];
		formState_.value.IP = '';
		formState_.value.remark = '';
		formState_.value.childZone = '';
	};
	const delBtn = (record) => {
		console.log(record, 'record');
		let values1 = [record.zoneId];
		DelLine({
			values: values1,
		}).then((res) => {
			message.success('删除成功');
			getData();
		});
	};
	watchEffect(() => {
		if (visible.value == false) {
			clearData();
		}
	});
	const Godeploy = (record) => {
		console.log(placetype.value, 'placetype.value');
		let id = record.zoneId;
		router.push(`/place/deploy?${id}`);
	};
	const stopBtn = (record) => {
		if (record.status == 1) {
			stopStatus({
				status: 0,
				zoneId: record.zoneId,
			}).then((res) => {
				message.success('操作成功');
				getData();
			});
		}
		if (record.status == 0) {
			stopStatus({
				status: 1,
				zoneId: record.zoneId,
			}).then((res) => {
				message.success('操作成功');
				getData();
			});
		}
	};
</script>

<style>
	.page {
		padding: 8px;
		background-color: #fff;
	}
	.button {
		display: flex;
		float: right;
		margin-bottom: 8px;
	}
	.pointer {
		cursor: pointer;
	}
	.search {
		display: flex;
	}
</style>
