// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum CordApi {
    list = '/record/manage/list', //所有集群列表
    addlist = '/record/manage/add',//新增
}
export const list = (params) => defHttp.post({ url: CordApi.list, params });
export const addlist = (params) => defHttp.post({ url: CordApi.addlist, params });