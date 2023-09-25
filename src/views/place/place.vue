<template>
	<div style="padding: 8px">
		<div class="page">
			<a-tabs @change="changetabs" v-model:activeKey="activeKey">
				<a-tab-pane key="0" tab="正向域"> </a-tab-pane>
				<a-tab-pane key="1" tab="反向域" force-render> </a-tab-pane>
			</a-tabs>
			<div class="search">
				<a-form>
					<div style="display: flex">
						<a-form-item style="margin-right: 10px" label="名称" :labelCol="{ span: 5 }"
							:wrapperCol="{ span: 23 }">
							<a-input v-model:value="search" placeholder="按名称搜索"></a-input>
						</a-form-item>
						<a-form-item label="主机组" :labelCol="{ span: 6 }" :wrapperCol="{ span: 23 }">
							<a-space>
								<a-select placeholder="请选择" ref="select" style="width: 150px" v-model:value="groupId">
									<a-select-option v-for="(item, index) in HostsGroupData" key="index"
										:value="item.groupId">{{
										item.groupName
									}}</a-select-option>
								</a-select>
							</a-space>
						</a-form-item>
						<a-button @click="searchBtn" type="primary"
							style="margin-right: 10px; margin-left: 10px"><search-outlined />搜索</a-button>
						<a-button @click="resetbtn">
							<reload-outlined />
							重置
						</a-button>
					</div>
				</a-form>
			</div>
		</div>

		<div class="page" style="margin-top: 8px">
			<div style="display: flex; margin-bottom: 8px">
				<a-space>
					<a-select ref="select" style="width: 120px; margin-right: 8px" @focus="focus"
						@select="handleChange_del" v-model:value="delselect" placeholder="批量操作">
						<a-select-option value="1">删除</a-select-option>
					</a-select>
				</a-space>
				<div>
					<a-button @click="addBtn" type="primary"><plus-outlined />添加</a-button>
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
			<a-table
			 :rowKey="(record) => record.zoneId"
				:row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: rowSelection }" :pagination="false"
				:scroll="{ x: 'calc(700px + 50%)', y: 555 }" :columns="columns" :data-source="initdata" bordered>
				<template #bodyCell="{ column, record }">
					<!-- 线路 -->
					<template v-if="column.dataIndex === 'lineName'">
						<div style="display: flex; justify-content: center; align-items: center">
							<div v-for="(item, index) in record.lineName" key="index" class="iplist_data"
								style="margin-right: 10px">
								<span> {{ item }} </span>
							</div>
						</div>
					</template>
					<!-- 线路 -->
					<template v-if="column.dataIndex === 'ipAddress'">
						<div style="display: flex; justify-content: center; align-items: center" class="pointer"
							@click="GoDep(record)">
							<span
								style="text-decoration: underline; text-decoration-color: blue; color: blue">{{ record.ipAddress }}
							</span>
						</div>
					</template>
					<!-- 操作 -->
					<template v-if="column.dataIndex === 'operation'">
						<div style="display: flex;">
							<div class="pointer">
								<a-popconfirm title="是否确认删除" ok-text="是" cancel-text="否" class="del"
									@confirm="delBtn(record)">
									<a-button type="link">删除</a-button>


								</a-popconfirm>
							</div>
							<div class="pointer" @click="Godeploy(record)">
								<a-button type="link">配置</a-button>
							</div>
							<div class="pointer">
								<a-popconfirm title="是否确认？" ok-text="是" cancel-text="否" @confirm="stopBtn(record)">
									<a-button v-show="record.status == 1" type="link">禁用</a-button>
									<a-button v-show="record.status == 0" type="link">启用</a-button>
								</a-popconfirm>
							</div>
							<div class="pointer" @click="openSOA(record)">
								<a-button type="link">配置SOA</a-button>
							</div>
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
	<!-- 正向域 -->
	<a-modal v-model:visible="visible" title="添加域" @ok="handleOk">
		<a-form style="margin-top: 10px" ref="formRef" :model="formState" name="basic" :label-col="{ span: 3 }"
			:wrapper-col="{ span: 20 }" autocomplete="off" validateTrigger="blur">
			<a-form-item label="域名" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }"
				:rules="[{ required: true, message: '请输入域名!' }]" name="name">
				<a-input placeholder="不要包含主机名，如www" v-model:value="formState.name" />
			</a-form-item>
			<!-- 主机 -->
			<a-form-item :rules="[{ required: true, message: '请选择主机组!' }]" name="hosts" label="主机组"
				:labelCol="{ span: 5 }">
				<a-select @change="changehosts" ref="select" v-model:value="formState.hosts" style="width: 150px"
					placeholder="请选择主机">
					<a-select-option v-for="(item, index) in HostsData" key="index" :value="item.groupId" value="3">{{
						item.groupName
					}}</a-select-option>
				</a-select>
			</a-form-item>
			<!-- 线路 -->
			<a-form-item :rules="[{ required: true, message: '请选择线路!' }]" name="lineId" label="线路选择"
				:labelCol="{ span: 5 }">
				<a-select v-model:value="formState.lineId" mode="multiple" style="width: 150px" placeholder="请选择"
					:options="groupData"></a-select>
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
		<a-form style="margin-top: 10px" ref="formRef_" :model="formState_" name="basic" :label-col="{ span: 3 }"
			:wrapper-col="{ span: 20 }" autocomplete="off" validateTrigger="blur">
			<a-form-item label="类型" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }" name="type_1"
				:rules="[{ required: true, message: '请选择类型!' }]">
				<a-select ref="select" v-model:value="formState_.type_1" style="width: 150px" placeholder="请选择类型"
					@focus="focus" @change="handleChange">
					<a-select-option value="3">v4反向解析</a-select-option>
					<a-select-option value="4">v6反向解析</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item :rules="[{ required: true, message: '请选择主机组!' }]" name="hosts" label="主机组"
				:labelCol="{ span: 5 }">
				<a-select @change="changehosts_" ref="select" v-model:value="formState_.hosts" style="width: 150px"
					placeholder="请选择主机组">
					<a-select-option v-for="(item, index) in HostsData" key="index" :value="item.groupId" value="3">{{
						item.groupName
					}}</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item :rules="[{ required: true, message: '请输入网络地址!' }]" name="IP" label="网络地址"
				:labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="请输入网络地址" v-model:value="formState_.IP" />
			</a-form-item>
			<a-form-item
			:rules="[{ required: true, message: '请选择应用线路!' }]" name="lineId"
			
			label="应用线路" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-select v-model:value="formState_.lineId" mode="multiple" style="width: 150px" placeholder="请选择"
					:options="groupData"></a-select>
			</a-form-item>
			<a-form-item label="所属域" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="所属域" v-model:value="formState_.childZone" />
			</a-form-item>
			
			<a-form-item label="备注" :labelCol="{ span: 5 }" :wrapperCol="{ span: 15 }">
				<a-textarea v-model:value="formState_.remark" placeholder="备注" :rows="4" />
			</a-form-item>
		</a-form>
	</a-modal>
	<!-- SOA配置 -->
	<a-modal v-model:visible="visible_SOA" title="SOA配置" @ok="handleOk_SOA">
		<a-form style="margin-top: 10px" ref="formRef_SOA" :model="formState_SOA" name="basic" :label-col="{ span: 3 }"
			:wrapper-col="{ span: 20 }" autocomplete="off" validateTrigger="blur">
			<a-form-item label="主名称服务器" :labelCol="{ span: 7 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="主名称服务器" v-model:value="formState_SOA.serverName" />
			</a-form-item>
			<a-form-item label="TTL" :labelCol="{ span: 7 }" :wrapperCol="{ span: 15 }" name="ttl">
				<a-input-number :formatter="(value) => Math.floor(value)" :parser="(value) => value.replace(/\D/g, '')"
					precision="0" min="0" placeholder="TTL" v-model:value="formState_SOA.ttl" />
			</a-form-item>
			<a-form-item label="管理员邮箱" :labelCol="{ span: 7 }" :wrapperCol="{ span: 15 }">
				<a-input placeholder="管理员邮箱" v-model:value="formState_SOA.mail" />
			</a-form-item>

			<a-form-item label="刷新时间(秒)" :labelCol="{ span: 7 }" :wrapperCol="{ span: 15 }">
				<a-input-number :formatter="(value) => Math.floor(value)" :parser="(value) => value.replace(/\D/g, '')"
					precision="0" min="0" placeholder="刷新时间(秒)" v-model:value="formState_SOA.refreshTime" />
			</a-form-item>
			<a-form-item label="重试时间(秒)" :labelCol="{ span: 7 }" :wrapperCol="{ span: 15 }">
				<a-input-number :formatter="(value) => Math.floor(value)" :parser="(value) => value.replace(/\D/g, '')"
					precision="0" min="0" placeholder="重试时间(秒)" v-model:value="formState_SOA.retryTime" />
			</a-form-item>
			<a-form-item label="过期时间(秒)" :labelCol="{ span: 7 }" :wrapperCol="{ span: 15 }">
				<a-input-number :formatter="(value) => Math.floor(value)" :parser="(value) => value.replace(/\D/g, '')"
					precision="0" min="0" placeholder="过期时间(秒)" v-model:value="formState_SOA.expireTime" />
			</a-form-item>
			<a-form-item label="否定缓存时间(秒)" :labelCol="{ span: 7 }" :wrapperCol="{ span: 15 }">
				<a-input-number :formatter="(value) => Math.floor(value)" :parser="(value) => value.replace(/\D/g, '')"
					precision="0" min="0" placeholder="否定缓存时间(秒)" v-model:value="formState_SOA.minimumTime" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script setup>
	import {
		GetList,
		GetLine,
		AddLine,
		GetReverseList,
		DelLine,
		AddReverseList,
		stopStatus,
		GetHostsAll,
		SOAEcho,
		EditSOA,
		HostGroup,
	} from './place.ts';
	import {
		SearchOutlined,
		ReloadOutlined,
		PlusOutlined
	} from '@ant-design/icons-vue'; //icon引入
	import {
		reactive,
		ref,
		toRefs,
		watchEffect
	} from 'vue';
	import {
		message
	} from 'ant-design-vue';
	import {
		router
	} from '/@/router';
	const columns = [{
			title: '名称',
			dataIndex: 'zoneName',
			align: 'center',
		},
		{
			title: '线路',
			dataIndex: 'lineName',
			align: 'center',
		},
		{
			title: '主机组',
			dataIndex: 'groupName',
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
		visible_SOA: false,
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
			hosts: undefined,
		},
		formState_: {
			lineId: [],
			type_1: undefined,
			IP: '',
			childZone: '',
			remark: '',
			hosts: undefined,
		},
		formState_SOA: {
			serverName: '',
			ttl: '',
			mail: '',
			refreshTime: '',
			retryTime: '',
			expireTime: '',
			minimumTime: '',
		},
		number: 0,
		groupData: [],
		search: '',
		placetype: '0',
		total: '',
		status: 1,
		HostsData: '',
		hosts: undefined,
		zoneId: '',
		HostsGroupData: '',
		groupId: undefined,
		delselect: undefined,
	});
	const {
		delselect,
		number,
		groupId,
		formState_SOA,
		visible_SOA,
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
		hosts,
		zoneId,
		HostsGroupData,
	} = toRefs(data);

	// 多选
	const state = reactive({
		selectedRowKeys: [],
	});
	const allclusterId = ref([]);
	const rowSelection = (selectedRowKeys, selectedRows) => {
		state.selectedRowKeys = selectedRowKeys;
		allclusterId.value = selectedRows.map((item) => item.zoneId);
		number.value = allclusterId.value.length;
	};
	const clearbtn = () => {
		allclusterId.value = [];
		number.value = 0;
		state.selectedRowKeys = [];
	};
	// 批量删除提交
	const handleChange_del = () => {
		if (allclusterId.value == '') {
			message.error('请选择数据');
			return;
		}
		if (delselect.value == 1) {
			let values1 = allclusterId.value;
			DelLine({
				values: values1,
			}).then((res) => {
				message.success('删除成功');
				getData();
			});
		}
	};

	const GetHostsGroupData = () => {
		HostGroup().then((res) => {
			HostsGroupData.value = res;
		});
	};
	GetHostsGroupData();
	const changetabs = () => {
		allclusterId.value = [];
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
	const handleOk_SOA = () => {
		let arr = [];
		arr.push(formState_SOA.value);
		let soaInfo = JSON.stringify(arr);

		EditSOA({
			soaInfo: soaInfo,
			zoneId: zoneId.value,
		}).then((res) => {
			message.success('操作成功');
			visible_SOA.value = false;
			getData();
			clearData();
		});
	};
	// 回显SOA
	const openSOA = (record) => {
		visible_SOA.value = true;
		zoneId.value = record.zoneId;
		SOAEcho(`${record.zoneId}`).then((res) => {
			let data = JSON.parse(res.soaInfo);
			data.forEach((item) => {
				formState_SOA.value.expireTime = item.expireTime;
				formState_SOA.value.mail = item.mail;
				formState_SOA.value.minimumTime = item.minimumTime;
				formState_SOA.value.refreshTime = item.refreshTime;
				formState_SOA.value.retryTime = item.retryTime;
				formState_SOA.value.serverName = item.serverName;
				formState_SOA.value.ttl = item.ttl;
			});
		});
	};
	const getData = () => {
		HostGroup({}).then((res) => {
			HostsData.value = res;
		});

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
		groupId.value = undefined;
		getData();
	};
	const onShowSizeChange = (current, pageSize) => {
		pageSize.value = pageSize;
		getData();
	};
	const changehosts = () => {
		formState.value.lineId = [];

		// 获取线路
		GetLine({
			value: formState.value.hosts,
		}).then((res) => {
			const transformedData = res.map(({
				lineId: value,
				lineName: label
			}) => ({
				value,
				label
			}));
			groupData.value = transformedData;
		});
	};
	const changehosts_ = () => {
		formState_.value.lineId = [];
		// 获取线路
		GetLine({
			value: formState.value.hosts,
		}).then((res) => {
			const transformedData = res.map(({
				lineId: value,
				lineName: label
			}) => ({
				value,
				label
			}));
			groupData.value = transformedData;
		});
	};
	const addBtn = () => {
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
				groupId: groupId.value,
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
			groupId: formState.value.hosts,
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
	 const IPV4 =  /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)(\/(\d|[1-2]\d|3[0-2]))?$/;
let isValid = IPV4.test(formState_.value.IP);

const IPV6 = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;
let isValidV6 = IPV6.test(formState_.value.IP);

if(formState_.value.type_1=='3'){
	if (!isValid) {
		message.error('网络地址不符合IPV4规则');
	  return;
	}
}else if ( formState_.value.type_1=='4'  ){
	if (!isValidV6) {
		message.error('网络地址不符合IPV6规则');
	  return;
	}
}






		AddReverseList({
			groupId: formState_.value.hosts,
			type: formState_.value.type_1,
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

		formState.value.hosts = undefined;

		formState.value.type_1 = undefined;
		formState_.value.lineId = [];
		formState_.value.IP = '';
		formState_.value.remark = '';
		formState_.value.childZone = '';

		formState_SOA.value.serverName = '';
		formState_SOA.value.ttl = '';
		formState_SOA.value.mail = '';
		formState_SOA.value.refreshTime = '';
		formState_SOA.value.retryTime = '';
		formState_SOA.value.expireTime = '';
		formState_SOA.value.minimumTime = '';
	};
	const delBtn = (record) => {
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
		let id = record.zoneId;

		if (placetype.value == '0') {
			router.push(`/place/deploy?${id}`);
		}

		if (placetype.value == '1') {
			router.push(`/place/reverse_deploy?${id}`);
		}
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
	// 跳转
	const GoDep = (record) => {
		let id = record.hostId;
		window.open('/deploy?' + id);
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