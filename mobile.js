// Atelier local : les options créatives complètent les tenues gagnées.
const bipDefaults={name:'Bip',gender:'neutral',color:'skin',eyes:'#1B1740',outfit:'none',accessory:'none',personality:'playful',motion:'gentle'};
let bipStyle={...bipDefaults,...(store.get('kalku:bip-style')||{})};
const customDialog=document.createElement('dialog');customDialog.id='bipStudio';customDialog.setAttribute('aria-labelledby','studioTitle');
customDialog.innerHTML=`<header class="studio-head"><div><small>LE STUDIO</small><h2 id="studioTitle">Crée ton Bip</h2></div><button type="button" id="closeStudio" aria-label="Fermer">✕</button></header><div class="studio-preview"><div id="studioAvatar"></div><div><b id="studioName"></b><p id="studioMessage">Ton compagnon, ton style.</p><button class="chip" id="studioReact" type="button">✦ Fais ton show</button></div></div><div class="studio-fields"><label>Son petit nom<input id="bipName" maxlength="20" autocomplete="off"></label><label>Genre<select id="bipGender"><option value="neutral">Neutre · iel</option><option value="female">Féminin · elle</option><option value="male">Masculin · il</option></select></label></div><p class="studio-note">Toutes les couleurs et tous les accessoires sont libres, quel que soit le genre.</p><div id="styleOptions"></div><div id="wardrobeMount"></div><footer><span>Enregistré sur cet appareil</span><button type="button" class="btn primary" id="finishStudio">C’est mon Bip ♥</button></footer>`;
document.body.appendChild(customDialog);
const styleGroups=[
 ['color','Sa couleur',[['skin','Tenue'],['#F7BA52','Mangue'],['#9F86FF','Lavande'],['#68D7BE','Menthe'],['#F28FB1','Guimauve'],['#72BEF5','Ciel'],['#DF9470','Terracotta']]],
 ['eyes','Ses yeux',[['#1B1740','Nuit'],['#277957','Émeraude'],['#316CC5','Océan'],['#8C4E28','Noisette']]],
 ['outfit','Son vêtement',[['none','Nature'],['tee','T-shirt'],['hoodie','Hoodie'],['dress','Robe'],['stripes','Marinière']]],
 ['accessory','Son accessoire',[['none','Sans'],['glasses','Lunettes'],['headphones','Casque'],['flower','Fleur'],['bow','Nœud'],['crown','Couronne']]],
 ['personality','Son caractère',[['playful','Espiègle'],['sweet','Tendre'],['bold','Énergique'],['dreamy','Rêveur']]],
 ['motion','Ses mouvements',[['gentle','Tout doux'],['lively','Dynamique'],['still','Calme']]]
];
for(const [key,title,choices] of styleGroups){const field=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=title;field.append(legend);for(const [value,label] of choices){const b=document.createElement('button');b.type='button';b.className='style-chip';b.dataset.key=key;b.dataset.value=value;b.textContent=label;if(value.startsWith('#')){const dot=document.createElement('i');dot.style.background=value;dot.setAttribute('aria-hidden','true');b.prepend(dot);}b.onclick=()=>{bipStyle[key]=value;saveBipStyle();};field.append(b);} $('styleOptions').append(field);}
$('bipName').oninput=e=>{bipStyle.name=e.target.value.trim().slice(0,20)||'Bip';saveBipStyle();};
$('bipGender').onchange=e=>{bipStyle.gender=e.target.value;saveBipStyle();};
function saveBipStyle(){if(typeof validateStudioStyle==='function')validateStudioStyle();store.set('kalku:bip-style',bipStyle);applySkin();renderMobile();renderStudio();}
function applyBipStyle(){
 const el=Bip.el;if(!el)return;
 if(bipStyle.color!=='skin'&&/^#[\da-f]{6}$/i.test(bipStyle.color)){ $('g1').setAttribute('stop-color',bipStyle.color);$('g2').setAttribute('stop-color',bipStyle.color); }
 el.querySelectorAll('#pupils circle').forEach(n=>n.setAttribute('fill',/^#[\da-f]{6}$/i.test(bipStyle.eyes)?bipStyle.eyes:'#1B1740'));
 el.dataset.motion=bipStyle.motion;el.setAttribute('aria-label',`${bipStyle.name} · touche pour une réaction`);
 let layer=el.querySelector('.personal-style');if(!layer){layer=document.createElementNS('http://www.w3.org/2000/svg','g');layer.classList.add('personal-style');el.append(layer);}
 const clothes={none:'',tee:'<path d="M13 75 L27 69 Q50 84 73 69 L87 75 L78 88 L70 84 L70 94 L30 94 L30 84 L22 88Z" fill="#F5F0E4"/><path d="M45 86L50 82L55 86L50 91Z" fill="#7856D8"/>',hoodie:'<path d="M18 73Q25 61 32 73Q50 86 68 73Q75 61 82 73L83 91Q50 104 17 91Z" fill="#7255B8"/><path d="M39 79L38 89M61 79L62 89" stroke="#F4E8FF" stroke-width="2"/><path d="M41 89L59 89L63 96L37 96Z" fill="#533C8B"/>',dress:'<path d="M32 74Q50 83 68 74L81 99Q50 109 19 99Z" fill="#DF729B"/><path d="M31 80Q50 86 69 80" fill="none" stroke="#FFDEA0" stroke-width="3"/>',stripes:'<path d="M18 76Q50 90 82 76L79 94Q50 105 21 94Z" fill="#FFF5DF"/><path d="M19 82Q50 95 81 82M20 90Q50 103 80 90" fill="none" stroke="#315D92" stroke-width="4"/>'};
 const accessories={none:'',glasses:'<g fill="none" stroke="#332650" stroke-width="3"><circle cx="36" cy="44" r="13"/><circle cx="64" cy="44" r="13"/><path d="M49 43H51"/></g>',headphones:'<path d="M12 49V36A38 35 0 0 1 88 36V49" fill="none" stroke="#302641" stroke-width="7"/><rect x="3" y="37" width="15" height="26" rx="7" fill="#AF95FF"/><rect x="82" y="37" width="15" height="26" rx="7" fill="#AF95FF"/>',flower:'<g fill="#EF88BA"><circle cx="78" cy="15" r="7"/><circle cx="86" cy="22" r="7"/><circle cx="81" cy="30" r="7"/><circle cx="71" cy="26" r="7"/><circle cx="70" cy="17" r="7"/></g><circle cx="78" cy="22" r="5" fill="#FFE191"/>',bow:'<path d="M30 10L49 18L31 27ZM70 10L51 18L69 27Z" fill="#D86FA3"/><circle cx="50" cy="18" r="5" fill="#FFE4A6"/>',crown:'<path d="M28 17L25 -3L40 7L50 -9L60 7L75 -3L72 17Z" fill="#FFDC79" stroke="#BA8129" stroke-width="2"/><circle cx="50" cy="8" r="3" fill="#AC75DC"/>'};
 Object.assign(accessories,window.FUN_ACCESSORIES||{});
 layer.innerHTML=(clothes[bipStyle.outfit]||'')+(accessories[bipStyle.accessory]||'');
}
function renderStudio(){
 if(!customDialog.open)return;
 $('studioName').textContent=bipStyle.name+' · '+({neutral:'iel',female:'elle',male:'il'}[bipStyle.gender]||'iel');
 $('styleOptions').querySelectorAll('button[data-key]').forEach(b=>b.setAttribute('aria-pressed',String(bipStyle[b.dataset.key]===b.dataset.value)));
 if(typeof renderStudioLocks==='function')renderStudioLocks();
 const copy=Bip.el.cloneNode(true);copy.removeAttribute('id');copy.removeAttribute('role');copy.removeAttribute('tabindex');copy.setAttribute('aria-hidden','true');
 copy.querySelectorAll('[id]').forEach(n=>{const old=n.id;n.id='studio-'+old;copy.querySelectorAll('[fill]').forEach(f=>{if(f.getAttribute('fill')===`url(#${old})`)f.setAttribute('fill',`url(#studio-${old})`);});});
 $('studioAvatar').replaceChildren(copy);
}
$('customizeUniverse').onclick=()=>{
 $('wardrobeMount').append($('universeEditor'));$('universeEditor').hidden=false;
 $('bipName').value=bipStyle.name;$('bipGender').value=bipStyle.gender;
 customDialog.showModal();$('customizeUniverse').setAttribute('aria-expanded','true');renderStudio();
};
const closeStudio=()=>customDialog.close();$('closeStudio').onclick=closeStudio;$('finishStudio').onclick=closeStudio;
customDialog.addEventListener('close',()=>{$('customizeUniverse').setAttribute('aria-expanded','false');$('customizeUniverse').focus();});
$('universeShop').addEventListener('click',closeStudio);
const reactionLines={playful:['J’ai mis mes neurones en baskets. On y va ?','Promis, je ne mange pas les lettres. Enfin… presque.','Toi + moi = une sacrée équipe !'],sweet:['On avance à ton rythme. Je reste avec toi.','Une petite victoire, ça mérite un grand sourire.','Un essai de plus, c’est déjà du progrès.'],bold:['Échauffement terminé. Place au défi !','Prêt à faire pétiller les neurones ?','Aujourd’hui, on tente quelque chose de nouveau !'],dreamy:['Et si les chiffres étaient des constellations ?','Chaque mot ouvre un petit monde.','Je collectionne les idées… et les étoiles.']};
let reactionIndex=0;
function reactBip(){
 const lines=reactionLines[bipStyle.personality]||reactionLines.playful;
 const text=lang==='fr'?lines[(reactionIndex++)%lines.length]:['You and me. A great team!','One little win, one big smile.','Let’s try something new!'][(reactionIndex++)%3];
 Bip.say(text, ['laugh','wow','happy'][reactionIndex%3],3400);
 if(!reduceMotion&&bipStyle.motion!=='still')replay(Bip.el,bipStyle.motion==='lively'?'dance':'wiggle');
 if(customDialog.open){$('studioMessage').textContent=text;renderStudio();}
 Snd.tap();
}
$('studioReact').onclick=reactBip;
const reactionBar=document.createElement('div');reactionBar.className='reaction-bar';
for(const [icon,label,mood,motion,line] of [['♥','Câlin','happy','bounce','Une dose de douceur pour la suite.'],['✦','Danse','laugh','dance','Petit pas de danse, grande énergie !'],['☀','Surprise','wow','wiggle','Oh ! Une nouvelle idée vient de passer.']]){
 const b=document.createElement('button');b.type='button';b.textContent=icon+' '+label;b.onclick=()=>{Bip.say(line,mood,3000);$('studioMessage').textContent=line;renderStudio();const svg=$('studioAvatar').firstElementChild;if(!reduceMotion&&bipStyle.motion!=='still')replay(svg,motion);Snd.tap();};reactionBar.append(b);
}
document.querySelector('.studio-preview').after(reactionBar);
const shuffleStyle=document.createElement('button');shuffleStyle.type='button';shuffleStyle.className='chip';shuffleStyle.textContent='↻ Surprends-moi';shuffleStyle.onclick=()=>{for(const [key,,choices] of styleGroups){if(['color','eyes','outfit','accessory'].includes(key)){const available=choices.filter(([v])=>typeof ownsStudioStyle!=='function'||ownsStudioStyle(key,v));bipStyle[key]=available[Math.floor(Math.random()*available.length)][0];};}saveBipStyle();};reactionBar.append(shuffleStyle);
for(const g of ['num','let']){
 const card=document.querySelector('.arcade-card.'+g);card.addEventListener('click',e=>{if(!e.target.closest('button'))launchFromHub(g,'home');});
}
function renderMobile(){
 $('pickNum').textContent=lang==='fr'?'Entrer →':'Enter →';$('pickLet').textContent=lang==='fr'?'Entrer →':'Enter →';
 $('pickNum').setAttribute('aria-label',lang==='fr'?'Ouvrir l’accueil de Kalku':'Open Kalku home');$('pickLet').setAttribute('aria-label',lang==='fr'?'Ouvrir l’accueil de Lettra':'Open Lettra home');
 $('hubTag').textContent=lang==='fr'?'Ton petit terrain de jeu.':'Your little playground.';
 $('surpriseTitle').textContent=lang==='fr'?'Un défi pour toi':'A challenge for you';
 $('universeSkin').textContent=bipStyle.name;
 $('hProfile').textContent='‹';$('hProfile').setAttribute('aria-label',lang==='fr'?'Retour à Mon univers':'Back to My universe');
 document.querySelector('#scr-home .logo').dataset.symbols=game==='let'?'A B C ✦':'25 × 4 = 100';
}
applySkin();

function greetGameHome(){
 const text=lang==='fr'?(game==='let'?'Neuf lettres, mille idées. Quel sera ton premier mot ?':'Six nombres, une cible. On fait chauffer les neurones ?'):(game==='let'?'Nine letters. What will your first word be?':'Six numbers. One target. Ready to try?');
 Bip.say(text,'happy',4200);
}
const resetStyle=document.createElement('button');resetStyle.type='button';resetStyle.className='chip';resetStyle.textContent='Revenir au Bip classique';resetStyle.onclick=()=>{bipStyle={...bipDefaults};$('bipName').value=bipStyle.name;$('bipGender').value=bipStyle.gender;saveBipStyle();};$('styleOptions').append(resetStyle);
