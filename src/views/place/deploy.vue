<template>
	
	
	配置
	
	
	
</template>

<script setup>
	import { GetList } from './deploy.ts'
		import { reactive, toRefs, ref } from 'vue';
			const data = reactive({
				id:'',
				pageNum: 1,
				pageSize: 10,
			})
			const {
				id,
				pageNum,
				pageSize
			}= toRefs(data);
		
	const getData = () => {
		let url = location.search;
		id.value = url.replace('?', '');
		GetList({
			id:id.value,
			pageNum:pageNum.value,
			pageSize:pageSize.value
		}).then(res=>{
			console.log(res,'---')
		})
	};
	getData();
</script>

<style>
	
</style>