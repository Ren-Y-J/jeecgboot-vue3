import { defHttp } from '/@/utils/http/axios';
enum Addpolicy{
    hostsAll = '/host/group/get/hostsAll',//获取主机组数据
    getaclIdAll = '/acl/manage/listAll',// 获取ACL数据
    listAll = '/domain/lib/listAll',//获取域名库数据
    serverAll = '/forwardServer/list/all',//获取所有服务器
}
export const hostsAll = (params) => defHttp.post({ url: Addpolicy.hostsAll, params });
export const getaclIdAll = (params) => defHttp.post({ url: Addpolicy.getaclIdAll, params });
export const serverAll = (params) => defHttp.post({ url: Addpolicy.serverAll, params });
export const listAll = (params) => defHttp.get({ url: Addpolicy.listAll, params });