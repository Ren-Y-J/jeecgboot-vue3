// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/host/group/list', //所有列表
  edit = '/host/group/update', //修改
  add = '/host/group/add', //新增
  del = '/host/group/delete', //删除
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
export const mainsetlist = (params) => defHttp.post({ url: RoleApi.list, params });
export const addmainset = (params) => defHttp.post({ url: RoleApi.add, params });
export const edimainset = (params) => defHttp.post({ url: RoleApi.edit, params });
export const delmainset = (params) => defHttp.post({ url: RoleApi.del, params });
// 回显
export const libraryInfo = (params) => defHttp.get({ url: '/domain/lib/' + params });
