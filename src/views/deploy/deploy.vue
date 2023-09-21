<template>
	<div class="title">
		<!-- <span>主机组配置{{ ShowDataAllData.ipAddress }}</span> -->
		<span>主机组配置</span>
	</div>

	<div class="padding">
		<!-- 主机信息 -->
		<!-- 	<div class="header">
			<span>主机信息</span>
			<br />
			<div class="line" />
			<div class="container">
				<div>
					状态：{{ statusName }}
					<br />
					集群：{{ ShowDataAllData.clusterName }}
				</div>
				<div
					>名称：{{ ShowDataAllData.hostName }}
					<br />
					磁盘总容量：{{ ShowDataAllData.physDiskTotal }}G
				</div>
				<div>
					IP：{{ ShowDataAllData.ipAddress }}
					<br />
					物理内存总容量：{{ ShowDataAllData.physMemTotal }}G
				</div>
				<div>
					端口：{{ ShowDataAllData.port }}
					<br />
					机架：{{ ShowDataAllData.floor }}
				</div>
			</div>
		</div> -->
		<!-- 配置主机 -->

		<div class="body">
			<span>配置主机</span>
			<br />
			<div class="line" />
			<a-tabs @change="changet_bas" v-model:activeKey="activeKey">
				<a-tab-pane key="0" tab="基本配置"></a-tab-pane>
				<a-tab-pane key="1" tab="线路配置">
					<Line />
				</a-tab-pane>
				<a-tab-pane key="2" tab="域配置">
					<Area @toggleComponent="toggleComponent" />
				</a-tab-pane>
				<a-tab-pane key="3" tab="记录配置">
					<Deploy :info="parentMsg" v-if="deptype == '0'" />
					<DeployReverse :info="parentMsg" v-if="deptype == '1'" />
				</a-tab-pane>

				<a-tab-pane key="4" tab="策略配置">
					<Tactics />
				</a-tab-pane>
			</a-tabs>
			<!-- 基本配置 -->
			<div v-show="activeKey == 0" style="padding: 10px">
				<a-form
					style="margin-top: 10px"
					ref="formRef_bas"
					:model="formState_bas"
					name="basic"
					:label-col="{ span: 5 }"
					:wrapper-col="{ span: 20 }"
					autocomplete="off"
					validateTrigger="blur"
				>
					基本配置
					<a-form-item label="递归查询" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-switch
							checkedValue="1"
							unCheckedValue="0"
							checked-children="开启"
							un-checked-children="关闭"
							v-model:checked="formState_bas.recursionOn"
						/>
						<a-checkbox
							v-if="formState_bas.recursionOn == 1"
							class="custom-checkbox"
							style="margin-left: 30px"
							v-model:checked="formState_bas.limitRecursionRange"
							>限制范围</a-checkbox
						>
						<a-select
							v-model:value="formState_bas.allowRecursionList"
							v-show="formState_bas.limitRecursionRange == 1"
							mode="multiple"
							style="width: 100%; margin-top: 10px"
							placeholder="请选择"
							:options="groupData_Acl"
						></a-select>
					</a-form-item>

					<a-form-item v-show="formState_bas.recursionOn == '1'" label="递归解析方式" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-radio-group v-model:value="formState_bas.recursionType">
							<a-radio value="1">仅递归查询</a-radio>
							<a-radio value="2">仅转发查询</a-radio>
							<a-radio value="3">递归失败后转发</a-radio>
							<a-radio value="4">转发失败后递归</a-radio>
						</a-radio-group>
						<a-select
							v-model:value="formState_bas.forwarderList"
							v-show="formState_bas.recursionType !== '1'"
							mode="multiple"
							style="width: 100%; margin-top: 10px"
							placeholder="请选择"
							:options="groupData"
						></a-select>
					</a-form-item>

					<a-form-item label="响应速率限制" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-switch
							style="margin-right: 10px"
							checked-children="开启"
							un-checked-children="关闭"
							checkedValue="1"
							unCheckedValue="0"
							v-model:checked="formState_bas.rateLimitOn"
						/>
						<a-tooltip placement="topLeft">
							<template #title>
								<span style="font-size: 8px">单IP查询速率上限</span>
							</template>
							<exclamation-circle-filled />
						</a-tooltip>
						<br /><br />
						<a-input-number
							:formatter="(value) => Math.floor(value)"
							:parser="(value) => value.replace(/\D/g, '')"
							precision="0"
							min="0"
							style="width: 300px"
							placeholder="请填写对请求响应速率的上限值"
							v-model:value="formState_bas.responsesPerSecond"
							v-show="formState_bas.rateLimitOn == true"
							addon-after="次/秒"
						></a-input-number>
					</a-form-item>
				</a-form>

				<a-form
					style="margin-top: 10px"
					ref="formRef_bas"
					:model="formState_bas"
					name="basic"
					:label-col="{ span: 5 }"
					:wrapper-col="{ span: 20 }"
					autocomplete="off"
					validateTrigger="blur"
				>
					<div class="line" />
					优化配置
					<a-form-item label="DNS日志设置" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-checkbox-group v-model:value="formState_bas.loggingTypeList" style="width: 100%">
							<a-checkbox value="1">查询日志 </a-checkbox>
							<a-checkbox value="2">响应日志 </a-checkbox>
							<a-checkbox value="3">调试日志 </a-checkbox>
							<a-tooltip overlayStyle="width:1000px">
								<template #title>
									<span style="font-size: 8px">查询日志：工作节点每收到一次查询则记录一次查询日志</span>
									<br />
									<span style="font-size: 8px">响应日志：工作节点每进行一次响应则记录一次响应日志</span>
									<br />
									<span style="font-size: 8px">调试日志：工作节点的调试日志</span>
								</template>
								<exclamation-circle-filled />
							</a-tooltip>
						</a-checkbox-group>
					</a-form-item>
					<a-form-item label="NX重定向" :labelCol="{ span: 8 }" :wrapperCol="{ span: 15 }">
						<a-switch
							style="margin-right: 10px"
							checked-children="开启"
							un-checked-children="关闭"
							checkedValue="1"
							unCheckedValue="0"
							v-model:checked="formState_bas.nxRedirectOn"
						/>
						<a-tooltip>
							<template #title>
								<span style="font-size: 8px">1. 开启NX重定向后，当查询结果为NXDOMAIN时，DNS服务器将解析为指定域名或地址。</span>
								<br />
								<span style="font-size: 8px">2. 指定后缀后，DNS服务器将对指定后缀的域名进行NX重定向。</span>
								<br />
								<span style="font-size: 8px">3. IPv4和IPv6地址不能同时为空。</span>
							</template>
							<exclamation-circle-filled />
						</a-tooltip>
						<a-radio-group
							v-show="formState_bas.nxRedirectOn == 1"
							v-model:value="formState_bas.nxDomainType"
							style="width: 500px; margin-left: 10px"
						>
							<a-radio value="0">全部域名 </a-radio>
							<a-radio value="1">指定后缀 </a-radio>
						</a-radio-group>
						<br />
						<a-input
							v-show="formState_bas.nxDomainType == 1"
							placeholder="请填写要启用的NX重定向的域名后缀"
							style="width: 300px; margin-top: 5px"
							v-model:value="formState_bas.nxSuffixDomain"
						/>
						<div v-show="formState_bas.nxRedirectOn == true">
							<a-input
								style="width: 300px; margin-bottom: 5px; margin-top: 5px"
								placeholder="为空则对IPv4直接返回空解析"
								v-model:value="formState_bas.nxRedirectIpV4"
								addon-before="IPv4重定向"
							/>
							<br />
							<a-input
								style="width: 300px"
								placeholder="为空则对IPv6直接返回空解析"
								v-model:value="formState_bas.nxRedirectIpV6"
								addon-before="IPv6重定向"
							/>
						</div>
					</a-form-item>
					<a-form-item label="高级优化配置" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-radio-group v-model:value="formState_bas.advancedOption" style="width: 500px; margin-left: 10px">
							<a-radio value="0">系统默认 </a-radio>
							<a-radio value="1">自定义 </a-radio>
						</a-radio-group>
					</a-form-item>

					<a-form-item v-show="formState_bas.advancedOption == 1" label="最大递归深度" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-input-number
							:formatter="(value) => Math.floor(value)"
							:parser="(value) => value.replace(/\D/g, '')"
							precision="0"
							min="0"
							style="width: 300px"
							placeholder="最大递归深度"
							v-model:value="formState_bas.maxRecursionDepth"
							addon-after="层"
						></a-input-number>
					</a-form-item>
					<a-form-item v-show="formState_bas.advancedOption == 1" label="最大递归查询数" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-input-number
							:formatter="(value) => Math.floor(value)"
							:parser="(value) => value.replace(/\D/g, '')"
							precision="0"
							min="0"
							style="width: 300px"
							placeholder="最大递归查询数"
							v-model:value="formState_bas.maxRecursionQueries"
							addon-after="次"
						></a-input-number>
					</a-form-item>

					<a-form-item v-show="formState_bas.advancedOption == 1" label="最小缓存TTL" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-input-number
							:formatter="(value) => Math.floor(value)"
							:parser="(value) => value.replace(/\D/g, '')"
							precision="0"
							min="0"
							style="width: 300px"
							placeholder="最小缓存TTL"
							v-model:value="formState_bas.minCacheTtl"
							addon-after="秒"
						></a-input-number>
					</a-form-item>
					<a-form-item v-show="formState_bas.advancedOption == 1" label="最大缓存TTL" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-input-number
							:formatter="(value) => Math.floor(value)"
							:parser="(value) => value.replace(/\D/g, '')"
							precision="0"
							min="0"
							style="width: 300px"
							placeholder="最大缓存TTL"
							v-model:value="formState_bas.maxCacheTtl"
							addon-after="秒"
						></a-input-number>
					</a-form-item>
					<a-form-item v-show="formState_bas.advancedOption == 1" label="递归超时时间" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-input-number
							:formatter="(value) => Math.floor(value)"
							:parser="(value) => value.replace(/\D/g, '')"
							precision="0"
							min="0"
							style="width: 300px"
							placeholder="递归超时时间"
							v-model:value="formState_bas.resolverQueryTimeout"
							addon-after="秒"
						></a-input-number>
					</a-form-item>
					<a-form-item v-show="formState_bas.advancedOption == 1" label="递归最大并发数" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-input-number
							:formatter="(value) => Math.floor(value)"
							:parser="(value) => value.replace(/\D/g, '')"
							precision="0"
							min="0"
							style="width: 300px"
							placeholder="递归最大并发数"
							v-model:value="formState_bas.recursiveClients"
							addon-after="个"
						></a-input-number>
					</a-form-item>
					<a-form-item v-show="formState_bas.advancedOption == 1" label="最小否定缓存TTL" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-input-number
							:formatter="(value) => Math.floor(value)"
							:parser="(value) => value.replace(/\D/g, '')"
							precision="0"
							min="0"
							style="width: 300px"
							placeholder="最小否定缓存TTL"
							v-model:value="formState_bas.minNcacheTtl"
							addon-after="秒"
						></a-input-number>
					</a-form-item>
					<a-form-item v-show="formState_bas.advancedOption == 1" label="性能优化选项" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-checkbox-group v-model:value="formState_bas.transferFormat" style="width: 100%">
							<a-checkbox value="many-answers">域记录打包传输 </a-checkbox>
							<a-tooltip>
								<template #title>
									<span style="font-size: 8px">启用域记录打包传输，主从同步时，域记录打包节约时间</span>
								</template>
								<exclamation-circle-filled />
							</a-tooltip>
						</a-checkbox-group>
					</a-form-item>
					<a-form-item v-show="formState_bas.advancedOption == 1" label="缓存预取" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-switch
							style="margin-right: 10px"
							checked-children="开启"
							un-checked-children="关闭"
							checkedValue="1"
							unCheckedValue="0"
							v-model:checked="formState_bas.prefetch"
						/>
						<a-tooltip>
							<template #title>
								<span style="font-size: 8px">开启缓存预取后，本系统将对热点域名和重点域名进行缓存预取。</span>
							</template>
							<exclamation-circle-filled />
						</a-tooltip>
					</a-form-item>
				</a-form>
				<a-form
					style="margin-top: 10px"
					ref="formRef_bas"
					:model="formState_bas"
					name="basic"
					:label-col="{ span: 5 }"
					:wrapper-col="{ span: 20 }"
					autocomplete="off"
					validateTrigger="blur"
				>
					<div class="line" />
					安全配置
					<a-form-item label="DNSSEC" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-switch
							style="margin-right: 10px"
							checked-children="开启"
							un-checked-children="关闭"
							checkedValue="1"
							unCheckedValue="0"
							v-model:checked="formState_bas.dnssecValidation"
						/>
						<a-tooltip>
							<template #title>
								<span style="font-size: 8px">启用DNSSEC可开启系统DNSSEC功能</span>
							</template>
							<exclamation-circle-filled />
						</a-tooltip>
					</a-form-item>
					<a-form-item v-show="formState_bas.dnssecValidation == true" label="DNSSEC" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-checkbox-group v-model:value="formState_bas.dnssecEnable" style="width: 100%">
							<a-checkbox value="1">开启DNSSEC验证 </a-checkbox>
							<a-tooltip>
								<template #title>
									<span style="font-size: 8px"
										>DNSSEC验证用于对递归查询的DS结果进行验证，由于运营商网络配置不尽规范，一般不建议开启</span
									>
								</template>
								<exclamation-circle-filled />
							</a-tooltip>
						</a-checkbox-group>
					</a-form-item>
					<a-form-item label="EDNS" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-switch
							style="margin-right: 10px"
							checked-children="开启"
							un-checked-children="关闭"
							checkedValue="1"
							unCheckedValue="0"
							v-model:checked="formState_bas.edns"
						/>
						<a-tooltip>
							<template #title>
								<span style="font-size: 8px">启用EDNS可提供EDNS支持</span>
							</template>
							<exclamation-circle-filled />
						</a-tooltip>
					</a-form-item>

					<a-form-item label="递归攻击防护" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-switch
							style="margin-right: 10px"
							checked-children="开启"
							un-checked-children="关闭"
							checkedValue="1"
							unCheckedValue="0"
							v-model:checked="formState_bas.recursionProtect"
						/>
						<a-tooltip>
							<template #title>
								<span style="font-size: 8px">启用递归攻击防护，可以有效防护针对递归解析的SERFAIL攻击</span>
							</template>
							<exclamation-circle-filled />
						</a-tooltip>
						<a-button @click="BtnOk" class="btnok" type="primary">提交</a-button>
					</a-form-item>

					<a-form-item label="最小化应答" :labelCol="{ span: 8 }" :wrapperCol="{ span: 8 }">
						<a-switch
							style="margin-right: 10px"
							checked-children="开启"
							un-checked-children="关闭"
							checkedValue="1"
							unCheckedValue="0"
							v-model:checked="formState_bas.minRes"
						/>

						<a-tooltip>
							<template #title>
								<span style="font-size: 8px">启用最小化应答，将简化响应包，提升服务器性能</span>
							</template>
							<exclamation-circle-filled />
						</a-tooltip>
					</a-form-item>
				</a-form>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { UpOutlined, DownOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue'; //icon引入
	import { ShowData, EditList, ShowDataAll, transList, AclList, GetDeployList } from './deploy.ts';
	import { reactive, ref, toRefs, watchEffect } from 'vue';
	import Area from './component/deploy_area.vue';
	import Deploy from './component/deploy_record.vue';
	import Tactics from './component/Tactics.vue';
	import Line from './component/line_dep.vue';
	import DeployReverse from './component/reverse_deploy.vue';
	import { message } from 'ant-design-vue';
	const data = reactive({
		deptype: '0',
		initData: '',
		pageID: '',
		ShowDataAllData: '',
		statusName: '',
		activeKey: '0',
		formState_bas: {
			hostId: '',
			checked: '',
			checkedBox: false,
			forwarderList: [],
			recursionType: '1',
			rateLimitOn: '0',
			responsesPerSecond: '',
			loggingTypeList: [],
			nxRedirectOn: false,
			nxDomainType: '',
			advancedOption: '0',
			maxRecursionDepth: '7',
			maxRecursionQueries: '1000',
			minCacheTtl: '90',
			maxCacheTtl: '604800',
			minNcacheTtl: '90',
			resolverQueryTimeout: '10',
			recursiveClients: '10000',
			prefetch: '',
			transferFormat: '',
			dnssecValidation: '0',
			dnssecEnable: '0',
			edns: '0',
			recursionProtect: '0',
			allowRecursionList: [],
			limitRecursionRange: false,
			recursionOn: '0',
			minRes: '0',
		},
		groupData: [],
		style_switch: '',
		groupData_Acl: [],
	});

	const { deptype, initData, pageID, ShowDataAllData, statusName, activeKey, formState_bas, style_switch, groupData, groupData_Acl } = toRefs(data);
	const handleClose = () => {
		activeKey.value = 3;
	};

	const parentMsg = ref('');
	const toggleComponent = (componentName) => {
		activeKey.value = '3';
		localStorage.setItem('Dep_type', componentName);

		let id = localStorage.getItem('zoneId');
		if (componentName == '0') {
			parentMsg.value = componentName;
			deptype.value = '0';
		} else if (componentName == '1') {
			deptype.value = '1';
			parentMsg.value = componentName;
		}
	};
	const GetData = () => {
		// 转发列表
		transList().then((res) => {
			let transformedData = res.map((item) => {
				return {
					value: item.id,
					label: item.name,
				};
			});
			groupData.value = transformedData;
		});
		// ACl
		AclList().then((res) => {
			console.log(res, 'ACL');
			let transformedData = res.map((item) => {
				return {
					value: item.aclId,
					label: item.aclName,
				};
			});
			groupData_Acl.value = transformedData;
		});

		let url = location.search;
		pageID.value = url.replace('?', '');
		formState_bas.value.hostId = pageID.value;
		ShowData(`${pageID.value}`).then((res) => {
			console.log(res, 'res------------9-9-9-9-9-9-9-');
			initData.value = res;
			formState_bas.value.checked = res.confContent.checked;
			formState_bas.value.forwarderList = res.confContent.forwarderList;
			formState_bas.value.recursionType = res.confContent.recursionType;
			formState_bas.value.rateLimitOn = res.confContent.rateLimitOn;
			formState_bas.value.responsesPerSecond = res.confContent.responsesPerSecond;
			formState_bas.value.loggingTypeList = res.confContent.loggingTypeList.map(String);
			formState_bas.value.nxRedirectOn = res.confContent.nxRedirectOn;
			formState_bas.value.nxDomainType = res.confContent.nxDomainType;
			formState_bas.value.advancedOption = res.confContent.advancedOption;
			formState_bas.value.maxRecursionDepth = res.confContent.maxRecursionDepth;
			formState_bas.value.maxRecursionQueries = res.confContent.maxRecursionQueries;
			formState_bas.value.minCacheTtl = res.confContent.minCacheTtl;

			formState_bas.value.maxCacheTtl = res.confContent.maxCacheTtl;

			formState_bas.value.minNcacheTtl = res.confContent.minNcacheTtl;
			formState_bas.value.resolverQueryTimeout = res.confContent.resolverQueryTimeout;
			formState_bas.value.recursiveClients = res.confContent.recursiveClients;
			formState_bas.value.prefetch = res.confContent.prefetch;
			formState_bas.value.transferFormat = res.confContent.transferFormat;
			formState_bas.value.dnssecValidation = res.confContent.dnssecValidation;
			formState_bas.value.dnssecEnable = res.confContent.dnssecEnable;
			formState_bas.value.edns = res.confContent.edns;
			formState_bas.value.recursionProtect = res.confContent.recursionProtect;
			formState_bas.value.allowRecursionList = res.confContent.allowRecursionList;
			formState_bas.value.limitRecursionRange = res.confContent.limitRecursionRange;
			formState_bas.value.recursionOn = res.confContent.recursionOn;
			formState_bas.value.minRes = res.confContent.minRes;
		});
		ShowDataAll(`${pageID.value}`).then((res) => {
			console.log(res, 'ShowDataAll');
			ShowDataAllData.value = res;
			// if (res.status == 0) {
			// 	statusName.value = '异常';
			// } else if (res.status == 1) {
			// 	statusName.value = '正常';
			// } else {
			// 	statusName.value = '空';
			// }
			// ShowDataAllData.value.physDiskTotal = (res.physDiskTotal / 100000000).toFixed(2);
			// ShowDataAllData.value.physMemTotal = (res.physMemTotal / 100000000).toFixed(2);
		});
	};
	GetData();
	const changet_bas = () => {
		localStorage.setItem('pageID', pageID.value);
	};
	const BtnOk = async () => {
		console.log(formState_bas.value.loggingTypeList, 'formState_bas.value.6666666666');
		if (formState_bas.value.loggingTypeList == '') {
			message.error('请选择DNS日志设置');
		} else {
			formState_bas.value.transferFormat = formState_bas.value.transferFormat.toString();
			formState_bas.value.dnssecEnable = formState_bas.value.dnssecEnable.toString();
			EditList(formState_bas.value)
				.then((res) => {
					message.success('配置成功！');
					GetData();
				})
				.catch((error) => {
					console.log(error, 'error');
				});
		}
	};
</script>

<style>
	body {
		background-color: #f0f2f5;
	}
	p {
		font-size: 20px;
		line-height: 30px;
	}
	.padding {
		padding: 10px;
	}

	.pointer {
		cursor: pointer;
	}
	.body {
		margin-top: 10px;
		width: 100%;
		background-color: #fff;
		padding: 10px;
	}
	.title {
		text-align: center;
		width: 100%;
		background-color: #319eff;
		padding: 10px;
		span {
			color: #fff;
			font-size: 25px;
		}
	}
	.header {
		background-color: #fff;
		padding: 10px;
		span {
			font-size: 15px;
		}
	}
	.line {
		width: 100%;
		background-color: #f0f2f5;
		height: 1px;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.container {
		display: flex;
		justify-content: space-between;
	}

	.container-Btn {
		display: flex;
		justify-content: center;
		align-items: center;
		.text_btn {
			border: none;
		}
		.text_btn:hover {
			background-color: #fff;
		}
	}
	.btnok {
		position: fixed;
		right: 80px;
		bottom: 80px;
	}
</style>
