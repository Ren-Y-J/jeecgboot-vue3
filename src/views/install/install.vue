<template>
	<div class="container">
		<div class="top">
			<img class="installicon" src="./image/install_icon.png" alt="" />
			<span class="title">DNS安装服务</span>
		</div>
	</div>
	<div class="container">
		<span class="title_2">正在安装DNS的主机组：主机组01</span>
	</div>
	<div class="container">
		<span class="title_2">注意：如果系统检测到目标主机已经安装DNS，将自动跳过</span>
	</div>
	<div class="container">
		<button class='btnNow'>
			<span>
				现在安装
			</span>
		<vertical-align-bottom-outlined style='fontSize:20px' />
		</button>
	</div>
	<div class="container">
		<div class='bottom'>
			<div class="bottom_title">
				主机IP
			</div>
			<div class="bottom_title">
				安装状态
			</div>
		</div>
	</div>
</template>

<script setup>
		import { VerticalAlignBottomOutlined} from '@ant-design/icons-vue'; //icon引入
	
	
	
	
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
	.btnNow{
		width: 248px;
		height: 70px;
		  background-image: url('./image/install_btn.png');
		span{
				font-weight: 700;
			color: #fff;
			font-size: 20px;
		}
	}
	.down{
		width: 24px;
		height: 26px;
	}
	.bottom{
		 display: flex;
		  justify-content: space-between;
		width: 779px;
		height: 430px;
		border-radius: 14px;
		 background: linear-gradient(to bottom, rgba(147, 165, 207, 0.5), rgba(228, 239, 233, 0.5));
	}
	.bottom div {
	  flex-basis: 50%;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	}
	.bottom_title{
		color: #fff;
		font-size: 18px;
	}
</style>
