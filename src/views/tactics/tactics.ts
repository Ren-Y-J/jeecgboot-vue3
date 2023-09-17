import { defHttp } from '/@/utils/http/axios';
enum Tactics{
    list = '/policies/option/list',//列表数据
    listAll = '/policies/option/policy/list',//总记录数
    dellist = '/policies/option/delete',//删除
}
export const list = (params) => defHttp.post({ url: Tactics.list, params });
export const listAll = (params) => defHttp.post({ url: Tactics.listAll, params });
export const dellist = (params) => defHttp.post({ url: Tactics.dellist, params });
