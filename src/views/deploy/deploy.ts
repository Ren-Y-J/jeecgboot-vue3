import { defHttp } from '/@/utils/http/axios';
enum DeployApi {
	Edit = '/hosts/conf/update',
	trans = '/forwardServer/list/all',
	Acl = '/acl/manage/listAll',
}

// 修改主机 
export const EditList = (params) => defHttp.post({ url: DeployApi.Edit, params });
// 回显
export const ShowData = (params) => defHttp.get({ url: '/hosts/conf/' + params });
// 回显
export const ShowDataAll = (params) => defHttp.get({ url: '/hosts/' + params });
// 转发服务器
export const transList = (params) => defHttp.post({ url: DeployApi.trans, params });
// ACL
export const AclList = (params) => defHttp.post({ url: DeployApi.Acl, params });

export const GetDeployList = (params) => defHttp.post({ url:'/reverse/zone/rel/list', params });