<template>
	<div style="padding: 10px">
		<!-- 头部搜索 -->
		<div class="page">
			<a-form>
				<div style="display: flex">
					<a-form-item label="名称" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
						<a-input v-model:value="name" placeholder="请输入名称"></a-input>
					</a-form-item>
					<a-form-item label="备注" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
						<a-input v-model:value="note" placeholder="请输入备注"></a-input>
					</a-form-item>
					<div class="searchbtn">
						<a-button :style="{ margin: '0px 5px ' }" type="primary" @click="seachbtn"> <search-outlined />搜索</a-button>
						<a-button :style="{ margin: '0px 5px ' }" @click="resetbtn"><reload-outlined />重置</a-button>
					</div>
				</div>
			</a-form>
		</div>
		<!-- 表格 -->
		<div class="page" style="margin-top: 10px">
			<a-button type="primary" @click="addOpen"> <search-outlined />添加转发服务器</a-button>
			<a-table
				:rowKey="(record) => record.hostId"
				style="margin-top: 5px"
				:pagination="false"
				:scroll="{ x: 'calc(700px + 50%)', y: 555 }"
				:columns="columns"
				:data-source="initdata"
				bordered
			>
				<template #bodyCell="{ column, record }">
					<!-- IP列表 -->
					<template v-if="column.dataIndex === 'ipList'">
						<div v-for="(item, index) in record.ipList" key="index" class="iplist_data" style="margin-right: 10px">
							<span> {{ item.ip }}({{ item.note }}) </span>
						</div>
					</template>
					<!-- 操作 -->
					<template v-if="column.dataIndex === 'operation'">
						<div style="display: flex; justify-content: center; align-items: center">
								 <a-button  @click="editBtn(record)" type="link">编辑</a-button>
								<a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="delBtn(record)">
									 <a-button type="link">删除</a-button>
								</a-popconfirm>
						</div>
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
			>
				<a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入名称!' }]">
					<a-input v-model:value="formState.name" />
				</a-form-item>

				<a-form-item label="备注">
					<a-input v-model:value="formState.note" />
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
	import { reactive, toRefs, ref, watchEffect } from 'vue';
	import { getlist, addlist, editlist, dellist } from './transition.ts';
	import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue'; //icon引入
	import { CloseOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons-vue';
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
		modelType: '', // 弹窗类型  0添加 1修改
		recordID: '',
		formState: {
			name: '',
			note: '',
		},
	});
	const { initdata, pageNum, pageSize, total, add_visible, IPlists, name, note, modelType, recordID, formState } = toRefs(data);
	const onFinish = (values) => {
		console.log('Success:', values);
	};
	const onFinishFailed = (errorInfo) => {
		console.log('Fail123ed:', errorInfo);
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
	const addOpen = () => {
		modelType.value = 0;

		add_visible.value = true;
	};
	const formRef = ref(null);
	const handleOk = async () => {
		if (modelType.value == 0) {
			try {
				await formRef.value.validate();
			} catch (error) {
				console.log(error);
				return;
			}

			for (let i = 0; i < IPlists.value.length; i++) {
				if (IPlists.value[i].ip == undefined) {
					message.error('第' + (i + 1) + '条IP不能为空');
					return;
				}
			}
			IPlists.value = IPlists.value.filter((item) => item.ip !== undefined);
			addlist({
				ipList: IPlists.value,
				name: formState.value.name,
				note: formState.value.note,
			}).then((res) => {
				message.success('添加成功');
				formRef.value.resetFields();
				getData();
				add_visible.value = false;
			});
		}

		if (modelType.value == 1) {
			for (let i = 0; i < IPlists.value.length; i++) {
				if (IPlists.value[i].ip == undefined) {
					message.error('第' + (i + 1) + '条IP不能为空');
					return;
				}
			}
			editlist({
				id: recordID.value,
				ipList: IPlists.value,
				name: formState.value.name,
				note: formState.value.note,
			}).then((res) => {
				message.success('修改成功');
				getData();
				add_visible.value = false;
			});
		}
	};
	const del = (index) => {
		console.log(index, 'index');
		if (index !== 0) {
			IPlists.value.splice(index, 1);
		}
	};
	const pushbtn = () => {
		let cope = {
			ip: IPlists.value.ip,
			note: IPlists.value.note,
		};
		console.log(IPlists.value, 'IPlists.value');

		for (let i = 0; i < IPlists.value.length; i++) {
			if (IPlists.value[i].ip == undefined) {
				message.error( '请输入第' + (i + 1) + '条IP');
				return;
			}
		}
		
		
		
		
		if (IPlists.value[0].ip == '') {
			message.error('请输入IP');
		} else {
			IPlists.value.push(cope);
		}
	};
	const editBtn = (record) => {
		recordID.value = record.id;
		modelType.value = 1;
		add_visible.value = true;
		let foundData = initdata.value.find((data) => data.id === record.id);
		formState.value.name = foundData.name;
		formState.value.note = foundData.note;
		IPlists.value = foundData.ipList;
	};
	const delBtn = (record) => {
		dellist({
			id: record.id,
		}).then((res) => {
			message.success('删除成功');
			getData();
		});
	};

	const seachbtn = () => {
		getlist({
			name: name.value,
			note: note.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		}).then((res) => {
			initdata.value = res.records;
			total.value = res.total;
		});
	};
	const resetbtn = () => {
		name.value = '';
		note.value = '';
		pageNum.value = 1;
		pageSize.value = 10;
		formState.value.name = '';
		formState.value.note = '';
		getData();
	};
	const onShowSizeChange = (current, pageSize) => {
		pageSize = pageSize.value;
		getData();
	};
	const changeFn = (P, Ps) => {
		P = pageNum.value;
		getData();
	};
	watchEffect(() => {
		if (add_visible.value == false) {
			name.value = '';
			note.value = '';
			formState.value.name = '';
			formState.value.note = '';
			IPlists.value = [
				{
					ip: '',
					note: '',
				},
			];
		}
	});
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
