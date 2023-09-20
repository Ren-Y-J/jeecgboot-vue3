import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/reverse/zone/rel/list', //所列表
  edit = '/reverse/zone/rel/update', //修改
  add = '/reverse/zone/rel/add', //新增
  del = '/reverse/zone/rel/delete',//删
 line='/line/manage/all',
}

// 所有列表
export const GetList = (params) => defHttp.post({ url: RoleApi.list, params });
// 删除
export const DelList = (params) => defHttp.post({ url: RoleApi.del, params });
// 获取
export const GetLine = (params) => defHttp.get({ url:'/zone/manage/'+ params });
// 新增
export const AddList = (params) => defHttp.post({ url:RoleApi.add,  params });
// 修改
export const EditList = (params) => defHttp.post({ url: RoleApi.edit, params });
// 回显
export const BackLine = (params) => defHttp.get({ url:'/reverse/zone/rel/'+ params });
// 启用禁用
export const stopStatus = (params) => defHttp.post({ url: '/zone/rel/switch', params });



