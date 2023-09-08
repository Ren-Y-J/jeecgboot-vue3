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
					<span class="charttxt"> CPU使用率：</span>
					<span class="charttxt"> 最大{{ maxUsed_day }}%</span>
					<span class="charttxt"> 最大{{ minUsed_day }}%</span>
					<span class="charttxt"> 平均{{ averUsed_day }}%</span>
					<span class="charttxt">当前{{ curUsed_day }}%</span>
				</div>
				<!-- 周图 -->
				<div class="chart_week" style="">
					周图
					<e-charts class="weekchart" :option="option_week" />
					<span class="charttxt"> CPU使用率：</span>
					<span class="charttxt"> 最大{{ maxUsed_week }}%</span>
					<span class="charttxt"> 最大{{ minUsed_week }}%</span>
					<span class="charttxt"> 平均{{ averUsed_week }}%</span>
					<span class="charttxt">当前{{ curUsed_week }}%</span>
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
	import { getCpu } from './host_board.ts';
	import 'echarts/lib/component/tooltip'; // 导入tooltip组件
	const data = reactive({
		id: '',
		Xdata: [],
		Ydata: [],
		averUsed_day: '', //	cpu使用率-平均
		curUsed_day: '', //	cpu使用率-当前
		maxUsed_day: '', //	cpu使用率-最大
		minUsed_day: '', //	cpu使用率-最小
		endDate: '',
		startDate_day: '',
		startDate_week: '',
		Xdata_week: [],
		Ydata_week: [],
		averUsed_week: '', //	cpu使用率-平均
		curUsed_week: '', //	cpu使用率-当前
		maxUsed_week: '', //	cpu使用率-最大
		minUsed_week: '', //	cpu使用率-最小
		averUsed_all: '', //	cpu使用率-平均
		curUsed_all: '', //	cpu使用率-当前
		maxUsed_all: '', //	cpu使用率-最大
		minUsed_all: '', //	cpu使用率-最小
		Xdata_all: [],
		Ydata_all: [],
		startData_all: '',
		endData_all: '',
	});
	const {
		id,
		Ydata,
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
		router.push(`/hosts/allhosts`);
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
		getCpu({
			hostId: id.value,
			timeType: 0,
			startTime: startDate_day.value,
			endTime: endDate.value,
		}).then((res) => {
			console.log(res, 'res');
			averUsed_day.value = res.averUsed;
			curUsed_day.value = res.curUsed;
			maxUsed_day.value = res.maxUsed;
			minUsed_day.value = res.minUsed;
			const jsonData = JSON.parse(JSON.stringify(res.data)); // 将JSON数据解析为JavaScript对象
			jsonData.forEach((item) => { 
				const date = new Date(item.date); // 转换日期字符串为日期对象
				const month = date.getMonth() + 1; // 获取月份，注意月份是从0开始计数的，所以需要加1
				const day = date.getDate(); // 获取日期
				const hours = date.getHours(); // 获取小时
				const minutes = date.getMinutes(); // 获取分钟
				const seconds = date.getSeconds(); // 获取秒数
				const formattedDate = `${month}-${day} ${hours}:${minutes}:${seconds}`; // 格式化日期字符串
				Xdata.value.push(formattedDate); // 将格式化后的日期数据添加到Xdata数组中
				Ydata.value.push(item.value); // 将值数据添加到Ydata数组中
			});
		});
	};
	initdata();
	const initdata_week = () => {
		getdate();
		getCpu({
			hostId: id.value,
			timeType: 1,
			startTime: startDate_week.value,
			endTime: endDate.value,
		}).then((res) => {
			console.log(res, 'res11');
			averUsed_week.value = res.averUsed;
			curUsed_week.value = res.curUsed;
			maxUsed_week.value = res.maxUsed;
			minUsed_week.value = res.minUsed;
			const jsonData = JSON.parse(JSON.stringify(res.data)); // 将JSON数据解析为JavaScript对象
			jsonData.forEach((item) => {
				const date = new Date(item.date); // 转换日期字符串为日期对象
				const month = date.getMonth() + 1; // 获取月份，注意月份是从0开始计数的，所以需要加1
				const day = date.getDate(); // 获取日期
				const hours = date.getHours(); // 获取小时
				const minutes = date.getMinutes(); // 获取分钟
				const seconds = date.getSeconds(); // 获取秒数
				const formattedDate = `${month}-${day} ${hours}:${minutes}:${seconds}`; // 格式化日期字符串
				Xdata_week.value.push(formattedDate); // 将格式化后的日期数据添加到Xdata数组中
				Ydata_week.value.push(item.value); // 将值数据添加到Ydata数组中
			});
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
			    trigger: 'axis',
			    axisPointer: {
			        type: 'cross',
			        label: {
			            show: false,
			        },
			    },
			  formatter: function (params) {
			      let xAxisData = params[0].name;
			      let dotHtml = '';
			      let spanColors = ['#21cbbf', '#6889ed', '#47b0f4', '#90d426']; // 定义每个span的颜色数组
			  
			      for (let i = 0; i < params.length; i++) {
			          let spanStyle = `display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${spanColors[i]}`;
			          dotHtml += `<span style="${spanStyle}"></span>`;
			          dotHtml += params[i].seriesName + params[i].data + 'G<br>';
			      }
			  
			      return `${xAxisData}<br>${dotHtml}`;
			  }
			
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
				axisLabel: {
				       formatter: function (value) {
				           return value + '%'; // 在刻度数字后面添加GB字段
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
			intervalValue = 8;
		} else {
			intervalValue = 3;
		}
		return {
			
			tooltip: {
			    trigger: 'axis',
			    axisPointer: {
			        type: 'cross',
			        label: {
			            show: false,
			        },
			    },
			  formatter: function (params) {
			      let xAxisData = params[0].name;
			      let dotHtml = '';
			      let spanColors = ['#21cbbf', '#6889ed', '#47b0f4', '#90d426']; // 定义每个span的颜色数组
			  
			      for (let i = 0; i < params.length; i++) {
			          let spanStyle = `display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${spanColors[i]}`;
			          dotHtml += `<span style="${spanStyle}"></span>`;
			          dotHtml += params[i].seriesName + params[i].data + 'G<br>';
			      }
			  
			      return `${xAxisData}<br>${dotHtml}`;
			  }
			
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
				data: Xdata_week.value,
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
				axisLabel: {
				       formatter: function (value) {
				           return value + '%'; // 在刻度数字后面添加GB字段
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
					data: Ydata_week.value,
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
			intervalValue = 1;
		}
		return {
		tooltip: {
		    trigger: 'axis',
		    axisPointer: {
		        type: 'cross',
		        label: {
		            show: false,
		        },
		    },
		  formatter: function (params) {
		      let xAxisData = params[0].name;
		      let dotHtml = '';
		      let spanColors = ['#21cbbf', '#6889ed', '#47b0f4', '#90d426']; // 定义每个span的颜色数组
		  
		      for (let i = 0; i < params.length; i++) {
		          let spanStyle = `display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${spanColors[i]}`;
		          dotHtml += `<span style="${spanStyle}"></span>`;
		          dotHtml += params[i].seriesName + params[i].data + 'G<br>';
		      }
		  
		      return `${xAxisData}<br>${dotHtml}`;
		  }
		
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
				axisLabel: {
				       formatter: function (value) {
				           return value + '%'; // 在刻度数字后面添加GB字段
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
					data: Ydata.value,
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
		getCpu({
			hostId: id.value,
			timeType: 4,
			startTime: startData_all.value,
			endTime: endData_all.value,
		}).then((res) => {
			console.log(res, 'all');
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
		getCpu({
			hostId: id.value,
			timeType: 4,
			startTime: startData_all.value,
			endTime: endData_all.value,
		}).then((res) => {
			console.log(res, 'all');
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
		box-shadow: 2px 2px 2px 2px #c5c6c8;
		margin-right: 10px;
		flex: 1;
	}
	.chart_week {
		padding: 10px;
		background-color: #fff;
		box-shadow: 2px 2px 2px 2px #c5c6c8;
		flex: 1;
		margin-bottom: 10px;
	}
	.chart_all {
		width: 100%;
		margin-top: 10px;
		padding: 10px;
		background-color: #fff;
		box-shadow: 2px 2px 2px 2px #c5c6c8;
		
	}
	.echart_all {
		height: 300px;
		width: 100%;
	}

	.charttxt {
		margin-left: 10px;
		margin-right: 10%;
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
