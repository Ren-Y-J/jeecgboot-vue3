import { nextTick } from 'vue';



const CONF = {
  width: 1920, // 这里设置你的默认宽度
  height: 1080 // 这里设置你的默认高度
};

function transformScale(el, options) {
  const { target = "width", origin = "top left" } = options;

  nextTick(() => {
    // 获取显示区域高宽
    const width = window.innerWidth;
    const height = window.innerHeight;
    el.style.transformOrigin = origin;
    if (target === "ratio") {
      const scaleX = width / CONF.width;
      const scaleY = height / CONF.height;
      el.style.transform = `scaleX(${scaleX}) scaleY(${scaleY})`;
    } else {
      let scaleProportion = 1;
      if (target === "width") {
        scaleProportion = width / CONF.width;
      }
      if (target === "height") {
        scaleProportion = height / CONF.height;
      }
      el.style.transform = `scale(${scaleProportion})`;
    }
  });
}

export const Scale = {
  mounted(el, binding) {
    const options = binding.options || { passive: true };

    const callback = () => transformScale(el, binding.value);

    window.addEventListener("resize", callback);

    callback();

    el._onResize = {
      callback,
      options
    };
  },
  unmounted(el) {
    if (!el._onResize) {
      return;
    }

    const { callback } = el._onResize;
    window.removeEventListener("resize", callback);
    delete el._onResize;
  }
};

export default Scale;
