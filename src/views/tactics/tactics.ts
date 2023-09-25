import { defHttp } from '/@/utils/http/axios';
enum Tactics{
    list = '/policies/option/list',//列表数据
    dellist = '/policies/option/delete',//删除
    synclist = '/policies/option/sync',//同步策略组
    addlist = '/policies/option/add',//新增策略组
    dellistAll = '/policies/option/batch/delete',//批量删除
    editlist = '/policies/option/edit',//修改
    
}
export const list = (params) => defHttp.post({ url: Tactics.list, params });
export const dellist = (params) => defHttp.post({ url: Tactics.dellist, params });
export const synclist = (params) => defHttp.get({ url: Tactics.synclist, params });
export const addlist = (params) => defHttp.post({ url: Tactics.addlist, params });
export const dellistAll = (params) => defHttp.post({ url: Tactics.dellistAll, params });
export const editlist = (params) => defHttp.post({ url: Tactics.editlist, params });
// 回显
export const BackLine = (params) => defHttp.get({ url:'/policies/option/policy/'+ params });

