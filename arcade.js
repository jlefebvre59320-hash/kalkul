// Deux signatures musicales synthétisées localement, suivant le réglage des effets.
let signatureTimers = [];
function stopGameSignature(){ signatureTimers.forEach(clearTimeout); signatureTimers=[]; }
function playGameSignature(g){
 stopGameSignature(); if(!Snd.on)return; Snd.ensure();
 const notes=g === "num" ? [261.63,329.63,392,523.25,783.99] : [349.23,440,523.25,659.25,698.46];
 const rhythm=g === "num" ? [0,85,170,300,430] : [0,140,280,350,510];
 notes.forEach((f,i)=>signatureTimers.push(setTimeout(()=>{
  if(!Snd.on||document.hidden)return;
  Snd.tone(f,g === "num"?.16:.28,g === "num"?"triangle":"sine",.055);
  if(i===notes.length-1)Snd.tone(f/2,.38,"sine",.035);
 },rhythm[i])));
}
function previewGameSound(g){
 if(!Snd.on){Snd.on=true;store.set("kalku:sound",true);}
 playGameSignature(g);renderUX();
 const card=document.querySelector(g === "num"?".arcade-card.num":".arcade-card.let");
 card.classList.remove("audition");void card.offsetWidth;card.classList.add("audition");
 setTimeout(()=>card.classList.remove("audition"),850);
}
function renderArcade(){
 $("todayLabel").textContent=lang === "fr"?"À QUOI ON JOUE ?":"WHAT SHALL WE PLAY?";
 $("hubSound").textContent=Snd.on?(lang === "fr"?"♫ Son activé":"♫ Sound on"):(lang === "fr"?"♫ Son coupé":"♫ Sound off");
 $("hubSound").setAttribute("aria-pressed",String(Snd.on));
 // L'illustration a sa propre identité, indépendamment du thème personnel choisi.
 $("numHome").setAttribute("aria-label",lang === "fr"?"Écouter la signature sonore de Kalku":"Listen to Kalku’s sound signature");
 $("letHome").setAttribute("aria-label",lang === "fr"?"Écouter la signature sonore de Lettra":"Listen to Lettra’s sound signature");
}
$("hubSound").onclick=()=>{Snd.on=!Snd.on;store.set("kalku:sound",Snd.on);if(!Snd.on)stopGameSignature();else{Snd.ensure();Snd.tap();}renderUX();};
function showGameEntrance(g){
 if(reduceMotion)return Promise.resolve();
 const el=$("gameLaunch");el.dataset.game=g;$("gameLaunchName").textContent=g === "num"?"Kalku.":"Lettra.";
 el.querySelector(".launch-symbols").textContent=g === "num"?"+  −  ×  ÷":"L  E  T  T  R  A";
 el.classList.add("show");
 return new Promise(resolve=>setTimeout(()=>{el.classList.remove("show");resolve();},480));
}
