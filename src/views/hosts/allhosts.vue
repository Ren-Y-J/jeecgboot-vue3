<template>
	<div class="allhostes">
		<div class="hostes">
			<a-form autocomplete="off">
				<a-row :gutter="1">
					<a-col span="3">
						<a-form-item style="margin-bottom: 0px" label="状态" name="status" :labelCol="{ span: 7 }"
							:wrapperCol="{ span: 10 }">
							<a-space>
								<a-select placeholder="请选择" ref="select" style="width: 120px" @focus="focus"
									@change="handleChange" v-model:value="status">
									<a-select-option value="1">正常</a-select-option>
									<a-select-option value="0">异常</a-select-option>
								</a-select>
							</a-space>
						</a-form-item>
					</a-col>
					<a-col :md="4">
						<a-form-item style="margin-bottom: 0px" label="集群名称" name="status" :labelCol="{ span: 8 }"
							:wrapperCol="{ span: 10 }">
							<a-space>
								<a-select placeholder="请选择" ref="select" style="width: 150px" @focus="focus"
									@change="handleChange" v-model:value="clusterName">
									<a-select-option v-for="(item, index) in groupData" key="index"
										:value="item.clusterId">{{
										item.clusterName
									}}</a-select-option>
								</a-select>
							</a-space>
						</a-form-item>
					</a-col>
					<a-col :md="4">
						<a-form-item style="margin-bottom: 0px" label="主机组" name="status" :labelCol="{ span: 8 }"
							:wrapperCol="{ span: 10 }">
							<a-space>
								<a-select placeholder="请选择" ref="select" style="width: 150px" v-model:value="groupId">
									<a-select-option v-for="(item, index) in HostsGroupData" key="index"
										:value="item.groupId">{{
										item.groupName
									}}</a-select-option>
								</a-select>
							</a-space>
						</a-form-item>
					</a-col>
					<a-col :md="4" :sm="5">
						<div class="searchbtn">
							<a-button :style="{ margin: '0px 5px ' }" type="primary" @click="seachbtn">
								<search-outlined />搜索</a-button>
							<a-button :style="{ margin: '0px 5px ' }" @click="resetbtn"><reload-outlined />重置</a-button>
						</div>
					</a-col>
				</a-row>
			</a-form>
		</div>
		<div class="hostes" style="margin-top: 8px">
			<div style="display: flex; justify-content: space-between">
				<div class="icon">
					<a-space>
						<a-select ref="select" style="width: 120px; margin-right: 8px" @focus="focus"
							@change="handleChange" v-model="delselect" placeholder="批量操作">
							<a-select-option value="1">删除</a-select-option>
						</a-select>
					</a-space>
					<a-button type="primary" @click="openadd"><plus-outlined />添加主机</a-button>
				</div>
				<div class="icon">
					<span class="icon-sx">
						<img src="../../assets/loginmini/icon/sx.png" alt="" @click="resetbtn" />
					</span>
				</div>
			</div>

			<a-alert show-icon style="margin-top: 8px; margin-bottom: 8px" type="info">
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
			<!-- 表格 -->
			<a-table :rowKey="(record) => record.hostId"
				:row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }" :pagination="false"
				:scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns" :data-source="initdata" bordered>
				<template #bodyCell="{ column, record }">
					<!-- 状态 -->
					<template v-if="column.dataIndex === 'statusName'">
						<img style="width: 16px; height: 16px; margin-left: 30%" v-if="record.status == '0'"
							src="../../assets/loginmini/icon/error.png" alt="" />
						<img v-if="record.status == '1'" src="../../assets/loginmini/icon/status-ok.png" alt=""
							style="width: 16px; height: 16px; margin-left: 30%" />
					</template>

					<template v-if="column.dataIndex === 'clusterName'">
						<span> {{ record.clusterName }} </span>
					</template>
					<!-- 磁盘使用情况 -->
					<template v-if="column.dataIndex === 'diskstatus'">
						<div class="pointer" @click="goboard_disk(record)">
							<span> {{ record.physDiskUsed }}G/{{ record.physDiskTotal }}G</span>
							<a-progress :percent="record.psy" size="small" strokeColor="#3CD275" :show-info="false" />
						</div>
					</template>
					<!-- 物理内存 -->
					<template v-if="column.dataIndex === 'storage'">
						<div class="pointer" @click="goboard_stor(record)">
							<span> {{ record.physMemUsed }}G/{{ record.physMemTotal }}G</span>
							<a-progress :percent="record.psy" size="small" strokeColor="#3CD275" :show-info="false" />
						</div>
					</template>
					<!-- cpu使用 -->
					<template v-if="column.dataIndex === 'cpuUsed'">
						<div class="pointer" @click="goboard_cpu(record)">
							<span> {{ record.cpuUsed }}%</span>
						</div>
					</template>
					<!-- 數據更新時間 -->
					<template v-if="column.dataIndex === 'dataUpdateTime'">
						<div class="pointer">
							<span> {{ record.dataUpdateTime }}</span>
						</div>
					</template>
					<!-- 操作 -->
					<template v-if="column.dataIndex === 'operation'">
						<div>
							<a-button @click="openmodal(record)" type="link">编辑</a-button>
							<a-button @click="Delbtn(record)" type="link">删除</a-button>
							<!-- <span class="pointer" @click="GoDep(record)" style="color: #2e7dff">配置</span> -->
						</div>
					</template>
				</template>
			</a-table>
			<div style="padding: 10px; display: flex; justify-content: flex-end">
				<a-pagination :show-total="(total) => `共 ${total} 条数据`" v-model:current="pageNum" :total="total"
					v-model:pageSize="pageSize" show-size-changer @showSizeChange="onShowSizeChange"
					@change="changeFn" />
			</div>
		</div>
	</div>
	<!-- 模态框添加主机 -->
	<a-modal v-model:visible="visible" title="添加主机" @ok="btnOK">
		<!-- 添加 -->
		<div class="addcomputer">
			<a-form style="margin-top: 10px" ref="formRef" :model="formState" name="basic" :label-col="{ span: 3 }"
				:wrapper-col="{ span: 20 }" autocomplete="off" validateTrigger="blur">
				<a-form-item label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }" name="name"
					:rules="formRules.name">
					<a-input @blur="changename" v-model:value="formState.name" placeholder="请输入主机名称"></a-input>
				</a-form-item>
				<a-form-item label="IP" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }" name="ip"
					:rules="formRules.ip">
					<a-input v-model:value="formState.ip" placeholder="请输入IP"></a-input>
				</a-form-item>
				<a-form-item label="root密码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }" name="rootpwd"
					:rules="formRules.rootpwd">
					<a-input @blur="change_rootpwd" v-model:value="formState.rootpwd" placeholder="请输入root密码"></a-input>
				</a-form-item>
				<a-form-item label="所属集群" :labelCol="{ span: 5 }" :wrapperCol="{ span: 10 }" name="clusterId"
					:rules="formRules.clusterId">
					<a-select v-model:value="formState.clusterId" placeholder="请选择集群">
						<a-select-option v-for="(item, index) in groupData" key="index" :value="item.clusterId">{{
							item.clusterName
						}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="主机组" :labelCol="{ span: 5 }" :wrapperCol="{ span: 10 }">
					<a-select v-model:value="formState.groupId" @change="handleChange" placeholder="请选择主机组">
						<a-select-option v-for="(item, index) in HostsGroupData" :key="index" :value="item.groupId">{{
							item.groupName
						}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="机架" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
					<a-input @blur="change_rack" v-model:value="formState.rack" placeholder="请输入机架"></a-input>
				</a-form-item>
			</a-form>
		</div>
	</a-modal>
	<!-- 模态框删除 -->
	<a-modal v-model:visible="visible_del" title="删除主机" @ok="btnOK_del">
		<!-- 删除 -->
		<div class="addcomputer">
			<a-form style="margin-top: 10px" ref="formRef_del" :model="formState_del" name="basic"
				:label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" autocomplete="off" validateTrigger="blur">
				<a-form-item label="确认服务器IP" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }" name="ip"
					:rules="formRules.ip">
					<a-input @blur="changeinput" placeholder="请输入服务器IP" v-model:value="formState_del.ip"></a-input>
					<span v-show="ruleshow"
						:class="{ success: rulesstatus, error: !rulesstatus }">{{ rulesmessage }}</span>
				</a-form-item>
				<a-form-item label="root密码" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }" name="okpwd"
					:rules="formRules.rootpwd">
					<a-input @blur="change_rootpwd" placeholder="请输入当前用户root密码"
						v-model:value="formState_del.okpwd"></a-input>
					<span v-show="ruleshow_rootpwd"
						:class="{ success: rulesstatus_rootpwd, error: !rulesstatus_rootpwd }">{{
						rulesmessage_rootpwd
					}}</span>
				</a-form-item>
			</a-form>
		</div>
	</a-modal>
	<!-- 模态框编辑 -->
	<a-modal v-model:visible="visible_edit" title="编辑服务器" @ok="btnOK_edit">
		<div class="addcomputer">
			<a-form style="margin-top: 10px" ref="formRef_edit" :model="formState_edit" name="basic"
				:label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" autocomplete="off" validateTrigger="blur">
				<a-form-item label="IP" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }" name="ip"
					:rules="formRules.ip">
					<a-input placeholder="请输入IP" v-model:value="formState_edit.ip"></a-input>
				</a-form-item>
				<a-form-item label="root密码" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }" name="okpwd"
					:rules="formRules.rootpwd">
					<a-input v-model:value="formState_edit.okpwd" placeholder="请输入root密码"></a-input>
				</a-form-item>
				<a-form-item label="所属集群" :labelCol="{ span: 6 }" :wrapperCol="{ span: 10 }" name="clusterId"
					:rules="formRules.clusterId">
					<a-select placeholder="请选择集群" v-model:value="formState_edit.clusterId">
						<a-select-option v-for="(item, index) in groupData" key="index" :value="item.clusterId">{{
							item.clusterName
						}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="主机组" :labelCol="{ span: 6 }" :wrapperCol="{ span: 10 }">
					<a-select placeholder="请选择主机组" v-model:value="formState_edit.groupId" @change="handleChange">
						<a-select-option v-for="(item, index) in HostsGroupData" :key="index" :value="item.groupId">{{
							item.groupName
						}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="机架" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
					<a-input placeholder="请输入机架" v-model:value="formState_edit.floor"></a-input>
				</a-form-item>
			</a-form>
		</div>
	</a-modal>
</template>

<script name="Two-hosts" setup>
	import {
		message
	} from 'ant-design-vue';
	import {
		SearchOutlined,
		ReloadOutlined,
		PlusOutlined
	} from '@ant-design/icons-vue'; //icon引入
	import {
		reactive,
		toRefs,
		ref,
		watchEffect,
		defineComponent,
		onMounted
	} from 'vue';
	import {
		addlist,
		getlist,
		dellist,
		showlist,
		editlist,
		grouplist,
		HostsGroup
	} from './hosts.ts';
	import {
		router
	} from '/@/router';
	const data = reactive({
		visible: false,
		visible_del: false,
		visible_edit: false,
		groupId: undefined,
		formState: {
			name: '', //主机名称
			ip: '',
			port: '',
			rootpwd: '',
			clusterId: undefined,
			role: undefined,
			rack: '',
			groupId: undefined,
		},
		formState_del: {
			ip: '',
			okpwd: '',
		},
		formState_edit: {
			ip: '',
			port: '',
			okpwd: '',
			clusterId: undefined,
			groupId: undefined,
			floor: '',
		},
		delselect: undefined,
		status: undefined,
		clusterName: undefined,
		initdata: '',
		recordID: '',
		okIP: '',
		okpwd: '',
		pageNum: 1,
		pageSize: 10,
		total: '',
		ipAddress: '',
		port: '',
		floor: '',
		groupData: '',
		hostId: '',
		number: 0,
		HostsGroupData: '',
	});

	const {
		formState_edit,
		formState_del,
		visible,
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
		delselect,
		status,
		clusterName,
		number,
		formState,
		HostsGroupData,
		groupId,
	} = toRefs(data);

	const getgrouplist = () => {
		grouplist().then((res) => {
			groupData.value = res;
		});
	};

	getgrouplist();
	const formRules = {
		name: [{
			required: true,
			message: '请输入主机名!'
		}],
		ip: [{
			required: true,
			message: '请输入IP!'
		}],
		// port: [{ required: true, message: '请输入端口!' }],
		rootpwd: [{
			required: true,
			message: '请输入密码!'
		}],
		clusterId: [{
			required: true,
			message: '请选择集群!'
		}],
		// role: [{ required: true, message: '请选择主机组!' }],
		rack: [{
			required: true,
			message: '请输入机架!'
		}],
	};
	const columns = [{
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
			title: 'IP',
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
			width: 100,
			align: 'center',
		},
		{
			title: '数据更新时间',
			dataIndex: 'dataUpdateTime',
			width: 150,
			align: 'center',
		},
		{
			title: '主机组',
			dataIndex: 'groupName',
			width: 100,
			align: 'center',
		},
		{
			title: '操作',
			dataIndex: 'operation',

			width: 160,
			align: 'center',
		},
	];
	const getData = () => {
		getlist({
			pageNum: pageNum.value,
			pageSize: pageSize.value,
		}).then((res) => {
			res.records.forEach((item) => {
				if (item.cpuUsed == null) {
					item.cpuUsed = '-';
				}
			});
			initdata.value = res.records;
			total.value = res.total;
			var result = [];
			initdata.value.forEach((item) => {
				var percentage = (item.physDiskUsed / item.physDiskTotal) * 100;
				var psy = {
					psy: percentage.toFixed(2)
				};
				result.push(psy);
			});
			initdata.value.forEach(function(item, index) {
				item.psy = result[index].psy;
				var physMemTotal = item.physMemTotal / 1000000000;
				physMemTotal = physMemTotal.toFixed(2);
				var physDiskTotal = item.physDiskTotal / 1000000000;
				physDiskTotal = physDiskTotal.toFixed(2);
				var physDiskUsed = item.physDiskUsed / 1000000000;
				physDiskUsed = physDiskUsed.toFixed(2);
				var physMemUsed = item.physMemUsed / 1000000000;
				physMemUsed = physMemUsed.toFixed(2);
				item.physMemTotal = physMemTotal;
				item.physDiskTotal = physDiskTotal;
				item.physDiskUsed = physDiskUsed;
				item.physMemUsed = physMemUsed;
			});
		});
	};
	getData();
	const openadd = () => {
		visible.value = true;
		// name.value = '';
		// ip.value = '';
		// port.value = '';
		// rootpwd.value = '';
		// clusterId.value = undefined;
		// role.value = undefined;
		// rack.value = '';
		GetHostsGroupData();
	};
	const GetHostsGroupData = () => {
		HostsGroup().then((res) => {
			console.log(res, 'HostsGroupData');
			HostsGroupData.value = res;
		});
	};
	GetHostsGroupData();
	const formRef = ref(null);
	const btnOK = async () => {
		try {
			await formRef.value.validate();
		} catch (error) {
			console.log(error);
			return;
		}
		// 添加
		const reg1 = /^(\d{1,3}\.){3}\d{1,3}$/;
		const reg =
			/^([1-9](\d{0,3}))$|^([1-5]\d{4})$|^(6[0-4]\d{3})$|^(65[0-4]\d{2})$|^(655[0-2]\d)$|^(6553[0-5])$/;
		if (!reg1.test(formState.value.ip)) {
			message.error('IP格式错误');
		}
		// else if (!reg.test(formState.value.port)) {
		// 	message.error('端口格式错误');
		// }
		else {
			addlist({
					hostName: formState.value.name,
					ipAddress: formState.value.ip,
					port: formState.value.port,
					rootSec: formState.value.rootpwd,
					clusterId: formState.value.clusterId,
					groupId: formState.value.groupId,
					floor: formState.value.rack,
				})
				.then((res) => {
					message.success('添加成功');
					visible.value = false;
					clearData();
					getData();
				})
				.catch((error) => {
					console.log(error, 'error');
				});
		}
	};
	// 删除
	const formRef_del = ref(null);
	const btnOK_del = async () => {
		try {
			await formRef_del.value.validate();
		} catch (error) {
			console.log(error);
			return;
		}

		dellist({
				hostId: recordID.value,
				ipAddress: formState_del.value.ip,
				rootSec: formState_del.value.okpwd,
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
		hostId.value = record.hostId;

		HostsGroup().then((res) => {



			console.log(res, 'HostsGroupData编辑');
			HostsGroupData.value = res;
			const newArrayElement = {
				groupId: "",
				groupName: "不选择主机组"
			};
			HostsGroupData.value.unshift(newArrayElement);


		});



		visible_edit.value = true;
		showlist(`${record.hostId}`).then((res) => {
			console.log(res, 9);
			formState_edit.value.groupId = res.groupId;
			formState_edit.value.ip = res.ipAddress;
			formState_edit.value.port = res.port;
			formState_edit.value.clusterId = res.clusterId;
			// if (res.role == 1) {
			// 	formState_edit.value.role = '权威';
			// } else if (res.role == 2) {
			// 	formState_edit.value.role = '递归';
			// } else if (res.role == 3) {
			// 	formState_edit.value.role = '权威+递归';
			// }
			formState_edit.value.floor = res.floor;
		});
	};
	// 编辑框提交

	const formRef_edit = ref(null);
	const btnOK_edit = async () => {
		try {
			await formRef_edit.value.validate();
		} catch (error) {
			console.log(error);
			return;
		}

		const reg1 = /^(\d{1,3}\.){3}\d{1,3}$/;
		const reg =
			/^([1-9](\d{0,3}))$|^([1-5]\d{4})$|^(6[0-4]\d{3})$|^(65[0-4]\d{2})$|^(655[0-2]\d)$|^(6553[0-5])$/;
		if (!reg1.test(formState_edit.value.ip)) {
			message.error('IP输入错误');
		}
		// else if (!reg.test(formState_edit.value.port)) {
		// 	message.error('端口输入错误');
		// }
		else {
			editlist({
					ipAddress: formState_edit.value.ip,
					port: formState_edit.value.port,
					rootSec: formState_edit.value.okpwd,
					clusterId: formState_edit.value.clusterId,
					groupId: formState_edit.value.groupId,
					floor: formState_edit.value.floor,
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
		formState_del.value.ip = ''
		formState_del.value.okpwd = ''


	};
	// 字段初始化
	const clearData = () => {
		formState.value.name = '';
		formState.value.ip = '';
		formState.value.port = '';
		formState.value.rootpwd = '';
		formState.value.clusterId = '';
		formState.value.role = '';
		formState.value.rack = '';
		formState_del.value.ip = '';
		formState_del.value.okpwd = '';

		(formState_edit.value.ip = ''),
		(formState_edit.value.port = ''),
		(formState_edit.value.okpwd = ''),
		(formState_edit.value.clusterId = undefined),
		(formState_edit.value.role = undefined),
		(formState_edit.value.floor = '');
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
		pageNum.value = 1;
		pageSize.value = 10;
		(groupId.value = undefined), getData();
	};
	const seachbtn = () => {
		console.log(groupId.value, 'groupId.value');
		getlist({
			status: status.value,
			clusterId: clusterName.value,
			pageNum: pageNum.value,
			pageSize: pageSize.value,
			groupId: groupId.value,
		}).then((res) => {
			initdata.value = res.records;
			total.value = res.total;
			console.log(res, '数据');
			var result = [];
			initdata.value.forEach((item) => {
				var percentage = (item.physDiskUsed / item.physDiskTotal) * 100;
				var psy = {
					psy: percentage.toFixed(2)
				};
				result.push(psy);
			});
			initdata.value.forEach(function(item, index) {
				item.psy = result[index].psy;
				var physMemTotal = item.physMemTotal / 1000000000;
				physMemTotal = physMemTotal.toFixed(2);
				var physDiskTotal = item.physDiskTotal / 1000000000;
				physDiskTotal = physDiskTotal.toFixed(2);
				var physDiskUsed = item.physDiskUsed / 1000000000;
				physDiskUsed = physDiskUsed.toFixed(2);
				var physMemUsed = item.physMemUsed / 1000000000;
				physMemUsed = physMemUsed.toFixed(2);
				item.physMemTotal = physMemTotal;
				item.physDiskTotal = physDiskTotal;
				item.physDiskUsed = physDiskUsed;
				item.physMemUsed = physMemUsed;
			});
		});
	};

	// 多选
	const state = reactive({
		selectedRowKeys: [],
	});
	const allclusterId = ref([]);
	const rowSelection = (selectedRowKeys, selectedRows) => {
		state.selectedRowKeys = selectedRowKeys;
		console.log(selectedRowKeys, 'allclusterId');
		// 对原数组元素进行运算后再赋值给新的数组

		allclusterId.value = selectedRows.map((item) => item.hostId);

		number.value = allclusterId.value.length;
	};
	const clearbtn = () => {
		allclusterId.value = [];
		number.value = 0;
		state.selectedRowKeys = [];
	};

	const goboard_cpu = (record) => {
		let id = record.hostId;
		router.push(`/hosts/host_board?${id}`);
	};
	// 内存
	const goboard_stor = (record) => {
		let id = record.hostId;
		router.push(`/hosts/host_board_storage?${id}`);
	};
	// 磁盘
	const goboard_disk = (record) => {
		console.log(record, 'recordrecordrecordrecord');
		let id = record.groupId;
		router.push(`/hosts/host_board_disk?${id}`);
	};
	const GoDep = (record) => {
		console.log(record, 'record---');
		let id = record.groupId;
		window.open('/deploy?' + id);
	};
</script>

<style scoped lang="less">
	.allhostes {
		padding: 8px;
	}

	.hostes {
		width: 100%;
		background-color: #fff;
		padding: 8px;
	}

	.addcomputer {
		padding: 8px;
	}

	// :deep(.ant-alert-info) {
	// 	background-color: #e6f7ff;
	// 	border: 1px solid #91d5ff;
	// }
	:deep(.ant-table-selection-column) {
		height: 30px;
	}

	.searchbtn {
		display: flex;
		flex-wrap: nowrap;
	}

	@media screen and (max-width: 800px) {
		.searchbtn {
			margin-top: 8px;
		}
	}

	.pointer {
		cursor: pointer;
	}

	.success {
		color: green;
	}

	.error {
		color: red;
	}

	.icon {
		height: 32px;
		display: flex;
		align-items: center;

		.icon-sx {
			width: 22px;
			height: 16px;
			display: inline-block;

			img {
				width: 100%;
				height: 100%;
			}

			&:hover {
				cursor: pointer;
			}
		}

		.icon-kz {
			display: inline-block;
			width: 16px;
			height: 16px;

			img {
				width: 100%;
				height: 100%;
			}
		}

		span:nth-child(1) {
			padding-right: 7px;
		}
	}
</style>