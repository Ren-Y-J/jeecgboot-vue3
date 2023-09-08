<template>
	<div class="page">
		<a-button @click="btn">返回上一级页面</a-button>
		<!-- v-scale="{ target: 'width', origin: 'top left' }" 页面缩放 -->
		<div>
			<div class="top" >
				<!-- 日图 -->
				<div class="chart_day" style="margin-bottom: 10px">
					日图
					<e-charts class="chart" :option="option" />
				</div>
				<!-- 周图 -->
				<div class="chart_week" >
					周图
					<e-charts class="weekchart" :option="option_week" />
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
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { router } from '/@/router';
	import { reactive, toRefs, ref, computed } from 'vue';
	import { getDisk } from './host_board.ts';
	import { message } from 'ant-design-vue';
	import 'echarts/lib/component/tooltip'; // 导入tooltip组件
	const data = reactive({
		id: '',
		Xdata: [],
		Ydata_usedData: [],
		Ydata_freeData: [],
		Ydata_cacheData: [],
		Ydata_buffData: [],
		
		Xdata_week: [],
			Ydata_buffData_week: [],
		Ydata_usedData_week:[],
		Ydata_freeData_week: [],
		Ydata_cacheData_week: [],
	
	Xdata_all: [],
	Ydata_buffData_all: [],
	Ydata_usedData_all:[],
	Ydata_freeData_all: [],
	Ydata_cacheData_all: [],
	legendData_day:[],
	
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
		
		averUsed_all: '', //	占用内存-平均
		curUsed_all: '', //	占用内存-当前
		maxUsed_all: '', //占用内存-最大
		minUsed_all: '', //	占用内存-最小
		maxFree_all:'',//空闲内存-最大
		minFree_all:'',//空闲内存-最小
		averFree_all:'',//空闲内存-平均
		curFree_all: '', //	空闲内存-当前
		maxCache_all:'',//缓存内存-最大
		minCache_all:'',//缓存内存-最小
		averCache_all:'',//缓存内存-平均
		curCache_all: '', //	缓存内存-当前
		maxBuff_all:'',//高速缓冲-最大
		minBuff_all:'',//高速缓冲-最小
		averBuff_all:'',//高速缓冲-平均
		curBuff_all: '', //	高速缓冲-当前
		
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
		legendData_day,
		
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
		
			Ydata_buffData_all,
		Ydata_usedData_all,
		Ydata_freeData_all,
		Ydata_cacheData_all,
		
		
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
		
		Xdata_week,
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
		
		
	
		Ydata_week,
		averUsed_week,
		curUsed_week,
		maxUsed_week,
		minUsed_week,
		Xdata_all,
		Ydata_all,
		endData_all,
		startData_all,
		
		averUsed_all, //	占用内存-平均
		curUsed_all, //	占用内存-当前
		maxUsed_all, //占用内存-最大
		minUsed_all, //	占用内存-最小
		maxFree_all,//空闲内存-最大
		minFree_all,//空闲内存-最小
		averFree_all,//空闲内存-平均
		curFree_all, //	空闲内存-当前
		maxCache_all,//缓存内存-最大
		minCache_all,//缓存内存-最小
		averCache_all,//缓存内存-平均
		curCache_all, //	缓存内存-当前
		maxBuff_all,//高速缓冲-最大
		minBuff_all,//高速缓冲-最小
		averBuff_all,//高速缓冲-平均
		curBuff_all, //	高速缓冲-当前
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
		getDisk({
			hostId: id.value,
			timeType: 0,
			startTime: startDate_day.value,
			endTime: endDate.value,
		}).then((res) => {
			console.log()
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
		getDisk({
			hostId: id.value,
			timeType: 1,
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
			
			
			// 空闲内存
			const jsonData_free = JSON.parse(JSON.stringify(res.freeData));
			jsonData_free.forEach((item)=>{
				Ydata_freeData_week.value.push(item.value/1000000000).toFixed(2);
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
			// If media query matches
			intervalValue = 4;
		} else {
			intervalValue = 0;
		}
		return {
			legend: {
			         type: 'scroll',
			         orient: 'vertical',
			         left: 10,
			         top: 300,
			         bottom: 40,
			         pageButtonItemGap: 5,
			         pageButtonGap: -5,
			         data: [ 
			{name:'占用内存', textStyle: {color: '#000'}},
			{name:'空闲内存', textStyle: {color: '#000'}},
			],
			  formatter: function (name) {
			          if (name === '占用内存') {
			                         return name + ' '.repeat(25) + '最大'+maxUsed_all.value+'GB'+ ' '.repeat(25) + '最小'+minUsed_all.value+'GB'+ ' '.repeat(25) + '平均'+ averUsed_all.value+'GB' +' '.repeat(25) + '当前'+  curUsed_all.value+'GB';
			                     } else if (name === '空闲内存') {
			                        return name + ' '.repeat(25) + '最大'+maxFree_all.value+'GB'+ ' '.repeat(25) + '最小'+minFree_all.value+'GB'+ ' '.repeat(25) + '平均'+ averFree_all.value+'GB' +' '.repeat(25) + '当前'+  curFree_all.value+'GB';
			                     }
			        },
			},
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
				bottom: '30%',
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
				            return value + 'GB'; // 在刻度数字后面添加GB字段
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
					data:Ydata_usedData_all.value,
					
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
					data:Ydata_freeData_all.value,
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
		intervalValue = 7;
	}
	return {
		legend: {
		         type: 'scroll',
		         orient: 'vertical',
		         left: 10,
		         top: 300,
		         bottom: 40,
		         pageButtonItemGap: 5,
		         pageButtonGap: -5,
		         data: [ 
		{name:'占用内存', textStyle: {color: '#000'}},
		{name:'空闲内存', textStyle: {color: '#000'}},
		],
		  formatter: function (name) {
		          if (name === '占用内存') {
		                         return name + ' '.repeat(25) + '最大'+maxUsed_week.value+'GB'+ ' '.repeat(25) + '最小'+minUsed_week.value+'GB'+ ' '.repeat(25) + '平均'+ averUsed_week.value+'GB' +' '.repeat(25) + '当前'+  curUsed_week.value+'GB';
		                     } else if (name === '空闲内存') {
		                        return name + ' '.repeat(25) + '最大'+maxFree_week.value+'GB'+ ' '.repeat(25) + '最小'+minFree_week.value+'GB'+ ' '.repeat(25) + '平均'+ averFree_week.value+'GB' +' '.repeat(25) + '当前'+  curFree_week.value+'GB';
		                     } 
		        },
		},
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
			bottom: '30%',
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
			           return value + 'GB'; // 在刻度数字后面添加GB字段
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
				data:Ydata_usedData_week.value,
				
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
				data:Ydata_freeData_week.value,
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
			  legend: {
			         type: 'scroll',
			         orient: 'vertical',
			         left: 10,
			         top: 300,
			         bottom: 40,
			         pageButtonItemGap: 5,
			         pageButtonGap: -5,
			         data: [ 
			{name:'占用内存', textStyle: {color: '#000'}},
            {name:'空闲内存', textStyle: {color: '#000'}},
			],
			  formatter: function (name) {
			          if (name === '占用内存') {
			                         return name + ' '.repeat(25) + '最大'+maxUsed_day.value+'GB'+ ' '.repeat(25) + '最小'+minUsed_day.value+'GB'+ ' '.repeat(25) + '平均'+ averUsed_day.value+'GB' +' '.repeat(25) + '当前'+  curUsed_day.value+'GB';
			                     } else if (name === '空闲内存') {
			                        return name + ' '.repeat(25) + '最大'+maxFree_day.value+'GB'+ ' '.repeat(25) + '最小'+minFree_day.value+'GB'+ ' '.repeat(25) + '平均'+ averFree_day.value+'GB' +' '.repeat(25) + '当前'+  curFree_day.value+'GB';
			                     } 
			        },
			},
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
				bottom: '30%',
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
				           return value + 'GB'; // 在刻度数字后面添加GB字段
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
					 itemStyle: {
					                color: '#21cbbf',
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
					itemStyle: {
					               color: '#6889ed',
					           },
					symbol: 'none', // 去除锚点
					data:Ydata_freeData.value,
				},
			],
		};
	});
	
	  const onChange = (value, dateString) => {
	      console.log('Selected Time: ', value);
	      console.log('Formatted Selected Time: ', dateString);
	    };
	    const onOk = value => {
	      console.log('onOk: ', value);
	    };
	    const onRangeOk = value => {
	      console.log('onOk: ', value);
	    };
	
	// 自定义日期提交
	const onRangeChange = (value, dateString) => {
		console.log('提交',);
			getAlldata();
		startData_all.value = dateString[0];
		endData_all.value = dateString[1];
		Xdata_all.value = [];
		Ydata_all.value = [];
		getDisk({
			hostId: id.value,
			timeType: 4,
			startTime: startData_all.value,
			endTime: endData_all.value,
		}).then((res) => {
			console.log(res,'res全部自定义的')
			if(res.averBuff==null){
				message.error('暂无数据');
			}
			
			
			// 占用内存
			averUsed_all.value =( res.averUsed/100000000).toFixed(2)
			curUsed_all.value = (res.curUsed/100000000).toFixed(2);
			maxUsed_all.value = (res.maxUsed/100000000).toFixed(2);
			minUsed_all.value = (res.minUsed/100000000).toFixed(2);
			// 空闲内存
			maxFree_all.value=(res.maxFree/100000000).toFixed(2)
			minFree_all.value=(res.minFree/100000000).toFixed(2)
			averFree_all.value = (res.averFree/1000000000).toFixed(2);
			curFree_all.value = (res.curFree/100000000).toFixed(2);
			
			// 空闲内存
			const jsonData_free = JSON.parse(JSON.stringify(res.freeData));
			jsonData_free.forEach((item)=>{
				Ydata_freeData_all.value.push(item.value/1000000000).toFixed(2);
			})
			// 占用内存
			const jsonData_used= JSON.parse(JSON.stringify(res.usedData));
			jsonData_used.forEach((item)=>{
				Ydata_usedData_all.value.push(item.value/1000000000).toFixed(2);
			})
		});
	};
	const getAlldata = () => {
		getdate();
		getDisk({
			hostId: id.value,
			timeType: 4,
			startTime: startData_all.value,
			endTime: endData_all.value,
		}).then((res) => {
			
			// 占用内存
			averUsed_all.value =( res.averUsed/100000000).toFixed(2)
			curUsed_all.value = (res.curUsed/100000000).toFixed(2);
			maxUsed_all.value = (res.maxUsed/100000000).toFixed(2);
			minUsed_all.value = (res.minUsed/100000000).toFixed(2);
			// 空闲内存
			maxFree_all.value=(res.maxFree/100000000).toFixed(2)
			minFree_all.value=(res.minFree/100000000).toFixed(2)
			averFree_all.value = (res.averFree/1000000000).toFixed(2);
			curFree_all.value = (res.curFree/100000000).toFixed(2);
			
			
			// 空闲内存
			const jsonData_free = JSON.parse(JSON.stringify(res.freeData));
			jsonData_free.forEach((item)=>{
				Ydata_freeData_all.value.push(item.value/1000000000).toFixed(2);
			})
			// 占用内存
			const jsonData_used= JSON.parse(JSON.stringify(res.usedData));
			jsonData_used.forEach((item)=>{
				Ydata_usedData_all.value.push(item.value/1000000000).toFixed(2);
			})
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
		height: 400px;
		width: 95%;
	}
	.weekchart {
		margin-top: 10px;
		height: 400px;
		width: 95%;
	}
	.chart_day {
		padding: 10px;
		background-color: #fff;
		margin-right: 10px;
		flex: 1;
		box-shadow: 2px 2px 2px 2px #c5c6c8;
	}
	.chart_week {
		padding: 10px;
		background-color: #fff;
		flex: 1;
		margin-bottom: 10px;
		box-shadow: 2px 2px 2px 2px #c5c6c8;
	}
	.chart_all {
		width: 100%;
		margin-top: 10px;
		padding: 10px;
		background-color: #fff;
		box-shadow: 2px 2px 2px 2px #c5c6c8;
	}
	.echart_all {
		height: 400px;
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
