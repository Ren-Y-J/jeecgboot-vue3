<template>
	<div class="mainset">
		<div class="nav">
			<a-form
				name="basic"
				:label-col="{ span: 4 }"
				:wrapper-col="{ span: 16 }"
				autocomplete="off"
				@finish="onFinish"
				@finishFailed="onFinishFailed"
			>
				<a-row :gutter="1">
					<a-col :md="6" :sm="24">
						<a-form-item style="margin-bottom: 0px" label="主机组名称" name="zone" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
							<a-input placeholder="请输入主机组名称" v-model:value="formData.groupName" />
						</a-form-item>
					</a-col>
					<a-col :md="4" :sm="5">
						<span class="searchbtn" style="display: inline-block; display: flex; flex-wrap: nowrap">
							<a-button :style="{ margin: '0px 5px ' }" type="primary" @click="searchFn"> <search-outlined /> 搜索</a-button>
							<a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
						</span>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<div class="contaion">
			<a-card>
				<a-button type="primary" style="margin-bottom: 4px" @click="isOpen"><plus-outlined />添加</a-button>
				<a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns" :data-source="datalist" bordered>
					<template #bodyCell="{ column, record }">
						<!-- 操作 -->
						<template v-if="column.dataIndex === 'operation'">
							<div style="display: flex; justify-content: center; align-items: center">
								<div class="pointer" style="margin-right: 10px">
									<a-button type="link" @click="isOpen(record)">编辑</a-button>
								</div>
								<div class="pointer" style="margin-right: 10px">
									<a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del" @confirm="confirm(record)">
										<a-button type="link">删除</a-button>
									</a-popconfirm>
								</div>
								<div class="pointer" style="margin-right: 10px">
									<a-popconfirm title="是否确认？" ok-text="是" cancel-text="否" @confirm="stopBtn(record)">
										<span v-show="record.status == 1" style="color: #1890ff">禁用</span>
										<span v-show="record.status == 0" style="color: #1890ff">启用</span>
									</a-popconfirm>
								</div>
								<div class="pointer" style="margin-right: 10px">
									<a-button type="link" @click="GoDep(record)">配置</a-button>
								</div>
								<div class="pointer" style="margin-right: 10px">
									<a-button type="link" @click="GoInstall(record)">安装向导</a-button>
								</div>
							</div>
						</template>
					</template>
				</a-table>
				<div class="pagination">
					<a-pagination
						:show-total="(totals) => `共 ${totals} 条数据`"
						v-model:current="formData.pageNum"
						:total="totals"
						v-model:pageSize="formData.pageSize"
						show-size-changer
						@showSizeChange="onShowSizeChange"
						@change="changeFn"
					/>
				</div>
			</a-card>
		</div>
		<div class="modal">
			<a-modal v-model:visible="visible" :title="opTitle" @ok="addoreditFn" @cancel="onCloses">
				<a-form
					:model="rowData"
					ref="formRefmainset"
					name="basic"
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 16 }"
					autocomplete="off"
					@finish="onFinish"
					@finishFailed="onFinishFailed"
					validateTrigger="blur"
				>
					<a-form-item :rules="formRules.groupName" label="主机组名称" name="groupName" style="margin-top: 26px">
						<a-input v-model:value="rowData.groupName" placeholder="请输入主机组名称" />
					</a-form-item>
				</a-form>
			</a-modal>
		</div>
	</div>
</template>
<script name="mainset" setup>
	import { defineComponent, reactive, ref, toRefs } from 'vue';
	import { mainsetlist, addmainset, edimainset, delmainset,GetHostsGroup } from './mainset.ts';
	import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue';
	import { message } from 'ant-design-vue';
	import { router } from '/@/router';
	const columns = [
		{
			title: '主机组',
			dataIndex: 'groupName',
			align: 'center',
		},
		{
			title: '创建时间',
			dataIndex: 'createTime',
			align: 'center',
		},
		{
			title: '操作',
			dataIndex: 'operation',
			align: 'center',
		},
	];
	const formRules = {
		groupName: [
			{
				required: true,
				message: '请输入主机组名称',
			},
		],
	};
	const data = reactive({
		visible: false,
		datalist: '',

		totals: '',
		opTitle: '主机组添加',
		formRefmainset: null,
	});
	const { opTitle, datalist, totals, visible, formRefmainset } = toRefs(data);
	const formData = ref({
		groupName: '',
		pageNum: 1,
		pageSize: 10,
	});
	const rowData = ref({
		groupName: '',
	});
	// 表格初始化
	const initData = async () => {
		let res = await mainsetlist(formData.value);
		console.log(res);
		datalist.value = res.records;
		totals.value = res.total;
	};
	initData();
	const isOpen = async (record) => {
		console.log(record, 'record.createTime');
		visible.value = true;
		// clusterId标题用rowdata里的id是否存在进行判断,页面关闭的时候也清空一下
		if (record.groupId) {
			rowData.value.groupName = record.groupName;
			rowData.value.groupId = record.groupId;
			// rowData.value = record
			opTitle.value = '编辑主机组';
		} else {
			opTitle.value = '添加主机组';
			// 确保上次没有缓存
			rowData.value = {
				groupName: '',
			};
			// rowData.value = { groupName: rowData.value.groupName }
		}
	};
	const addoreditFn = async () => {
		try {
			await formRefmainset.value.validate();
		} catch (error) {
			// console.log(error);
			return console.log(error);
		}
		console.log(rowData);

		if (rowData.value.groupId) {
			await edimainset(rowData.value);
			visible.value = false;
			message.success('修改成功');
			initData();
			onCloses();
		} else {
			await addmainset(rowData.value);
			visible.value = false;
			message.success('添加成功');
			initData();
			onClose();
		}
	};
	// 关闭弹框

	const onCloses = () => {
		visible.value = false;
		formRefmainset.value.resetFields();
		opTitle.value = '';
		// groupName清空 恢复默认数据类型
		rowData.value = {
			groupName: '',
		};
	};
	// 删除
	const delFn = async (groupId) => {
		await delmainset({
			groupId: groupId,
		});
		// 更新列表
		initData();
		message.success('删除成功');
	};
	const confirm = (recoed) => {
		// console.log(recoed.groupId);
		delFn(recoed.groupId);
		initData();
	};
	// 分页
	const changeFn = (P, Ps) => {
		formData.value.pageNum = P;
		initData();
	};
	const onShowSizeChange = (current, pageSize) => {
		formData.value.pageSize = pageSize;
		initData();
	};
	// 搜索重置
	const searchFn = () => {
		formData.value.pageNum = 1;
		initData();
	};
	const AlldelFn = () => {
		formData.value.groupName = '';
		initData();
	};
	const GoDep = (record) => {
		let id = record.groupId;
		window.open('/deploy?' + id);
		console.log(record, 'record');
		localStorage.setItem('groupName', record.groupName);
	};


	const GoInstall = (record) => {


		GetHostsGroup().then((res)=>{
			// console.log(res)
			// localStorage.setItem('HostsGroupID', res);
      let id = record.groupId;
      window.open('/install?groupId=' + id+"&taskId="+res);

		})








	};




</script>
<style scoped lang="less">
	.mainset {
		padding: 10px;

		.nav {
			padding: 8px;
			background-color: #fff;

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

		.contaion {
			margin-top: 6px;
			// padding: 8px;
			// margin: 10px;

			.pagination {
				margin: 10px 0 0 0;
				display: flex;
				justify-content: flex-end;
			}

			// 标题
			/deep/.ant-table-thead > tr > th,
			.ant-table-tbody > tr > td,
			.ant-table tfoot > tr > th,
			.ant-table tfoot > tr > td {
				padding: 7.5px 16px;
			}

			/deep/ .ant-card-body {
				padding: 6px !important;
			}

			/deep/ .ant-table-tbody > tr > td {
				padding: 6px !important;
			}
		}
	}
</style>
