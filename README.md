# Kalku

Casse-tête quotidien : six nombres, trois cibles, quatre opérations. Mode Blitz, compagnon Bip, roulette, trophées, boutique.
Application web installable (PWA) : aucun serveur, tout tient dans ce dossier.

## Mettre en ligne sur GitHub Pages (gratuit, 5 minutes)

1. Compte sur github.com.
2. « + » puis « New repository ». Nom : `kalku`. Public. « Create repository ».
3. « uploading an existing file » : glisse TOUT le contenu de ce dossier, y compris le dossier `icons`, `manifest.webmanifest` et `sw.js` (garde la structure : le dossier `icons` doit rester un dossier). « Commit changes ».
4. Settings, Pages, Source « Deploy from a branch », Branch `main`, dossier `/ (root)`, Save.
5. Une à trois minutes plus tard : `https://TONPSEUDO.github.io/kalku/`

## Installer sur iPhone (sans App Store)

Ouvre l'adresse dans Safari, bouton Partager (carré avec flèche), « Sur l'écran d'accueil ». Le jeu s'ouvre en plein écran avec sa propre icône, fonctionne hors ligne après la première visite, et garde sa sauvegarde.
Android : Chrome propose « Installer l'application » tout seul, ou menu à trois points, « Ajouter à l'écran d'accueil ».

## Mettre à jour

Ré-envoie `index.html` (et le reste si changé). Les joueurs qui ont installé l'app reçoivent la nouvelle version à leur deuxième ouverture suivante : le service worker sert d'abord la version en cache, puis remplace. Pour forcer, change `kalku-v1` en `kalku-v2` dans `sw.js`.

## Avant d'ouvrir à d'autres joueurs

- Retire les trois codes de test (commentaire « codes de test, à retirer avant diffusion » dans `index.html`).
- Colle tes liens de paiement dans `PAYMENT_LINKS`.

## App Store, plus tard

Emballage Capacitor + Xcode sur Mac + compte développeur Apple (99 $/an). Les achats de pièces et gemmes devront passer par le système d'achat intégré d'Apple, pas par des liens externes.
