# Refonte de l’interface — septembre 2026

## Changements

- Accueil centré sur deux cartes quotidiennes, progression et accès direct au défi ou au Blitz.
- Navigation Jouer / Classement / Collection / Profil hors partie, avec boutique et roulette accessibles depuis Collection.
- Plateaux plus sobres, cible lisible, sélection contrastée et historique exact des opérations, compatible avec Annuler et Recommencer.
- Coût des indices affiché avant utilisation ; lettres composées accessibles au clavier.
- Préférence Bip Discret / Bavard persistée sur l’appareil. Le mode discret est le défaut ; indices et célébrations sont conservés.
- Comparaison du résultat quotidien avec le dernier défi terminé du même mode, lorsqu’un historique existe.
- État de sauvegarde cloud réel dans Profil et traitement des erreurs de sauvegarde.
- Modales en file, gestion du focus, tabulation confinée et fermeture par Échap quand l’annulation est proposée.
- Correction des sélecteurs CSS Lettra et du numéro de défi UTC.
- Reprise du Blitz actif depuis les nouvelles cartes pour éviter de remplacer son plateau en ouvrant un autre jeu.

## Fichiers

`index.html`, `ux.css`, `ux.js` et `sw.js` doivent être publiés ensemble. Le service worker passe à `kalku-v14` et précache les deux nouveaux fichiers. Les dictionnaires et icônes restent nécessaires.

La refonte ne migre pas les données existantes et conserve les identifiants de stockage du jeu. Le nouveau réglage utilise `kalku:bip-mode`.

## Vérification

Tests locaux dans Chrome : 390×844, 320×740, 1280×900 et mode sombre ; français et anglais ; navigation, calcul/annulation, lettres au clavier, préférences persistées, modales, erreurs/succès Supabase simulés et reprise Blitz. Aucun débordement horizontal ni erreur JavaScript pendant ces parcours. Appels externes bloqués pendant ces tests. Safari/iOS et la synchronisation Supabase réelle restent à vérifier.

Cette livraison concerne l’interface. Elle ne résout pas l’ensemble des anomalies de l’audit initial, notamment l’export incomplet de Lettra, les transactions de récompenses, les minuteurs et la validation serveur des scores. Les paiements n’ont pas été activés.

## Accueil Mon univers

L’accueil principal présente maintenant une scène Bip personnalisable, les tenues et thèmes possédés, les décors activables, la progression XP et la prochaine récompense de niveau. Le coffre et la roue sont accessibles depuis cet accueil.

Le défi surprise génère un calcul résoluble indépendant du classement. Les trois premières réussites de chaque journée UTC rapportent chacune 30 pièces et 15 XP ; les suivantes restent accessibles en entraînement. Le plafond est stocké dans le portefeuille. Comme le reste de l’économie actuelle, il est contrôlé côté client et n’est pas une protection anti-triche serveur.

Tous les consommables et cosmétiques achetés en pièces coûtent cinq fois leur prix initial. Les raretés, les possessions existantes et les déblocages de niveau sont conservés. Exemples : indice 300 pièces, gomme 200, tenue Néon 2 400, cosmétique diamant 40 000.

Publier également `universe.js` et `universe.css`. Le cache passe à `kalku-v15`.

Tests complémentaires : équipement et décoration après rechargement ; quatre défis résolus donnant exactement 90 pièces et 45 XP au total ; plafond conservé après rechargement ; états quotidiens inchangés ; coffre réclamable une seule fois. Validation Chrome locale sans écriture distante.
