// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/hosts/list', //所有集群列表
  edit = '', //修改
  add = '', //新增
  del = '',
  query = '',
}
export const list = (params) => defHttp.post({ url: RoleApi.list, params });
