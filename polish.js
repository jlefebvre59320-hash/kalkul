// Confort mobile, aperçu des objets et réglages sonores persistants.
function comfortLevel(key,fallback){const v=store.get('kalku:volume-'+key);return typeof v==='number'&&Number.isFinite(v)?Math.max(0,Math.min(1,v)):fallback;}
function itemArtwork(item){
 if(item.key==='realm'){
  const p=REALMS[item.scope].find(p=>p[0]===item.value),art=document.createElement('div');art.className='realm-mini';art.style.background=`radial-gradient(at 90% 0%,${p[7]},transparent),${p[2]}`;art.style.color=p[4];art.textContent=p[8];return art;
 }
 const style={...bipStyle,[item.key]:item.value};
 const svg=bipPreview(SKINS.find(s=>s.id===wallet.skin)||SKINS[0]);
 if(style.color!=='skin')svg.querySelectorAll('[id^=g1_],[id^=g2_]').forEach(n=>n.setAttribute('stop-color',style.color));
 svg.querySelectorAll('[id^=pupils] circle:not([data-eye-glint])').forEach(n=>n.setAttribute('fill',style.eyes));
 const layer=document.createElementNS('http://www.w3.org/2000/svg','g');layer.innerHTML=bipLayers(style);svg.append(layer);return svg;
}
const itemDialog=document.createElement('dialog');itemDialog.id='itemDialog';itemDialog.setAttribute('aria-labelledby','itemTitle');itemDialog.innerHTML='<header class="studio-head"><div><small>LE DRESSING DE BIP</small><h2 id="itemTitle"></h2></div><button type="button" id="closeItem" aria-label="Fermer l’aperçu">✕</button></header><div id="itemArt"></div><p id="itemDescription"></p><div class="item-budget"><span>Ton solde</span><b id="itemBalance"></b></div><p id="itemNote" role="status"></p><button type="button" class="btn primary" id="itemAction"></button><button type="button" class="btn" id="itemShop">Voir la boutique</button>';
document.body.append(itemDialog);let previewItem=null;
function openItemPreview(item){if(!item)return;previewItem=item;renderItemPreview();if(!itemDialog.open)itemDialog.showModal();}
function renderItemPreview(){
 const item=previewItem;if(!item)return;const owned=studioOwned().includes(item.id);$('itemTitle').textContent=item.label;$('itemArt').replaceChildren(itemArtwork(item));
 $('itemDescription').textContent=item.key==='realm'?'Une ambiance réservée à '+realmLabel(item.scope)+'. Les autres espaces gardent leurs couleurs.':'Essaie ce style sur Bip. L’aperçu ne change pas ta tenue actuelle.';
 $('itemBalance').textContent=wallet.coins.toLocaleString('fr')+' ◎';
 $('itemNote').textContent=owned?'Cet objet est dans ta collection.':wallet.coins<item.price?'Il te manque '+(item.price-wallet.coins).toLocaleString('fr')+' pièces. Continue les défis pour le débloquer.':'Achat unique avec les pièces gagnées en jouant.';
 $('itemAction').disabled=!owned&&wallet.coins<item.price;$('itemAction').textContent=owned?(item.key==='realm'?'Appliquer à '+realmLabel(item.scope):'Porter cet objet'):'Débloquer · '+item.price.toLocaleString('fr')+' ◎';
 $('itemAction').onclick=()=>{
  if(!studioOwned().includes(item.id)){
   if(!purchaseStudioItem(item.id))return;
   Snd.buy();buzz(18);renderStudioShop();renderItemPreview();$('itemNote').textContent='Débloqué ! Tu peux maintenant l’équiper.';
  }else{
   if(item.key==='realm'){realmSettings[item.scope].palette=item.value;store.set('kalku:realms',realmSettings);applyRealm();renderRealmPicker();}
   else{bipStyle[item.key]=item.value;saveBipStyle();}
   itemDialog.close();toast(item.key==='realm'?'Ambiance appliquée':'Bip a un nouveau style !');
  }
 };
}
$('closeItem').onclick=()=>itemDialog.close();$('itemShop').onclick=()=>{itemDialog.close();openStudioShop(previewItem);};
// Un studio organisé : identité, dressing, caractère et univers.
let studioSection='look';
const studioTabs=document.createElement('div');studioTabs.id='studioTabs';studioTabs.setAttribute('role','group');studioTabs.setAttribute('aria-label','Catégories de personnalisation');
for(const [id,label] of [['look','Apparence'],['identity','Identité'],['mood','Caractère'],['world','Univers']]){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.section=id;b.onclick=()=>{studioSection=id;renderStudioSections();};studioTabs.append(b);}
document.querySelector('.studio-preview').after(studioTabs);
function renderStudioSections(){
 studioTabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.section===studioSection)));
 document.querySelector('.studio-fields').hidden=studioSection!=='identity';
 document.querySelector('.studio-fields').nextElementSibling.hidden=studioSection!=='identity';
 document.querySelector('.reaction-bar').hidden=studioSection!=='mood';
 $('wardrobeMount').hidden=studioSection!=='world';
 $('styleOptions').querySelectorAll('fieldset').forEach(f=>{const key=f.querySelector('[data-key]')?.dataset.key;f.hidden=!(studioSection==='look'?['color','eyes','outfit','accessory'].includes(key):studioSection==='mood'?['personality','motion'].includes(key):false);});
 $('styleOptions').lastElementChild.hidden=studioSection!=='identity';
 $('studioExplanation').hidden=studioSection!=='look';
}
// Le choix d’univers a sa place dans l’onglet Univers.
const worldButton=[...document.querySelectorAll('.reaction-bar button')].find(b=>b.textContent.includes('trois univers'));
if(worldButton)$('wardrobeMount').prepend(worldButton);
studioExplanation.id='studioExplanation';
renderStudioSections();
const originalStudioOpen=$('customizeUniverse').onclick;$('customizeUniverse').onclick=()=>{originalStudioOpen();renderStudioSections();};
// Deux curseurs indépendants ; musique volontaire et arrêt en arrière-plan.
const audioPanel=document.createElement('section');audioPanel.className='grp comfort-panel';audioPanel.id='comfortPanel';audioPanel.innerHTML='<h3>À ton rythme</h3><p>Une ambiance douce, des effets légers. Tu gardes le contrôle.</p><div class="volume-row"><label for="musicVolume">Volume de la musique</label><output id="musicVolumeValue"></output><input id="musicVolume" type="range" min="0" max="100" step="5"></div><div class="volume-row"><label for="effectsVolume">Volume des effets</label><output id="effectsVolumeValue"></output><input id="effectsVolume" type="range" min="0" max="100" step="5"></div><label class="comfort-switch"><span>Vibrations discrètes<small>Selon les capacités de ton appareil</small></span><input id="hapticsToggle" type="checkbox"></label><button class="chip" id="previewSound" type="button">Écouter la signature du jeu</button>';
$('grpSound').closest('section').after(audioPanel);
for(const [key,fallback] of [['music',.45],['effects',.7]]){
 const input=$(key+'Volume'),output=$(key+'VolumeValue');input.value=Math.round(comfortLevel(key,fallback)*100);output.textContent=input.value+' %';
 input.oninput=()=>{const value=Number(input.value)/100;store.set('kalku:volume-'+key,value);output.textContent=input.value+' %';if(key==='music'&&Music.out&&Snd.ctx)Music.out.gain.setTargetAtTime(Music.on?.16*value:0,Snd.ctx.currentTime,.15);};
}
$('hapticsToggle').checked=store.get('kalku:haptics')!==false;$('hapticsToggle').onchange=e=>{store.set('kalku:haptics',e.target.checked);if(e.target.checked)buzz(12);};
$('previewSound').onclick=()=>{Snd.on=true;store.set('kalku:sound',true);playGameSignature(game);renderProfile();renderUX();};
// Règles courtes, consultables avant de lancer le chronomètre.
const helpDialog=document.createElement('dialog');helpDialog.id='helpDialog';helpDialog.setAttribute('aria-labelledby','helpTitle');helpDialog.innerHTML='<header class="studio-head"><h2 id="helpTitle"></h2><button type="button" id="closeHelp" aria-label="Fermer les règles">✕</button></header><ol id="helpSteps"></ol><p>Le défi du jour est commun à tous. Le Blitz dure cinq minutes.</p><button class="btn primary" id="finishHelp" type="button">J’ai compris</button>';document.body.append(helpDialog);
const helpButton=document.createElement('button');helpButton.type='button';helpButton.className='chip';helpButton.id='homeHelp';helpButton.textContent='? Comment jouer';
const homeActions=document.createElement('div');homeActions.className='home-actions';$('changeGame').replaceWith(homeActions);homeActions.append(changeGame,helpButton);
helpButton.onclick=()=>{const letters=game==='let';$('helpTitle').textContent=letters?'Un mot à la fois':'À toi de calculer';const lines=letters?['Touche les lettres pour composer un mot d’au moins trois lettres.','Valide ton mot avant la fin des 45 secondes. Plus il est long, plus il rapporte.','Efface ou mélange les lettres pour trouver une autre idée.']:['Choisis un nombre, une opération, puis un deuxième nombre.','Combine les résultats pour atteindre la cible. Chaque tuile ne sert qu’une fois.','Tu peux annuler une étape. Bip peut donner un indice avec la pénalité indiquée.'];$('helpSteps').replaceChildren(...lines.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));helpDialog.showModal();};
$('closeHelp').onclick=$('finishHelp').onclick=()=>helpDialog.close();
// L’application installée conserve le jeu de lettres sans réseau après son premier chargement.
function refreshConnectivity(){let el=$('offlineHint');if(!el){el=document.createElement('p');el.id='offlineHint';el.setAttribute('role','status');document.body.append(el);}el.hidden=navigator.onLine;el.textContent='Hors ligne · progression conservée sur cet appareil';}
addEventListener('online',refreshConnectivity);addEventListener('offline',refreshConnectivity);refreshConnectivity();
if('serviceWorker' in navigator){let controlled=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!controlled){controlled=true;return;}if($('updateNotice'))return;const bar=document.createElement('div');bar.id='updateNotice';bar.setAttribute('role','status');const text=document.createElement('span');text.textContent='Une nouvelle version est prête.';const button=document.createElement('button');button.type='button';button.textContent='Actualiser';button.onclick=()=>{if(screen==='game'){toast('Reviens à l’accueil pour actualiser sans interrompre ta partie.');return;}location.reload();};bar.append(text,button);document.body.append(bar);});}
