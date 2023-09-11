<template>
	<div class="allhostes">
		<div class="hostes">
			<a-form autocomplete="off">
				<a-row :gutter="1">
					<a-col span="3">
						<a-form-item style="margin-bottom: 0px" label="状态" name="status" :labelCol="{ span: 7 }" :wrapperCol="{ span: 10 }">
							<a-space>
								<a-select
									placeholder="请选择"
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
									placeholder="请选择"
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
		<div class="hostes" style="margin-top: 8px">
			<div style="display: flex; justify-content: space-between">
				<div class="icon">
					<a-space>
						<a-select
							ref="select"
							style="width: 120px; margin-right: 8px"
							@focus="focus"
							@change="handleChange"
							v-model="delselect"
							placeholder="批量操作"
						>
							<a-select-option value="1">删除</a-select-option>
						</a-select>
					</a-space>
					<a-button type="primary" @click="openadd"><plus-outlined />添加主机</a-button>
				</div>
				<div class="icon">
					<span class="icon-sx">
						<img src="../../assets/loginmini/icon/sx.png" alt="" @click="resetbtn" />
						<!-- <reload-outlined /> -->
					</span>
					<!-- <span class="icon-kz"><img src="../../assets/loginmini/icon/kz.png" alt="" /></span> -->
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
			<a-table
				:rowKey="(record) => record.hostId"
				:row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }"
				:pagination="false"
				:scroll="{ x: 'calc(700px + 50%)', y: 555 }"
				:columns="columns"
				:data-source="initdata"
				bordered
			>
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
					</template>

					<template v-if="column.dataIndex === 'clusterName'">
						<span> {{ record.clusterName }} </span>
					</template>
					<!-- 磁盘使用情况 -->
					<template v-if="column.dataIndex === 'diskstatus'">
						<div class="pointer" @click="goboard_disk(record)" >
							<span> {{ record.physDiskUsed }}G/{{ record.physDiskTotal }}G</span>
							<a-progress :percent="record.psy" size="small" strokeColor="#3CD275" :show-info="false" />
						</div>
					</template>
					<!-- 物理内存 -->
					<template v-if="column.dataIndex === 'storage'">
						<div class="pointer"  @click="goboard_stor(record)">
							<span> {{ record.physMemUsed }}G/{{ record.physMemTotal }}G</span>
							<a-progress :percent="record.psy" size="small" strokeColor="#3CD275" :show-info="false" />
						</div>
					</template>
					<!-- cpu使用 -->
					<template v-if="column.dataIndex === 'cpuUsed'">
						<div class="pointer" @click="goboard_cpu(record)">
							<span > {{ record.cpuUsed }}%</span>
						</div>
					</template>
					<!-- 數據更新時間 -->
					<template v-if="column.dataIndex === 'dataUpdateTime'">
						<div class="pointer">
							<span > {{ record.dataUpdateTime }}</span>
						</div>
					</template>
					<!-- 操作 -->
					<template v-if="column.dataIndex === 'operation'">
						<div>
							<span @click="openmodal(record)" class="pointer" style="color: #2e7dff; margin-right: 8px">编辑</span>
							<span class="pointer" @click="Delbtn(record)" style="color: #2e7dff; margin-right: 8px">删除</span>
							<span  class="pointer" style="color: #2e7dff">配置</span>
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
				<a-form-item label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }" :rules="formRules.name">
					<a-input @blur="changename" v-model:value="name" placeholder="请输入主机名称"></a-input>
					<span v-show="ruleshow_name" :class="{ success: rulesstatus_name, error: !rulesstatus_name }">{{ rulesmessage_name }}</span>
				</a-form-item>
				<a-form-item label="IP" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }" :rules="formRules.name">
					<a-input @blur="changeinput" v-model:value="ip" placeholder="请输入IP"></a-input>
					<span v-show="ruleshow" :class="{ success: rulesstatus, error: !rulesstatus }">{{ rulesmessage }}</span>
				</a-form-item>

				<a-form-item label="端口" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }" :rules="formRules.port">
					<a-input @blur="changeinput_2" v-model:value="port" placeholder="请输入端口"></a-input>
					<span v-show="ruleshow_1" :class="{ success: rulesstatus_1, error: !rulesstatus_1 }">{{ rulesmessage_1 }}</span>
				</a-form-item>
				<a-form-item label="root密码" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }" :rules="formRules.rootpwd">
					<a-input @blur="change_rootpwd" v-model:value="rootpwd" placeholder="请输入root密码"></a-input>
					<span v-show="ruleshow_rootpwd" :class="{ success: rulesstatus_rootpwd, error: !rulesstatus_rootpwd }">{{
						rulesmessage_rootpwd
					}}</span>
				</a-form-item>
				<a-form-item label="所属集群" :labelCol="{ span: 5 }" :wrapperCol="{ span: 10 }" :rules="formRules.clusterId">
					<a-select v-model:value="clusterId" placeholder="请选择集群">
						<a-select-option v-for="(item, index) in groupData" key="index" :value="item.clusterId">{{
							item.clusterName
						}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="角色" :labelCol="{ span: 5 }" :wrapperCol="{ span: 10 }" :rules="formRules.role">
					<a-select v-model:value="role" @change="handleChange" placeholder="请选择角色">
						<a-select-option value="1">权威</a-select-option>
						<a-select-option value="2">递归</a-select-option>
						<a-select-option value="3">权威+递归</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="机架" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }" :rules="formRules.clusterId">
					<a-input @blur="change_rack" v-model:value="rack" placeholder="请输入机架"></a-input>
					<span v-show="ruleshow_rack" :class="{ success: rulesstatus_rack, error: !rulesstatus_rack }">{{
						rulesmessage_rack
					}}</span>
				</a-form-item>
			</a-form>
		</div>
	</a-modal>
	<!-- 模态框删除 -->
	<a-modal v-model:visible="visible_del" title="删除节点" @ok="btnOK_del">
		<!-- 删除 -->
		<div class="addcomputer">
			<a-form-item label="确认服务器IP" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }" :rules="formRules.role">
				<a-input @blur="changeinput" placeholder="请输入服务器IP" v-model:value="ip"></a-input>
				<span v-show="ruleshow" :class="{ success: rulesstatus, error: !rulesstatus }">{{ rulesmessage }}</span>
			</a-form-item>
			<a-form-item label="当前用户密码" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }" :rules="formRules.role">
				<a-input @blur="change_rootpwd" placeholder="请输入当前用户密码" v-model:value="okpwd"></a-input>
				<span v-show="ruleshow_rootpwd" :class="{ success: rulesstatus_rootpwd, error: !rulesstatus_rootpwd }">{{
					rulesmessage_rootpwd
				}}</span>
			</a-form-item>
		</div>
	</a-modal>
	<!-- 模态框编辑 -->
	<a-modal v-model:visible="visible_edit" title="编辑服务器" @ok="btnOK_edit">
		<div class="addcomputer">
			<a-form-item label="IP" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }" :rules="formRules.ip">
				<a-input @blur="changeinput" placeholder="请输入IP" v-model:value="ip"></a-input>
				<span v-show="ruleshow" :class="{ success: rulesstatus, error: !rulesstatus }">{{ rulesmessage }}</span>
			</a-form-item>
			<a-form-item label="端口" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }" :rules="formRules.port">
				<a-input @blur="changeinput_2" placeholder="请输入端口" v-model:value="port"></a-input>
				<span v-show="ruleshow_1" :class="{ success: rulesstatus_1, error: !rulesstatus_1 }">{{ rulesmessage_1 }}</span>
			</a-form-item>
			<a-form-item label="root密码" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }" :rules="formRules.rootpwd">
				<a-input @blur="change_rootpwd" v-model:value="okpwd" placeholder="请输入root密码"></a-input>
				<span v-show="ruleshow_rootpwd" :class="{ success: rulesstatus_rootpwd, error: !rulesstatus_rootpwd }">{{
					rulesmessage_rootpwd
				}}</span>
			</a-form-item>
			<a-form-item label="所属集群" :labelCol="{ span: 6 }" :wrapperCol="{ span: 10 }" :rules="formRules.clusterId">
				<a-select placeholder="请选择集群" v-model:value="clusterId">
					<a-select-option v-for="(item, index) in groupData" key="index" :value="item.clusterId">{{ item.clusterName }}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="角色" :labelCol="{ span: 6 }" :wrapperCol="{ span: 10 }" :rules="formRules.role">
				<a-select placeholder="请选择角色" v-model:value="role" @change="handleChange">
					<a-select-option value="1">权威</a-select-option>
					<a-select-option value="2">递归</a-select-option>
					<a-select-option value="3">权威+递归</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="机架" :labelCol="{ span: 6 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="请输入机架" v-model:value="floor"></a-input>
			</a-form-item>
		</div>
	</a-modal>
</template>

<script name="Two-hosts" setup>
	import { message } from 'ant-design-vue';
	import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue'; //icon引入
	import { reactive, toRefs, ref, watchEffect, defineComponent, onMounted } from 'vue';
	import { addlist, getlist, dellist, showlist, editlist, grouplist } from './hosts.ts';
	import { router } from '/@/router';
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
		pageSize: 10,
		total: '',
		ipAddress: '',
		port: '',
		floor: '',
		groupData: '',
		hostId: '',
		number: 0,
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
		delselect,
		status,
		clusterName,
		number,
	} = toRefs(data);

	const getgrouplist = () => {
		grouplist().then((res) => {
			groupData.value = res;
		});
	};

	getgrouplist();
	const formRules = {
		port: [{ required: true, message: () => rulesmessage }],
		ip: [{ required: true, message: () => rulesmessage }],
		name: [{ required: true, message: () => rulesmessage }],
		rootpwd: [{ required: true, message: () => rulesmessage }],
		clusterId: [{ required: true, message: () => rulesmessage }],
		role: [{ required: true, message: () => rulesmessage }],
	};

	const rulesmessage = ref('');
	const rulesstatus = ref(false);
	const ruleshow = ref(false);
	const changeinput = () => {
		const reg = /^(\d{1,3}\.){3}\d{1,3}$/;
		if (ip.value == '') {
			rulesmessage.value = 'IP不能为空';
			ruleshow.value = true;
		} else if (!reg.test(ip.value)) {
			rulesmessage.value = 'IP输入错误';
			ruleshow.value = true;
		} else {
			ruleshow.value = false;
		}
	};
	const rulesmessage_1 = ref('');
	const rulesstatus_1 = ref(false);
	const ruleshow_1 = ref(false);

	const changeinput_2 = () => {
		const reg = /^([1-9](\d{0,3}))$|^([1-5]\d{4})$|^(6[0-4]\d{3})$|^(65[0-4]\d{2})$|^(655[0-2]\d)$|^(6553[0-5])$/;
		if (port.value == '') {
			rulesmessage_1.value = '端口不能为空';
			ruleshow_1.value = true;
		} else if (!reg.test(port.value)) {
			rulesmessage_1.value = '端口输入错误';
			ruleshow_1.value = true;
		} else {
			ruleshow_1.value = false;
		}
	};
	const ruleshow_name = ref(false);
	const rulesmessage_name = ref('');
	const changename = () => {
		if (name.value == '') {
			rulesmessage_name.value = '名称不能为空';
			ruleshow_name.value = true;
		} else {
			ruleshow_name.value = false;
		}
	};
	const ruleshow_rootpwd = ref(false);
	const rulesmessage_rootpwd = ref('');
	const change_rootpwd = () => {
		if (okpwd.value == '') {
			rulesmessage_rootpwd.value = 'root密码不能为空';
			ruleshow_rootpwd.value = true;
		} else {
			ruleshow_rootpwd.value = false;
		}
	};

const ruleshow_rack = ref(false);
	const rulesmessage_rack = ref('');
	const change_rack = () => {
		if (rack.value == '') {
			rulesmessage_rack.value = '机架不能为空';
			ruleshow_rack.value = true;
		} else {
			ruleshow_rack.value = false;
		}
	};

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
			title: '角色',
			dataIndex: 'roleName',

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
			initdata.value = res.records;
			total.value = res.total;
			console.log(res, '数据');
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
		});
	};
	getData();
	const openadd = () => {
		visible.value = true;
		name.value = '';
		ip.value = '';
		port.value = '';
		rootpwd.value = '';
		clusterId.value = undefined;
		role.value = undefined;
		rack.value = '';
	};

	const btnOK = () => {
		// 添加
		const reg1 = /^(\d{1,3}\.){3}\d{1,3}$/;
		const reg = /^([1-9](\d{0,3}))$|^([1-5]\d{4})$|^(6[0-4]\d{3})$|^(65[0-4]\d{2})$|^(655[0-2]\d)$|^(6553[0-5])$/;

		if (name.value == '') {
			message.error('请输入主机名称');
		} else if (ip.value == '') {
			message.error('IP不能为空');
		} else if (!reg1.test(ip.value)) {
			message.error('IP输入错误');
		} else if (port.value == '') {
			message.error('端口不能为空');
		} else if (!reg.test(port.value)) {
			message.error('端口输入错误');
		} else if (rootpwd.value == '') {
			message.error('请输入root密码');
		} else if (clusterId.value == '') {
			message.error('请选择所属集群');
		} else if (role.value == '') {
			message.error('请选择角色');
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
					rulesmessage_name.value = '';
					rulesmessage.value = '';
					rulesmessage_1.value = '';
					rulesmessage_rootpwd.value = '';
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
		const reg1 = /^(\d{1,3}\.){3}\d{1,3}$/;
		if (ip.value == '') {
			message.error('IP不能为空');
		} else if (!reg1.test(ip.value)) {
			message.error('IP输入错误');
		} else if (okpwd.value == '') {
			message.error('密码不能为空');
		} else {
			dellist({
				hostId: recordID.value,
				ipAddress: ip.value,
				rootSec: okpwd.value,
			})
				.then((res) => {
					message.success('删除成功');
					visible_del.value = false;
					rulesmessage.value = '';
					rulesmessage_rootpwd.value = '';
					clearData();
					getData();
				})
				.catch((error) => {
					console.log(error, 'error');
				});
		}
	};
	// 编辑框回显
	const openmodal = (record) => {
		visible_edit.value = true;
		showlist(`${record.hostId}`).then((res) => {
			hostId.value = res.hostId;
			ip.value = res.ipAddress;
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
		const reg1 = /^(\d{1,3}\.){3}\d{1,3}$/;
		const reg = /^([1-9](\d{0,3}))$|^([1-5]\d{4})$|^(6[0-4]\d{3})$|^(65[0-4]\d{2})$|^(655[0-2]\d)$|^(6553[0-5])$/;
		if (ip.value == '') {
			message.error('请输入ip');
		} else if (!reg1.test(ip.value)) {
			message.error('IP输入错误');
		} else if (port.value == '') {
			message.error('端口不能为空');
		} else if (!reg.test(port.value)) {
			message.error('端口输入错误');
		} else if (okpwd.value == '') {
			message.error('请输入root密码');
		} else if (clusterId.value == undefined) {
			message.error('请选择集群');
		} else if (role.value == undefined) {
			message.error('请选择角色');
		} else {
			editlist({
				ipAddress: ip.value,
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
					rulesmessage.value = '';
					rulesmessage_1.value = '';
					rulesmessage_rootpwd.value = '';
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
		ip.value = '';
		okpwd.value = '';
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
		ipAddress.value = '';
		floor.value = '';
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

	watchEffect(() => {
		if (visible.value == false) {
			rulesmessage_name.value = '';
			rulesmessage.value = '';
			rulesmessage_1.value = '';
			rulesmessage_rootpwd.value = '';
			clusterId.value = undefined;
			role.value = undefined;
		}
		if (visible_del.value == false) {
			rulesmessage.value = '';
			rulesmessage_rootpwd.value = '';
		}
		if (visible_edit.value == false) {
			rulesmessage.value = '';
			rulesmessage_1.value = '';
			rulesmessage_rootpwd.value = '';
		}
	});

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
	
	const goboard_cpu =(record)=>{
		let id =record.hostId
		  router.push(`/hosts/host_board?${id}`)
		console.log(record,'record')
	}
	const goboard_stor =(record)=>{
		let id =record.hostId
		  router.push(`/hosts/host_board_storage?${id}`)
		console.log(record,'record')
	}
	const goboard_disk =(record)=>{
		let id =record.hostId
		  router.push(`/hosts/host_board_disk?${id}`)
		console.log(record,'record')
	}
	
	
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

	:deep(.ant-alert-info) {
		background-color: #e6f7ff;
		border: 1px solid #91d5ff;
	}
	:deep(.ant-table-selection-column) {
		height:30px
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
