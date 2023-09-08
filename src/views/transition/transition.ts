// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/forwardServer/list', //所有
  edit = ' ', //修改
  add = '/forwardServer/add', //新增
  del = ' ',//删除
}
// 所有
export const getlist = (params) => defHttp.post({ url: RoleApi.list, params });
// 新增
export const addlist = (params) => defHttp.post({ url: RoleApi.add, params });