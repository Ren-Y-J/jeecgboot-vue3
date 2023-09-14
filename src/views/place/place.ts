import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/zone/manage/list', //所列表
  edit = '', //修改
  add = '/zone/manage/add', //新增
  del = '/zone/manage/delete',//删
  line='/line/manage/all',
  stop='/zone/manage/switch'//停用
  
}    
// 获取所有正向列表
export const GetList = (params) => defHttp.post({ url: RoleApi.list, params });
// 获取所有反向列表
export const GetReverseList = (params) => defHttp.post({ url:'/reverse/zone/list', params });
// 获取
export const GetLine = (params) => defHttp.post({ url: RoleApi.line, params });
// 新增
export const AddLine = (params) => defHttp.post({ url: RoleApi.add, params });
// 删除
export const DelLine = (params) => defHttp.post({ url: RoleApi.del, params });
// 新增反向域
export const AddReverseList = (params) => defHttp.post({ url:'/reverse/zone/add', params });
// 停用
export const stopStatus = (params) => defHttp.post({ url:RoleApi.stop, params });
// 获取主机下拉
export const GetHostsAll = (params) => defHttp.post({ url:'/hosts/get/hostsAll', params });
// SOA回显
export const SOAEcho = (params) => defHttp.get({ url:'/zone/manage/value/'+ params });