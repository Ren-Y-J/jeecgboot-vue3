import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  list = '/zone/manage/list', //所列表
  edit = '', //修改
  add = '', //新增
  del = '',//删
}
export const GetList = (params) => defHttp.post({ url: RoleApi.list, params });