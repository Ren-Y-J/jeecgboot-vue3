<template>
	<div class="allhostes">
		<div class="hostes">
			<a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
				<a-row :gutter="1">
					<a-col span="3">
						<a-form-item style="margin-bottom: 0px" label="状态" name="status" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
							<a-space>
								<a-select ref="select" style="width: 120px" @focus="focus" @change="handleChange">
									<a-select-option value="1">正常</a-select-option>
									<a-select-option value="0">异常</a-select-option>
								</a-select>
							</a-space>
						</a-form-item>
					</a-col>
					<a-col :md="3" :sm="24">
						<a-form-item style="margin-bottom: 0px" label="集群名称" name="status" :labelCol="{ span: 8 }" :wrapperCol="{ span: 10 }">
							<a-space>
								<a-select ref="select" style="width: 120px" @focus="focus" @change="handleChange">
									<a-select-option value="1">权威集群</a-select-option>
									<a-select-option value="0">转发集群</a-select-option>
								</a-select>
							</a-space>
						</a-form-item>
					</a-col>
					<a-col :md="4" :sm="5">
						<span style="display: inline-block; display: flex; flex-wrap: nowrap; margin-top: 0px">
							<a-button :style="{ margin: '0px 5px ' }" type="primary" @click="handleQuery"> <search-outlined />搜索</a-button>
							<a-button :style="{ margin: '0px 5px ' }" @click="AlldelFn"><reload-outlined />重置</a-button>
						</span>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<div class="hostes" style="margin-top: 10px">
			<a-row>
				<a-col span="2">
					<a-space>
						<a-select ref="select" style="width: 120px" @focus="focus" @change="handleChange">
							<a-select-option value="1">删除</a-select-option>
						</a-select>
					</a-space>
				</a-col>
				<a-col span="4">
					<a-button :style="{ margin: '0px 5px ' }" type="primary" @click="visible = true"><plus-outlined />添加主机</a-button>
				</a-col>
			</a-row>
			<a-alert show-icon class="alert" style="margin-top: 8px" type="info">
				<template #message>
					<template v-if="number > 0">
						<span>已选定 {{ number }} 条记录(可跨页)</span>
						<a-divider type="vertical" />
						<a @click="fn">清空</a>
						<a-divider type="vertical" />
					</template>
					<template v-else>
						<span>未选中任何数据</span>
					</template>
				</template>
			</a-alert>
			<!-- 表格 -->
			<a-table :scroll="{ x: 'calc(700px + 50%)', y: 240 }" :columns="columns" :data-source="initdata">
				<template #bodyCell="{ column, record }">
					<!-- 磁盘使用情况 -->
					<template v-if="column.dataIndex === 'diskstatus'">
						<div class="pointer">
							<span> {{ record.physDiskUsed }}/{{ record.physDiskTotal }}</span>
							<a-progress :percent="30" size="small" strokeColor="#3CD275" :show-info="false" />
						</div>
					</template>
					<!-- 物理内存 -->
					<template v-if="column.dataIndex === 'storage'">
						<div class="pointer">
							<span> {{ record.physMemUsed }}/{{ record.physMemTotal }}</span>
							<a-progress :percent="30" size="small" strokeColor="#3CD275" :show-info="false" />
						</div>
					</template>

					<!-- 操作 -->
					<template v-if="column.dataIndex === 'operation'">
						<div>
							<span :style="{ margin: '0px 8px ' }" @click="openmodal(record)" class="pointer" style="color: #2e7dff">编辑</span>
							<a-popconfirm
								title="是否确认删除"
								ok-text="是"
								cancel-text="否"
								class="pointer"
								@confirm="Delbtn(record)"
								@cancel="cancel"
							>
								<span style="color: #2e7dff">删除</span>
							</a-popconfirm>
						</div>
					</template>
				</template>
			</a-table>
		</div>
	</div>
	<!-- 模态框 -->
	<a-modal v-model:visible="visible" title="添加主机" @ok="btnOK">
		<div class="addcomputer">
			<a-form-item label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input v-model:value="name"></a-input>
			</a-form-item>
			<a-form-item label="IP" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input v-model:value="ip"></a-input>
			</a-form-item>
			<a-form-item label="端口" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input v-model:value="port"></a-input>
			</a-form-item>
			<a-form-item label="root密码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input v-model:value="rootpwd"></a-input>
			</a-form-item>
			<a-form-item label="所属集群" :labelCol="{ span: 5 }" :wrapperCol="{ span: 10 }">
				<a-select v-model:value="clusterId">
					<a-select-option value="1">权威集群</a-select-option>
					<a-select-option value="0">转发集群</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="角色" :labelCol="{ span: 5 }" :wrapperCol="{ span: 10 }">
				<a-select v-model:value="role" @change="handleChange">
					<a-select-option value="1">权威</a-select-option>
					<a-select-option value="2">递归</a-select-option>
					<a-select-option value="3">权威+递归</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="机架" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input v-model:value="rack"></a-input>
			</a-form-item>
		</div>
	</a-modal>
</template>

<script name="Two-hosts" setup>
	import { message } from 'ant-design-vue';
	import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue'; //icon引入
	import { reactive, toRefs } from 'vue';
	import { addlist, getlist, dellist } from './hosts.ts';
	const data = reactive({
		visible: false,
		name: '', //主机名称
		ip: '',
		port: '',
		rootpwd: '',
		rack: '',
		role: '',
		clusterId: '',
		initdata: '',
	});
	const { visible, name, ip, port, rootpwd, rack, role, clusterId, initdata } = toRefs(data);
	const columns = [
		{
			title: '状态',
			dataIndex: 'statusName',
			width: 80,
			align: 'center',
		},
		{
			title: '名称',
			dataIndex: 'hostName',

			width: 100,
			align: 'center',
		},
		{
			title: 'ip',
			dataIndex: 'ipAddress',

			width: 150,
			align: 'center',
		},
		{
			title: '机架',
			dataIndex: 'floor',
			width: 150,
			align: 'center',
		},
		{
			title: '端口',
			dataIndex: 'port',
			width: 100,
			align: 'center',
		},
		{
			title: '集群',
			dataIndex: 'clusterName',
			width: 150,
			align: 'center',
		},
		{
			title: '磁盘使用情况',
			dataIndex: 'diskstatus',
			width: 200,
			align: 'center',
		},
		{
			title: '物理内存',
			dataIndex: 'storage',
			width: 200,
			align: 'center',
		},
		{
			title: 'CPU使用',
			dataIndex: 'cpuUsed',
			width: 150,
			align: 'center',
		},
		{
			title: '数据更新时间',
			dataIndex: 'dataUpdateTime',
			width: 150,
			align: 'center',
		},
		{
			title: '角色',
			dataIndex: 'roleName',

			width: 100,
			align: 'center',
		},
		{
			title: '操作',
			dataIndex: 'operation',

			width: 200,
			align: 'center',
		},
	];
	const getData = () => {
		getlist({
			pageNum: 10,
			pageSize: 1,
		}).then((res) => {
			console.log(res.records, '数据');
			initdata.value = res.records;
		});
	};
	getData();
	const btnOK = () => {
		addlist({
			hostName: name.value,
			ipAddress: ip.value,
			port: port.value,
			rootSec: rootpwd.value,
			clusterId: clusterId.value,
			role: role.value,
			floor: rack.value,
		})
			.then((res) => {
				message.success('添加成功');
				visible.value = false;
				clearData();
			})
			.catch((error) => {
				console.log(error, 'error');
			});
	};
	const openmodal = (record) => {
		console.log(record.clusterId, 'record');
	};
	const Delbtn = (record) => {
		console.log(record.clusterId, 'record');
		dellist({
			clusterId: record.clusterId,
		})
			.then((res) => {
				message.success('删除成功');
				getData();
			})
			.catch((error) => {
				console.log(error, 'error');
			});
	};
	const clearData = () => {
		name.value = '';
		ip.value = '';
		port.value = '';
		rootpwd.value = '';
		rack.value = '';
		role.value = '';
		clusterId.value = '';
	};
</script>

<style scoped lang="less">
	.allhostes {
		padding: 10px;
	}
	.hostes {
		width: 100%;
		background-color: #fff;
		padding: 10px;
	}
	.addcomputer {
		padding: 10px;
	}

	:deep(.ant-alert-info) {
		background-color: #e6f7ff;
		border: 1px solid #91d5ff;
	}
	.pointer {
		cursor: pointer;
	}
</style>
