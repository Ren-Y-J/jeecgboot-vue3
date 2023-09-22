import { defHttp } from '/@/utils/http/axios';
enum Tactics{
    list = '/policy/option/list',//列表数据
    dellistAll = '/policy/option/batch/delete',//批量删除
    dellist = '/policy/option/delete',//删除
}
export const list = (params) => defHttp.post({ url: Tactics.list, params });
export const dellistAll = (params) => defHttp.post({ url: Tactics.dellistAll, params });
export const dellist = (params) => defHttp.post({ url: Tactics.dellist, params });