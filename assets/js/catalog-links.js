(() => {
  'use strict';
  const dialog = document.querySelector('dialog[data-product-dialog], #product-dialog');
  const share = dialog?.querySelector('[data-product-share]');
  if (!dialog || !share) return;
  const status = dialog.querySelector('[data-share-status]');
  const fallback = dialog.querySelector('[data-share-link]');
  const products = [...document.querySelectorAll('#catalog button[data-product]')];
  let activeId = null;
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-product]');
    if (!trigger || !products.some(item => item.dataset.product === trigger.dataset.product)) return;
    activeId = trigger.dataset.product;
    status.textContent = '';
    fallback.hidden = true;
  }, true);
  share.addEventListener('click', async () => {
    if (!activeId) return;
    const url = new URL(location.href);
    url.search = '';
    url.searchParams.set('product', activeId);
    url.hash = 'catalog';
    try {
      await navigator.clipboard.writeText(url.href);
      status.textContent = 'Ссылка на предмет скопирована.';
    } catch {
      fallback.value = url.href;
      fallback.hidden = false;
      fallback.focus();
      fallback.select();
      status.textContent = 'Скопируйте выделенную ссылку вручную.';
    }
  });
  dialog.addEventListener('close', () => {
    const url = new URL(location.href);
    if (url.searchParams.has('product')) {
      url.searchParams.delete('product');
      history.replaceState(history.state, '', url);
    }
  });
  const requested = new URL(location.href).searchParams.get('product');
  const product = products.find(item => item.dataset.product === requested);
  if (product) {
    const reset = document.querySelector('[data-filter="Все"]');
    const search = document.querySelector('[data-search]');
    if (search) { search.value = ''; search.dispatchEvent(new Event('input', {bubbles: true})); }
    reset?.click();
    product.scrollIntoView({block: 'center', behavior: 'instant'});
    product.click();
  }
})();
