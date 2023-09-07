// 传一个对象
import { defHttp } from '/@/utils/http/axios';
enum RoleApi {
  cpu = '/hosts/stat/cpuUsed', //CPU
  stor='/hosts/stat/memUsed' //内存
}
// 获取CPU数据
export const getCpu = (params) => defHttp.post({ url: RoleApi.cpu, params });
// 获取内存
export const getStor = (params) => defHttp.post({ url: RoleApi.stor, params });