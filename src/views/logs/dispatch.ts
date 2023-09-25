// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/delivery/info/log/list', //所有列表
  hostsAll = '/hosts/get/hostsAll',
  edit = '', //修改
  add = '', //新增
  del = '', //删除
}
/**
 *分组列表
 */
export const dispatchlist = (params) => defHttp.post({ url: RoleApi.list, params });
export const gethostsAll = (params) => defHttp.post({ url: RoleApi.hostsAll, params });
