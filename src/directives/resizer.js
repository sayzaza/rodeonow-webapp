// wrapper for ResizeObserver
Vue.directive('resizer',
  {
    bind(el, binding)
    {
      if (window.ResizeObserver && typeof binding.value === 'function')
      {
        el.__resizeObserver__ = new window.ResizeObserver(entries =>
        {
          binding.value(entries[0].contentRect);
        });
        el.__resizeObserver__.observe(el);
      }
    },
    unbind(el)
    {
      if (el.__resizeObserver__) el.__resizeObserver__.disconnect();
    }
 }
);
