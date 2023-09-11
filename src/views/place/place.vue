<template>
	<div style="padding: 8px">
		<div class="page">
			<a-tabs v-model:activeKey="activeKey">
				<a-tab-pane key="1" tab="Tab 1">
					  <PlaceA />
				</a-tab-pane>
				<a-tab-pane key="2" tab="Tab 2" force-render>
					Content of Tab Pane 2
				</a-tab-pane>
			</a-tabs>
		</div>
	</div>
</template>

<script >
	import { PlaceA } from './place_A.vue'
	import { reactive, ref, toRefs } from 'vue';
	export default {
	  name: 'place',
	  components: {
	    PlaceA
	  }
	}
	const data = reactive({
		activeKey: '1',
	});
	const { 
		activeKey
		} = toRefs(data);
	
</script>

<style>
	.page {
		padding: 8px;
		background-color: #fff;
	}
</style>
