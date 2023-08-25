import type { UserConfig, ConfigEnv } from 'vite';
import pkg from './package.json';
import dayjs from 'dayjs';
import { loadEnv } from 'vite';
import { resolve } from 'path';
import { generateModifyVars } from './build/generate/generateModifyVars';
import { createProxy } from './build/vite/proxy';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { OUTPUT_DIR } from './build/constant';
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'
// 压缩打包代码
import compression from 'vite-plugin-compression2';
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
 plugins: [
      PkgConfig(),
      OptimizationPersist()
    ]
  const env = loadEnv(mode, root);

  // loadEnv的布尔类型是一个字符串。这个函数可以转换为布尔类型
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv;

  const isBuild = command === 'build';

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      // 监听所有本地IPs
      host: true,
      https: false,
      port: VITE_PORT,
      // 来自.env的负载代理配置
      proxy: createProxy(VITE_PROXY),
    },
    build: {
      minify: 'esbuild',
      target: 'es2015',
      cssTarget: 'chrome80',
      outDir: OUTPUT_DIR,
			
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 用于在生产环境中删除控制台
          drop_console: VITE_DROP_CONSOLE,
          drop_debugger: true,
        },
      },
      // 关闭brotliSize显示可以稍微减少包装时间
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
	  // 优化:代码分割
	   rollupOptions: {
	          output: {
	            manualChunks(id) {
	              if (id.includes('components')) { 
	                return 'components';
	              }
	            },
	          },
	        },
    },
    define: {
      // setting vue-i18-next
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      },
    },

    // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
 plugins: [
	  createVitePlugins(viteEnv, isBuild),
      // ...其他插件
      // compression({
      //   algorithm: 'gzip',
      //   exclude: [/\.(br)$ /, /\.(gz)$/],
      // }),
      // compression({
      //   algorithm: 'brotliCompress',
      //   exclude: [/\.(br)$ /, /\.(gz)$/],
      // }),
    ],
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
      },
      // @iconify/iconify: The dependency is dynamically and virtually loaded by @purge-icons/generated, so it needs to be specified explicitly
      include: [
        '@vue/runtime-core',
        '@vue/shared',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
      ],
    },
  };
};

