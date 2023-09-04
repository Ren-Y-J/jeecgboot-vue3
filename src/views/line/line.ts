// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/line/manage/list', //所有集群列表
  // edit = '/cluster/manage/update', //修改
  add = '/line/manage/add', //新增
  del = '/line/manage/delete',
  aclIdAll = '/acl/manage/listAll',
  hostsAll = '/hosts/get/hostsAll',
}
export const list = (params) => defHttp.post({ url: RoleApi.list, params });
export const gethostsAll = (params) => defHttp.post({ url: RoleApi.hostsAll, params });
// ACL列表(不分页)
export const getaclIdAll = (params) => defHttp.post({ url: RoleApi.aclIdAll, params });
/**
 * 获取全部租户
 */
export const addaclIdAll = (params) => defHttp.post({ url: RoleApi.add, params });
// export const editclusterList = (params) => defHttp.post({ url: RoleApi.edit, params });
// 回显
// export const clusterInfo = (params) => defHttp.get({ url: '/cluster/manage/' + params });
//删除
export const delline = (params) => defHttp.post({ url: RoleApi.del, params });
// 根据集群ID查询主机zhe
// export const queryhost = (params) => defHttp.post({ url: RoleApi.query, params });
