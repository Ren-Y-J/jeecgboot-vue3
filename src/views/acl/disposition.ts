// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/acl/manage/list', //所有列表
  edit = '/acl/manage/update', //修改
  add = '/acl/manage/add', //新增
  del = '/acl/manage/delete', //删除
  addInfo = '/acl/details/add', //新增Acl详情
  aclIdinfoList = '/acl/details/list',
  delInfo = '/acl/details/delete',
  operator = '/acl/details/get/operator',
  district = '/acl/details/get/areas',
}
export const acllist = (params) => defHttp.post({ url: RoleApi.list, params });
/**
 * 新增Acl名称
 */
export const addaclList = (params) => defHttp.post({ url: RoleApi.add, params });
/**
 * 修改Acl名称
 */

export const editaclname = (params) => defHttp.post({ url: RoleApi.edit, params });
// 回显
export const aclnameInfo = (params) => defHttp.get({ url: '/acl/manage/' + params });
//删除
export const delcalList = (params) => defHttp.post({ url: RoleApi.del, params });
// 新增Acl详情
export const addInfo = (params) => defHttp.post({ url: RoleApi.addInfo, params });
// 根据集群ID查询主机zhe
// export const aclIdinfoList = (params) => defHttp.post({ url: '/cluster/manage/' + params });
export const aclIdinfoList = (params) => defHttp.post({ url: RoleApi.aclIdinfoList, params });
export const acldelInfo = (params) => defHttp.post({ url: RoleApi.delInfo, params });
// 运营商
export const getoperator = (params) => defHttp.post({ url: RoleApi.operator, params });
export const getdistrict = (params) => defHttp.post({ url: RoleApi.district, params });
