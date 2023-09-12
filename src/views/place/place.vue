<template>
	<div style="padding: 8px">
		<div class="page">
			<a-tabs @change="changetabs" v-model:activeKey="activeKey">
				<a-tab-pane key="0" tab="正向域"> </a-tab-pane>
				<a-tab-pane key="1" tab="反向域" force-render> </a-tab-pane>
			</a-tabs>
			<div class="search">
				<a-form-item :labelCol="{ span: 5 }" :wrapperCol="{ span: 23 }">
					<a-input v-model:value="note" placeholder="按名称搜索"></a-input>
				</a-form-item>
				<a-button type="primary">搜索</a-button>
			</div>
			<div style="margin-bottom: 8px">
				<a-button @click="addBtn" type="primary">添加</a-button>
			</div>

			<a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns" :data-source="initdata" bordered>
				<template #bodyCell="{ column, record }">
					<!-- 操作 -->
					<template v-if="column.dataIndex === 'operation'">
						<div style="display: flex; justify-content: center; align-items: center">
							<div class="pointer">
								<a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="delBtn(record)">
									<span style="color: red">删除</span>
								</a-popconfirm>
							</div>
						</div>
					</template>
				</template>
			</a-table>
		</div>
	</div>
	<a-modal v-model:visible="visible" title="添加域" @ok="handleOk"> 
	<div v-if="activeKey=='0'">
		<a-form
			style="margin-top: 10px"
			ref="formRef"
			:model="formState"
			name="basic"
			:label-col="{ span: 3 }"
			:wrapper-col="{ span: 20 }"
			autocomplete="off"
		>
			<a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入名称!' }]">
				<a-input v-model:value="formState.name" />
			</a-form-item>
		</a-form>
		
	</div>
	
	
	
	
	</a-modal>
</template>

<script setup>
	import { GetList } from './place.ts';
	import { reactive, ref, toRefs } from 'vue';
	const columns = [
		{
			title: '名称',
			dataIndex: 'zoneName',
		},
		{
			title: '线路',
			dataIndex: 'lineId',
		},
		{
			title: '备注',
			dataIndex: 'remark',
		},
		{
			title: '操作',
			dataIndex: 'operation',
		},
	];
	const data = reactive({
		activeKey: '0',
		type: 0,
		pageNum: 1,
		pageSize: 10,
		initdata: '',
		visible: false,
		formState: {
			name: '',
		},
	});
	const { type, activeKey, pageNum, pageSize, initdata, visible,formState } = toRefs(data);
	const changetabs = () => {
		type.value = activeKey.value;
		GetList({
			type: type.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		}).then((res) => {
			initdata.value = res.records;
		});
	};
	const getData = () => {
		GetList({
			type: type.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		}).then((res) => {
			initdata.value = res.records;
		});
	};
	getData();
	const addBtn = () => {
		visible.value = true;
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
