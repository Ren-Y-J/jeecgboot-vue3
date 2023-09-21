// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
	list = '/hosts/list', //所有主机
	edit = '/hosts/update', //修改
	add = '/hosts/add', //新增
	del = '/hosts/delete', //删除主机
	query = '',
	show = '/hosts/{hostId}',
	group = '/cluster/manage/getAllCluster',
	host_group = '/host/group/get/hostsAll',
}
// 新增主机
export const addlist = (params) => defHttp.post({ url: RoleApi.add, params });
// 获取主机数据
export const getlist = (params) => defHttp.post({ url: RoleApi.list, params });
// 删除主机数据
export const dellist = (params) => defHttp.post({ url: RoleApi.del, params });
// 回显
export const showlist = (params) => defHttp.get({ url: '/hosts/' + params });
// 修改主机
export const editlist = (params) => defHttp.post({ url: RoleApi.edit, params });
// 获取所有集群信息
export const grouplist = (params) => defHttp.post({ url: RoleApi.group, params });
// 主机组
export const HostsGroup = (params) => defHttp.post({ url: RoleApi.host_group, params });
