// Interface commune : textes, navigation, lecture du plateau et état de sauvegarde.
const UX = {
  fr: {
    play:"Accueil", ranking:"Classement", collection:"Collection", profile:"Profil", today:"LES DÉFIS DU JOUR", numbers:"CALCUL", letters:"LETTRES", start:"Jouer le défi", resume:"Reprendre", results:"Voir mon résultat", blitz:"Blitz · 5 min", universe:"Mon univers", rounds:"manches terminées", hint:"Indice", tokenHint:"Indice · 1 objet", starCap:"2 étoiles max.", halfPoints:"points ÷ 2", removeLetter:"Retirer à partir de la lettre", wordHelp:"3 lettres minimum. Touchez une lettre du mot pour revenir en arrière.", select:"Choisissez un nombre pour commencer", operation:"Choisissez une opération", second:"Choisissez le deuxième nombre", history:"Vos calculs", noHistory:"Les étapes de votre calcul apparaîtront ici.", bipLabel:"Pendant la partie", quiet:"Discret", chatty:"Bavard", bipNote:"En mode discret, Bip garde ses indices et ses célébrations, avec moins de commentaires spontanés.", local:"Progression sur cet appareil", offline:"Hors ligne · progression sur cet appareil", pending:"Modifications à synchroniser", saving:"Synchronisation en cours…", saved:"Sauvegarde cloud enregistrée", syncError:"Échec de synchronisation · réessayez", connected:"Compte connecté · sauvegarde à vérifier", nav:"Navigation principale", numDesc:"Six nombres. Une cible. À vous de calculer.", letDesc:"Neuf lettres. Quel mot trouverez-vous ?", headline:"Joue. Gagne. Crée ton univers.", shop:"Ouvrir la boutique", wheel:"Roulette", active:"Reprendre le Blitz en cours", invalid:"Opération impossible"
  },
  en: {
    play:"Home", ranking:"Rankings", collection:"Collection", profile:"Profile", today:"TODAY’S CHALLENGES", numbers:"NUMBERS", letters:"LETTERS", start:"Play today’s challenge", resume:"Continue", results:"View my result", blitz:"Blitz · 5 min", universe:"My space", rounds:"rounds completed", hint:"Hint", tokenHint:"Hint · 1 item", starCap:"2 stars max.", halfPoints:"half points", removeLetter:"Remove from letter", wordHelp:"At least 3 letters. Tap a letter in your word to go back.", select:"Choose a number to begin", operation:"Choose an operation", second:"Choose the second number", history:"Your calculations", noHistory:"Your calculation steps will appear here.", bipLabel:"During a game", quiet:"Quiet", chatty:"Chatty", bipNote:"Quiet mode keeps hints and celebrations, with fewer spontaneous comments.", local:"Progress saved on this device", offline:"Offline · progress on this device", pending:"Changes waiting to sync", saving:"Syncing…", saved:"Cloud save recorded", syncError:"Could not sync · please retry", connected:"Signed in · cloud save not verified", nav:"Main navigation", numDesc:"Six numbers. One target. Your move.", letDesc:"Nine letters. What word will you find?", headline:"Play. Earn. Make it yours.", shop:"Visit the shop", wheel:"Prize wheel", active:"Resume your active Blitz", invalid:"Invalid operation"
  }
};
function uxText(){ return UX[lang] || UX.en; }
function bipChatty(){ return store.get("kalku:bip-mode") === "chatty"; }
function renderSyncStatus(){
  const el = $("syncStatus"); if (!el) return; const t = uxText();
  el.textContent = !navigator.onLine ? t.offline : !Cloud.user ? t.local : ({pending:t.pending,saving:t.saving,saved:t.saved,error:t.syncError})[Cloud.syncState] || t.connected;
  el.dataset.state = Cloud.user ? Cloud.syncState : "local";
}
function renderUX(){
  const t = uxText();
  document.body.dataset.screen = screen;
  $("mainNav").setAttribute("aria-label", t.nav);
  const current = ["hub","home","game"].includes(screen) ? "hub" : ["shop","roulette","trophies"].includes(screen) ? "trophies" : screen;
  document.querySelectorAll("[data-destination]").forEach(b => { if (b.dataset.destination === current) b.setAttribute("aria-current","page"); else b.removeAttribute("aria-current"); });
  document.querySelectorAll("[data-nav-label]").forEach(el => el.textContent = t[el.dataset.navLabel]);
  $("todayLabel").textContent = t.today;
  $("todayDate").textContent = new Intl.DateTimeFormat(lang, {day:"numeric",month:"short",timeZone:"UTC"}).format(new Date(today + "T12:00:00Z"));
  $("hubTag").textContent = t.headline;
  $("numType").textContent = t.numbers; $("letType").textContent = t.letters;
  $("numDesc").textContent = t.numDesc; $("letDesc").textContent = t.letDesc;
  [["num",daily,SERIES_LEN],["let",ldaily,LET_ROUNDS]].forEach(([prefix,state,total]) => {
    const done = state.idx >= total;
    $(prefix + "Progress").value = Math.min(total,state.idx);
    $(prefix + "Progress").setAttribute("aria-label", `${prefix === "num" ? "Kalku" : "Lettra"} : ${state.idx}/${total} ${t.rounds}`);
    $(prefix + "State").textContent = `${Math.min(total,state.idx)}/${total} ${t.rounds}`;
    $(prefix === "num" ? "pickNum" : "pickLet").textContent = (done ? t.results : state.idx ? t.resume : t.start) + " →";
    $(prefix + "Blitz").textContent = (prefix === "num" ? blitz.running : lblitz.running) ? t.active : t.blitz;
    $(prefix + "Home").textContent = Snd.on ? (lang === "fr" ? "♫ Écouter" : "♫ Listen") : (lang === "fr" ? "♫ Activer le son" : "♫ Enable sound");
  });
  $("bipModeLabel").textContent = t.bipLabel; $("bipMode").value = bipChatty() ? "chatty" : "quiet";
  $("bipMode").options[0].textContent = t.quiet; $("bipMode").options[1].textContent = t.chatty; $("bipModeNote").textContent = t.bipNote;
  $("collectionShop").textContent = t.shop; $("collectionWheel").textContent = t.wheel;
  [["pName",lang === "fr" ? "Votre pseudo" : "Your name"],["accEmail",T.acc.email],["accPass",T.acc.pass],["accNewPass",T.acc.newPass],["codeIn",T.codePh],["codeArea",T.pr.import]].forEach(([id,label]) => $(id).setAttribute("aria-label",label));
  renderSyncStatus();
  if (typeof renderArcade === "function") renderArcade();
  if (typeof renderUniverse === "function") renderUniverse();
  if (typeof renderMobile === "function") renderMobile();
  if (typeof renderNavigation === "function") renderNavigation();
  if(screen === "shop" && typeof renderStudioShop === "function") renderStudioShop();
}
let gameLaunchPending = false;
async function launchFromHub(nextGame, nextMode){
  if(gameLaunchPending) return;
  if (blitz.running || lblitz.running){ setGame(lblitz.running ? "let" : "num"); startBlitzScreen(); return; }
  gameLaunchPending = true;
  try{
    playGameSignature(nextGame);
    await showGameEntrance(nextGame);
    setGame(nextGame);
    if (nextMode === "daily") startDaily(); else if (nextMode === "blitz") startBlitzScreen(); else { go("home"); if(typeof greetGameHome === "function") greetGameHome(); }
  }finally{ gameLaunchPending=false; }
}
function renderCalculation(){
  const t = uxText(), preview = $("calcPreview"), history = $("calcHistory");
  const selected = B.selA !== null && B.tiles[B.selA];
  preview.textContent = !selected ? t.select : `${selected.v} ${B.selOp ? OPS.find(o=>o.k === B.selOp).s + " …" : "…"} · ${B.selOp ? t.second : t.operation}`;
  history.replaceChildren(); history.setAttribute("aria-label",t.history);
  B.history.forEach(before => {
    const c = before.calculation; if (!c) return;
    const line = document.createElement("span");
    line.textContent = `${c.a} ${OPS.find(o=>o.k === c.op).s} ${c.b} = ${c.result}`;
    history.appendChild(line);
  });
  if (!history.childElementCount){ const note = document.createElement("span"); note.className="empty"; note.textContent=t.noHistory; history.appendChild(note); }
}
$("bipMode").addEventListener("change", e=>{ store.set("kalku:bip-mode",e.target.value); renderUX(); });
for (const prefix of ["num","let"]){
  $(prefix + "Blitz").addEventListener("click",()=>launchFromHub(prefix,"blitz"));
  $(prefix + "Home").addEventListener("click",()=>previewGameSound(prefix));
}
document.querySelectorAll("[data-destination]").forEach(b=>b.addEventListener("click",()=>{
  if (b.dataset.destination === "board"){ board.tab="today"; board.mode=game === "let" ? lModeKey("ldaily") : "daily"; }
  go(b.dataset.destination);
}));
$("collectionShop").addEventListener("click",()=>go("shop"));
$("collectionWheel").addEventListener("click",()=>go("roulette"));
addEventListener("online",renderSyncStatus); addEventListener("offline",renderSyncStatus);

function renderResultInsight(modeName, score){
  const previous = hist.filter(h => h.mode === modeName && h.day < today && h.completed).sort((a,b)=>b.day.localeCompare(a.day))[0];
  const el = $("resultInsight");
  if (!previous){ el.textContent = lang === "fr" ? "Défi terminé. Rendez-vous demain pour la suite !" : "Challenge complete. Come back tomorrow for more!"; return; }
  const delta = score - previous.successes;
  const unit = modeName === "daily" ? (lang === "fr" ? "cible(s)" : "target(s)") : "points";
  el.textContent = lang === "fr" ? `${delta > 0 ? "+" : ""}${delta} ${unit} par rapport à votre dernier défi (${previous.day}).` : `${delta > 0 ? "+" : ""}${delta} ${unit} compared with your last challenge (${previous.day}).`;
}
