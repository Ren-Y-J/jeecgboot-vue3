// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum CordApi {
    list = '/record/manage/list', //所有集群列表
    addlist = '/record/manage/add',//新增
    dellist = '/record/manage/delete',//删除
    editlist = '/record/manage/update',//修改
    listAll = '/zone/manage/listAll',//域名
}
export const list = (params) => defHttp.post({ url: CordApi.list, params });
export const addlist = (params) => defHttp.post({ url: CordApi.addlist, params });
export const dellist = (params) => defHttp.post({ url: CordApi.dellist, params });
export const editlist = (params) => defHttp.post({ url: CordApi.editlist, params });
export const listAll = (params) => defHttp.post({ url: CordApi.listAll, params });