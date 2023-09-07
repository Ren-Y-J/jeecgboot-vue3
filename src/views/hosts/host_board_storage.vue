<template>
	<div class="page">
		<a-button @click="btn">返回上一级页面</a-button>
		<!-- v-scale="{ target: 'width', origin: 'top left' }" 页面缩放 -->
		<div>
			<div class="top" style="">
				<!-- 日图 -->
				<div class="chart_day" style="margin-bottom: 10px">
					日图
					<e-charts class="chart" :option="option" />
					<span class="charttxt"> 占用内存：</span>
					<span class="charttxt"> 最大{{ maxUsed_day }}GB</span>
					<span class="charttxt"> 最小{{ minUsed_day }}GB</span>
					<span class="charttxt"> 平均{{ averUsed_day }}GB</span>
					<span class="charttxt">当前{{ curUsed_day }}GB</span>
					<br />
					<span class="charttxt"> 空闲内存：</span>
					<span class="charttxt"> 最大{{ maxFree_day }}GB</span>
					<span class="charttxt"> 最小{{ minFree_day }}GB</span>
					<span class="charttxt"> 平均{{ averFree_day }}GB</span>
					<span class="charttxt">当前{{ curFree_day }}GB</span>
					<br />
					<span class="charttxt"> 缓存内存：</span>
					<span class="charttxt"> 最大{{ maxCache_day }}GB</span>
					<span class="charttxt"> 最小{{ minCache_day }}GB</span>
					<span class="charttxt"> 平均{{ averCache_day }}GB</span>
					<span class="charttxt">当前{{ curCache_day }}GB</span>
					<br />
					<span class="charttxt"> 高速缓冲：</span>
					<span class="charttxt"> 最大{{ maxBuff_day }}GB</span>
					<span class="charttxt"> 最小{{ minBuff_day }}GB</span>
					<span class="charttxt"> 平均{{ averBuff_day }}GB</span>
					<span class="charttxt">当前{{ curBuff_day }}GB</span>
				</div>
				<!-- 周图 -->
				<div class="chart_week" style="">
					周图
					<e-charts class="weekchart" :option="option_week" />
					<span class="charttxt"> 占用内存：</span>
					<span class="charttxt"> 最大{{ maxUsed_week }}GB</span>
					<span class="charttxt"> 最小{{ minUsed_week }}GB</span>
					<span class="charttxt"> 平均{{ averUsed_week }}GB</span>
					<span class="charttxt">当前{{ curUsed_week }}GB</span>
					<br />
					<span class="charttxt"> 空闲内存：</span>
					<span class="charttxt"> 最大{{ maxFree_week }}GB</span>
					<span class="charttxt"> 最小{{ minFree_week }}GB</span>
					<span class="charttxt"> 平均{{ averFree_week }}GB</span>
					<span class="charttxt">当前{{ curFree_week }}GB</span>
					<br />
					<span class="charttxt"> 缓存内存：</span>
					<span class="charttxt"> 最大{{ maxCache_week }}GB</span>
					<span class="charttxt"> 最小{{ minCache_week }}GB</span>
					<span class="charttxt"> 平均{{ averCache_week }}GB</span>
					<span class="charttxt">当前{{ curCache_week }}GB</span>
					<br />
					<span class="charttxt"> 高速缓冲：</span>
					<span class="charttxt"> 最大{{ maxBuff_week }}GB</span>
					<span class="charttxt"> 最小{{ minBuff_week }}GB</span>
					<span class="charttxt"> 平均{{ averBuff_week }}GB</span>
					<span class="charttxt">当前{{ curBuff_week }}GB</span>
				</div>
			</div>
			<a-space direction="vertical" :size="12">
				<a-range-picker
					:show-time="{ format: 'HH:mm' }"
					format="YYYY-MM-DD HH:mm"
					:placeholder="['开始时间', '结束时间']"
					@change="onRangeChange"
					@ok="onRangeOk"
				/>
			</a-space>
			<div>
				<div class="chart_all">
					自定义时间
					<e-charts class="echart_all" :option="option_all" />
					<span class="charttxt"> CPU使用率：</span>
					<span class="charttxt"> 最大{{ maxUsed_all }}%</span>
					<span class="charttxt"> 最大{{ minUsed_all }}%</span>
					<span class="charttxt"> 平均{{ averUsed_all }}%</span>
					<span class="charttxt">当前{{ curUsed_all }}%</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { router } from '/@/router';
	import { reactive, toRefs, ref, computed } from 'vue';
	import { getStor } from './host_board.ts';
	import 'echarts/lib/component/tooltip'; // 导入tooltip组件
	const data = reactive({
		id: '',
		Xdata: [],
		Ydata_usedData: [],
		Ydata_freeData: [],
		Ydata_cacheData: [],
		Ydata_buffData: [],
		Ydata_usedData_week:[],
		Ydata_usedData_week: [],
		Ydata_freeData_week: [],
		Ydata_cacheData_week: [],
		Ydata_buffData_week: [],
		averUsed_day: '', //	占用内存-平均
		curUsed_day: '', //	占用内存-当前
		maxUsed_day: '', //占用内存-最大
		minUsed_day: '', //	占用内存-最小
		maxFree_day:'',//空闲内存-最大
		minFree_day:'',//空闲内存-最小
		averFree_day:'',//空闲内存-平均
		curFree_day: '', //	空闲内存-当前
		maxCache_day:'',//缓存内存-最大
		minCache_day:'',//缓存内存-最小
		averCache_day:'',//缓存内存-平均
		curCache_day: '', //	缓存内存-当前
		maxBuff_day:'',//高速缓冲-最大
		minBuff_day:'',//高速缓冲-最小
		averBuff_day:'',//高速缓冲-平均
		curBuff_day: '', //	高速缓冲-当前
		
		averUsed_week: '', //	占用内存-平均
		curUsed_week: '', //	占用内存-当前
		maxUsed_week: '', //占用内存-最大
		minUsed_week: '', //	占用内存-最小
		maxFree_week:'',//空闲内存-最大
		minFree_week:'',//空闲内存-最小
		averFree_week:'',//空闲内存-平均
		curFree_week: '', //	空闲内存-当前
		maxCache_week:'',//缓存内存-最大
		minCache_week:'',//缓存内存-最小
		averCache_week:'',//缓存内存-平均
		curCache_week: '', //	缓存内存-当前
		maxBuff_week:'',//高速缓冲-最大
		minBuff_week:'',//高速缓冲-最小
		averBuff_week:'',//高速缓冲-平均
		curBuff_week: '', //	高速缓冲-当前
		
		endDate: '',
		startDate_day: '',
		startDate_week: '',
		Xdata_week: [],
		Ydata_week: [],
		averUsed_week: '', //	占用内存-平均
		curUsed_week: '', //	占用内存-当前
		maxUsed_week: '', //	占用内存--最大
		minUsed_week: '', //	占用内存--最小
		averUsed_all: '', //	占用内存--平均
		curUsed_all: '', //	占用内存--当前
		maxUsed_all: '', //	占用内存--最大
		minUsed_all: '', //	占用内存--最小
		Xdata_all: [],
		Ydata_all: [],
		startData_all: '',
		endData_all: '',
	});
	const {
		maxFree_day,
		minFree_day,
		averFree_day,
		curFree_day,
		maxCache_day,
		minCache_day,
		averCache_day,
		curCache_day,
		maxBuff_day,
		minBuff_day,
		averBuff_day,
		curBuff_day,
		
		maxFree_week,
		minFree_week,
		averFree_week,
		curFree_week,
		maxCache_week,
		minCache_week,
		averCache_week,
		curCache_week,
		maxBuff_week,
		minBuff_week,
		averBuff_week,
		curBuff_week,
		
		id,
		Ydata_usedData,
		Ydata_freeData,
		Ydata_cacheData,
		Ydata_buffData,
		Ydata_usedData_week,
		Ydata_freeData_week,
		Ydata_cacheData_week,
		Ydata_buffData_week,
		Xdata,
		averUsed_day,
		curUsed_day,
		maxUsed_day,
		minUsed_day,
		endDate,
		startDate_week,
		startDate_day,
		Xdata_week,
		Ydata_week,
		averUsed_week,
		curUsed_week,
		maxUsed_week,
		minUsed_week,
		averUsed_all,
		curUsed_all,
		maxUsed_all,
		minUsed_all,
		Xdata_all,
		Ydata_all,
		endData_all,
		startData_all,
	} = toRefs(data);
	const btn = () => {
		router.push(`/hosts/Allhosts`);
	};
	const getID = () => {
		let url = location.search;
		id.value = url.replace('?', '');
	};
	getID();
	const getdate = () => {
		// 获取当前时间
		let currentDate = new Date();
		let year = currentDate.getFullYear();
		let month = String(currentDate.getMonth() + 1).padStart(2, '0');
		let day = String(currentDate.getDate()).padStart(2, '0');
		let hours = String(currentDate.getHours()).padStart(2, '0');
		let minutes = String(currentDate.getMinutes()).padStart(2, '0');
		let seconds = String(currentDate.getSeconds()).padStart(2, '0');
		endDate.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		let startday = String(currentDate.getDate() - 1).padStart(2, '0');
		startDate_day.value = `${year}-${month}-${startday} ${hours}:${minutes}:${seconds}`;
		startData_all.value = `${year}-${month}-${startday} ${hours}:${minutes}:${seconds}`;
		endData_all.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

		// 获取七天前时间
		function getPreviousDate(days) {
			let currentDate = new Date();
			currentDate.setDate(currentDate.getDate() - Math.abs(days));

			let year = currentDate.getFullYear();
			let month = String(currentDate.getMonth() + 1).padStart(2, '0');
			let day = String(currentDate.getDate()).padStart(2, '0');
			let hours = String(currentDate.getHours()).padStart(2, '0');
			let minutes = String(currentDate.getMinutes()).padStart(2, '0');
			let seconds = String(currentDate.getSeconds()).padStart(2, '0');

			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		}

		let sevenDaysAgo = getPreviousDate(7);
		startDate_week.value = sevenDaysAgo;
	};

	const initdata = () => {
		getdate();
		getStor({
			hostId: id.value,
			timeType: 0,
			startTime: startDate_day.value,
			endTime: endDate.value,
		}).then((res) => {
			// 占用内存
			averUsed_day.value =( res.averUsed/100000000).toFixed(2)
			curUsed_day.value = (res.curUsed/100000000).toFixed(2);
			maxUsed_day.value = (res.maxUsed/100000000).toFixed(2);
			minUsed_day.value = (res.minUsed/100000000).toFixed(2);
			// 空闲内存
			maxFree_day.value=(res.maxFree/100000000).toFixed(2)
			minFree_day.value=(res.minFree/100000000).toFixed(2)
			averFree_day.value = (res.averFree/1000000000).toFixed(2);
			curFree_day.value = (res.curFree/100000000).toFixed(2);
			// 缓存内存
			maxCache_day.value=(res.maxCache/100000000).toFixed(2)
			minCache_day.value=(res.minCache/100000000).toFixed(2)
			averCache_day.value = (res.averCache/1000000000).toFixed(2);
			curCache_day.value = (res.curCache/100000000).toFixed(2);
			// 高速缓冲
			maxBuff_day.value=(res.maxBuff/100000000).toFixed(2)
			minBuff_day.value=(res.minBuff/100000000).toFixed(2)
			averBuff_day.value = (res.averBuff/1000000000).toFixed(2);
			curBuff_day.value = (res.curBuff/100000000).toFixed(2);
			
			const jsonData = JSON.parse(JSON.stringify(res.buffData)); // 将JSON数据解析为JavaScript对象
			jsonData.forEach((item) => {
			  const date = new Date(item.date);
			  const formattedTime = date.toLocaleTimeString('en-US', { hour12: false });
			  const month = date.getMonth() + 1;
			  const day = date.getDate();
			  const formattedDate = `${month}-${day} ${formattedTime}`;
			  Xdata.value.push(formattedDate);
			  Ydata_buffData.value.push(item.value / 1000000000).toFixed(2);
			});
			// 缓存内存
			const jsonData_cace = JSON.parse(JSON.stringify(res.cacheData));
			jsonData_cace.forEach((item)=>{
				Ydata_cacheData.value.push(item.value/1000000000).toFixed(2);
			})
			
			// 空闲内存
			const jsonData_free = JSON.parse(JSON.stringify(res.freeData));
			jsonData_free.forEach((item)=>{
				Ydata_freeData.value.push(item.value/1000000000).toFixed(2);
			})
			// 占用内存
			const jsonData_used= JSON.parse(JSON.stringify(res.usedData));
			jsonData_used.forEach((item)=>{
				Ydata_usedData.value.push(item.value/1000000000).toFixed(2);
			})
			
		});
	};
	initdata();
	const initdata_week = () => {
		getdate();
		getStor({
			hostId: id.value,
			timeType: 0,
			startTime: startDate_week.value,
			endTime: endDate.value,
		}).then((res) => {
			// 占用内存
			averUsed_week.value =( res.averUsed/100000000).toFixed(2)
			curUsed_week.value = (res.curUsed/100000000).toFixed(2);
			maxUsed_week.value = (res.maxUsed/100000000).toFixed(2);
			minUsed_week.value = (res.minUsed/100000000).toFixed(2);
			// 空闲内存
			maxFree_week.value=(res.maxFree/100000000).toFixed(2)
			minFree_week.value=(res.minFree/100000000).toFixed(2)
			averFree_week.value = (res.averFree/1000000000).toFixed(2);
			curFree_week.value = (res.curFree/100000000).toFixed(2);
			// 缓存内存
			maxCache_week.value=(res.maxCache/100000000).toFixed(2)
			minCache_week.value=(res.minCache/100000000).toFixed(2)
			averCache_week.value = (res.averCache/1000000000).toFixed(2);
			curCache_week.value = (res.curCache/100000000).toFixed(2);
			// 高速缓冲
			maxBuff_week.value=(res.maxBuff/100000000).toFixed(2)
			minBuff_week.value=(res.minBuff/100000000).toFixed(2)
			averBuff_week.value = (res.averBuff/1000000000).toFixed(2);
			curBuff_week.value = (res.curBuff/100000000).toFixed(2);
			
			const jsonData = JSON.parse(JSON.stringify(res.buffData)); // 将JSON数据解析为JavaScript对象
			jsonData.forEach((item) => {
			  const date = new Date(item.date);
			  const formattedTime = date.toLocaleTimeString('en-US', { hour12: false });
			  const month = date.getMonth() + 1;
			  const day = date.getDate();
			  const formattedDate = `${month}-${day} ${formattedTime}`;
			  Xdata.value.push(formattedDate);
			  Ydata_buffData.value.push(item.value / 1000000000).toFixed(2);
			});
			// 缓存内存
			const jsonData_cace = JSON.parse(JSON.stringify(res.cacheData));
			jsonData_cace.forEach((item)=>{
				Ydata_cacheData.value.push(item.value/1000000000).toFixed(2);
			})
			
			// 空闲内存
			const jsonData_free = JSON.parse(JSON.stringify(res.freeData));
			jsonData_free.forEach((item)=>{
				Ydata_freeData.value.push(item.value/1000000000).toFixed(2);
			})
			// 占用内存
			const jsonData_used= JSON.parse(JSON.stringify(res.usedData));
			jsonData_used.forEach((item)=>{
				Ydata_usedData_week.value.push(item.value/1000000000).toFixed(2);
			})
			
		});
	};
	initdata_week();

	const option_all = computed(() => {
		let intervalValue;

		if (window.matchMedia('(max-width: 600px)').matches) {
			intervalValue = 2;
		} else {
			intervalValue = 0;
		}
		return {
			tooltip: {
				trigger: 'axis', // show tooltip when hovering over the series
				axisPointer: {
					type: 'cross', // show a crosshair pointer
					label: {
						show: false,
					},
				},
				formatter: function (params) {
					let xAxisData = params[0].name;
					let yAxisData = params[0].data;
					return ` ${xAxisData}<br>${yAxisData}%`;
				},
			},
			grid: {
				left: '5%',
				right: '5%',
				top: '5%',
				bottom: '8%',
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: Xdata_all.value,
				axisLine: {
					lineStyle: {
						color: '#1f98d3',
					},
				},
				axisLabel: {
					interval: intervalValue, // 设置刻度值之间的间隔
					// ...
				},
			},
			yAxis: {
				type: 'value',
				axisLine: {
					show: true, // 显示Y轴线条
					lineStyle: {
						color: '#1f98d3',
					},
					
				},
				
			},

			series: [
				{
					name: '流量详情',
					type: 'line',

					areaStyle: {
						normal: {
							color: '#66dbd3', // 改变区域颜色
							opacity: 0.7, // 改变区域透明度
						},
					},
					lineStyle: {
						color: '#21cbbf', // 设置线条颜色为红色
					},
					symbol: 'none', // 去除锚点
					data: Ydata_all.value,
				},
			],
		};
	});

	const option_week = computed(() => {
	 let intervalValue;
	
	if (window.matchMedia('(max-width: 600px)').matches) {
		// If media query matches
		intervalValue = 4;
	} else {
		intervalValue = 2;
	}
	return {
		tooltip: {
			trigger: 'axis', // show tooltip when hovering over the series
			axisPointer: {
				type: 'cross', // show a crosshair pointer
				label: {
					show: false,
				},
			},
			formatter: function (params) {
				// customize the tooltip content
				let xAxisData = params[0].name;
				let yAxisData = params[0].seriesName+params[0].data;
				let yAxisData_1=params[1].seriesName+params[1].data
				let yAxisData_2=params[2].seriesName+params[2].data
					let yAxisData_3=params[3].seriesName+params[3].data
				console.log(params,'paramsparamsparamsparams')
				return ` ${xAxisData}<br>${yAxisData}G<br>${yAxisData_1}G<br>${yAxisData_2}G<br>${yAxisData_3}G`;
			},
		},
		grid: {
			left: '5%',
			right: '5%',
			top: '5%',
			bottom: '8%',
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: Xdata.value,
			axisLine: {
				lineStyle: {
					color: '#1f98d3',
				},
			},
			axisLabel: {
				interval: intervalValue, // 设置刻度值之间的间隔
				// ...
			},
		},
		yAxis: {
			type: 'value',
			axisLine: {
				show: true, // 显示Y轴线条
				lineStyle: {
					color: '#1f98d3',
				},
			},
		},
	
		series: [
			{
				name: '占用内存',
				type: 'line',
				stack: 'Total',
				areaStyle: {
					normal: {
						color: '#66dbd3', // 改变区域颜色
						opacity: 0.7, // 改变区域透明度
					},
				},
				lineStyle: {
					color: '#21cbbf', // 设置线条颜色
				},
				symbol: 'none', // 去除锚点
				data:Ydata_usedData.value,
			},
			{
				name: '空闲内存',
				type: 'line',
				stack: 'Total',
				areaStyle: {
					normal: {
						color: '#a2a8f3', // 改变区域颜色
						opacity: 0.7, // 改变区域透明度
					},
				},
				lineStyle: {
					color: '#6889ed', // 设置线条颜色
				},
				symbol: 'none', // 去除锚点
				data:Ydata_freeData.value,
			},
			{
				name: '缓存内存',
				type: 'line',
				stack: 'Total',
				areaStyle: {
					normal: {
						color: '#74c3f6', // 改变区域颜色
						opacity: 0.7, // 改变区域透明度
					},
				},
				lineStyle: {
					color: '#47b0f4', // 设置线条颜色
				},
				symbol: 'none', // 去除锚点
				data:Ydata_cacheData.value,
			},
			{
				name: '高速缓冲',
				type: 'line',
				stack: 'Total',
				areaStyle: {
					normal: {
						color: '#aadc5c', // 改变区域颜色
						opacity: 0.7, // 改变区域透明度
					},
				},
				lineStyle: {
					color: '#90d426', // 设置线条颜色
				},
				symbol: 'none', // 去除锚点
				data:Ydata_buffData.value,
			},
		],
	};
	});
	const option = computed(() => {
		let intervalValue;

		if (window.matchMedia('(max-width: 600px)').matches) {
			// If media query matches
			intervalValue = 4;
		} else {
			intervalValue = 2;
		}
		return {
			tooltip: {
				trigger: 'axis', // show tooltip when hovering over the series
				axisPointer: {
					type: 'cross', // show a crosshair pointer
					label: {
						show: false,
					},
				},
				formatter: function (params) {
					// customize the tooltip content
					let xAxisData = params[0].name;
					let yAxisData = params[0].seriesName+params[0].data;
					let yAxisData_1=params[1].seriesName+params[1].data
					let yAxisData_2=params[2].seriesName+params[2].data
						let yAxisData_3=params[3].seriesName+params[3].data
					console.log(params,'paramsparamsparamsparams')
					return ` ${xAxisData}<br>${yAxisData}G<br>${yAxisData_1}G<br>${yAxisData_2}G<br>${yAxisData_3}G`;
				},
			},
			grid: {
				left: '5%',
				right: '5%',
				top: '5%',
				bottom: '8%',
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: Xdata.value,
				axisLine: {
					lineStyle: {
						color: '#1f98d3',
					},
				},
				axisLabel: {
					interval: intervalValue, // 设置刻度值之间的间隔
					// ...
				},
			},
			yAxis: {
				type: 'value',
				axisLine: {
					show: true, // 显示Y轴线条
					lineStyle: {
						color: '#1f98d3',
					},
				},
			},

			series: [
				{
					name: '占用内存',
					type: 'line',
					stack: 'Total',
					areaStyle: {
						normal: {
							color: '#66dbd3', // 改变区域颜色
							opacity: 0.7, // 改变区域透明度
						},
					},
					lineStyle: {
						color: '#21cbbf', // 设置线条颜色
					},
					symbol: 'none', // 去除锚点
					data:Ydata_usedData.value,
				},
				{
					name: '空闲内存',
					type: 'line',
					stack: 'Total',
					areaStyle: {
						normal: {
							color: '#a2a8f3', // 改变区域颜色
							opacity: 0.7, // 改变区域透明度
						},
					},
					lineStyle: {
						color: '#6889ed', // 设置线条颜色
					},
					symbol: 'none', // 去除锚点
					data:Ydata_freeData.value,
				},
				{
					name: '缓存内存',
					type: 'line',
					stack: 'Total',
					areaStyle: {
						normal: {
							color: '#74c3f6', // 改变区域颜色
							opacity: 0.7, // 改变区域透明度
						},
					},
					lineStyle: {
						color: '#47b0f4', // 设置线条颜色
					},
					symbol: 'none', // 去除锚点
					data:Ydata_cacheData.value,
				},
				{
					name: '高速缓冲',
					type: 'line',
					stack: 'Total',
					areaStyle: {
						normal: {
							color: '#aadc5c', // 改变区域颜色
							opacity: 0.7, // 改变区域透明度
						},
					},
					lineStyle: {
						color: '#90d426', // 设置线条颜色
					},
					symbol: 'none', // 去除锚点
					data:Ydata_buffData.value,
				},
			],
		};
	});
	// 自定义日期提交
	const onRangeChange = (value, dateString) => {
		startData_all.value = dateString[0];
		endData_all.value = dateString[1];
		Xdata_all.value = [];
		Ydata_all.value = [];
		getStor({
			hostId: id.value,
			timeType: 4,
			startTime: startData_all.value,
			endTime: endData_all.value,
		}).then((res) => {
			averUsed_all.value = res.averUsed;
			curUsed_all.value = res.curUsed;
			maxUsed_all.value = res.maxUsed;
			minUsed_all.value = res.minUsed;
			const jsonData = JSON.parse(JSON.stringify(res.data)); // 将JSON数据解析为JavaScript对象
			jsonData.forEach((item) => {
				const date = new Date(item.date); // 转换日期字符串为日期对象
				const month = date.getMonth() + 1; // 获取月份，注意月份是从0开始计数的，所以需要加1
				const day = date.getDate(); // 获取日期
				const hours = date.getHours(); // 获取小时
				const minutes = date.getMinutes(); // 获取分钟
				const seconds = date.getSeconds(); // 获取秒数
				const formattedDate = `${month}-${day} ${hours}:${minutes}:${seconds}`; // 格式化日期字符串
				Xdata_all.value.push(formattedDate); // 将格式化后的日期数据添加到Xdata数组中
				Ydata_all.value.push(item.value); // 将值数据添加到Ydata数组中
			});
		});
	};
	const getAlldata = () => {
		getdate();
		getStor({
			hostId: id.value,
			timeType: 4,
			startTime: startData_all.value,
			endTime: endData_all.value,
		}).then((res) => {
			averUsed_all.value = res.averUsed;
			curUsed_all.value = res.curUsed;
			maxUsed_all.value = res.maxUsed;
			minUsed_all.value = res.minUsed;
			const jsonData = JSON.parse(JSON.stringify(res.data)); // 将JSON数据解析为JavaScript对象
			jsonData.forEach((item) => {
				const date = new Date(item.date); // 转换日期字符串为日期对象
				const month = date.getMonth() + 1; // 获取月份，注意月份是从0开始计数的，所以需要加1
				const day = date.getDate(); // 获取日期
				const hours = date.getHours(); // 获取小时
				const minutes = date.getMinutes(); // 获取分钟
				const seconds = date.getSeconds(); // 获取秒数
				const formattedDate = `${month}-${day} ${hours}:${minutes}:${seconds}`; // 格式化日期字符串
				Xdata_all.value.push(formattedDate); // 将格式化后的日期数据添加到Xdata数组中
				Ydata_all.value.push(item.value); // 将值数据添加到Ydata数组中
			});
		});
	};
	getAlldata();
</script>

<style scoped>
	.page {
		padding: 10px;
	}
	.top {
		display: flex;
		margin-top: 10px;
		flex-wrap: wrap;
	}
	.chart {
		margin-top: 10px;
		height: 300px;
		width: 95%;
	}
	.weekchart {
		margin-top: 10px;
		height: 300px;
		width: 95%;
	}
	.chart_day {
		padding: 10px;
		background-color: #fff;
		margin-right: 10px;
		flex: 1;
	}
	.chart_week {
		padding: 10px;
		background-color: #fff;
		flex: 1;
		margin-bottom: 10px;
	}
	.chart_all {
		width: 100%;
		margin-top: 10px;
		padding: 10px;
		background-color: #fff;
	}
	.echart_all {
		height: 300px;
		width: 100%;
	}

	.charttxt {
		margin-left: 10px;
		margin-right: 5%;
		font-size: 10px;
	}
	@media (max-width: 500px) {
		.top {
			flex-direction: column;
		}
		.chart_all {
			width: 150%;
		}
	}
</style>
