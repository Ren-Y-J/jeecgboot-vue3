// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/cluster/manage/list', //所有集群列表
  edit = '/cluster/manage/update', //修改
  add = '/cluster/manage/add', //新增
  del = '/cluster/manage/delete',
  query = '/hosts/get/clusterId'
}
export const list = (params) => defHttp.post({ url: RoleApi.list, params });
/**
 * 获取全部租户 
 */
export const addclusterList = (params) => defHttp.post({ url: RoleApi.add, params });
export const editclusterList = (params) => defHttp.post({ url: RoleApi.edit, params });
// 回显
export const clusterInfo = (params) => defHttp.get({ url: '/cluster/manage/' + params });
//删除
export const delclusterList = (params) => defHttp.post({ url: RoleApi.del, params });
// 根据集群ID查询主机zhe
export const queryhost = (params) => defHttp.post({ url: RoleApi.query, params });