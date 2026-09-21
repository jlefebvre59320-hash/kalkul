# Kalku

Casse-tête de nombres : défi du jour en 10 parties (les mêmes pour tous, changement à minuit UTC), Blitz de 5 minutes, classements par jour, compagnon Bip, boutique, roulette, trophées. Application web installable, un seul fichier `index.html` plus ses icônes.

## 1. Mettre en ligne ou mettre à jour (GitHub Pages)

- Première fois : dépôt public `kalkul`, envoyer tous les fichiers de ce dossier à la racine (pas de sous-dossier), puis Settings › Pages › Deploy from a branch › main › / (root).
- Mise à jour : Add file › Upload files, glisser les fichiers modifiés (un même nom remplace l’ancien), Commit changes. Les téléphones qui ont installé l’app reçoivent la nouvelle version à la deuxième ouverture suivante.

Adresse : https://jlefebvre59320-hash.github.io/kalkul/

## 2. Installer comme une app

- iPhone : Safari, bouton Partager, « Sur l’écran d’accueil ».
- Android : Chrome propose « Installer l’application », ou menu ⋮ › « Ajouter à l’écran d’accueil ».
- Mac : Safari › Fichier › Ajouter au Dock, ou Chrome › icône d’installation dans la barre d’adresse.

## 3. Comptes, classement mondial, administration (Supabase)

1. SQL Editor › New query : coller tout `supabase.sql`, Run. Le fichier peut être rejoué sans erreur.
2. Authentication › Sign In / Providers › Email : « Confirm email » **activé**. Le jeu gère l’attente de confirmation, le renvoi de l’e-mail et le mot de passe oublié.
3. Authentication › URL Configuration : Site URL et Redirect URLs = `https://jlefebvre59320-hash.github.io/kalkul/`. Sans ça, les liens des e-mails renvoient vers localhost.
4. Table Editor › admins › Insert row : ton e-mail. Une fois connecté dans le jeu avec ce compte, Profil › Compte affiche « Administration ».
5. Les identifiants du projet (URL et clé publique) sont déjà en tête du script de `index.html`, constantes SUPABASE_URL et SUPABASE_ANON_KEY.

Le service d’e-mail intégré de Supabase est limité à quelques envois par heure : suffisant pour tester, à remplacer par un SMTP (Resend, Brevo…) avant une ouverture large (réglage Supabase, rien à changer dans le jeu).

## 4. Avant d’ouvrir à d’autres joueurs

- Retirer les trois codes de test (commentaire « codes de test, à retirer avant diffusion » en tête du script).
- Coller les liens de paiement dans PAYMENT_LINKS.

## 5. Limites connues

- Les scores sont déclarés par le jeu lui-même ; un classement public exigeant demandera une validation côté serveur.
- Les défis Blitz sont uniques par appareil (historique local) ; les défis du jour le sont pour tous par construction.
- App Store : nécessite un emballage natif, un Mac, un compte développeur Apple et les achats intégrés d’Apple.
