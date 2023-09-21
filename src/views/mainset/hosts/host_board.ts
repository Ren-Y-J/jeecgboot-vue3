// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  cpu = '/hosts/stat/cpuUsed', //CPU
  stor='/hosts/stat/memUsed', //内存
  disk='/hosts/stat/diskUsed'//磁盘
}
// 获取CPU数据
export const getCpu = (params) => defHttp.post({ url: RoleApi.cpu, params });
// 获取内存
export const getStor = (params) => defHttp.post({ url: RoleApi.stor, params });
// 获取磁盘
export const getDisk = (params) => defHttp.post({ url: RoleApi.disk, params });