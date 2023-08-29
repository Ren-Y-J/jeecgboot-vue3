<template>
  <div>
    {{ 1 }}---- {{ $route.params.aclId }} --{{ $route.query.aclId }}
  </div>
</template>
<script name='aclInfo' setup>
// 在这个URL中，参数是通过查询字符串的形式传递的，你可以使用URL解析库（如Node.js中的URL模块）来解析查询字符串，并提取参数的值。
var href = window.location.href;
console.log(href);
//定义一个对象
function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  if (url.indexOf("?") != -1) {


    // var str = url.substr(1);
    // strs = str.split("&");
    // for (var i = 0; i < strs.length; i++) {
    //   theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    // }
  }
  // return theRequest;
}
GetRequest()
</script>
<style scoped lang="less"></style>