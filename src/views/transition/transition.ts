// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/forwardServer/list', //所有
  edit = '/forwardServer/update', //修改
  add = '/forwardServer/add', //新增
  del = '/forwardServer/delete',//删除
}
// 所有
export const getlist = (params) => defHttp.post({ url: RoleApi.list, params });
// 新增
export const addlist = (params) => defHttp.post({ url: RoleApi.add, params });
// 回显
export const editlist = (params) => defHttp.post({ url: RoleApi.edit, params });
// 删除
export const dellist = (params) => defHttp.post({ url: RoleApi.del, params });