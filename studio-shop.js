// Les créations du studio suivent la même économie en pièces que la boutique.
const studioCatalog=[];
for(const [key,,choices] of styleGroups){
 if(!['color','eyes','outfit','accessory'].includes(key))continue;
 choices.forEach(([value,label],i)=>{if(value===bipDefaults[key])return;studioCatalog.push({id:key+':'+value,key,value,label,price:key==='accessory'?3000+i*500:key==='outfit'?4000+i*1000:key==='color'?1800:1500});});
}
for(const k of Object.keys(REALMS))REALMS[k].slice(1).forEach((p,i)=>studioCatalog.push({id:'realm:'+k+':'+p[0],key:'realm',scope:k,value:p[0],label:realmLabel(k)+' · '+p[1],price:5000+i*1500}));
const studioOwned=()=>Array.isArray(wallet.studioOwned)?wallet.studioOwned:[];
function ownsStudioStyle(key,value){return value===bipDefaults[key]||!['color','eyes','outfit','accessory'].includes(key)||studioOwned().includes(key+':'+value);}
function validateStudioStyle(){for(const key of ['color','eyes','outfit','accessory'])if(!ownsStudioStyle(key,bipStyle[key]))bipStyle[key]=bipDefaults[key];}
function ownsRealm(k,id){return id===REALMS[k][0][0]||id==='collection'||studioOwned().includes('realm:'+k+':'+id);}
function openStudioShop(item){
 navigationCurrent.studio=true;
 if(realmDialog.open)realmDialog.close();if(customDialog.open)customDialog.close();
 shopTab='skins';go('shop');studioCategory=item?.key||'accessory';renderStudioShop();
 $('studioShop').scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});
}
function renderStudioLocks(){
 for(const b of $('styleOptions').querySelectorAll('button[data-key]')){
  const item=studioCatalog.find(x=>x.key===b.dataset.key&&x.value===b.dataset.value);const owned=ownsStudioStyle(b.dataset.key,b.dataset.value);
  b.classList.toggle('locked-style',!owned);b.setAttribute('aria-label',item?item.label+(owned?' · Possédé':' · Verrouillé, '+item.price+' pièces · Voir en boutique'):b.textContent);
  let lock=b.querySelector('.style-lock');if(!owned&&!lock){lock=document.createElement('small');lock.className='style-lock';lock.textContent='🔒';b.append(lock);}else if(owned&&lock)lock.remove();
 }
}
$('styleOptions').addEventListener('click',e=>{const b=e.target.closest('button[data-key]');if(!b||ownsStudioStyle(b.dataset.key,b.dataset.value))return;e.stopImmediatePropagation();e.preventDefault();openStudioShop(studioCatalog.find(x=>x.key===b.dataset.key&&x.value===b.dataset.value));},true);
$('realmChoices').addEventListener('click',e=>{const b=e.target.closest('.realm-swatch');if(!b)return;const i=[...$('realmChoices').children].indexOf(b),p=REALMS[pickerRealm][i];if(!p||ownsRealm(pickerRealm,p[0]))return;e.stopImmediatePropagation();e.preventDefault();openStudioShop(studioCatalog.find(x=>x.scope===pickerRealm&&x.value===p[0]));},true);
const studioShop=document.createElement('section');studioShop.id='studioShop';studioShop.innerHTML='<h2>Le dressing de Bip</h2><p>Gagne des pièces dans les défis, puis débloque tes créations. Les objets achetés restent dans ta collection.</p><div id="studioShopTabs"></div><div id="studioShopItems"></div><p id="studioShopStatus" role="status"></p>';
document.querySelector('#scr-shop [data-tab=skins]').prepend(studioShop);let studioCategory='accessory';
function renderStudioShop(){
 const categories={accessory:'Accessoires',outfit:'Vêtements',color:'Couleurs',eyes:'Yeux',realm:'Ambiances'};
 $('studioShopTabs').replaceChildren();for(const [key,label] of Object.entries(categories)){const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=label;b.setAttribute('aria-pressed',String(key===studioCategory));b.onclick=()=>{studioCategory=key;renderStudioShop();};$('studioShopTabs').append(b);}
 $('studioShopItems').replaceChildren();for(const item of studioCatalog.filter(x=>x.key===studioCategory)){
  const row=document.createElement('div');row.className='studio-shop-item';const name=document.createElement('b');name.textContent=item.label;const b=document.createElement('button');b.type='button';b.className='chip';const owned=studioOwned().includes(item.id);b.textContent=owned?'Possédé ✓':item.price.toLocaleString('fr')+' ◎';b.disabled=owned||wallet.coins<item.price;b.setAttribute('aria-label',owned?item.label+' possédé':'Acheter '+item.label+' pour '+item.price+' pièces');
  b.onclick=()=>{if(!purchaseStudioItem(item.id))return;$('studioShopStatus').textContent=item.label+' débloqué ! Disponible dans la personnalisation.';renderStudioShop();Snd.buy();};
  const note=document.createElement('small');note.textContent=owned?'Dans ta collection':wallet.coins<item.price?'Encore '+(item.price-wallet.coins).toLocaleString('fr')+' pièces':'Débloquer définitivement';const text=document.createElement('div');text.append(name,note);row.append(text,b);$('studioShopItems').append(row);
 }
}
// Les apparences essayées gratuitement dans l’ancienne version ne sont pas des achats.
validateStudioStyle();store.set('kalku:bip-style',bipStyle);
for(const k of Object.keys(REALMS))if(!ownsRealm(k,realmSettings[k].palette))realmSettings[k].palette=REALMS[k][0][0];
store.set('kalku:realms',realmSettings);applySkin();applyRealm();
const studioExplanation=document.createElement('p');studioExplanation.className='studio-note';studioExplanation.textContent='Tes objets possédés sont utilisables. 🔒 Les autres se débloquent avec les pièces gagnées, dans la boutique.';$('styleOptions').before(studioExplanation);

function purchaseStudioItem(id){const item=studioCatalog.find(x=>x.id===id);if(!item||studioOwned().includes(id)||wallet.coins<item.price)return false;wallet.coins-=item.price;wallet.studioOwned=[...studioOwned(),id];saveWallet();return true;}
