// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/delivery/info/list', //所有列表
  hostsAll = '/hosts/get/hostsAll',
  edit = '', //修改
  add = '', //新增
  del = '', //删除
  // addInfo = '/acl/details/add', //新增Acl详情
  // aclIdinfoList = '/acl/details/list',
  // delInfo = '/acl/details/delete',
  // operator = '/acl/details/get/operator',
  // district = '/acl/details/get/areas',
  // updateremark = '/acl/details/update',
}
/**
 *分组列表
 */
export const taskloglist = (params) => defHttp.post({ url: RoleApi.list, params });
export const gethostsAll = (params) => defHttp.post({ url: RoleApi.hostsAll, params });
export const addlibrary = (params) => defHttp.post({ url: RoleApi.add, params });
export const editlibrary = (params) => defHttp.post({ url: RoleApi.edit, params });
export const dellibrary = (params) => defHttp.post({ url: RoleApi.del, params });
// 回显
export const libraryInfo = (params) => defHttp.get({ url: '/domain/lib/' + params });
