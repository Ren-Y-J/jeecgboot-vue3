// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/domain/lib/define/list', //所有列表
  edit = '/domain/lib/define/update', //修改
  add = '/domain/lib/define/add', //新增
  del = '/domain/lib/define/delete',
  // addInfo = '/acl/details/add', //新增Acl详情
  // aclIdinfoList = '/acl/details/list',
  // delInfo = '/acl/details/delete',
  libraryAlllist = '/domain/lib/listAll',
  // district = '/acl/details/get/areas',
  // updateremark = '/acl/details/update',
}
/**
 * 域名库
 */

export const grouplist = (params) => defHttp.post({ url: RoleApi.list, params });
export const libraryAll = (params) => defHttp.get({ url: RoleApi.libraryAlllist, params });
export const addgroup = (params) => defHttp.post({ url: RoleApi.add, params });
export const editgroup = (params) => defHttp.post({ url: RoleApi.edit, params });
export const delgroup = (params) => defHttp.post({ url: RoleApi.del, params });
// 回显
export const groupInfo = (params) => defHttp.post({ url: '/domain/lib/define/' + params });
