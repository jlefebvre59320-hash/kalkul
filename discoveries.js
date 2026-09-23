// Answers are available only after completing all daily letter rounds.
function renderWordDiscoveries(){
 let panel=$('wordDiscoveries');if(!panel){panel=document.createElement('section');panel.id='wordDiscoveries';$('rstars').after(panel);}
 panel.replaceChildren();panel.hidden=!ldailyDone();if(panel.hidden)return;
 const title=document.createElement('h3');title.textContent=lang==='fr'?'Les mots que tu pouvais trouver':'Words you could have found';panel.append(title);
 const draws=lseriesFor(today,lang),language=lang;
 draws.forEach((letters,i)=>{
  const details=document.createElement('details'),summary=document.createElement('summary'),list=document.createElement('p');
  summary.textContent=`${i+1} · ${letters.join(' ')} `;details.append(summary,list);panel.append(details);
  details.addEventListener('toggle',async()=>{if(!details.open||list.dataset.ready)return;list.textContent=language==='fr'?'Recherche des mots…':'Finding words…';if(!await Dict.load(language)){list.textContent=language==='fr'?'Dictionnaire indisponible. Réessaie avec du réseau.':'Dictionary unavailable. Try again online.';return;}if(lang!==language)return;const words=Dict.solutions(letters);summary.textContent=`${i+1} · ${letters.join(' ')} · ${words.length} ${language==='fr'?'mots':'words'}`;list.textContent=words.join(' · ');list.dataset.ready='true';});
 });
}
const extraReactions={
 playful:['Mes idées font des loopings aujourd’hui.','Petit calcul, grand sourire !','J’ai un faible pour les mots qui pétillent.','On tente un détour ? Il y a parfois une solution cachée.','Mon super-pouvoir ? Croire en ton prochain essai.'],
 sweet:['On peut ralentir, je t’attends.','Ta curiosité fait tout le travail.','Même les petites découvertes méritent une fête.','Une pause, une respiration, une nouvelle idée.','Tu apprends à chaque tentative.'],
 bold:['Défi suivant : surprendre ton propre record !','Une autre combinaison ? Fais parler ton imagination.','Les chiffres sont prêts. À nous de jouer !','Aujourd’hui, on explore toutes les pistes.','Je parie sur ta persévérance.'],
 dreamy:['Ce mot ressemble à une petite constellation.','Un chiffre peut cacher tout un voyage.','Je me demande de quelle couleur sont les idées.','Il reste tant de chemins à explorer.','Des lettres, des étoiles et un peu d’imagination.']
};
for(const key of Object.keys(extraReactions))reactionLines[key].push(...extraReactions[key]);
