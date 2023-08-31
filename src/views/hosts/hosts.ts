// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/hosts/list', //所有主机
  edit = '', //修改
  add = '/hosts/add', //新增
  del = '/hosts/delete',
  query = '',
}
// 新增主机
export const addlist = (params) => defHttp.post({ url: RoleApi.add, params });
// 获取主机数据
export const getlist = (params) => defHttp.post({ url: RoleApi.list, params });
// 删除主机数据
export const dellist = (params) => defHttp.post({ url: RoleApi.del, params });

