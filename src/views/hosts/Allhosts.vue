<template>
	<div class="allhostes">
		<div class="hostes">
			<a-form :model="formState" name="basic" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed">
				<a-row :gutter="1">
					<a-col span='3'>
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
					<a-button :style="{ margin: '0px 5px ' }" type="primary" @click="AlldelFn"><plus-outlined />添加主机</a-button>
				</a-col>
			</a-row>
			<a-alert show-icon class="alert" style="margin-top: 8px" type="info">
			  <!-- Ant Design Vue 的Alert使用 z这块我点清空我那些勾选的东西都取消 number是勾选的个数 type="info"-->
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
			
			
			
		</div>
	</div>
</template>

<script name="Two-hosts" setup>
	import { SearchOutlined, ReloadOutlined,PlusOutlined } from '@ant-design/icons-vue';
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
</style>
