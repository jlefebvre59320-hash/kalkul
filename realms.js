// Trois ambiances autonomes : changer un espace ne recolore pas les autres.
const REALMS={
 hub:[
 ['atelier','Atelier nocturne','#101023','#1D1C36','#F4EFFF','#BAB4D5','#CFB6FF','#514278','✦'],
 ['aurore','Aurore boréale','#0C2226','#17363A','#EDFFFA','#A9CEC5','#9DE7C8','#367D78','✧'],
 ['peche','Pêche veloutée','#FFF4E9','#FFFDF8','#463229','#766254','#8A4F32','#E7B696','☀'],
 ['bonbon','Nuage de sucre','#2C1833','#41264B','#FFF0FA','#DFC0DB','#F7B4D8','#904780','♥'],
 ['bleu','Rêve bleu','#0E203C','#1C3353','#F1F7FF','#BACBE5','#A4CEFF','#396597','☾'],
 ['papier','Papier lavande','#F3EFFB','#FFFCFF','#37264D','#6D5B7E','#775599','#C6B1E5','❋']
 ],
 num:[
 ['electric','Violet électrique','#17102D','#281D46','#F4EEFF','#C1B3DE','#D9FF83','#7952D0','×'],
 ['cosmic','Calcul cosmique','#11142D','#212744','#EDF4FF','#B8C4E1','#A7DEFF','#4548AE','✧'],
 ['arcade','Arcade acidulée','#241137','#3C2152','#FFF0FF','#D8B5E4','#F9BBEC','#A352B6','+'],
 ['plum','Prune & vanille','#271827','#3F293D','#FFF2E7','#D7BACB','#FFE0A0','#844878','÷'],
 ['lilac','Lilas givré','#F3EEFF','#FFFCFF','#362653','#77618B','#62409D','#AD8ADC','='],
 ['ultra','Ultra violet','#160E36','#2D2052','#F5EDFF','#C1B2DF','#9EF0D3','#5C39B6','∞']
 ],
 let:[
 ['jade','Jardin de jade','#102724','#1C3933','#EFFCF5','#B4D1C2','#FFDEA0','#429781','A'],
 ['lagoon','Lagon des mots','#0C2630','#173D47','#F0FCFF','#B3D3DB','#B8EEE0','#287D8C','≈'],
 ['matcha','Matcha doux','#F0F2E4','#FCFDEF','#283F2D','#62745D','#376246','#A3BB84','❋'],
 ['moss','Mousse enchantée','#192B23','#2B4132','#F2F7EA','#C0CFB6','#E1EAA2','#5C825E','♧'],
 ['mint','Menthe & rose','#102C2B','#1B4240','#EEFAF4','#BAD9CD','#FFD0D9','#438D80','✿'],
 ['teal','Encre turquoise','#0C232B','#183945','#EDF8FA','#B6CCD1','#EAD4A3','#2B7580','Aa']
 ]
};
const storedRealms=store.get('kalku:realms')||{};
const realmSettings={};for(const k of Object.keys(REALMS)){const value=storedRealms[k]||{};realmSettings[k]={palette:REALMS[k].some(p=>p[0]===value.palette)||value.palette==='collection'?value.palette:REALMS[k][0][0],board:wallet.themes.includes(value.board)?value.board:'classic'};}
let activeRealm='hub',realmSignature='',pickerRealm='hub';
const realmLabel=k=>k==='hub'?'Mon univers':k==='num'?'Kalku':'Lettra';
function realmPalette(k){return REALMS[k].find(p=>p[0]===realmSettings[k].palette)||REALMS[k][0];}
const realmProperties=['bg','panel','ink','soft','line','accent','accent-2','accent-ink','tile','tile-edge','tile-glow','op','op-ink','focus','blob-a','blob-b','blob-c','face','star-off'];
function saveScopedBoard(id){realmSettings[activeRealm]={palette:'collection',board:id};store.set('kalku:realms',realmSettings);applyRealm();}
function applyRealm(){
 if(screen==='hub')activeRealm='hub';else if(screen==='home'||screen==='game')activeRealm=game==='let'?'let':'num';
 const setting=realmSettings[activeRealm],root=document.documentElement,p=realmPalette(activeRealm);
 wallet.theme=setting.board;
 root.dataset.realm=activeRealm;
 if(setting.board==='classic')delete root.dataset.board;else root.dataset.board=setting.board;
 if(setting.palette==='collection'){realmProperties.forEach(k=>root.style.removeProperty('--'+k));}
 else{
  delete root.dataset.board;
  const [, ,bg,panel,ink,soft,accent,glow]=p;
  const vars={bg,panel,ink,soft,line:`color-mix(in srgb, ${soft} 24%, ${panel})`,accent,'accent-2':accent,'accent-ink':bg,tile:panel,'tile-edge':glow,'tile-glow':`${glow}55`,op:`color-mix(in srgb, ${glow} 20%, ${panel})`,'op-ink':ink,focus:accent,'blob-a':glow,'blob-b':accent,'blob-c':glow,face:'#211B35','star-off':glow};
  Object.entries(vars).forEach(([k,v])=>root.style.setProperty('--'+k,v));
 }
 for(const k of ['num','let']){const q=realmPalette(k);root.style.setProperty('--'+k+'-glow',q[7]);root.style.setProperty('--'+k+'-base',k==='num'?'#29174F':'#103B36');root.style.setProperty('--'+k+'-cta',['lilac','matcha'].includes(q[0])?(k==='num'?'#D9FF83':'#FFDEA0'):q[6]);}
 const signature=activeRealm+JSON.stringify(setting);
 if(signature!==realmSignature){realmSignature=signature;const th=THEMES.find(t=>t.id===setting.board);spawnParticles(setting.palette==='collection'?th?.particles:null);}
}
const realmDialog=document.createElement('dialog');realmDialog.id='realmDialog';realmDialog.setAttribute('aria-labelledby','realmTitle');realmDialog.innerHTML=`<header class="studio-head"><div><small>UNE AMBIANCE PAR ESPACE</small><h2 id="realmTitle">Tes trois univers</h2></div><button type="button" id="closeRealms" aria-label="Fermer les ambiances">✕</button></header><div id="realmTabs" role="group" aria-label="Espace à personnaliser"></div><p id="realmHint"></p><div id="realmChoices"></div><div id="realmCollection"></div><p class="studio-note">Chaque espace garde ses couleurs. Choix enregistrés sur cet appareil.</p><button id="finishRealms" class="btn primary" type="button">C’est mon ambiance ✦</button>`;document.body.append(realmDialog);
function openRealms(k){pickerRealm=k;renderRealmPicker();realmDialog.showModal();}
function renderRealmPicker(){
 $('realmTabs').replaceChildren();for(const k of Object.keys(REALMS)){const b=document.createElement('button');b.type='button';b.textContent=realmLabel(k);b.setAttribute('aria-pressed',String(k===pickerRealm));b.onclick=()=>{pickerRealm=k;renderRealmPicker();};$('realmTabs').append(b);}
 $('realmHint').textContent=`Tu personnalises ${realmLabel(pickerRealm)} uniquement.`;
 $('realmChoices').replaceChildren();for(const p of REALMS[pickerRealm]){const b=document.createElement('button');b.type='button';b.className='realm-swatch';b.setAttribute('aria-pressed',String(realmSettings[pickerRealm].palette===p[0]));b.style.setProperty('--sw-bg',p[2]);b.style.setProperty('--sw-glow',p[7]);b.style.setProperty('--sw-ink',p[4]);b.style.setProperty('--sw-dot',p[6]);const art=document.createElement('span');art.className='swatch-art';art.textContent=p[8];art.setAttribute('aria-hidden','true');const label=document.createElement('b');label.textContent=p[1]+(typeof ownsRealm==='function'&&!ownsRealm(pickerRealm,p[0])?' 🔒':'');b.append(art,label);b.onclick=()=>{realmSettings[pickerRealm].palette=p[0];store.set('kalku:realms',realmSettings);applyRealm();renderRealmPicker();Snd.tap();};$('realmChoices').append(b);}
 $('realmCollection').replaceChildren();const owned=THEMES.filter(t=>wallet.themes.includes(t.id)&&t.id!=='classic');if(owned.length){const title=document.createElement('h3');title.textContent='Tes ambiances de collection';$('realmCollection').append(title);for(const th of owned){const b=document.createElement('button');b.type='button';b.className='chip';b.textContent=th.icon+' '+T.themes[th.id];b.setAttribute('aria-pressed',String(realmSettings[pickerRealm].palette==='collection'&&realmSettings[pickerRealm].board===th.id));b.onclick=()=>{realmSettings[pickerRealm]={palette:'collection',board:th.id};store.set('kalku:realms',realmSettings);applyRealm();renderRealmPicker();};$('realmCollection').append(b);}}
}
$('closeRealms').onclick=() => realmDialog.close();$('finishRealms').onclick=()=>realmDialog.close();
const ambianceButton=document.createElement('button');ambianceButton.type='button';ambianceButton.className='chip realm-open';ambianceButton.textContent='✦ Ambiance';ambianceButton.setAttribute('aria-label','Personnaliser l’ambiance de ce jeu');ambianceButton.onclick=()=>openRealms(game==='let'?'let':'num');document.querySelector('#scr-home .logo').append(ambianceButton);
const studioAmbiance=document.createElement('button');studioAmbiance.type='button';studioAmbiance.className='chip';studioAmbiance.textContent='✦ Couleurs de mes trois univers';studioAmbiance.onclick=()=>openRealms('hub');document.querySelector('.reaction-bar').append(studioAmbiance);
window.FUN_ACCESSORIES={
 duck:'<ellipse cx="50" cy="13" rx="20" ry="10" fill="#FFD951"/><circle cx="63" cy="2" r="10" fill="#FFE56C"/><circle cx="66" cy="0" r="1.5" fill="#302530"/><path d="M71 4L82 7L72 10Z" fill="#F99A38"/><path d="M31 10L22 3L26 17Z" fill="#FFD951"/>',
 planet:'<ellipse cx="50" cy="4" rx="20" ry="14" fill="#9DB5FF"/><ellipse cx="50" cy="5" rx="30" ry="6" fill="none" stroke="#F8D590" stroke-width="5" transform="rotate(-15 50 5)"/><circle cx="46" cy="0" r="3" fill="#DEE6FF"/>',
 banana:'<path d="M30 -8Q38 26 75 3Q65 31 40 22Q22 12 30 -8Z" fill="#FFE167" stroke="#D9A54B" stroke-width="2"/><path d="M30 -8L28 -13" stroke="#6E5434" stroke-width="4"/>',
 mustache:'<path d="M50 59Q37 48 27 63Q39 72 50 63Q61 72 73 63Q63 48 50 59Z" fill="#4C3147"/>',
 bunny:'<ellipse cx="33" cy="6" rx="9" ry="22" fill="#F7DFF0" transform="rotate(-15 33 6)"/><ellipse cx="67" cy="6" rx="9" ry="22" fill="#F7DFF0" transform="rotate(15 67 6)"/><ellipse cx="33" cy="5" rx="4" ry="15" fill="#EB9BBC"/><ellipse cx="67" cy="5" rx="4" ry="15" fill="#EB9BBC"/>',
 mushroom:'<path d="M17 17Q50 -30 83 17Z" fill="#E97D88"/><ellipse cx="50" cy="17" rx="34" ry="6" fill="#FFF2D8"/><circle cx="39" cy="3" r="5" fill="#FFF2D8"/><circle cx="60" cy="5" r="6" fill="#FFF2D8"/>',
 hearts:'<path d="M23 39Q23 29 32 34Q42 27 46 38Q47 48 35 55Q23 48 23 39ZM54 39Q54 29 63 34Q73 27 77 38Q78 48 66 55Q54 48 54 39Z" fill="#ED8EBA" stroke="#7A395C" stroke-width="2"/><path d="M46 41L54 41" stroke="#7A395C" stroke-width="3"/>',
 propeller:'<path d="M24 20Q50 -3 76 20Z" fill="#91CFF1"/><path d="M50 7V-6" stroke="#48506B" stroke-width="3"/><ellipse cx="37" cy="-6" rx="14" ry="4" fill="#F5B6CB"/><ellipse cx="63" cy="-6" rx="14" ry="4" fill="#BDE49B"/><circle cx="50" cy="-6" r="3" fill="#FCEAB1"/>',
 rainbow:'<path d="M20 18A30 30 0 0 1 60 -10" fill="none" stroke="#EA8FA5" stroke-width="6"/><path d="M26 18A24 24 0 0 1 58 -4" fill="none" stroke="#F6D383" stroke-width="6"/><path d="M32 18A18 18 0 0 1 56 2" fill="none" stroke="#8BCFB6" stroke-width="6"/><circle cx="23" cy="19" r="10" fill="#FFF7EE"/>',
 star:'<path d="M74 -6L79 5L91 6L82 14L85 26L74 20L63 26L66 14L57 6L69 5Z" fill="#FFE59C" stroke="#CB9C54" stroke-width="1.5"/><circle cx="71" cy="11" r="1.2" fill="#564135"/><circle cx="77" cy="11" r="1.2" fill="#564135"/>'
};
const funChoices=[['duck','Canard perché'],['planet','Saturne'],['banana','Banane chic'],['mustache','Moustache'],['bunny','Oreilles lapin'],['mushroom','Champignon'],['hearts','Lunettes cœur'],['propeller','Hélicoptère'],['rainbow','Arc-en-ciel'],['star','Étoile filante']];
styleGroups.find(g=>g[0]==='accessory')[2].push(...funChoices);
const accessoryField=$('styleOptions').querySelector('[data-key=accessory]').closest('fieldset');for(const [value,label] of funChoices){const b=document.createElement('button');b.type='button';b.className='style-chip';b.dataset.key='accessory';b.dataset.value=value;b.textContent=label;b.onclick=()=>{bipStyle.accessory=value;saveBipStyle();};accessoryField.append(b);}
applySkin();applyRealm();

UNIVERSE_TEXT.fr.themes="Ambiances de collection · cet espace";
universeRenderKey="";
