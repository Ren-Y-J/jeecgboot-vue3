// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/line/manage/list', //所有集群列表
  edit = '/line/manage/update', //修改
  add = '/line/manage/add', //新增
  del = '/line/manage/delete',
  aclIdAll = '/acl/manage/listAll',
  hostsAll = '/hosts/get/hostsAll',
  hostsAlls = '/host/group/get/hostsAll',
  infolineName = '/line/manage/getLineByHostId',
  infolineNames = '/line/manage/getLineByGroupId', //根据主机组ID查询线路
  sortlineName = '/line/manage/sort',
  switch = '/line/manage/switch',
}
export const list = (params) => defHttp.post({ url: RoleApi.list, params });
export const gethostsAll = (params) => defHttp.post({ url: RoleApi.hostsAll, params });
export const gethostsAlls = (params) => defHttp.post({ url: RoleApi.hostsAlls, params });
// ACL列表(不分页)
export const getaclIdAll = (params) => defHttp.post({ url: RoleApi.aclIdAll, params });
/**
 *
 */
export const addaclIdAll = (params) => defHttp.post({ url: RoleApi.add, params });
export const editline = (params) => defHttp.post({ url: RoleApi.edit, params });
// 回显
export const lineInfo = (params) => defHttp.get({ url: '/line/manage/' + params });
//删除
export const delline = (params) => defHttp.post({ url: RoleApi.del, params });
export const getinfolineName = (params) => defHttp.post({ url: RoleApi.infolineName, params });
export const getinfolineNames = (params) => defHttp.post({ url: RoleApi.infolineNames, params });
export const sortlineName = (params) => defHttp.post({ url: RoleApi.sortlineName, params });
export const upswitch = (params) => defHttp.post({ url: RoleApi.switch, params });
