(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 767px)');
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const content = JSON.parse($('#site-content').textContent);
  root.classList.add('js');

  // Native details is the source of truth; a new click reverses the live panel.
  $$('.disclosure, .fallback-details').forEach(details => {
    const summary = $('summary', details);
    const panel = $('.disclosure-content', details);
    let desired = details.open;
    let animation = null;
    summary.addEventListener('click', event => {
      event.preventDefault();
      const from = details.open ? panel.getBoundingClientRect().height : 0;
      const fromOpacity = details.open ? parseFloat(getComputedStyle(panel).opacity) : 0;
      desired = !desired;
      if (animation) animation.cancel();
      if (reduced.matches) { details.open = desired; animation = null; return; }
      details.open = true;
      const to = desired ? panel.scrollHeight : 0;
      animation = panel.animate([{height: `${from}px`, opacity: fromOpacity}, {height: `${to}px`, opacity: desired ? 1 : 0}], {duration:270,easing:'cubic-bezier(.22,.61,.36,1)',fill:'both'});
      const current = animation;
      current.onfinish = () => {
        if (animation !== current) return;
        details.open = desired;
        current.cancel();
        animation = null;
      };
    });
  });

  const menuButton = $('[data-menu-toggle]');
  const nav = $('#site-nav');
  let menuOpen = false;
  let menuAnimation = null;
  const setMenu = (open, restore = false) => {
    const from = nav.getBoundingClientRect().height;
    menuOpen = open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.innerHTML = open ? 'Закрыть <span aria-hidden="true">×</span>' : 'Меню <span aria-hidden="true">+</span>';
    if (menuAnimation) menuAnimation.cancel();
    nav.inert = narrow.matches && !open;
    if (!narrow.matches) {
      nav.classList.remove('is-open'); nav.style.height = ''; nav.removeAttribute('aria-hidden'); return;
    }
    nav.setAttribute('aria-hidden', String(!open));
    nav.classList.add('is-open');
    const to = open ? nav.scrollHeight : 0;
    if (reduced.matches) {
      nav.style.height = open ? 'auto' : '0px'; nav.classList.toggle('is-open',open);
    } else {
      menuAnimation = nav.animate([{height:`${from}px`,opacity:open ? 0.4 : 1},{height:`${to}px`,opacity:open ? 1 : 0}],{duration:270,easing:'cubic-bezier(.22,.61,.36,1)',fill:'both'});
      const current = menuAnimation;
      current.onfinish = () => {
        if (menuAnimation !== current) return;
        nav.style.height = menuOpen ? 'auto' : '0px';
        nav.classList.toggle('is-open', menuOpen);
        current.cancel(); menuAnimation = null;
      };
    }
    if (restore) menuButton.focus({preventScroll:true});
  };
  menuButton.addEventListener('click', () => setMenu(!menuOpen));
  $$('a',nav).forEach(link => link.addEventListener('click', () => { if(narrow.matches) setMenu(false); }));
  document.addEventListener('keydown', event => {
    if(event.key === 'Escape' && menuOpen) setMenu(false,true);
  });
  narrow.addEventListener('change', () => setMenu(false));
  if(narrow.matches){nav.inert=true;nav.setAttribute('aria-hidden','true');}

  // Finite, server-rendered collection with immediate enhancement.
  const cards = $$('[data-product-card]');
  const search = $('[data-search]');
  const clear = $('[data-search-clear]');
  const filters = $$('[data-filter]');
  const params = new URLSearchParams(location.search);
  let category = filters.some(b => b.dataset.filter === params.get('category')) ? params.get('category') : 'Все';
  search.value = params.get('q') || '';
  const filterProducts = (updateURL = true) => {
    const query = search.value.trim().toLocaleLowerCase('ru');
    let count = 0;
    cards.forEach((card,index) => {
      const record = content.catalog[index];
      const haystack = `${record.title} ${record.category} ${record.description} ${record.specification}`.toLocaleLowerCase('ru');
      const visible = (category === 'Все' || record.category === category) && (!query || haystack.includes(query));
      card.hidden = !visible;
      if(visible) count++;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    $('[data-empty]').hidden = count !== 0;
    clear.hidden = !search.value;
    $('[data-results-count]').textContent = `Показано ${count} из ${cards.length}`;
    if(updateURL){
      const url = new URL(location.href);
      category === 'Все' ? url.searchParams.delete('category') : url.searchParams.set('category',category);
      query ? url.searchParams.set('q',search.value.trim()) : url.searchParams.delete('q');
      history.replaceState(null,'',url);
    }
  };
  filters.forEach(button => button.addEventListener('click',() => {category=button.dataset.filter;filterProducts();}));
  search.addEventListener('input',event => {if(!event.isComposing)filterProducts();});
  search.addEventListener('compositionend',() => filterProducts());
  clear.addEventListener('click',()=>{search.value='';filterProducts();search.focus();});
  $('[data-reset]').addEventListener('click',()=>{category='Все';search.value='';filterProducts();search.focus();});
  $$('[data-category-link]').forEach(link=>link.addEventListener('click',()=>{category=link.dataset.categoryLink;search.value='';filterProducts();}));
  filterProducts(false);

  // Dialog keeps original photos, verified descriptions, and native focus behavior.
  const productDialog = $('[data-product-dialog]');
  const galleryDialog = $('[data-gallery-dialog]');
  const dialogTriggers = new WeakMap();
  const openDialog = (dialog,trigger) => {
    dialogTriggers.set(dialog,trigger);
    dialog.showModal();
    dialog.scrollTop=0;
    $('[data-dialog-close]',dialog).focus({preventScroll:true});
  };
  [productDialog,galleryDialog].forEach(dialog=>{
    $('[data-dialog-close]',dialog).addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{
      if(event.target !== dialog)return;
      const r=dialog.getBoundingClientRect();
      if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)dialog.close();
    });
    dialog.addEventListener('close',()=>{
      const trigger=dialogTriggers.get(dialog);
      if(trigger && trigger.isConnected)trigger.focus({preventScroll:true});
    });
  });
  let activeProduct = null;
  $$('[data-product]').forEach(button=>button.addEventListener('click',()=>{
    activeProduct=content.catalog.find(p=>p.id===button.dataset.product);
    if(!activeProduct)return;
    $('[data-dialog-image]').src=activeProduct.image;
    $('[data-dialog-image]').alt=activeProduct.title;
    $('[data-dialog-image]').width=activeProduct.width;
    $('[data-dialog-image]').height=activeProduct.height;
    $('[data-dialog-category]').textContent=activeProduct.category;
    $('#product-dialog-title').textContent=activeProduct.title;
    $('[data-dialog-description]').textContent=activeProduct.description;
    $('[data-dialog-spec]').textContent=activeProduct.specification;
    openDialog(productDialog,button);
  }));
  $('[data-dialog-request]').addEventListener('click',event=>{
    event.preventDefault();
    $('#request-object').value=activeProduct ? activeProduct.title : '';
    productDialog.close();
    requestAnimationFrame(()=>{
      $('#request').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
      $('#request-name').focus({preventScroll:true});
    });
  });
  let galleryIndex=0;
  let galleryIndices=[];
  const renderViewer=()=>{
    const item=content.gallery[galleryIndex];
    $('[data-viewer-image]').src=item.image;
    $('[data-viewer-image]').alt=item.title;
    $('[data-viewer-image]').width=item.width;
    $('[data-viewer-image]').height=item.height;
    $('#viewer-title').textContent=item.title;
    $('[data-viewer-description]').textContent=item.description;
    $('[data-viewer-group]').textContent=galleryIndex<5?'НАПОЛНЕНИЕ ИНТЕРЬЕРА':'ИНТЕРЬЕРНАЯ ИДЕЯ';
    $('[data-viewer-count]').textContent=`${galleryIndices.indexOf(galleryIndex)+1} / ${galleryIndices.length}`;
  };
  const advanceViewer=delta=>{
    const position=galleryIndices.indexOf(galleryIndex);
    galleryIndex=galleryIndices[(position+delta+galleryIndices.length)%galleryIndices.length];
    renderViewer();
  };
  $$('[data-gallery]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();
    galleryIndex=Number(link.dataset.gallery);
    galleryIndices=link.dataset.galleryGroup==='cases'?[0,1,2,3,4]:[5,6];
    renderViewer();openDialog(galleryDialog,link);
  }));
  $('[data-viewer-prev]').addEventListener('click',()=>advanceViewer(-1));
  $('[data-viewer-next]').addEventListener('click',()=>advanceViewer(1));
  galleryDialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();advanceViewer(-1);}
    if(event.key==='ArrowRight'){event.preventDefault();advanceViewer(1);}
  });

  // Request preparation is local; export always uses the latest edited textarea.
  const form=$('[data-request-form]');
  const prepared=$('[data-prepared]');
  const preparedText=$('[data-prepared-text]');
  const status=$('[data-request-status]');
  const setError=(id,message)=>{
    const input=$(`#request-${id}`);
    input.setAttribute('aria-invalid',String(Boolean(message)));
    $(`#error-${id}`).textContent=message;
    return !message;
  };
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const name=form.elements.name.value.trim();
    const contact=form.elements.contact.value.trim();
    const nameValid=setError('name',name?'':'Укажите ваше имя.');
    const contactValid=setError('contact',contact.length>=3?'':'Укажите телефон или контакт в Instagram.');
    if(!nameValid || !contactValid){$('[aria-invalid="true"]',form).focus();return;}
    const object=form.elements.object.value.trim();
    const message=form.elements.message.value.trim();
    preparedText.value=[`Здравствуйте, Art Time!`,`Меня зовут ${name}.`,`Контакт: ${contact}.`,object?`Интересует: ${object}.`:'Хочу обсудить подбор предметов для интерьера.',message?`О пространстве и пожеланиях: ${message}`:'Прошу уточнить детали и условия подбора.','Буду рад(а) обсудить стоимость и наличие.'].join('\n\n');
    prepared.hidden=false;
    status.textContent='Текст готов. Отредактируйте и скопируйте его или сохраните в TXT. Отправьте обращение Art Time в Instagram.';
    preparedText.focus({preventScroll:true});
    prepared.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'nearest'});
  });
  ['name','contact'].forEach(id=>$(`#request-${id}`).addEventListener('input',()=>setError(id,'')));
  $('[data-copy]').addEventListener('click',async()=>{
    try{
      if(!navigator.clipboard)throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(preparedText.value);
      status.textContent='Текст скопирован. Передайте его Art Time в Instagram.';
    }catch{
      preparedText.focus();preparedText.select();
      status.textContent='Автоматическое копирование недоступно. Текст выделен: скопируйте его вручную или сохраните TXT.';
    }
  });
  $('[data-download]').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob(['\ufeff',preparedText.value],{type:'text/plain;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='art-time-request.txt';
    document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    status.textContent='Файл TXT подготовлен для сохранения. Передайте запрос Art Time удобным способом.';
  });

  // Sticky frame: opaque left plane withdraws while one photo becomes full-frame.
  const scene=$('[data-scene]');
  const photo=$('.hero-photo');
  const cover=$('.hero-cover');
  const heroCopy=$('.hero-copy');
  const caption=$('.hero-caption');
  const progressBar=$('.scene-progress span');
  const motionButton=$('[data-motion-toggle]');
  let paused=false;
  let pending=false;
  let sceneTop=0;
  let sceneRange=1;
  let progress=0;
  const geometry=()=>{
    sceneTop=scene.getBoundingClientRect().top+scrollY;
    sceneRange=Math.max(1,scene.offsetHeight-$('.hero-frame').offsetHeight);
  };
  const renderScene=()=>{
    pending=false;
    if(reduced.matches || paused)return;
    progress=Math.min(1,Math.max(0,(scrollY-sceneTop)/sceneRange));
    scene.dataset.progress=progress.toFixed(3);
    heroCopy.inert=!narrow.matches && progress>.45;
    if(narrow.matches){
      photo.style.transform=`scale(${1+progress*.07})`;
      cover.style.transform='';heroCopy.style.transform='';heroCopy.style.opacity='';
    }else{
      photo.style.transform=`translateX(${18*(1-progress)}%) scale(${1.04-progress*.04})`;
      cover.style.transform=`scaleX(${1-progress})`;
      heroCopy.style.transform=`translateY(calc(-43% - ${progress*70}px))`;
      heroCopy.style.opacity=String(Math.max(0,1-progress*2.2));
    }
    caption.style.opacity=String(1-progress*.4);
    progressBar.style.transform=`scaleX(${progress})`;
  };
  const scheduleScene=()=>{if(!pending){pending=true;requestAnimationFrame(renderScene);}};
  const configureMotion=()=>{
    root.classList.toggle('motion-enabled',!reduced.matches);
    motionButton.disabled=reduced.matches;
    if(reduced.matches){
      photo.style.transform='';cover.style.transform='';heroCopy.style.transform='';heroCopy.style.opacity='';caption.style.opacity='';
      motionButton.textContent='Движение отключено';scene.dataset.progress='0';heroCopy.inert=false;
    }else{motionButton.textContent=paused?'Продолжить движение':'Остановить движение';}
    geometry();scheduleScene();
  };
  motionButton.addEventListener('click',()=>{
    paused=!paused;motionButton.setAttribute('aria-pressed',String(paused));
    motionButton.textContent=paused?'Продолжить движение':'Остановить движение';
    if(!paused){geometry();scheduleScene();}
  });
  addEventListener('scroll',scheduleScene,{passive:true});
  addEventListener('resize',()=>{geometry();scheduleScene();},{passive:true});
  reduced.addEventListener('change',configureMotion);
  narrow.addEventListener('change',()=>{geometry();scheduleScene();});
  if(document.fonts)document.fonts.ready.then(()=>{geometry();scheduleScene();});
  photo.addEventListener('load',()=>{geometry();scheduleScene();});
  configureMotion();
})();
