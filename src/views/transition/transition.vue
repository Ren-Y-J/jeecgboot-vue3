<template>
	<div style="padding: 10px">
		<!-- 头部搜索 -->
		<div class="page">
			<a-form autocomplete="off">
				<a-row :gutter="1">
					<a-col span="5">
						<a-form-item label="名称" :labelCol="{ span: 5 }" :wrapperCol="{ span: 20 }">
							<a-input v-model:value="name" placeholder="请输入名称"></a-input>
						</a-form-item>
					</a-col>
					<a-col span="5">
						<a-form-item label="备注" :labelCol="{ span: 5 }" :wrapperCol="{ span: 20 }">
							<a-input v-model:value="name" placeholder="请输入备注"></a-input>
						</a-form-item>
					</a-col>
					<a-col span="5">
						<div class="searchbtn">
							<a-button :style="{ margin: '0px 5px ' }" type="primary" @click="seachbtn"> <search-outlined />搜索</a-button>
							<a-button :style="{ margin: '0px 5px ' }" @click="resetbtn"><reload-outlined />重置</a-button>
						</div>
					</a-col>
				</a-row>
				<a-button :style="{ margin: '0px 5px ' }" type="primary" @click="seachbtn"> <search-outlined />添加转发服务器</a-button>
			</a-form>
		</div>
		<!-- 表格 -->
		<div class="page" style="margin-top: 10px">
			<a-table :pagination="false" :scroll="{ x: 'calc(700px + 50%)', y: 440 }" :columns="columns" :data-source="initdata" bordered> </a-table>
			<!-- 分页 -->
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
</template>

<script>
	import { reactive, toRefs, ref } from 'vue';
	const data = reactive({
		initdata: '',
	});
	const { initdata } = toRefs(data);
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
	];
</script>

<style>
	.page {
		padding: 10px;
		background-color: #fff;
		width: 100%;
	}
</style>
