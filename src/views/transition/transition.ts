// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = ' ', //所有
  edit = ' ', //修改
  add = ' ', //新增
  del = ' ',//删除
}
// 主机
export const addlist = (params) => defHttp.post({ url: RoleApi.add, params });
