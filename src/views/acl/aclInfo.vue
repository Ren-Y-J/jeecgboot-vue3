<template>
  <div>
    {{ 1 }}---- {{ $route.params.aclId }} --{{ $route.query.aclId }}
  </div>
</template>
<script name='aclInfo' setup>
import { aclIdinfoList } from './disposition'
// 在这个URL中，参数是通过查询字符串的形式传递的，你可以使用URL解析库（如Node.js中的URL模块）来解析查询字符串，并提取参数的值。
var href = window.location.href;
console.log(href);
//定义一个对象
function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  if (url.indexOf("?") != -1) {
    let aclId = url.split('?')[1]
    console.log(aclId);
  }
}
GetRequest()
// const initData = async () => {
//   // let res = await aclIdinfoList()
// }
</script>
<style scoped lang="less"></style>