<template>
	<div class="allhostes">
		<div class="hostes">
			<a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
				<a-row :gutter="1">
					<a-col span="3">
						<a-form-item style="margin-bottom: 0px" label="状态" name="status" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
							<a-space>
								<a-select
									placeholder="选择状态"
									ref="select"
									style="width: 120px"
									@focus="focus"
									@change="handleChange"
									v-model:value="status"
								>
									<a-select-option value="1">正常</a-select-option>
									<a-select-option value="0">异常</a-select-option>
								</a-select>
							</a-space>
						</a-form-item>
					</a-col>
					<a-col :md="4">
						<a-form-item style="margin-bottom: 0px" label="集群名称" name="status" :labelCol="{ span: 8 }" :wrapperCol="{ span: 10 }">
							<a-space>
								<a-select
									placeholder="选择集群名称"
									ref="select"
									style="width: 150px"
									@focus="focus"
									@change="handleChange"
									v-model:value="clusterName"
								>
									<a-select-option v-for="(item, index) in groupData" key="index" :value="item.clusterId">{{
										item.clusterName
									}}</a-select-option>
								</a-select>
							</a-space>
						</a-form-item>
					</a-col>
					<a-col :md="4" :sm="5">
						<div class="searchbtn">
							<a-button :style="{ margin: '0px 5px ' }" type="primary" @click="seachbtn"> <search-outlined />搜索</a-button>
							<a-button :style="{ margin: '0px 5px ' }" @click="resetbtn"><reload-outlined />重置</a-button>
						</div>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<div class="hostes" style="margin-top: 10px">
			<a-space>
				<a-select ref="select" style="width: 120px" @focus="focus" @change="handleChange" v-model="delselect" placeholder="批量操作">
					<a-select-option value="1">删除</a-select-option>
				</a-select>
			</a-space>
			<a-button :style="{ margin: '0px 5px ' }" type="primary" @click="openadd"><plus-outlined />添加主机</a-button>
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
			<a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 440 }" :columns="columns" :data-source="initdata" bordered>
				<template #bodyCell="{ column, record }">
					<!-- 状态 -->
					<template v-if="column.dataIndex === 'statusName'">
						<img
							style="width: 16px; height: 16px; margin-left: 30%"
							v-if="record.status == '0'"
							src="../../assets/loginmini/icon/error.png"
							alt=""
						/>
						<img
							v-if="record.status == '1'"
							src="../../assets/loginmini/icon/status-ok.png"
							alt=""
							style="width: 16px; height: 16px; margin-left: 30%"
						/>
						<span v-if="record.status == null"> 数据缺失</span>
					</template>

					<template v-if="column.dataIndex === 'clusterName'">
						<span v-if="record.clusterName !== ''"> {{ record.clusterName }} </span>
						<span v-if="record.clusterName == null"> 数据缺失</span>
					</template>
					<!-- 磁盘使用情况 -->
					<template v-if="column.dataIndex === 'diskstatus'">
						<div class="pointer">
							<span> {{ record.physDiskUsed }}G/{{ record.physDiskTotal }}G</span>
							<a-progress :percent="record.psy" size="small" strokeColor="#3CD275" :show-info="false" />
						</div>
					</template>
					<!-- 物理内存 -->
					<template v-if="column.dataIndex === 'storage'">
						<div class="pointer">
							<span> {{ record.physMemUsed }}G/{{ record.physMemTotal }}G</span>
							<a-progress :percent="record.psy" size="small" strokeColor="#3CD275" :show-info="false" />
						</div>
					</template>
					<!-- cpu使用 -->
					<template v-if="column.dataIndex === 'cpuUsed'">
						<div class="pointer">
							<span> {{ record.cpuUsed }}%</span>
						</div>
					</template>
					<!-- 操作 -->
					<template v-if="column.dataIndex === 'operation'">
						<div>
							<span :style="{ margin: '0px 8px ' }" @click="openmodal(record)" class="pointer" style="color: #2e7dff">编辑</span>
							<span class="pointer" @click="Delbtn(record)" style="color: #2e7dff">删除</span>
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
	<!-- 模态框添加主机 -->
	<a-modal v-model:visible="visible" title="添加主机" @ok="btnOK">
		<!-- 添加 -->
		<div class="addcomputer">
			<a-form ref="formRef" validateTrigger="blur">
				<a-form-item label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
					<a-input v-model:value="name" placeholder="请输入主机名称"></a-input>
				</a-form-item>
				<a-form-item name="ip" label="IP" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }" :rules="formRules.ip">
					<a-input v-model:value="ip" placeholder="请输入IP"></a-input>
				</a-form-item>

				<a-form-item label="端口" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
					<a-input v-model:value="port" placeholder="请输入端口"></a-input>
				</a-form-item>
				<a-form-item label="root密码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
					<a-input v-model:value="rootpwd" placeholder="请输入root密码"></a-input>
				</a-form-item>
				<a-form-item label="所属集群" :labelCol="{ span: 5 }" :wrapperCol="{ span: 10 }">
					<a-select v-model:value="clusterId" placeholder="请选择集群">
						<a-select-option v-for="(item, index) in groupData" key="index" :value="item.clusterId">{{
							item.clusterName
						}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="角色" :labelCol="{ span: 5 }" :wrapperCol="{ span: 10 }">
					<a-select v-model:value="role" @change="handleChange" placeholder="请选择角色">
						<a-select-option value="1">权威</a-select-option>
						<a-select-option value="2">递归</a-select-option>
						<a-select-option value="3">权威+递归</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="机架" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
					<a-input v-model:value="rack" placeholder="请输入机架"></a-input>
				</a-form-item>
			</a-form>
		</div>
	</a-modal>
	<!-- 模态框删除 -->
	<a-modal v-model:visible="visible_del" title="删除节点" @ok="btnOK_del">
		<!-- 删除 -->
		<div class="addcomputer">
			<a-form-item label="确认服务器IP" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
				<a-input v-model:value="okIP"></a-input>
			</a-form-item>
			<a-form-item label="当前用户密码" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
				<a-input v-model:value="okpwd"></a-input>
			</a-form-item>
		</div>
	</a-modal>
	<!-- 模态框编辑 -->
	<a-modal v-model:visible="visible_edit" title="编辑服务器" @ok="btnOK_edit">
		<div class="addcomputer">
			<a-form-item label="IP" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
				<a-input v-model:value="ipAddress"></a-input>
			</a-form-item>
			<a-form-item label="端口" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
				<a-input v-model:value="port"></a-input>
			</a-form-item>
			<a-form-item label="root密码" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
				<a-input v-model:value="okpwd" placeholder="请输入root密码"></a-input>
			</a-form-item>
			<a-form-item label="所属集群" :labelCol="{ span: 6 }" :wrapperCol="{ span: 10 }">
				<a-select v-model:value="clusterId">
					<a-select-option v-for="(item, index) in groupData" key="index" :value="item.clusterId">{{ item.clusterName }}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="角色" :labelCol="{ span: 6 }" :wrapperCol="{ span: 10 }">
				<a-select v-model:value="role" @change="handleChange">
					<a-select-option value="1">权威</a-select-option>
					<a-select-option value="2">递归</a-select-option>
					<a-select-option value="3">权威+递归</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="机架" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
				<a-input v-model:value="floor"></a-input>
			</a-form-item>
		</div>
	</a-modal>
</template>

<script name="Two-hosts" setup>
	import { message } from 'ant-design-vue';
	import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue'; //icon引入
	import { reactive, toRefs } from 'vue';
	import { addlist, getlist, dellist, showlist, editlist, grouplist } from './hosts.ts';
	const data = reactive({
		visible: false,
		visible_del: false,
		visible_edit: false,
		name: '', //主机名称
		ip: '',
		port: '',
		rootpwd: '',
		rack: '',
		role: undefined,
		clusterId: undefined,
		delselect: undefined,
		status: undefined,
		clusterName: undefined,
		initdata: '',
		recordID: '',
		okIP: '',
		okpwd: '',
		pageNum: 1,
		pageSize: 50,
		total: '',
		ipAddress: '',
		port: '',
		floor: '',
		groupData: '',
		hostId: '',
		formRules: {
			ip: [{ required: true, message: '请输入ip' }],
		},
	});

	const {
		visible,
		name,
		ip,
		port,
		rootpwd,
		rack,
		role,
		clusterId,
		initdata,
		recordID,
		okIP,
		okpwd,
		visible_del,
		pageNum,
		pageSize,
		total,
		visible_edit,
		ipAddress,
		floor,
		groupData,
		hostId,
		formRules,
		delselect,
		status,
		clusterName,
	} = toRefs(data);

	const getgrouplist = () => {
		grouplist().then((res) => {
			groupData.value = res;
			console.log(groupData.value, 'getgrouplist');
		});
	};
	getgrouplist();
	const columns = [
		{
			title: '状态',
			dataIndex: 'statusName',
			width: 70,
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
			width: 100,
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

			width: 180,
			align: 'center',
		},
	];
	const getData = () => {
		getlist({
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		}).then((res) => {
			initdata.value = res.records;
			total.value = res.total;
			var result = [];
			initdata.value.forEach((item) => {
				var percentage = (item.physDiskUsed / item.physDiskTotal) * 100;
				var psy = { psy: percentage.toFixed(2) };
				result.push(psy);
			});
			initdata.value.forEach(function (item, index) {
				item.psy = result[index].psy;
				var physMemTotal = item.physMemTotal / 1000000000;
				var physDiskTotal = item.physDiskTotal / 1000000000;
				var physDiskUsed = item.physDiskUsed / 1000000000;
				var physMemUsed = item.physMemUsed / 1000000000;
				item.physMemTotal = physMemTotal;
				item.physDiskTotal = physDiskTotal;
				item.physDiskUsed = physDiskUsed;
				item.physMemUsed = physMemUsed;
			});

			console.log(initdata.value, '66');
		});
	};
	getData();
	const openadd = () => {
		visible.value = true;
	};

	const btnOK = () => {
		// 添加
		if (name.value == '') {
			message.error('请输入主机名称');
		} else if (ip.value == '') {
			message.error('请输入IP');
		} else if (ip.value.length != 5) {
			message.error('请输入5位数IP');
		} else if (port.value.length != 5) {
			message.error('请输入5位数端口');
		} else if (port.value == '') {
			message.error('请输入端口');
		} else if (rootpwd.value == '') {
			message.error('请输入root密码');
		} else if (clusterId.value == '') {
			message.error('请选择所属集群');
		} else if (role.value == '') {
			message.error('请选择角色');
		} else if (rack.value == '') {
			message.error('请输入机架');
		} else {
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
					getData();
					modaltype.value = '';
				})
				.catch((error) => {
					console.log(error, 'error');
				});
		}
	};
	// 删除
	const btnOK_del = () => {
		dellist({
			hostId: recordID.value,
			ipAddress: okIP.value,
			rootSec: okpwd.value,
		})
			.then((res) => {
				message.success('删除成功');
				visible_del.value = false;
				clearData();
				getData();
			})
			.catch((error) => {
				console.log(error, 'error');
			});
	};
	// 编辑框回显
	const openmodal = (record) => {
		visible_edit.value = true;

		showlist(`${record.hostId}`).then((res) => {
			console.log(res, '回显');
			hostId.value = res.hostId;
			ipAddress.value = res.ipAddress;
			port.value = res.port;

			clusterId.value = res.clusterId;
			if (res.role == 1) {
				role.value = '权威';
			} else if (res.role == 2) {
				role.value = '递归';
			} else if (res.role == 3) {
				role.value = '权威+递归';
			}
			floor.value = res.floor;
		});
	};
	// 编辑框提交
	const btnOK_edit = () => {
		if ((okpwd.value = '')) {
			message.error('请输入root密码');
		} else {
			editlist({
				ipAddress: ipAddress.value,
				port: port.value,
				rootSec: okpwd.value,
				clusterId: clusterId.value,
				role: role.value,
				floor: floor.value,
				hostId: hostId.value,
			})
				.then((res) => {
					message.success('修改成功');
					visible_edit.value = false;
					clearData();
					getData();
				})
				.catch((error) => {
					console.log(error, 'error');
				});
		}
	};
	const Delbtn = (record) => {
		recordID.value = record.hostId;
		visible_del.value = true;
	};
	// 字段初始化
	const clearData = () => {
		name.value = '';
		ip.value = '';
		port.value = '';
		rootpwd.value = '';
		rack.value = '';
		role.value = '';
		clusterId.value = '';
		okIP.value = '';
		okpwd.value = '';
		(ipAddress.value = ''), (floor.value = '');
	};
	const onShowSizeChange = (current, pageSize) => {
		pageSize = pageSize.value;
		getData();
	};
	const changeFn = (P, Ps) => {
		P = pageNum.value;
		getData();
	};
	const resetbtn = () => {
		status.value = undefined;
		clusterName.value = undefined;
		getData();
	};
	const seachbtn = () => {
		getlist({
			pageNum: pageNum.value,
			pageSize: pageSize.value,
			status: status.value,
			clusterId: clusterName.value,
		}).then((res) => {
			initdata.value = res.records;
			total.value = res.total;
		});
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
	.searchbtn {
		display: flex;
		flex-wrap: nowrap;
	}
	@media screen and (max-width: 800px) {
		.searchbtn {
			margin-top: 10px;
		}
	}

	.pointer {
		cursor: pointer;
	}
</style>
