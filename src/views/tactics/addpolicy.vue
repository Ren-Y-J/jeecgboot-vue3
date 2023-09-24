<template>
    <div class="addform">
      <div >
        
        <div>
            <!-- ref="formRef" :model="formState" v-model:value="formState.policiesName" name="policiesName" :rules="[{ required: true, message: '请输入策略组名称!' }]"-->
            <a-form
				
				name="basic"
				:label-col="{ span: 9 }"
				:wrapper-col="{ span: 6 }"
				autocomplete="off"
				@finish="onFinish"
				@finishFailed="onFinishFailed"
				validateTrigger="blur">
                <div class="foundation ml">基础配置</div>
				<a-form-item
					label="策略名称"
					style="margin-top: 5px">
					<a-input  placeholder="请输入策略名称" />
				</a-form-item>
                <!-- v-model:value="queryParams.type" ref="select" v-model:value="queryParams.type"-->
                <a-form-item style="margin-bottom: 0px;margin-top: -10px" label="所属集群:" name="type" :labelCol="{ span: 9 }" 
                  :wrapperCol="{ span: 10 }"  >
                    <a-space>
                        <a-select   style="width: 327px" @focus="focus" placeholder="本机DNS" 
                        @change="handleChange"  >
                        <a-select-option value="0">本机DNS</a-select-option>
                    </a-select>
                    </a-space>
                </a-form-item>
                <a-form-item style="margin-bottom: 0px;margin-top: 10px" label="所属策略组:" name="type" :labelCol="{ span: 9 }" 
                  :wrapperCol="{ span: 10 }"  >
                    <a-space>
                        <a-select   style="width: 327px" @focus="focus" placeholder="默认" 
                        @change="handleChange"  >
                        <a-select-option value="0">默认</a-select-option>
                    </a-select>
                    </a-space>
                </a-form-item>
                <div class="foundation ml">匹配规则</div>
                <!-- v-model:value="radiovalue" -->
                <a-form-item label="匹配源地址" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" @change="changeradioFn">
                        <a-radio :value="0">所有地址</a-radio>
                        <a-radio :value="1">ACL选择</a-radio>
                    </a-radio-group>
                </a-form-item>
                <!-- <div v-if="radiovalue == 1">
            <div style="margin-left:130px ;">
              <a-form-item :validateTrigger="['change', 'blur']"
                 label="" name="aclId" style='margin-top: 10px'>
                <a-space>
                  <a-select placeholder="请选择" ref="select"  style="width: 160px"
                    @focus="focus" @change="handleChange" mode="tags" :size="size" 
                    >
                    <a-select-option value="0">默认</a-select-option>
                    <a-select-option value="0">默认</a-select-option>
                    <a-select-option value="0">默认</a-select-option>
                  </a-select>
                </a-space>
              </a-form-item>
            </div>

          </div> -->
                <a-form-item label="匹配目的地址" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" @change="changeradioFn">
                        <a-radio :value="0">所有地址</a-radio>
                        <a-radio :value="1">ACL选择</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="匹配解析类型" name="aclType" style="margin-bottom: 0px">
                    <a-radio-group  name="radioGroup" @change="changeradioFn">
                        <a-radio :value="0">所有解析类型</a-radio>
                        <a-radio :value="1">手动选择</a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-form>
        </div>
      </div>
    </div>
</template>
<script setup>




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