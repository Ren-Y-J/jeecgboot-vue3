<template>
	<div class="container">
		<div class="top">
			<img class="installicon" src="./image/install_icon.png" alt="" />
			<span> DNS安装服务</span>
		</div>
	</div>
</template>

<script setup></script>

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
	}
	.installicon {
		width: 174px;
		height: 158px;
	}
	.top {
		display: flex;
		span {
			font-size: 36px;
			font-weight: 700;
			color: #fff;
			margin-left: 40px;
			line-height: 158px;
		}
	}
</style>
