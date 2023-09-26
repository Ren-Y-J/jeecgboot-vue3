import { defHttp } from '/@/utils/http/axios';
enum installApi {
  list = '/host/group/install', //所列表
  status='/host/group/install/status',
  task =  '/host/group/install/task'
}

// 获取安装DNS
export const GetList = (params) => defHttp.post({ url: installApi.list, params });
// 安装状态
export const GetStatus= (params) => defHttp.post({ url: installApi.status, params });
// 防止安装刷新界面
export const GetTask= (params) => defHttp.post({ url: installApi.task, params });
