// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/line/manage/list', //所有集群列表
  edit = '/line/manage/update', //修改
  add = '/line/manage/add', //新增
  del = '/line/manage/delete',
  aclIdAll = '/acl/manage/listAll',
  hostsAll = '/hosts/get/hostsAll',
  infolineName = '/line/manage/getLineByHostId',
  sortlineName = '/line/manage/sort',
}
export const list = (params) => defHttp.post({ url: RoleApi.list, params });
export const gethostsAll = (params) => defHttp.post({ url: RoleApi.hostsAll, params });
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
export const sortlineName = (params) => defHttp.post({ url: RoleApi.sortlineName, params });
