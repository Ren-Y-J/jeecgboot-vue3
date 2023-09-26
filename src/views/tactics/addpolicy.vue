<template>
    <div class="addform">
        <div class="mar_auto">
            <!-- ref="formRef" :model="formState" v-model:value="formState.policiesName" name="policiesName" :rules="[{ required: true, message: '请输入策略组名称!' }]"-->
            <a-form name="basic" :model="formState_bas" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }" autocomplete="off" style="padding-top: 40px;"
				@finish="onFinish" @finishFailed="onFinishFailed" validateTrigger="blur">基础配置
<!-- 基础配置 -->
				<a-form-item :wrapper-col="{ span: 5 }" label="策略名称" style="margin-top: 5px">
					<a-input  placeholder="请输入策略名称" v-model:value="formState_bas.policyName"/>
				</a-form-item>
                <a-form-item style="margin-bottom: 0px;margin-top: -10px" label="所属主机组:" name="type"  
                  :wrapperCol="{ span: 6 }"  >
                    <a-space>
                        <a-select style="width: 327px" @focus="focus" placeholder="请选择"  @change="handleChange" :options="Main_set" v-model:value="formState_bas.policyHostGroup">
                        </a-select>
                    </a-space>
                </a-form-item>
                <a-form-item style="margin-bottom: 0px;margin-top: 10px" label="所属策略组" name="type"  
                  :wrapperCol="{ span: 6 }" >
                    <a-space>
                        <a-select style="width: 327px" @focus="focus" placeholder="请选择"  @change="handleChange" v-model:value="formState_bas.Policy_group">
                            <a-select-option value="0">默认</a-select-option>
                        </a-select>
                    </a-space>
                </a-form-item>
            </a-form>
<!-- 匹配规则 -->
            <a-form name="basic" :model="formState_bas" :label-col="{ span: 3 }"  :wrapper-col="{ span: 7 }" autocomplete="off" style="padding-top: 40px"
				@finish="onFinish" @finishFailed="onFinishFailed" validateTrigger="blur">匹配规则
                <a-form-item label="匹配源地址" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" @change="changeradioFn" v-model:value="formState_bas.radiovalue" >
                        <a-radio value="0">所有地址</a-radio>
                        <a-radio value="1">ACL选择</a-radio>
                    </a-radio-group>
                    <a-select placeholder="请选择" ref="select"  style="width: 70%; margin-top: 10px"  mode="multiple" v-if="formState_bas.radiovalue == '1'"
                            :size="size" :options="allaclId" :field-names="{ label: 'aclId', value: 'aclId' }" v-model:value="formState_bas.rule_ACL" >
                    </a-select>
                </a-form-item>
                <!-- ACL选择下拉框 -->
                
                    
                    
             

                <a-form-item label="匹配目的地址" name="aclType" style="margin-bottom: 0px" >
                    <a-radio-group  name="radioGroup" v-model:value="formState_bas.radiovalue_acl">
                        <a-radio value="0">所有地址</a-radio>
                        <a-radio value="1">ACL选择</a-radio>
                    </a-radio-group>
                    <a-select placeholder="请选择"  style="width: 70%; margin-top: 10px"  mode="multiple" v-if="formState_bas.radiovalue_acl == '1'"
                        :size="size" :options="allaclId" :field-names="{ label: 'aclId', value: 'aclId' }" v-model:value="formState_bas.address_ACL">
                    </a-select>
                </a-form-item>
                <!-- ACL选择下拉框 -->
               

                <a-form-item label="匹配解析类型" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" v-model:value="formState_bas.radiovalue_type">
                        <a-radio value="0">所有解析类型</a-radio>
                        <a-radio value="1">手动选择</a-radio>
                    </a-radio-group>
                    <a-select placeholder="请选择" mode="tags" style="width: 70%; margin-top: 10px" v-if="formState_bas.radiovalue_type == '1'"
                            :size="size" v-model:value="formState_bas.selection">
                                <a-select-option value="0">默认</a-select-option>
                                <a-select-option value="1">默认</a-select-option>
                                <a-select-option value="2">默认</a-select-option>
                            </a-select>
                </a-form-item>
                <!-- 手动选择下拉框 -->
                

                <a-form-item label="匹配域名" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" v-model:value="formState_bas.radiovalue_domain ">
                        <a-radio value="0">所有域名</a-radio>
                        <a-radio value="1">域名库</a-radio>
                        <a-radio value="2">手动输入域名</a-radio>
                    </a-radio-group>
                    <div v-if="formState_bas.radiovalue_domain == '0'" style="margin-top: 10px">* 匹配所有域名</div>
                    <div v-if="formState_bas.radiovalue_domain == '1'">
                        <div style="margin-top: 10px">* 按域名库匹配解析请求，包括系统内置域名库和用户自定义域名库</div>
                        <a-select placeholder="请选择" mode="multiple" style="width: 50%; margin-top: 10px"
                            :size="size" :options="Domain" :field-names="{ label: 'dnId', value: 'dnId' }" v-model:value="formState_bas.Domain_library">
                        </a-select>
                        <a-button :style="{ margin: '10px 8px 9px 10px '}"  type="primary" @click="go_Domain">自定义域名库管理</a-button>
                    </div>
                    <div v-if="formState_bas.radiovalue_domain == '2'">
                        <div style="margin-top: 10px">* 按手动输入的域名列表来匹配解析请求</div>
                        <a-textarea v-model:value="formState_bas.Manual_input" show-count :maxlength="100" style="width: 60%; margin-top: 10px"  placeholder="Basic usage"/>
                </div>

                </a-form-item>
                
                
            </a-form>
                
<!-- 解析动作 -->
                
                <a-form name="basic" :model="formState_bas" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }" autocomplete="off" style="padding-top: 40px"
				@finish="onFinish" @finishFailed="onFinishFailed" validateTrigger="blur">解析动作
                <a-form-item label="策略类型" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" v-model:value="formState_bas.radiovalue_load">
                        <a-radio value="0">递归策略</a-radio>
                        <a-radio value="1">转发策略</a-radio>
                        <a-radio value="2">负载均衡策略</a-radio>
                        <a-radio value="3">域名劫持策略</a-radio>
                    </a-radio-group>
                    <exclamation-circle-filled class="icon_filled"/>
                </a-form-item>

                <div v-if="formState_bas.radiovalue_load == '1'">
                    <div >
                    <a-form-item  :validateTrigger="['change', 'blur']" :wrapperCol="{ span: 10 }" 
                        label="转发服务器" name="aclId" style='margin-top: 10px;margin-bottom: 10px'>
                        <a-space>
                            <a-select placeholder="请选择" ref="select"  style="width: 260px" @focus="focus" @change="handleChange" :size="size" :options="server" 
                            v-model:value="formState_bas.forwarding">
                            </a-select>
                        </a-space>
                    </a-form-item>
                    </div>
                </div>

                <div v-if="formState_bas.radiovalue_load == '2'">
                    <div>
                    <a-form-item label="负载均衡列表" name="aclType" style="margin-bottom: 0px">
                        <a-table :columns="columns" :pagination="false" bordered >
                        </a-table>
                        <a-button :style="{ margin: '10px 8px 0px 0px ' }" type="primary" @click="add_load">添加负载均衡点</a-button>
                    </a-form-item>
                    </div>
                </div>

                <div v-if="formState_bas.radiovalue_load == '3'">
                    <div>
                    <a-form-item label="劫持动作" name="aclType" style="margin-bottom: 0px">
                    <a-space>
                            <a-select placeholder="请选择劫持动作" ref="select"  style="width: 260px" @focus="focus" @change="handleChange"  
                            :size="size" v-model:value="formState_bas.abduct"> 
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
            </a-form>

<!-- >结果处理 -->
                
                <a-form name="basic" :model="formState_bas" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }" autocomplete="off" style="padding-top: 40px"
				@finish="onFinish" @finishFailed="onFinishFailed" validateTrigger="blur">结果处理
                <a-form-item label="NX重定向" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" v-model:value="formState_bas.radiovalue_NX">
                        <a-radio value="0">继承集群(集群已关闭NX重定向)</a-radio>
                        <a-radio value="1">自定义</a-radio>
                    </a-radio-group>
                    <exclamation-circle-filled class="icon_filled"/>
                    <div v-if="formState_bas.radiovalue_NX == '1'">
                  
                    <a-form-item :validateTrigger="['change', 'blur']" :wrapperCol="{ span: 10 }" :labelCol="{ span: 9 }"
                        label="" name="aclId" style='margin-top: 10px;margin-bottom: 10px'>
                        <a-checkbox v-model:checked="formState_bas.checked_suffix">指定域名后缀</a-checkbox>
                            <div v-if="formState_bas.checked_suffix == true">
                                <a-input  placeholder="请填写要启用NX重定向的域名后缀" style='margin-top: 10px;margin-bottom: 10px' v-model:value="formState_bas.suffix"/>
                            </div>
                         <a-input v-model:value="formState_bas.suffix_V4" addon-before="V4重定向" placeholder="为空则对V4直接返回空解析" style='margin-bottom: 10px'/>
                         <a-input v-model:value="formState_bas.suffix_V6" addon-before="V6重定向" placeholder="为空则对V6直接返回空解析" style='margin-bottom: 10px'/>
                    </a-form-item>
                    </div>
                </a-form-item>
                 <!-- 自定义 -->
                    <a-form-item label="失败后转发" name="aclType" style="margin-bottom: 0px">
                        <a-switch v-model:checked="formState_bas.checked_transpond" style="margin-right: 20px"/>
                        <exclamation-circle-filled class="icon_filled"/>
                        <div v-if="formState_bas.checked_transpond == true" >
                            <a-form-item  name="aclType" style="margin-bottom: 0px;margin-top:10px">
                            <a-space>
                                <a-select placeholder="请选择" ref="select"  style="width: 260px" @focus="focus" @change="handleChange" mode="tags" :size="size" 
                                v-model:value="formState_bas.Lose_transpond">
                                    <a-select-option value="0">默认</a-select-option>
                                    <a-select-option value="1">默认</a-select-option>
                                    <a-select-option value="2">默认</a-select-option>
                                </a-select>
                            </a-space>
                            </a-form-item> 
                    </div>
                    </a-form-item>
                    
                
            </a-form>

                
                <a-form name="basic" :model="formState_bas" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }"  style="padding-top: 40px"
				  layout="horizontal">故障检测
                <a-form-item label=" " :colon="false"  name="aclType" style="margin-bottom: 10px">
                    <a-switch v-model:checked="formState_bas.checked" />
                </a-form-item>
                <a-form-item  name="aclType" style="margin-bottom: 100px">
                    <a-button :style="{ margin: '10px 8px 20px 0px ' }" type="primary" @click="Save_config">保存配置</a-button>
                </a-form-item>
            </a-form>
        </div>
</div>

<!-- 添加负载均衡点按钮弹框 -->
            <a-modal  style="top: 100px" v-model:visible="visible_Load" title="添加负载均衡点" width="700px" @ok="add_load_Off">
                <a-form name="basic"  :model="formState_add" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish" @finishFailed="onFinishFailed" validateTrigger="blur">
                    <a-form-item :wrapper-col="{ span: 16 }" label="名称" style="margin-top: 5px">
                        <a-input  placeholder="负载均衡策略名称" v-model:value="formState_add.Balance"/>
                    </a-form-item>
                    <a-form-item label="NX重定向"  style="margin-bottom: 0px;margin-top:-15px">
                        <a-radio-group  v-model:value="formState_add.radiovalue_transmit">
                            <a-radio value="0">转发</a-radio>
                            <a-radio value="1">递归</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <div v-if="formState_add.radiovalue_transmit == '0'">
                        <a-form-item label="转发服务器"  style="margin-bottom: 0px;margin-top:10px">
                        <a-space>
                            <a-select placeholder="请选择转发服务器" ref="select"  style="width: 465px" @focus="focus" @change="handleChange" :options="server" :size="size" 
                            v-model:value="formState_add.Forwarding_server">
                            </a-select>
                        </a-space>
                        </a-form-item>
                    </div>
                    
                    <a-form-item label="失败后递归" name="aclType" style="margin-bottom: 0px;margin-top:10px">
                        <a-switch v-model:checked="formState_add.checked_Lose" style="margin-right: 20px"/>
                        <exclamation-circle-filled class="icon_filled"/>
                    </a-form-item>
                    <a-form-item label="排序" name="aclType" style="margin-bottom: 0px;margin-top:10px">
                        <a-space>
                            <a-select placeholder="请选择排序" ref="select"  style="width: 465px" @focus="focus" @change="handleChange"
                                :size="size" v-model:value="formState_add.Select_sort">
                                <a-select-option value="1">1</a-select-option>
                                <a-select-option value="2">2</a-select-option>
                                <a-select-option value="3">3</a-select-option>
                            </a-select>
                        </a-space>
                    </a-form-item>
                    <a-form-item label="解析动作" name="aclType" style="margin-bottom: 0px;margin-top:10px">
                        <a-radio-group  name="radioGroup" v-model:value="formState_add.radiovalue_action">
                            <a-radio value="0">SNMP探测指定IP网卡</a-radio>
                            <a-radio value="1">转发服务器服务延时测试</a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <!-- 选择第一项 -->
                    <div v-if="formState_add.radiovalue_action == '0'">
                        <a-form-item :wrapper-col="{ span: 16 }" label="检测周期" style="margin-top: 5px">
                            <a-input v-model:value="formState_add.Detect_cycle"  addon-after="分" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="复检周期" style="margin-top: -5px">
                            <a-input v-model:value="formState_add.Review_cycle"  addon-after="分" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="异常判断次数" style="margin-top: -5px">
                            <a-input v-model:value="formState_add.abnormal"  addon-after="次" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="检测点IP地址" style="margin-top: -5px">
                            <a-input  placeholder="请输入检测点IP地址" v-model:value="formState_add.IP_address"/>
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="检测点团体名" style="margin-top: -5px">
                            <a-input  placeholder="请输入检测点SNMP团体名" v-model:value="formState_add.Group_name"/>
                        </a-form-item>
                        <a-form-item label="检测点端口:" name="aclType" style="margin-bottom: 0px;margin-top:-5px">
                            <a-space>
                                <a-select placeholder="请选择要检测的端口" ref="select"  style="width: 260px" @focus="focus" @change="handleChange" mode="tags" 
                                    :size="size" v-model:value="formState_add.port">
                                    <a-select-option value="0">默认</a-select-option>
                                    <a-select-option value="1">默认</a-select-option>
                                    <a-select-option value="2">默认</a-select-option>
                                </a-select>
                            </a-space>
                            <a-button :style="{ margin: '0px 0px 0px 22px ' }" type="primary" @click="add_time">配置启用时段</a-button>
                        </a-form-item>
                        <a-form-item label="解析动作" name="aclType" style="margin-bottom: 0px;margin-top:5px">
                            <a-radio-group  name="radioGroup" v-model:value="formState_add.action_out">
                                <a-radio value="0">出口</a-radio>
                                <a-radio value="1">入口</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item label="解析动作" name="aclType" style="margin-bottom: 10px;margin-top:0px">
                            <a-radio-group  name="radioGroup" v-model:value="formState_add.radiovalue_band">
                                <a-radio value="0">使用端口物理宽带</a-radio>
                                <a-radio value="1">使用手动设置宽带</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <div v-if="formState_add.radiovalue_band == '1'" class="band">
                            <a-form-item :wrapper-col="{ span: 18 }"  style="margin-top: -40px;margin-left:470px;">
                                <a-input v-model:value="formState_add.broadband_Mbps" addon-after="Mbps" />
                            </a-form-item>
                        </div>
                    </div>

                    <!-- 选择第二项 -->
                    <div v-if="formState_add.radiovalue_action == '1'">
                        <a-form-item :wrapper-col="{ span: 16 }" label="检测周期" style="margin-top: 5px">
                            <a-input v-model:value="formState_add.Detection_points"  addon-after="分" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="复检周期" style="margin-top: -5px">
                            <a-input v-model:value="formState_add.cycle_points"  addon-after="分" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="延迟阈值" style="margin-top: -5px">
                            <a-input v-model:value="formState_add.milliseconds"  addon-after="毫秒" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ span: 16 }" label="异常判断次数" style="margin-top: -5px">
                            <a-input v-model:value="formState_add.frequency"  addon-after="次" />
                        </a-form-item>
                    </div>  
                </a-form> 
		    </a-modal>

        <!-- 配置启用时段弹框 -->
        <div>
		<a-modal
			:scroll="{ x: 'calc(700px + 50%)', y: '510' }"
			:body-style="modalStyle"
			style="top: 200px"
			v-model:visible="visible_Time"
			title="配置启用时段"
			width="600px"
			@ok="handleadd"
			
		>
			<a-form
				ref="formRef"
				:model="formState_Time"
				name="basic"
				:label-col="{ span: 6 }"
				:wrapper-col="{ span: 16 }"
				autocomplete="off"
				@finish="onFinish"
				@finishFailed="onFinishFailed"
				validateTrigger="blur"
			>
				<a-form-item
					label="启用周期"
					name="policiesTimeType"
					style="margin-top: 26px"
					class="lable_form"
					:rules="[{ required: true, message: '请选择启用周期!' }]"
				>
					<a-checkbox-group v-model:value="formState_Time.policiesTimeType" style="width: 100%" @change="checkboxTime" class="radio_right">
						<a-row>
							<a-col :span="5">
								<a-checkbox value="1">周一</a-checkbox>
							</a-col>
							<a-col :span="5">
								<a-checkbox value="2">周二</a-checkbox>
							</a-col>
							<a-col :span="5">
								<a-checkbox value="3">周三</a-checkbox>
							</a-col>
							<a-col :span="5">
								<a-checkbox value="4">周四</a-checkbox>
							</a-col>
							<a-col :span="5">
								<a-checkbox value="5">周五</a-checkbox>
							</a-col>
							<a-col :span="5">
								<a-checkbox value="6">周六</a-checkbox>
							</a-col>
							<a-col :span="5">
								<a-checkbox value="7">周日</a-checkbox>
							</a-col>
						</a-row>
					</a-checkbox-group>
				</a-form-item>
				<div class="label_text">时段：</div>
				<a-form-item class="form_time"  v-for="(item,index) in formDataName" :key="index" >
					<a-time-range-picker v-model:value="item.state_value" value-format="HH:mm:ss" :placeholder="placeholder" />
					<div class="addtimeform">
						<plus-circle-filled style="color: #bfbfbf" @click="addIconTime" v-if="item.id === '1'" />
						<close-circle-filled class="Xicon" @click="XiconBtn(index)" v-if="item.id !== '1'" />
					</div>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>
<script setup>
import { router } from '/@/router';
import { message,Modal } from 'ant-design-vue';
import { hostsAll,getaclIdAll,listAll,serverAll } from "./addpolicy"
import { computed, defineComponent, reactive, toRefs, ref,createVNode,watch, toRef  } from 'vue';
import {  ExclamationCircleFilled,PlusCircleFilled,CloseCircleFilled  } from '@ant-design/icons-vue'


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
visible_Time:false,
Main_set:[],
allaclId:[],
Domain:[],
server:[],
formState_bas:{
    radiovalue:'0',
    radiovalue_acl:'0',
    radiovalue_type:'0',
    radiovalue_NX:'0',
    radiovalue_load:'0',
    radiovalue_domain:'0',
    checked:false,
    checked_suffix:false,
    checked_transpond:false,
    policyHostGroup:undefined,
    policyName:'',
    Policy_group:undefined,
    rule_ACL:undefined,
    address_ACL:undefined,
    selection:undefined,
    Domain_library:undefined,
    Manual_input:undefined,
    forwarding:undefined,
    abduct:undefined,
    suffix:'',
    suffix_V4:'',
    suffix_V6:'',
    Lose_transpond:undefined,
},
formState_add:{
    radiovalue_transmit:'0',
    checked_Lose:false,
    radiovalue_action:'0',
    radiovalue_band:'0',
    Balance:'',
    Forwarding_server:undefined,
    Select_sort:undefined,
    Detect_cycle:10,
    Review_cycle:10,
    abnormal:2,
    IP_address:'',
    Group_name:'',
    port:undefined,
    action_out:'0',
    broadband_Mbps:'',
    Detection_points:10,
    cycle_points:10,
    milliseconds:500,
    frequency:2
},
formState_Time:{
    policiesTimeType:[],
    policiesTimeRange:[]
  },
formDataName:[{id:'1',state_value:[]}],
})

const {
visible_Load,
visible_Time,
Main_set,
allaclId,
Domain,
server,
formState_bas,
formState_add,
formState_Time,
formDataName,
} = toRefs(data)
const formRef = ref(null); //添加按钮弹框需要的ref

//配置启用时段的弹框滚动条和高度v
const modalStyle = ref({
	height: '230px',
	overflowY: 'auto',
	overflowX: 'hidden',
});

// 添加负载均衡点按钮
const add_load = ()=>{
    visible_Load.value = true
}
// 添加负载均衡弹框确定按钮
const add_load_Off = ()=>{
    // visible_Load.value = false
    console.log(formState_add.value,'formState_add22222');
}

// 保存配置按钮
const Save_config = ()=>{
    router.push('/tactics/disposition')
}

//点击配置启用时段的添加时间图标v
const addIconTime = () => {
	//添加时段
	formDataName.value.push({
		state_value:[]
	})
};
// 配置启用时段删除时间图标v
const XiconBtn = (index) => {
	formDataName.value.splice(index,1)
};

// 配置时段按钮
const add_time = ()=>{
    visible_Time.value = true
}


// 配置时段弹框的确定按钮
const handleadd =async (evt)=>{
	let target = evt.target;
	if(target.nodeName == "SPAN"){
        target = evt.target.parentNode;
    }
    target.blur()
	formDataName.value.forEach(item=>{
		if(item.state_value == ''){
			message.error('请选择时间')
		}else{
			visible_Time.value = false
		}
	})
    try {
    	await formRef.value.validate()
  	} catch (error) {
    	return console.log(error)
  	}
  	let arrTime =''
  	let policiesTime = []//获取的时间段的数组
//   console.log(formDataName.value,'formDataName.value***');
   	let strCancel = formDataName.value.forEach(item=>{//数据是对象包数组的形式，遍历里面的每一项
  		arrTime =item.state_value.toString()//用toString()转成字符串形式
  		let arrToStr = arrTime.split(',')//逗号分隔
  		let convertedTimeString  = arrToStr.join('-')//按照指定分隔符分割
  		policiesTime.push(convertedTimeString) //push没有返回值，let变量需要在遍历之前；
  		formState_Time.value.policiesTimeRange = policiesTime
  	})
}

const gethostAll = ()=>{
    // 获取主机组数据
    hostsAll().then((res)=>{
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
        let transformedServe = res.map((item) => {
			return {
				value: item.id,
				label: item.id,
			};
		});
		server.value = transformedServe;
    })
}
gethostAll()

// 自定义域名库管理按钮跳转
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
.lable_form {
	/deep/ .ant-form-item-label > label {
		align-items: start;
	}
}
.form_time {
	width: 400px;
	margin-left: 130px;
	/deep/ .ant-form-item-control-input {
		width: 450px;
		margin-left: 30px;
	}
}
.addtimeform {
	display: inline;
	margin-left: 30px;
}
.label_text {
	margin-left: 90px;
}
.mar_auto{
    width: 1500px;
    margin: 0 auto;
}

</style>