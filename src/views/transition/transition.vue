<template>
	<div style="padding: 10px">
		<!-- 头部搜索 -->
		<div class="page">
			<a-form autocomplete="off">
				<a-row :gutter="1">
					<a-col span="5">
						<a-form-item label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 20 }">
							<a-input v-model:value="name" placeholder="请输入名称"></a-input>
						</a-form-item>
					</a-col>
					<a-col span="5">
						<a-form-item label="备注" :labelCol="{ span: 5 }" :wrapperCol="{ span: 20 }">
							<a-input v-model:value="name" placeholder="请输入备注"></a-input>
						</a-form-item>
					</a-col>
					<a-col span="5">
						<div class="searchbtn">
							<a-button :style="{ margin: '0px 5px ' }" type="primary" @click="seachbtn"> <search-outlined />搜索</a-button>
							<a-button :style="{ margin: '0px 5px ' }" @click="resetbtn"><reload-outlined />重置</a-button>
						</div>
					</a-col>
				</a-row>
				<a-button :style="{ margin: '0px 5px ' }" type="primary" @click="seachbtn"> <search-outlined />添加转发服务器</a-button>
			</a-form>
		</div>
		<!-- 表格 -->
		<div class="page" style="margin-top: 10px">
			<a-table
				:rowKey="(record) => record.hostId"
				:pagination="false"
				:scroll="{ x: 'calc(700px + 50%)', y: 555 }"
				:columns="columns"
				:data-source="initdata"
				bordered
			>
			
			<template #bodyCell="{ column, record }">
				<template v-if="columns.dataIndex === 'ipList'">
					<div class="pointer"> 000 </div>
				</template>

				<template v-if="columns.dataIndex === 'operation'">
			 <a-table-column key="age" title="Age" data-index="ipList" />
				</template>
			</template>
			</a-table>

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
		<!-- 添加弹窗 -->
		<a-modal width="1000px" v-model:visible="add_visible" title="添加转发服务器" @ok="handleOk">
			<a-form
				style="margin-top: 10px"
				ref="formRef"
				:model="formState"
				name="basic"
				:label-col="{ span: 3 }"
				:wrapper-col="{ span: 20 }"
				autocomplete="off"
				@finish="onFinish"
				@finishFailed="onFinishFailed"
			>
				<a-form-item label="名称" name="username" :rules="[{ required: true, message: '请输入名称!' }]">
					<a-input v-model:value="name" />
				</a-form-item>

				<a-form-item label="备注">
					<a-input v-model:value="note" />
				</a-form-item>

				<a-form-item label="IP列表">
					<div class="iplist">
						<div class="iplist_title">
							<div class="iplist_title_IP">
								<span style="font-weight: 700">IP</span>
							</div>
							<div class="iplist_title_IP">
								<span style="font-weight: 700">备注</span>
							</div>
							<div class="iplist_title_IP">
								<span style="font-weight: 700; margin-right: 15px">操作</span>
							</div>
						</div>
						<div class="iplist_input" v-for="(IPlists, index) in IPlists">
							<div class="iplist_title_IP">
								<a-input v-model:value="IPlists.ip" />
							</div>
							<div class="iplist_title_IP">
								<a-input v-model:value="IPlists.note" />
							</div>
							<div class="pointer" @click="del(index)" style="margin-right: 15px">
								<close-outlined :style="{ color: 'red' }" />
							</div>
						</div>
					</div>
					<a-button style="margin-top: 8px; wdith: 100%" @click="pushbtn"> <search-outlined />添加</a-button>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script setup>
	import { reactive, toRefs, ref } from 'vue';
	import { getlist, addlist } from './transition.ts';
	import { CloseOutlined } from '@ant-design/icons-vue';
	import { message } from 'ant-design-vue';
	const data = reactive({
		initdata: '',
		pageNum: 1,
		pageSize: 10,
		total: '',
		add_visible: false,
		IPlists: [
			{
				ip: ' ',
				note: ' ',
			},
		],
		name: '',
		note: '',
	});
	const { initdata, pageNum, pageSize, total, add_visible, IPlists, name, note } = toRefs(data);
	const onFinish = (values) => {
		console.log('Success:', values);
	};
	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};
	const getData = () => {
		getlist({
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		}).then((res) => {
			initdata.value = res.records;
			total.value = res.total;
		});
	};
	getData();
	const columns = [
		{
			title: '名称',
			dataIndex: 'name',

			width: 80,
			align: 'center',
		},
		{
			title: '备注',
			dataIndex: 'note',
			width: 100,
			align: 'center',
		},
		{
			title: 'IP列表',
			dataIndex: 'ipList',

			width: 500,
			align: 'center',
		},
		{
			title: '操作',
			dataIndex: 'operation',

			width: 160,
			align: 'center',
		},
	];
	const seachbtn = () => {
		add_visible.value = true;
	};
	const formRef = ref(null);
	const handleOk = async () => {
		// try {
		// 	await formRef.value.validate();
		// } catch (error) {
		// 	// console.log(error);
		// 	return console.log(error);
		// }
		IPlists.value = IPlists.value.filter((item) => item.ip !== undefined);
		addlist({
			ipList: IPlists.value,
			name: name.value,
			note: note.value,
		}).then((res) => {
			message.success('添加成功');
			getData();
			add_visible.value = false;
		});
	};
	const del = (index) => {
		IPlists.value.splice(index, 1);
	};
	const pushbtn = () => {
		let cope = {
			ip: IPlists.value.ip,
			note: IPlists.value.note,
		};
		console.log(cope, 'cope');
		// if(cope.ip==undefined){
		// 	message.error('请输入IP');

		// }else{

		// }
		IPlists.value.push(cope);
	};
</script>

<style>
	.page {
		padding: 8px;
		background-color: #fff;
		width: 100%;
	}
	.pointer {
		cursor: pointer;
	}
	.searchbtn {
		display: flex;
		flex-wrap: nowrap;
	}

	.iplist {
		width: 100%;
	}
	.iplist_title {
		width: 100%;
		background-color: #eff2f7;
		padding: 10px;
		display: flex;
		justify-content: space-between;
		border: 1px solid #eaeef3;
		border-top: none;
	}
	.iplist_input {
		width: 100%;
		padding: 10px;
		display: flex;
		justify-content: space-between;
		border: 1px solid #eaeef3;
	}
</style>
