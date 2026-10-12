(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 767px)');
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const content = JSON.parse($('#site-content').textContent);
  root.classList.add('js');
  let paused = false;
  const motionEntries = new Map();
  const motionAllowed = () => !reduced.matches && !paused;
  const cancelMotion = owner => {
    const entry = motionEntries.get(owner);
    if (!entry) return;
    motionEntries.delete(owner); entry.animation.cancel(); entry.cleanup();
  };
  const animate = (owner, frames, duration, cleanup = () => {}, finish = () => {}) => {
    cancelMotion(owner);
    if (!motionAllowed()) { cleanup(); finish(); return; }
    const animation = owner.animate(frames, {duration, easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    const entry = {animation,cleanup,finish}; motionEntries.set(owner,entry);
    animation.onfinish = () => {
      if (motionEntries.get(owner) !== entry) return;
      motionEntries.delete(owner); animation.cancel(); cleanup(); finish();
    };
  };
  const settleMotion = () => {
    [...motionEntries].forEach(([owner,entry]) => { cancelMotion(owner); entry.finish(); });
  };


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
  const filterMotion = window.ArtTimeFilterMotion.create(cards, {isPaused: () => paused});
  const filterProducts = (updateURL = true) => {
    const filterSnapshot = updateURL ? filterMotion.capture() : null;
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
    const resultCount = $('[data-results-count]');
    resultCount.textContent = `Показано ${count} из ${cards.length}`;
    if(updateURL) animate(resultCount,[{opacity:.55},{opacity:1}],140);
    if(updateURL){
      const url = new URL(location.href);
      category === 'Все' ? url.searchParams.delete('category') : url.searchParams.set('category',category);
      query ? url.searchParams.set('q',search.value.trim()) : url.searchParams.delete('q');
      history.replaceState(null,'',url);
    }
    filterMotion.play(filterSnapshot);
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
  const closeVersions = new WeakMap();
  const clearDialogMotion = dialog => {
    [...motionEntries.keys()].forEach(owner => {if(owner === dialog || dialog.contains(owner)) cancelMotion(owner);});
    $$('.photo-transfer',dialog).forEach(layer => layer.remove());
  };
  const photoArrival = (dialog,source) => {
    const stage = $('.photo-stage',dialog);
    animate(stage,[{clipPath:'inset(0 3% 0 3%)'},{clipPath:'inset(0 0 0 0)'}],narrow.matches?280:360);
    if(!motionAllowed() || !source || !source.complete) return;
    const from=source.getBoundingClientRect(), to=stage.getBoundingClientRect();
    if(!from.width || !to.width || from.bottom<0 || from.top>innerHeight)return;
    const layer=source.cloneNode(false);
    layer.removeAttribute('srcset');layer.removeAttribute('sizes');layer.src=source.currentSrc || source.src;
    layer.removeAttribute('id');layer.removeAttribute('loading');layer.alt='';layer.className='photo-transfer';layer.setAttribute('aria-hidden','true');
    stage.append(layer);
    const x=from.left-to.left,y=from.top-to.top;
    animate(layer,[{transform:`translate(${x}px,${y}px) scale(${from.width/to.width},${from.height/to.height})`,opacity:.95},{transform:'translate(0,0) scale(1)',opacity:0}],narrow.matches?280:360,()=>layer.remove());
  };
  const openDialog = (dialog,trigger) => {
    closeVersions.set(dialog,(closeVersions.get(dialog)||0)+1);
    clearDialogMotion(dialog);
    dialogTriggers.set(dialog,trigger);
    if(!dialog.open)dialog.showModal();
    dialog.scrollTop=0;
    $('[data-dialog-close]',dialog).focus({preventScroll:true});
    const source=trigger?.closest('[data-product-card]')?.querySelector('img') || trigger?.querySelector('img');
    photoArrival(dialog,source);
  };
  const closeDialog = dialog => {
    if(!dialog.open)return;
    clearDialogMotion(dialog);
    const version=(closeVersions.get(dialog)||0)+1;closeVersions.set(dialog,version);
    animate(dialog,[{opacity:1},{opacity:.2}],160,()=>{},()=>{
      if(closeVersions.get(dialog)===version && dialog.open)dialog.close();
    });
  };
  [productDialog,galleryDialog].forEach(dialog=>{
    $('[data-dialog-close]',dialog).addEventListener('click',()=>closeDialog(dialog));
    dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog(dialog);});
    dialog.addEventListener('click',event=>{
      if(event.target !== dialog)return;
      const r=dialog.getBoundingClientRect();
      if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom)closeDialog(dialog);
    });
    dialog.addEventListener('close',()=>{
      closeVersions.set(dialog,(closeVersions.get(dialog)||0)+1);clearDialogMotion(dialog);
      const trigger=dialogTriggers.get(dialog);
      if(trigger && trigger.isConnected)trigger.focus({preventScroll:true});
    });
  });
  // One existing semantic action spans photo and title; no duplicate Tab stop.
  cards.forEach(card=>{
    const button=$('[data-product]',card), image=$('.product-image',card);
    card.append(button);
    const sizeAction=()=>{button.style.height=`${$('h3',card).offsetTop+$('h3',card).offsetHeight}px`;};
    new ResizeObserver(sizeAction).observe(card);sizeAction();
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
    $('#request-object').dispatchEvent(new Event('input',{bubbles:true}));
    productDialog.close();
    requestAnimationFrame(()=>{
      $('#request').scrollIntoView({behavior:motionAllowed()?'smooth':'instant',block:'start'});
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
    clearDialogMotion(galleryDialog);
    closeVersions.set(galleryDialog,(closeVersions.get(galleryDialog)||0)+1);
    const stage=$('.photo-stage',galleryDialog), old=$('[data-viewer-image]');
    if(motionAllowed() && old.complete && old.naturalWidth){
      const layer=old.cloneNode(false);layer.removeAttribute('data-viewer-image');layer.className='photo-transfer';layer.alt='';layer.setAttribute('aria-hidden','true');stage.append(layer);
      animate(layer,[{transform:'translateX(0)',opacity:1},{transform:`translateX(${-delta*24}px)`,opacity:0}],180,()=>layer.remove());
    }
    animate(stage,[{clipPath:`inset(0 ${delta<0?8:0}% 0 ${delta>0?8:0}%)`},{clipPath:'inset(0 0 0 0)'}],260);
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

  // Request preparation is local; source changes explicitly invalidate exports.
  const form=$('[data-request-form]');
  const prepared=$('[data-prepared]');
  const preparedText=$('[data-prepared-text]');
  const status=$('[data-request-status]');
  const copyButton=$('[data-copy]'), downloadButton=$('[data-download]'), regenerate=$('[data-regenerate]');
  let draftVersion=0, copyVersion=0, sourceSnapshot='', stale=false;
  const currentSource=()=>JSON.stringify(['name','contact','object','message'].map(key=>form.elements[key].value));
  const refreshExports=()=>{const unavailable=stale || !preparedText.value.trim();copyButton.disabled=unavailable;downloadButton.disabled=unavailable;regenerate.hidden=!stale;prepared.dataset.stale=String(stale);};
  const invalidateDraft=()=>{
    if(prepared.hidden)return;
    draftVersion++;copyVersion++;stale=stale || currentSource()!==sourceSnapshot;refreshExports();
    status.textContent=stale?'Поля изменились. Ваши правки сохранены. Обновите текст из полей перед копированием или сохранением TXT.':'Поля соответствуют подготовленному тексту. Ваши правки сохранены.';
  };
  form.addEventListener('input',invalidateDraft);
  preparedText.addEventListener('input',()=>{draftVersion++;copyVersion++;refreshExports();if(!stale)status.textContent=preparedText.value.trim()?'Ваши правки сохранены в этой вкладке. Можно копировать или сохранить TXT.':'Введите текст запроса для копирования или сохранения TXT.';});
  regenerate.addEventListener('click',()=>form.requestSubmit());
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
    draftVersion++;copyVersion++;sourceSnapshot=currentSource();stale=false;
    prepared.hidden=false;refreshExports();
    animate(prepared,[{opacity:.75},{opacity:1}],180);
    status.textContent='Текст готов. Отредактируйте и скопируйте его или сохраните в TXT. Отправьте обращение Art Time в Instagram.';
    preparedText.focus({preventScroll:true});
    prepared.scrollIntoView({behavior:motionAllowed()?'smooth':'instant',block:'nearest'});
  });
  ['name','contact'].forEach(id=>$(`#request-${id}`).addEventListener('input',()=>setError(id,'')));
  copyButton.addEventListener('click',async()=>{
    if(stale || !preparedText.value.trim())return;
    const version=draftVersion, attempt=++copyVersion, text=preparedText.value;
    const current=()=>version===draftVersion && attempt===copyVersion && text===preparedText.value && !stale;
    status.textContent='Копируем текущий текст…';
    try{
      if(!navigator.clipboard)throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      if(current())status.textContent='Текст скопирован. Передайте его Art Time в Instagram.';
    }catch{
      if(!current())return;
      preparedText.focus();preparedText.select();
      status.textContent='Автоматическое копирование недоступно. Текст выделен: скопируйте его вручную или сохраните TXT.';
    }
  });
  $('[data-download]').addEventListener('click',()=>{
    if(stale || !preparedText.value.trim())return;
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
    if(reduced.matches || paused || root.classList.contains('text-roomy'))return;
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
    root.classList.toggle('motion-enabled',!reduced.matches && !root.classList.contains('text-roomy'));
    if(reduced.matches)settleMotion();
    motionButton.disabled=reduced.matches;
    if(reduced.matches || root.classList.contains('text-roomy')){
      photo.style.transform='';cover.style.transform='';heroCopy.style.transform='';heroCopy.style.opacity='';caption.style.opacity='';
      motionButton.textContent='Движение отключено';scene.dataset.progress='0';heroCopy.inert=false;
    }else{motionButton.textContent=paused?'Продолжить движение':'Остановить движение';}
    geometry();scheduleScene();
  };
  motionButton.addEventListener('click',()=>{
    paused=!paused;root.classList.toggle('motion-paused',paused);if(paused)settleMotion();motionButton.setAttribute('aria-pressed',String(paused));
    motionButton.textContent=paused?'Продолжить движение':'Остановить движение';
    if(!paused){geometry();scheduleScene();}
  });
  addEventListener('scroll',scheduleScene,{passive:true});
  addEventListener('resize',()=>{geometry();scheduleScene();},{passive:true});
  reduced.addEventListener('change',configureMotion);
  narrow.addEventListener('change',()=>{geometry();scheduleScene();});
  if(document.fonts)document.fonts.ready.then(()=>{geometry();scheduleScene();});
  photo.addEventListener('load',()=>{geometry();scheduleScene();});
  const checkTextRoom = () => {
    const frame=$('.hero-frame');
    const required=heroCopy.offsetHeight + (narrow.matches ? innerHeight*.48+100 : 180);
    const roomy=required>Math.max(innerHeight,760)+(narrow.matches?80:0) || (!narrow.matches && $('.site-header').scrollWidth>$('.site-header').clientWidth);
    if(root.classList.contains('text-roomy')!==roomy){root.classList.toggle('text-roomy',roomy);configureMotion();}
    geometry();scheduleScene();
  };
  new ResizeObserver(checkTextRoom).observe(heroCopy);
  configureMotion();
  // Material opens over the already presented photo; image and tasks are never hidden or delayed.
  let vitrineRequest = 0;
  const openVitrine=request=>requestAnimationFrame(()=>{
    if(request !== vitrineRequest || !motionAllowed() || scrollY>20)return;
    $$('.vitrine-leaf').forEach(leaf => {cancelMotion(leaf);leaf.remove();});
    const material=$('.hero-material'),duration=narrow.matches?850:1100;
    animate(material,[{clipPath:'inset(1.5% 1.5% 1.5% 1.5%)'},{clipPath:'inset(0 0 0 0)'}],duration);
    [-1,1].forEach(direction=>{
      const leaf=document.createElement('div');leaf.className=`vitrine-leaf vitrine-leaf--${direction<0?'left':'right'}`;leaf.setAttribute('aria-hidden','true');$('.hero-visual').append(leaf);
      animate(leaf,[{transform:'translateX(0)',opacity:1},{transform:`translateX(${direction*110}%)`,opacity:0}],duration,()=>leaf.remove());
    });
  });
  // Wait only for decorative paint readiness; the photo and task are never gated.
  const presentVitrine = () => {
    const request = ++vitrineRequest;
    const ready = photo.decode ? photo.decode().catch(() => {}) : Promise.resolve();
    ready.then(() => requestAnimationFrame(() => openVitrine(request)));
  };
  const replay = $('[data-vitrine-replay]');
  replay.hidden = false; replay.disabled = reduced.matches;
  reduced.addEventListener('change',()=>{replay.disabled = reduced.matches;});
  replay.addEventListener('click',()=>{if(reduced.matches)return;if(paused)motionButton.click();scrollTo({top:sceneTop,behavior:'instant'});geometry();scheduleScene();presentVitrine();});
  if(photo.complete && photo.naturalWidth)presentVitrine();
  else photo.addEventListener('load',presentVitrine,{once:true});
})();
