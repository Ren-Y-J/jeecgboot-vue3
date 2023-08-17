import { watch, unref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useTitle as usePageTitle } from '@vueuse/core';
import { useGlobSetting } from '/@/hooks/setting';
import { useRouter } from 'vue-router';
import { useLocaleStore } from '/@/store/modules/locale';

import { REDIRECT_NAME } from '/@/router/constant';

/**
 * 监听页面更改和动态更改网站标题
 */
export function useTitle() {
  const { title } = useGlobSetting();
  const { t } = useI18n();
  const { currentRoute } = useRouter();
  const localeStore = useLocaleStore();

  const pageTitle = usePageTitle();

  watch(
    [() => currentRoute.value.path, () => localeStore.getLocale],
    () => {
      const route = unref(currentRoute);

      if (route.name === REDIRECT_NAME) {
        return;
      }

      // const tTitle = t(route?.meta?.title as string);
	  const tTitle ='点亮网络DNS系统';
      // pageTitle.value = tTitle ? ` ${tTitle} - ${title} ` : `${title}`;'
	  pageTitle.value = tTitle
    },
    { immediate: true }
  );
}
