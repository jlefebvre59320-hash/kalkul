// Accueil = racine ; Retour = écran réellement visité précédemment.
const navigationTrail=[];
let navigationCurrent={id:'hub',game:game},navigationReturning=false;
function rememberNavigation(id){
 if(!navigationReturning){
  if(id==='hub')navigationTrail.length=0;
  else if(id!==navigationCurrent.id||((id==='home'||id==='game')&&game!==navigationCurrent.game)){
   const previous={...navigationCurrent};
   if(previous.id==='game'){previous.timed=!!startTs;previous.letterActive=LB.active;}
   navigationTrail.push(previous);
   if(navigationTrail.length>30)navigationTrail.shift();
  }
 }
 navigationCurrent={id,game};
}
function navigateBack(){
 const previous=navigationTrail.pop()||{id:screen==='game'?'home':'hub',game};
 navigationReturning=true;
 try{
  if(previous.game!==game)setGame(previous.game);
  go(previous.id);
  if(previous.studio)$("customizeUniverse").click();
  if(previous.id==='game'){
   if(mode==='daily'&&previous.timed&&!dailyDone())startTs=Date.now();
   if(game==='let'&&mode==='ldaily'&&previous.letterActive&&!ldailyDone()){
    LB.active=true;clearInterval(LB.timer);LB.timer=setInterval(lTick,200);lRender();lTick();
   }
  }
 }finally{navigationReturning=false;}
}
function navigationLabel(id){return ({hub:lang==='fr'?'Accueil':'Home',home:game==='let'?'Lettra':'Kalku',game:lang==='fr'?'Partie':'Game',shop:lang==='fr'?'Boutique':'Shop',roulette:lang==='fr'?'Roue':'Wheel',trophies:lang==='fr'?'Collection':'Collection',board:lang==='fr'?'Classement':'Rankings',profile:lang==='fr'?'Profil':'Profile',friends:lang==='fr'?'Amis':'Friends',admin:'Administration'})[id]||id;}
function renderNavigation(){
 const previous=navigationTrail[navigationTrail.length-1];
 for(const b of document.querySelectorAll('#hProfile,#back,.topbar .icon.back')){
  b.classList.add('return-link');b.textContent=lang==='fr'?'‹ Retour':'‹ Back';
  b.setAttribute('aria-label',(lang==='fr'?'Retour vers ':'Back to ')+navigationLabel(previous?.id||(screen==='game'?'home':'hub')));
 }
 $('hubProfile').hidden=false;$('hubProfile').textContent=lang==='fr'?'Compte':'Account';$('hubProfile').classList.add('settings-link');$('hubProfile').setAttribute('aria-label',lang==='fr'?'Mon compte':'My account');
 $('hubSettings').textContent=lang==='fr'?'Réglages':'Settings';$('hubSettings').classList.add('settings-link');
 const h=$('mainNav').querySelector('[data-destination=hub]');h.setAttribute('aria-label',lang==='fr'?'Accueil · choisir un jeu':'Home · choose a game');
 h.firstElementChild.textContent='⌂';
 $('customizeUniverse').textContent=lang==='fr'?'Personnaliser Bip':'Customize Bip';
 if(screen==='hub'||screen==='home')Bip.el.setAttribute('aria-label',lang==='fr'?'Personnaliser '+bipStyle.name:'Customize '+bipStyle.name);
 const current=$('navigationContext');current.textContent=screen==='home'?(lang==='fr'?'Accueil de ':'')+(game==='let'?'Lettra':'Kalku'):'';
}
const context=document.createElement('span');context.id='navigationContext';document.querySelector('#scr-home .topbar').after(context);
const changeGame=document.createElement('button');changeGame.id='changeGame';changeGame.type='button';changeGame.className='chip';changeGame.textContent='⌂ Changer de jeu';changeGame.onclick=()=>go('hub');document.querySelector('#scr-home .logo').after(changeGame);

// Le bouton explicite évite de devoir deviner le rôle de la flèche.
$('changeGame').setAttribute('aria-label','Accueil · choisir Kalku ou Lettra');

$('hubProfile').addEventListener('click',()=>$('grpAcc').scrollIntoView({block:'start'}));
$('hubSettings').addEventListener('click',()=>$('grpSound').closest('section').scrollIntoView({block:'start'}));
