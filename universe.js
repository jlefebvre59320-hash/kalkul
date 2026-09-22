// L'accueil personnel et son défi libre ont un état indépendant des parties classées.
const UNIVERSE_TEXT = {
 fr:{eyebrow:"BIENVENUE CHEZ TOI",title:"Mon univers",personalize:"✦ Personnaliser",collection:"Ma collection",shop:"Découvrir de nouveaux objets →",skins:"Les tenues de Bip",themes:"L’ambiance",decors:"Les décors",empty:"Tes prochains décors t’attendent dans la boutique.",chest:"Ton cadeau du jour",opened:"Coffre ouvert !",tomorrow:"À demain pour le prochain",wheel:"La roue des surprises",tickets:"ticket(s) disponible(s)",tryWheel:"Des objets à collectionner",tag:"LE DÉFI SURPRISE",random:"Un calcul, une petite victoire.",shuffle:"↻ Changer",reward:"+30 pièces · +15 XP",practice:"Entraînement libre",remaining:"récompense(s) restante(s) aujourd’hui",play:"À toi de jouer →",nextLevel:"Prochain niveau",owned:"objets possédés",close:"Fermer le défi",rules:"Combine les six nombres pour atteindre la cible. Chaque tuile ne s’utilise qu’une fois. Pas de chrono : prends ton temps.",target:"LA CIBLE À ATTEINDRE",pick:"Choisis un nombre, une opération, puis un autre nombre.",invalid:"Ce calcul ne donne pas un entier positif. Essaie une autre opération.",undo:"Annuler",reset:"Recommencer",next:"Encore un défi →",win:"Bien joué ! +30 pièces et +15 XP.",freeWin:"Bien joué ! Reviens demain pour de nouvelles récompenses.",active:"Termine ton Blitz avant de lancer un défi surprise.",equipped:"Équipé",level:"Niveau"},
 en:{eyebrow:"WELCOME TO YOUR SPACE",title:"My universe",personalize:"✦ Customize",collection:"My collection",shop:"Discover new items →",skins:"Bip’s outfits",themes:"The atmosphere",decors:"Decorations",empty:"Find your next decorations in the shop.",chest:"Your daily gift",opened:"Chest opened!",tomorrow:"Come back tomorrow",wheel:"The surprise wheel",tickets:"ticket(s) available",tryWheel:"Collect new items",tag:"THE SURPRISE CHALLENGE",random:"One puzzle. A little victory.",shuffle:"↻ Shuffle",reward:"+30 coins · +15 XP",practice:"Free practice",remaining:"reward(s) left today",play:"Let’s play →",nextLevel:"Next level",owned:"items owned",close:"Close challenge",rules:"Combine the six numbers to reach the target. Use each tile once. No timer: take your time.",target:"YOUR TARGET",pick:"Choose a number, an operation, then another number.",invalid:"This calculation is not a positive whole number. Try another operation.",undo:"Undo",reset:"Restart",next:"Another challenge →",win:"Well done! +30 coins and +15 XP.",freeWin:"Well done! Come back tomorrow for more rewards.",active:"Finish your Blitz before starting a surprise challenge.",equipped:"Equipped",level:"Level"}
};
const ut = () => UNIVERSE_TEXT[lang] || UNIVERSE_TEXT.en;
let universeRenderKey = "", surprise = null, practiceBoard = null;
function surpriseDay(){ return new Date().toISOString().slice(0,10); }
function rewardsLeft(){ const r = wallet.surpriseRewards; return Math.max(0,3 - (r && r.day === surpriseDay() ? Number(r.count) || 0 : 0)); }
function createSurprise(){
 const nums = numsAt(Math.floor(Math.random()*SPACE));
 const target = targetFor(nums,Math.random,[40,250,2],surprise ? [surprise.target] : null) || nums[0]+nums[1];
 return {nums,target};
}
function renderUniverse(){
 const t=ut();
 if (!surprise) surprise=createSurprise();
 $("universeEyebrow").textContent=t.eyebrow;
 $("universeTitle").textContent=wallet.name ? (lang === "fr" ? `L’univers de ${wallet.name}` : `${wallet.name}’s universe`) : t.title;
 $("universeLevel").textContent=`${t.level} ${wallet.level}`;
 $("universeSkin").textContent=T.skins[wallet.skin] || T.skins.classic;
 $("universeXp").textContent=`${wallet.xp} / ${xpNeed(wallet.level)} XP`;
 $("universeXpBar").value=wallet.xp; $("universeXpBar").max=xpNeed(wallet.level); $("universeXpBar").setAttribute("aria-label",`${t.nextLevel} ${wallet.level+1}`);
 const unlock=UNLOCKS[wallet.level+1];
 $("universeNext").textContent=`${t.nextLevel} : +${20*(wallet.level+1)} ◎${unlock ? " · "+T.skins[unlock] : ""}`;
 $("customizeUniverse").textContent=t.personalize;
 const ownedCount=wallet.owned.length+wallet.themes.length+wallet.decors.length;
 $("universeCollection").textContent=`${t.collection} · ${ownedCount}`;
 $("universeShop").textContent=t.shop;
 $("hubChestTitle").textContent=chestReady()?t.chest:t.opened;
 const streak=Math.max(1,(store.get("kalku:stats") || {}).streak || 1);
 $("hubChestText").textContent=chestReady()?`+${30+10*Math.min(10,streak)} ◎ · +${XP_CHEST} XP`:t.tomorrow;
 $("hubChest").disabled=!chestReady();
 $("hubWheelTitle").textContent=t.wheel; $("hubWheelText").textContent=wallet.tickets?`${wallet.tickets} ${t.tickets}`:t.tryWheel;
 $("surpriseTag").textContent=t.tag; $("surpriseTitle").textContent=t.random;
 $("shuffleChallenge").textContent=t.shuffle; $("surpriseNumbers").textContent=surprise.nums.join(" · "); $("surpriseTarget").textContent=surprise.target;
 $("surpriseReward").textContent=rewardsLeft()?t.reward:t.practice;
 $("surpriseRemaining").textContent=`${rewardsLeft()}/3 ${t.remaining}`;
 $("playChallenge").textContent=t.play;
 const key=JSON.stringify([lang,wallet.skin,wallet.theme,wallet.owned,wallet.themes,wallet.decors,wallet.decorPos]);
 if(key === universeRenderKey) return; universeRenderKey=key;
 $("hubDecor").replaceChildren();
 wallet.decors.forEach(id=>{const d=DECORS.find(x=>x.id===id),pos=(wallet.decorPos||{})[id]||{};if(!d||pos.hidden)return;const el=document.createElement("span");el.className="universe-decor";el.textContent=d.icon;el.style.left=pos.x||d.x;el.style.top=pos.y||d.y;$("hubDecor").appendChild(el);});
 const options=$("universeOptions"); options.replaceChildren();
 const section=(label)=>{const h=document.createElement("h3");h.textContent=label;options.appendChild(h);const box=document.createElement("div");box.className="universe-chips";options.appendChild(box);return box;};
 const picker=(label,list,names,current,pick)=>{const box=section(label);list.forEach(x=>{const b=document.createElement("button");b.type="button";b.className="chip";b.textContent=`${x.icon||"✦"} ${names[x.id]}`;b.setAttribute("aria-pressed",String(current===x.id));b.addEventListener("click",()=>{pick(x.id);saveWallet();renderUniverse();});box.appendChild(b);});};
 picker(t.skins,SKINS.filter(x=>wallet.owned.includes(x.id)),T.skins,wallet.skin,id=>{wallet.skin=id;applySkin();});
 picker(t.themes,THEMES.filter(x=>wallet.themes.includes(x.id)),T.themes,wallet.theme,id=>{wallet.theme=id;applyTheme();});
 const box=section(t.decors);
 if(!wallet.decors.length){const note=document.createElement("p");note.textContent=t.empty;box.appendChild(note);}
 wallet.decors.forEach(id=>{const d=DECORS.find(x=>x.id===id);if(!d)return;const b=document.createElement("button");b.type="button";b.className="chip";b.textContent=`${d.icon} ${T.decors[id]}`;b.setAttribute("aria-pressed",String(!((wallet.decorPos||{})[id]||{}).hidden));b.onclick=()=>{wallet.decorPos=wallet.decorPos||{};const p=wallet.decorPos[id]||{};p.hidden=!p.hidden;wallet.decorPos[id]=p;saveWallet();renderUniverse();};box.appendChild(b);});
}
$("customizeUniverse").onclick=()=>{const box=$("universeEditor");box.hidden=!box.hidden;$("customizeUniverse").setAttribute("aria-expanded",String(!box.hidden));};
$("universeCollection").onclick=()=>go("trophies");
$("universeShop").onclick=()=>{shopTab="board";go("shop");};
$("hubChest").onclick=()=>openChest(); $("hubWheel").onclick=()=>go("roulette");
$("shuffleChallenge").onclick=()=>{surprise=createSurprise();renderUniverse();};
function startSurprise(){
 if(blitz.running||lblitz.running){toast(ut().active);return;}
 practiceBoard={nums:surprise.nums.slice(),target:surprise.target,tiles:surprise.nums.map(v=>({v,alive:true})),history:[],a:null,op:null,won:false,message:""};
 renderPractice(); if(!$("challengeDialog").open)$("challengeDialog").showModal();
}
function renderPractice(){
 const p=practiceBoard,t=ut(); if(!p)return;
 $("challengeHeading").textContent=t.tag; $("challengeRules").textContent=t.rules;
 $("closeChallenge").setAttribute("aria-label",t.close);
 $("challengeTargetLabel").textContent=t.target; $("challengeTarget").textContent=p.target;
 $("undoChallenge").textContent=t.undo;$("resetChallenge").textContent=t.reset;$("nextChallenge").textContent=t.next;
 $("nextChallenge").hidden=!p.won;$("undoChallenge").disabled=p.won||!p.history.length;$("resetChallenge").disabled=p.won||!p.history.length;
 $("challengeMessage").textContent=p.message||(p.a!==null?`${p.tiles[p.a].v} ${p.op?OPS.find(o=>o.k===p.op).s:""} …`:t.pick);
 const tiles=$("challengeTiles");tiles.replaceChildren();
 p.tiles.forEach((tile,i)=>{const b=document.createElement("button");b.type="button";b.textContent=tile.alive?tile.v:"·";b.disabled=!tile.alive||p.won;b.setAttribute("aria-pressed",String(p.a===i));b.onclick=()=>practiceTap(i);tiles.appendChild(b);});
 const ops=$("challengeOps");ops.replaceChildren();
 OPS.forEach(o=>{const b=document.createElement("button");b.type="button";b.textContent=o.s;b.disabled=p.won||p.a===null;b.setAttribute("aria-pressed",String(p.op===o.k));b.onclick=()=>{p.op=p.op===o.k?null:o.k;p.message="";renderPractice();};ops.appendChild(b);});
}
function practiceTap(i){
 const p=practiceBoard;if(!p||p.won||!p.tiles[i].alive)return;
 p.message="";
 if(p.a===i){p.a=null;p.op=null;}else if(p.a===null||!p.op){p.a=i;}else{
  const result=apply(p.tiles[p.a].v,p.op,p.tiles[i].v);
  if(result===null){p.message=ut().invalid;p.op=null;renderPractice();return;}
  p.history.push(p.tiles.map(x=>({...x})));p.tiles[p.a].alive=false;p.tiles[i].v=result;p.a=null;p.op=null;
  if(result===p.target){
   p.won=true;const rewarded=rewardsLeft()>0;
   if(rewarded){const day=surpriseDay(),previous=wallet.surpriseRewards;wallet.surpriseRewards={day,count:(previous&&previous.day===day?Number(previous.count)||0:0)+1};wallet.coins+=30;wallet.c.coinsEarned+=30;wallet.xp+=15;
    // Sauvegarder les gains avant l'animation et avant de rouvrir une partie.
    const ups=[];while(wallet.xp>=xpNeed(wallet.level)){wallet.xp-=xpNeed(wallet.level);wallet.level++;ups.push(wallet.level);}
    saveWallet();renderXp();practiceBoard.levelUps=ups;
   }
   p.message=rewarded?ut().win:ut().freeWin;Snd.exact();renderUniverse();
  }
 }
 renderPractice();
 if(p.levelUps?.length){const ups=p.levelUps.splice(0);$("challengeDialog").close();ups.forEach((lv,i)=>setTimeout(()=>levelUp(lv),i*2800));}
}
$("playChallenge").onclick=startSurprise;
$("closeChallenge").onclick=()=>$("challengeDialog").close();
$("challengeDialog").addEventListener("close",()=>{renderUniverse();});
$("undoChallenge").onclick=()=>{const p=practiceBoard;if(!p||p.won||!p.history.length)return;p.tiles=p.history.pop();p.a=null;p.op=null;p.message="";renderPractice();};
$("resetChallenge").onclick=()=>{const p=practiceBoard;if(!p||p.won)return;p.tiles=p.nums.map(v=>({v,alive:true}));p.history=[];p.a=null;p.op=null;p.message="";renderPractice();};
$("nextChallenge").onclick=()=>{ $("challengeDialog").close();surprise=createSurprise();renderUniverse();startSurprise(); };
