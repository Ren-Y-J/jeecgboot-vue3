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
			<a-table
				:rowKey="(record) => record.hostId"
				:pagination="false"
				:scroll="{ x: 'calc(700px + 50%)', y: 555 }"
				:columns="columns"
				:data-source="initdata"
				bordered
			>
				<template v-if="column.dataIndex === 'operation'">
					<div> 阿诗丹顿洒点水 </div>
				</template>
			</a-table>

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
		<!-- 添加弹窗 -->
		 <a-modal v-model:visible="add_visible" title="添加转发服务器" @ok="handleOk">
			   <a-form
			      ref="formRef"
			      :model="formState"
			      name="basic"
			      :label-col="{ span: 6 }"
			      :wrapper-col="{ span: 16 }"
			      autocomplete="off"
			      @finish="onFinish"
			      @finishFailed="onFinishFailed"
			    >
			      <a-form-item
			        label="Username"
			        name="username"
			        :rules="[{ required: true, message: 'Please input your username!' }]"
			      >
			        <a-input v-model:value="formState.username" />
			      </a-form-item>
			  
			      <a-form-item
			        label="Password"
			        name="password"
			        :rules="[{ required: true, message: 'Please input your password!' }]"
			      >
			        <a-input-password v-model:value="formState.password" />
			      </a-form-item>
			  
			    </a-form>
			 
			 
		    </a-modal>
	</div>
</template>

<script setup>
	import { reactive, toRefs, ref } from 'vue';
	import { getlist,addlist } from './transition.ts';
	const data = reactive({
		initdata: '',
		pageNum: 1,
		pageSize: 10,
		total:'',
		add_visible:false,
		formState:{
			   username: '',
			      password: '',
		}
	});
	const { initdata,pageNum,pageSize,total,add_visible,formState } = toRefs(data);
	 const onFinish = values => {
	      console.log('Success:', values);
	    };
	    const onFinishFailed = errorInfo => {
	      console.log('Failed:', errorInfo);
	    };
const getData = () =>{
	getlist({
		pageNum:pageNum.value,
		pageSize:pageSize.value
	}).then(res=>{
		initdata.value=res.records
		total.value=res.total
	})
}
	getData()
	const columns = [
		{
			title: '名称',
			dataIndex: 'name',

			width: 80,
			align: 'center',
		},
		{
			title: '备注',
			dataIndex: 'note',
			width: 100,
			align: 'center',
		},
		{
			title: 'IP列表',
			dataIndex: 'ipList',

			width: 500,
			align: 'center',
		},
		{
			title: '操作',
			dataIndex: 'operation',

			width: 160,
			align: 'center',
		},
	];
	const seachbtn = () =>{
		add_visible.value=true
		
		
	}
	const formRef = ref(null)
	const handleOk = async () => {
		
		try {
		  await formRef.value.validate()
		} catch (error) {
		  // console.log(error);
		  return console.log(error)
		}
		
		
	}
	
	
	
	
	
	
	
	
</script>

<style>
	.page {
		padding: 8px;
		background-color: #fff;
		width: 100%;
	}
	.pointer {
		cursor: pointer;
	}
	.searchbtn {
		display: flex;
		flex-wrap: nowrap;
	}
</style>
