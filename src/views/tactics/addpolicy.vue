<template>
    <div class="addform">
      
        
        <div>
            <!-- ref="formRef" :model="formState" v-model:value="formState.policiesName" name="policiesName" :rules="[{ required: true, message: '请输入策略组名称!' }]"-->
            <a-form name="basic" :label-col="{ span: 9 }" :wrapper-col="{ span: 12 }" autocomplete="off"
				@finish="onFinish" @finishFailed="onFinishFailed" validateTrigger="blur">

                <div class="foundation ml">基础配置</div>
				<a-form-item :wrapper-col="{ span: 6 }" label="策略名称" style="margin-top: 5px">
					<a-input  placeholder="请输入策略名称" />
				</a-form-item>
                <!-- v-model:value="queryParams.type" ref="select" v-model:value="queryParams.type"-->
                <a-form-item style="margin-bottom: 0px;margin-top: -10px" label="所属集群:" name="type" :labelCol="{ span: 9 }" 
                  :wrapperCol="{ span: 10 }"  >
                    <a-space>
                        <a-select style="width: 327px" @focus="focus" placeholder="本机DNS"  @change="handleChange"  >
                            <a-select-option value="0">本机DNS</a-select-option>
                        </a-select>
                    </a-space>
                </a-form-item>
                <a-form-item style="margin-bottom: 0px;margin-top: 10px" label="所属策略组:" name="type" :labelCol="{ span: 9 }" 
                  :wrapperCol="{ span: 10 }"  >
                    <a-space>
                        <a-select style="width: 327px" @focus="focus" placeholder="默认"  @change="handleChange"  >
                            <a-select-option value="0">默认</a-select-option>
                        </a-select>
                    </a-space>
                </a-form-item>

                <div class="foundation ml">匹配规则</div>
                <a-form-item label="匹配源地址" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" @change="changeradioFn" v-model:value="radiovalue" >
                        <a-radio :value="0">所有地址</a-radio>
                        <a-radio :value="1">ACL选择</a-radio>
                    </a-radio-group>
                </a-form-item>
                <!-- ACL选择下拉框 -->
                <div v-if="radiovalue == 1">
                    <div style="margin-left:490px;">
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

                <a-form-item label="匹配目的地址" name="aclType" style="margin-bottom: 0px" >
                    <a-radio-group  name="radioGroup" v-model:value="radiovalue_acl">
                        <a-radio :value="0">所有地址</a-radio>
                        <a-radio :value="1">ACL选择</a-radio>
                    </a-radio-group>
                </a-form-item>
                <!-- ACL选择下拉框 -->
                <div v-if="radiovalue_acl == 1">
                    <div style="margin-left:490px;">
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

                <a-form-item label="匹配解析类型" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" v-model:value="radiovalue_type">
                        <a-radio :value="0">所有解析类型</a-radio>
                        <a-radio :value="1">手动选择</a-radio>
                    </a-radio-group>
                </a-form-item>
                <!-- 手动选择下拉框 -->
                <div v-if="radiovalue_type == 1">
                    <div style="margin-left:490px;">
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
                    <a-radio-group  name="radioGroup" >
                        <a-radio :value="0">所有域名</a-radio>
                        <a-radio :value="1">域名库</a-radio>
                        <a-radio :value="2">手动输入域名</a-radio>
                    </a-radio-group>
                </a-form-item>
                <div style="margin-left:420px">* 匹配所有域名</div>
                <div class="ml foundation">解析动作</div>
                <a-form-item label="策略类型" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" >
                        <a-radio :value="0">递归策略</a-radio>
                        <a-radio :value="1">转发策略</a-radio>
                        <a-radio :value="2">负载均衡策略</a-radio>
                        <a-radio :value="3">域名劫持策略</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="负载均衡列表" name="aclType" style="margin-bottom: 0px">
                    <!-- :data-source="listData" -->
                    <a-table :columns="columns" :pagination="false" bordered >
                    </a-table>
                    <a-button :style="{ margin: '0px 8px 0px 0px ' }" type="primary">添加负载均衡点</a-button>
                </a-form-item>
                <div class="ml foundation">结果处理</div>
                <a-form-item label="NX重定向" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" >
                        <a-radio :value="0">继承集群(集群已关闭NX重定向)</a-radio>
                        <a-radio :value="1">自定义</a-radio>
                    </a-radio-group>
                </a-form-item>
                <div class="ml foundation">故障检测</div>
                <a-form-item  name="aclType" style="margin-bottom: 0px">
                    <a-switch v-model:checked="checked" style="margin-left:400px;"/>
                </a-form-item>
            </a-form> 
        </div>
    </div>
</template>
<script setup>
import { computed, defineComponent, reactive, toRefs, ref,createVNode,watch, toRef  } from 'vue';


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

})
const  {

} = toRefs(data)
const radiovalue = ref(0);
const radiovalue_acl = ref(0)
const radiovalue_type = ref(0)
const checked = ref(false);


</script>
<style scoped lang='less'>
.addform{
    // margin-left: 100px;
    margin: 10px;
    background: white;
    .ml{
        margin-left: 300px;
    }
}
.foundation{
    font-size: 16px;
}

</style>