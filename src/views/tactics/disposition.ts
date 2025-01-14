import { defHttp } from '/@/utils/http/axios';
enum Tactics{
    list = '/policy/option/list',//列表数据
    dellistAll = '/policy/option/batch/delete',//批量删除
    dellist = '/policy/option/delete',//删除
    editlist = '/policy/option/update',//获取所有线路
}
export const list = (params) => defHttp.post({ url: Tactics.list, params });
export const dellistAll = (params) => defHttp.post({ url: Tactics.dellistAll, params });
export const dellist = (params) => defHttp.post({ url: Tactics.dellist, params });
export const editlist = (params) => defHttp.post({ url: Tactics.editlist, params });