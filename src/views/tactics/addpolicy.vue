<template>
    <div class="addform">
        <div>
            <!-- ref="formRef" :model="formState" v-model:value="formState.policiesName" name="policiesName" :rules="[{ required: true, message: '请输入策略组名称!' }]"-->
            <a-form name="basic" :label-col="{ span: 9 }" :wrapper-col="{ span: 12 }" autocomplete="off" style="padding-top: 40px"
				@finish="onFinish" @finishFailed="onFinishFailed" validateTrigger="blur">
<!-- 基础配置 -->
                <div class="foundation ml">基础配置</div>
				<a-form-item :wrapper-col="{ span: 6 }" label="策略名称" style="margin-top: 5px">
					<a-input  placeholder="请输入策略名称" />
				</a-form-item>
                <!-- v-model:value="queryParams.type" ref="select" v-model:value="queryParams.type"-->
                <a-form-item style="margin-bottom: 0px;margin-top: -10px" label="所属主机组:" name="type" :labelCol="{ span: 9 }" 
                  :wrapperCol="{ span: 10 }"  >
                    <a-space>
                        <a-select style="width: 327px" @focus="focus" placeholder="请选择"  @change="handleChange" :options="Main_set" >
                        </a-select>
                    </a-space>
                </a-form-item>
                <a-form-item style="margin-bottom: 0px;margin-top: 10px" label="所属策略组" name="type" :labelCol="{ span: 9 }" 
                  :wrapperCol="{ span: 10 }" >
                    <a-space>
                        <a-select style="width: 327px" @focus="focus" placeholder="请选择"  @change="handleChange"  >
                            <a-select-option value="0">默认</a-select-option>
                        </a-select>
                    </a-space>
                </a-form-item>
<!-- 匹配规则 -->
                <div class="foundation ml">匹配规则</div>
                <a-form-item label="匹配源地址" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" @change="changeradioFn" v-model:value="radiovalue" >
                        <a-radio :value="0">所有地址</a-radio>
                        <a-radio :value="1">ACL选择</a-radio>
                    </a-radio-group>
                </a-form-item>
                <!-- ACL选择下拉框 -->
                <div v-if="radiovalue == 1">
                    <div style="margin-left:590px;">
                    <a-form-item :validateTrigger="['change', 'blur']" :wrapperCol="{ span: 10 }" :labelCol="{ span: 9 }"
                        label="" name="aclId" style='margin-top: 10px;margin-bottom: 10px'>
                        <a-space>
                            <a-select placeholder="请选择" ref="select"  style="width: 260px" @focus="focus" @change="handleChange" mode="tags" 
                            :size="size" :options="allaclId" :field-names="{ label: 'aclName', value: 'aclId' }">
                            </a-select>
                        </a-space>
                    </a-form-item>
                    </div>
                </div>

                <a-form-item label="匹配目的地址" name="aclType" style="margin-bottom: 0px" >
                    <a-radio-group  name="radioGroup" v-model:value="radiovalue_acl">
                        <a-radio :value="0">所有地址</a-radio>
                        <a-radio :value="1">ACL选择</a-radio>
                    </a-radio-group>
                </a-form-item>
                <!-- ACL选择下拉框 -->
                <div v-if="radiovalue_acl == 1">
                    <div style="margin-left:590px;">
                    <a-form-item :validateTrigger="['change', 'blur']" :wrapperCol="{ span: 10 }" :labelCol="{ span: 9 }"
                        label="" name="aclId" style='margin-top: 10px;margin-bottom: 10px'>
                        <a-space>
                            <a-select placeholder="请选择" ref="select"  style="width: 260px" @focus="focus" @change="handleChange" mode="tags" 
                            :size="size" :options="allaclId" :field-names="{ label: 'aclName', value: 'aclId' }">
                            </a-select>
                        </a-space>
                    </a-form-item>
                    </div>
                </div>

                <a-form-item label="匹配解析类型" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" v-model:value="radiovalue_type">
                        <a-radio :value="0">所有解析类型</a-radio>
                        <a-radio :value="1">手动选择</a-radio>
                    </a-radio-group>
                </a-form-item>
                <!-- 手动选择下拉框 -->
                <div v-if="radiovalue_type == 1">
                    <div style="margin-left:590px;">
                    <a-form-item :validateTrigger="['change', 'blur']" :wrapperCol="{ span: 10 }" :labelCol="{ span: 9 }"
                        label="" name="aclId" style='margin-top: 10px;margin-bottom: 10px'>
                        <a-space>
                            <a-select placeholder="请选择" ref="select"  style="width: 260px" @focus="focus" @change="handleChange" mode="tags" 
                            :size="size" >
                                <a-select-option value="0">默认</a-select-option>
                                <a-select-option value="1">默认</a-select-option>
                                <a-select-option value="2">默认</a-select-option>
                            </a-select>
                        </a-space>
                    </a-form-item>
                    </div>
                </div>

                <a-form-item label="匹配域名" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" v-model:value="radiovalue_domain ">
                        <a-radio :value="0">所有域名</a-radio>
                        <a-radio :value="1">域名库</a-radio>
                        <a-radio :value="2">手动输入域名</a-radio>
                    </a-radio-group>
                </a-form-item>
                <div v-if="radiovalue_domain == 0">
                    <div>
                    <a-form-item label="" name="aclType" style="margin-bottom: 0px">
                        <div style="margin-left:550px">* 匹配所有域名</div>
                    </a-form-item>
                    </div>
                </div>
                <div v-if="radiovalue_domain == 1">
                    <div>
                    <a-form-item label="" name="aclType" style="margin-bottom: 0px">
                        <div style="margin-left:550px;width:800px">* 按域名库匹配解析请求，包括系统内置域名库和用户自定义域名库</div>
                        <a-space style="margin-left:550px;">
                            <a-select placeholder="请选择" ref="select"  style="width: 260px" @focus="focus" @change="handleChange" mode="tags" 
                            :size="size" :options="Domain" :field-names="{ label: 'name', value: 'dnId' }">
                               
                            </a-select>
                            <a-button :style="{ margin: '10px 8px 9px 0px '}"  type="primary" @click="go_Domain">自定义域名库管理</a-button>
                        </a-space>
                    </a-form-item>
                    </div>
                </div>
                <div v-if="radiovalue_domain == 2">
                    <div>
                    <a-form-item label="" name="aclType" style="margin-bottom: 0px">
                        <div style="margin-left:550px;width:800px">* 按手动输入的域名列表来匹配解析请求</div>
                        <a-textarea v-model:value="value2" show-count :maxlength="100"  style="margin-left:550px;width:300px" placeholder="Basic usage"/>
                    </a-form-item>
                    </div>
                </div>
                
<!-- 解析动作 -->
                <div class="ml foundation">解析动作</div>
                <a-form-item label="策略类型" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" v-model:value="radiovalue_load">
                        <a-radio :value="0">递归策略</a-radio>
                        <a-radio :value="1">转发策略</a-radio>
                        <a-radio :value="2">负载均衡策略</a-radio>
                        <a-radio :value="3">域名劫持策略</a-radio>
                    </a-radio-group>
                    <exclamation-circle-filled class="icon_filled"/>
                </a-form-item>

                <div v-if="radiovalue_load == 1">
                    <div >
                    <a-form-item  :validateTrigger="['change', 'blur']" :wrapperCol="{ span: 10 }" :labelCol="{ span: 9 }"
                        label="转发服务器" name="aclId" style='margin-top: 10px;margin-bottom: 10px'>
                        <a-space>
                            <a-select placeholder="请选择" ref="select"  style="width: 260px" @focus="focus" @change="handleChange" :size="size" :options="server">
                               
                            </a-select>
                        </a-space>
                    </a-form-item>
                    </div>
                </div>

                <div v-if="radiovalue_load == 2">
                    <div>
                    <a-form-item label="负载均衡列表" name="aclType" style="margin-bottom: 0px">
                        <a-table :columns="columns" :pagination="false" bordered >
                        </a-table>
                        <a-button :style="{ margin: '10px 8px 0px 0px ' }" type="primary" @click="add_load">添加负载均衡点</a-button>
                    </a-form-item>
                    </div>
                </div>

                <div v-if="radiovalue_load == 3">
                    <div>
                    <a-form-item label="劫持动作" name="aclType" style="margin-bottom: 0px">
                    <a-space>
                            <a-select placeholder="请选择劫持动作" ref="select"  style="width: 260px" @focus="focus" @change="handleChange"  
                            :size="size" > 
                                <a-select-option value="1"> 拦截并返回该域名不存在 （NXDOMAIN）</a-select-option>
                                <a-select-option value="2"> 拦截并返回空解析 （NOERROR）</a-select-option>
                                <a-select-option value="3">拦截并返回指定的IPv4地址</a-select-option>
                                <a-select-option value="4">拦截并返回指定的IPv6地址</a-select-option>
                                <a-select-option value="5">拦截并返回指定的CNAME记录</a-select-option>
                            </a-select>
                        </a-space>
                </a-form-item>
                    </div>
                </div>

<!-- >结果处理 -->
                <div class="ml foundation">结果处理</div>
                <a-form-item label="NX重定向" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" v-model:value="radiovalue_NX">
                        <a-radio :value="0">继承集群(集群已关闭NX重定向)</a-radio>
                        <a-radio :value="1">自定义</a-radio>
                    </a-radio-group>
                    <exclamation-circle-filled class="icon_filled"/>
                </a-form-item>
                 <!-- 自定义 -->
                <div v-if="radiovalue_NX == 1">
                    <div style="margin-left:590px;">
                    <a-form-item :validateTrigger="['change', 'blur']" :wrapperCol="{ span: 10 }" :labelCol="{ span: 9 }"
                        label="" name="aclId" style='margin-top: 10px;margin-bottom: 10px'>
                        <a-checkbox v-model:checked="checked_suffix">指定域名后缀</a-checkbox>
                            <div v-if="checked_suffix == true">
                                <a-input  placeholder="请填写要启用NX重定向的域名后缀" style='margin-top: 10px;margin-bottom: 10px'/>
                            </div>
                         <a-input v-model:value="value1" addon-before="V4重定向"  style='margin-bottom: 10px'/>
                         <a-input v-model:value="value1" addon-before="V4重定向"  style='margin-bottom: 10px'/>
                    </a-form-item>
                    </div>
                    <a-form-item label="失败后转发" name="aclType" style="margin-bottom: 0px">
                        <a-switch v-model:checked="checked_transpond" style="margin-right: 20px"/>
                        <exclamation-circle-filled class="icon_filled"/>
                    </a-form-item>
                    <div v-if="checked_transpond == true" style="margin-left:590px;">
                            <a-form-item  name="aclType" style="margin-bottom: 0px;margin-top:10px">
                            <!-- :data-source="listData" -->
                            <a-space>
                                <a-select placeholder="请选择" ref="select"  style="width: 260px" @focus="focus" @change="handleChange" mode="tags" :size="size" >
                                    <a-select-option value="0">默认</a-select-option>
                                    <a-select-option value="1">默认</a-select-option>
                                    <a-select-option value="2">默认</a-select-option>
                                </a-select>
                            </a-space>
                            </a-form-item> 
                    </div>
                </div>

                <div class="ml foundation">故障检测</div>
                <a-form-item  name="aclType" style="margin-bottom: 0px">
                    <a-switch v-model:checked="checked" style="margin-left:550px;"/>
                </a-form-item>
            </a-form> 
        </div>

<!-- 添加负载均衡点按钮弹框 -->
        <div>
            <a-modal :body-style="modalStyle" style="top: 100px" v-model:visible="visible_Load" title="添加负载均衡点" width="700px" @ok="handleadd">
                <a-form name="basic" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger="blur">
                    <a-form-item :wrapper-col="{ span: 16 }" label="名称" style="margin-top: 5px">
                        <a-input  placeholder="负载均衡策略名称" />
                    </a-form-item>
                    <a-form-item label="NX重定向" name="aclType" style="margin-bottom: 0px;margin-top:-15px">
                        <a-radio-group  name="radioGroup" v-model:value="radiovalue_transmit">
                            <a-radio :value="0">转发</a-radio>
                            <a-radio :value="1">递归</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <div v-if="radiovalue_transmit == 0">
                        <a-form-item label="转发服务器" name="aclType" style="margin-bottom: 0px;margin-top:10px">
                        <a-space>
                            <a-select placeholder="请选择转发服务器" ref="select"  style="width: 465px" @focus="focus" @change="handleChange" :options="server" :size="size" >
                            </a-select>
                        </a-space>
                        </a-form-item>
                    </div>
                    
                    <a-form-item label="失败后递归" name="aclType" style="margin-bottom: 0px;margin-top:10px">
                        <a-switch v-model:checked="checked_Lose" style="margin-right: 20px"/>
                        <exclamation-circle-filled class="icon_filled"/>
                    </a-form-item>
                    <a-form-item label="排序" name="aclType" style="margin-bottom: 0px;margin-top:10px">
                        <a-space>
                            <a-select placeholder="请选择排序" ref="select"  style="width: 465px" @focus="focus" @change="handleChange"
                                :size="size" >
                                <a-select-option value="1">1</a-select-option>
                                <a-select-option value="2">2</a-select-option>
                                <a-select-option value="3">3</a-select-option>
                            </a-select>
                        </a-space>
                    </a-form-item>
                    <a-form-item label="解析动作" name="aclType" style="margin-bottom: 0px;margin-top:10px">
                        <a-radio-group  name="radioGroup" v-model:value="radiovalue_action">
                            <a-radio :value="0">SNMP探测指定IP网卡</a-radio>
                            <a-radio :value="1">转发服务器服务延时测试</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <!-- 选择第一项 -->
                    <div v-if="radiovalue_action == 0">
                        <a-form-item :wrapper-col="{ span: 16 }" label="检测周期" style="margin-top: 5px">
                            <a-input v-model:value="value1"  addon-after="分" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="复检周期" style="margin-top: -5px">
                            <a-input v-model:value="value1"  addon-after="分" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="异常判断次数" style="margin-top: -5px">
                            <a-input v-model:value="value1"  addon-after="次" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="检测点IP地址" style="margin-top: -5px">
                            <a-input  placeholder="请输入检测点IP地址" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="检测点团体名" style="margin-top: -5px">
                            <a-input  placeholder="请输入检测点SNMP团体名" />
                        </a-form-item>
                        <a-form-item label="检测点端口:" name="aclType" style="margin-bottom: 0px;margin-top:-5px">
                            <a-space>
                                <a-select placeholder="请选择要检测的端口" ref="select"  style="width: 260px" @focus="focus" @change="handleChange" mode="tags" 
                                    :size="size" >
                                    <a-select-option value="0">默认</a-select-option>
                                    <a-select-option value="1">默认</a-select-option>
                                    <a-select-option value="2">默认</a-select-option>
                                </a-select>
                            </a-space>
                            <a-button :style="{ margin: '0px 0px 0px 22px ' }" type="primary" >配置启用时段</a-button>
                        </a-form-item>
                        <a-form-item label="解析动作" name="aclType" style="margin-bottom: 0px;margin-top:5px">
                            <a-radio-group  name="radioGroup" >
                                <a-radio :value="0">出口</a-radio>
                                <a-radio :value="1">入口</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item label="解析动作" name="aclType" style="margin-bottom: 10px;margin-top:0px">
                            <a-radio-group  name="radioGroup" v-model:value="radiovalue_band">
                                <a-radio :value="0">使用端口物理宽带</a-radio>
                                <a-radio :value="1">使用手动设置宽带</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <div v-if="radiovalue_band == 1" class="band">
                            <a-form-item :wrapper-col="{ span: 18 }"  style="margin-top: -40px;margin-left:470px;">
                                <a-input v-model:value="value1" addon-after="Mbps" />
                            </a-form-item>
                            <!-- <a-form-item  style="margin-top:-40px;margin-left:480px;">
                                <a-input v-model:value="value1" addon-after="Mbps" />
                            </a-form-item> -->
                        </div>
                    </div>

                    <!-- 选择第二项 -->
                    <div v-if="radiovalue_action == 1">
                        <a-form-item :wrapper-col="{ span: 16 }" label="检测周期" style="margin-top: 5px">
                            <a-input v-model:value="value1"  addon-after="分" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="复检周期" style="margin-top: -5px">
                            <a-input v-model:value="value1"  addon-after="分" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="延迟阈值" style="margin-top: -5px">
                            <a-input v-model:value="value1"  addon-after="毫秒" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="异常判断次数" style="margin-top: -5px">
                            <a-input v-model:value="value1"  addon-after="次" />
                        </a-form-item>

                    </div>
                    
                </a-form>
		    </a-modal>
        </div>



    </div>
</template>
<script setup>
import { router } from '/@/router';
import { message,Modal } from 'ant-design-vue';
import { hostsAll,getaclIdAll,listAll,serverAll } from "./addpolicy"
import { computed, defineComponent, reactive, toRefs, ref,createVNode,watch, toRef  } from 'vue';
import {  ExclamationCircleFilled  } from '@ant-design/icons-vue'


const columns = [{
  title: '名称',
  dataIndex: 'policySquence',
  width: 220,
  align: 'center'
}, {
  title: '动作',
  dataIndex: 'policyName',
  width: 220,
  align: 'center'
}, {
  title: '检测点',
  dataIndex: 'matchSrc',
  width: 220,
  align: 'center'
},
{
  title: '检测状态',
  dataIndex: 'matchDst',
  width: 220,
  align: 'center'
},
{
  title: '当前权重',
  dataIndex: 'matchDomain',
  width: 220,
  align: 'center'

},
{
  title: '操作',
  dataIndex: 'operation',
  width: 250,
  align: 'center'
},
];
const data = reactive({
visible_Load : false,
Main_set:[],
allaclId:[],
Domain:[],
server:[]
})
const  {
visible_Load,
Main_set,
allaclId,
Domain,
server

} = toRefs(data)
const radiovalue = ref(0);
const radiovalue_acl = ref(0)
const radiovalue_type = ref(0)
const checked = ref(false);
const checked_suffix = ref(false)
const checked_transpond = ref(false)
const checked_Lose = ref(false)
const radiovalue_NX = ref(0)
const radiovalue_load = ref(0)
const radiovalue_domain = ref(0)
const radiovalue_action = ref(0)
const radiovalue_band = ref(0)
const radiovalue_transmit = ref(0)

const add_load = ()=>{
    visible_Load.value = true
}

const gethostAll = ()=>{
    // 获取主机组数据
    hostsAll().then((res)=>{
        // console.log(res,'res');
        let transformedData = res.map((item) => {
			return {
				value: item.groupId,
				label: item.groupName,
			};
		});
		Main_set.value = transformedData;
    })

    // 获取ACL数据
    getaclIdAll().then((res)=>{
        allaclId.value = res
    })
    //获取域名库数据
    listAll().then((res)=>{
        Domain.value = res
    })
    //获取所有服务器
    serverAll().then((res)=>{
        console.log(res);
        let transformedServe = res.map((item) => {
			return {
				value: item.id,
				label: item.name,
			};
		});
		server.value = transformedServe;
    })

}
gethostAll()

const go_Domain = ()=>{
    router.push('/domainname')
}

</script>
<style scoped lang='less'>
.addform{
    margin: 10px;
    background: white;
    .ml{
        margin-left: 400px;
    }
}
.foundation{
    font-size: 16px;
}
.anticon{
    color:#727272;
}



</style>