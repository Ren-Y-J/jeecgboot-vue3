<template>
	<div class="container">
		<div class="top">
			<img class="installicon" src="./image/install_icon.png" alt="" />
			<span class="title">DNS安装服务</span>
		</div>
	</div>
	<div class="container">
		<span class="title_2">正在安装DNS的主机组：{{ installName }}</span>
	</div>
	<div class="container">
		<span class="title_2">注意：如果系统检测到目标主机已经安装DNS，将自动跳过</span>
	</div>
	<div class="container">
		<button v-if="GoInstallStatus == 0" @click="handleClick" class="btnNow">
			<span> 现在安装 </span>
			<tool-outlined style="fontsize: 20px" />
		</button>
		<button v-if="GoInstallStatus == 1" class="btnNow_">
			<span> 正在安装... </span>
		</button>
	</div>
	<div class="container">
		<div class="bottomAll">
			<div style="position: sticky; top: 0" class="bottom">
				<div class="bottom_title"> 主机IP </div>
				<div class="bottom_title"> 安装状态 </div>
			</div>

			<div style="overflow: auto; height: 358px">
				<div class="bottom" v-for="(item, index) in initData" key="index">
					<div class="bottom_title">
						{{ item.ipAddress }}
					</div>
					<div v-if="item.status === '失败'" class="bottom_title">
						<img class="installicon_2" src="./image/error.png" alt="" />
					</div>
					<div v-if="item.status === '成功'" class="bottom_title">
						<img class="installicon_2" src="./image/success.png" alt="" />
					</div>
					<div v-if="item.status !== '成功' && item.status !== '失败'" class="bottom_title">
						{{ item.status }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { VerticalAlignBottomOutlined, CheckCircleOutlined, ToolOutlined } from '@ant-design/icons-vue'; //icon引入
	import { reactive, ref, toRefs, watchEffect } from 'vue';
	import { GetList, GetStatus, GetTask } from './install.ts';
	const data = reactive({
		initData: [],
		GoInstallStatus: 0,
		HostsGroupID: '',
		installName:''
		
	});

	const { timerId, installName, initData, DNSID, GoInstallStatus } = toRefs(data);
	const params = new URLSearchParams(window.location.search);
	const taskId = params.get('taskId');
	const groupId = params.get('groupId');
	installName.value = params.get('installName');
	const getData = () => {
		GetList({
			taskId: taskId,
			groupId: groupId,
		}).then((res) => {
			GoInstall();
		});
	};
	const GoInstall = async () => {
		GoInstallStatus.value = 1;
		let res = await GetStatus({
			value: taskId,
		});
		let allStatusMatched = '';
		res.forEach((item) => {
			if (item.status == '-1') {
				item.status = '待安装...';
			}
			if (item.status == '0') {
				item.status = '待执行...';
			}
			if (item.status == '1') {
				item.status = '执行中...';
			}
			if (item.status == '2') {
				item.status = '成功';
			}
			if (item.status == '3') {
				item.status = '失败';
			}
		});
		allStatusMatched = res.every((item) => item.status === '成功' || item.status === '失败');
		if (allStatusMatched) {
			clearInterval(timerId.value);
			GoInstallStatus.value = 0;
		}
		initData.value = res;
		DelF5();
	};
	GetTask({
		value: taskId,
	}).then((res) => {
		// 获取状态，对安装的回显
		if(res==1){
			GoInstall()
			GoInstallStatus.value = 1;
			timerId.value = setInterval(GoInstall, 4000);
		}
	});
	const handleClick = () => {
		getData();
		timerId.value = setInterval(GoInstall, 4000);
	};



	const DelF5 = () => {
		document.oncontextmenu = function () {
			return false;
		};
		document.onkeydown = function (event) {
			var e = event || window.event || arguments.callee.caller.arguments[0];
			if (e && e.keyCode == 116) {
				return false;
			}
		};
	};
</script>

<style>
	body {
		font-family: sans-serif; /*字体加粗*/
		background-image: url('./image/install_bg.png'); /*背景图片*/
		background-repeat: no-repeat;
		overflow: hidden;
		background-size: cover;
	}
	.container {
		margin: 36px auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.installicon {
		width: 174px;
		height: 158px;
	}
	.top {
		display: flex;
	}
	.title {
		font-size: 36px;
		font-weight: 700;
		color: #fff;
		margin-left: 40px;
		line-height: 158px;
	}
	.title_2 {
		font-weight: 700;
		font-size: 18px;
		color: #fff;
	}
	.btnNow {
		width: 248px;
		height: 70px;
		background-image: url('./image/install_btn.png');
		span {
			font-weight: 700;
			color: #fff;
			font-size: 20px;
		}
	}
	.btnNow_ {
		width: 248px;
		height: 70px;
		border-radius: 35px;
		background-image: url('./image/install_btn_error.png');
		span {
			font-weight: 700;
			color: #fff;
			font-size: 20px;
		}
	}
	.down {
		width: 24px;
		height: 26px;
	}
	.bottom {
		display: flex;
		justify-content: space-between;
	}
	.bottom div {
		flex-basis: 50%;
		display: flex;
		justify-content: center;
	}
	.bottom_title {
		font-weight: 700;
		margin-top: 15px;
		color: #fff;
		font-size: 18px;
	}
	.bottomAll {
		padding: 10px;
		width: 779px;
		height: 430px;
		border-radius: 14px;
		background: linear-gradient(to bottom, rgba(147, 165, 207, 0.5), rgba(228, 239, 233, 0.5));
	}
	.installicon_2 {
		width: 19px;
		height: 19px;
		margin-right: 5px;
		margin-top: 5px;
	}
</style>
