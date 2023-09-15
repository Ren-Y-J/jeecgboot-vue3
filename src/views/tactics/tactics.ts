import { defHttp } from '/@/utils/http/axios';
enum Tactics{
    list = '/policies/option/list',
    listAll = '/policies/option/policy/list'
}
export const list = (params) => defHttp.post({ url: Tactics.list, params });
export const listAll = (params) => defHttp.post({ url: Tactics.listAll, params });
