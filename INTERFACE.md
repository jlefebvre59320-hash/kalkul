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

`index.html`, `ux.css`, `ux.js` et `sw.js` doivent être publiés ensemble. Le service worker précache les fichiers de la refonte. Les dictionnaires et icônes restent nécessaires.

La refonte ne migre pas les données existantes et conserve les identifiants de stockage du jeu. Le nouveau réglage utilise `kalku:bip-mode`.

## Vérification

Tests locaux dans Chrome : 390×844, 320×740, 1280×900 et mode sombre ; français et anglais ; navigation, calcul/annulation, lettres au clavier, préférences persistées, modales, erreurs/succès Supabase simulés et reprise Blitz. Aucun débordement horizontal ni erreur JavaScript pendant ces parcours. Appels externes bloqués pendant ces tests. Safari/iOS et la synchronisation Supabase réelle restent à vérifier.

Cette livraison concerne l’interface. Elle ne résout pas l’ensemble des anomalies de l’audit initial, notamment l’export incomplet de Lettra, les transactions de récompenses, les minuteurs et la validation serveur des scores. Les paiements n’ont pas été activés.

## Accueil Mon univers

L’accueil principal présente maintenant une scène Bip personnalisable, les tenues et thèmes possédés, les décors activables, la progression XP et la prochaine récompense de niveau. Le coffre et la roue sont accessibles depuis cet accueil.

Le défi surprise génère un calcul résoluble indépendant du classement. Les trois premières réussites de chaque journée UTC rapportent chacune 30 pièces et 15 XP ; les suivantes restent accessibles en entraînement. Le plafond est stocké dans le portefeuille. Comme le reste de l’économie actuelle, il est contrôlé côté client et n’est pas une protection anti-triche serveur.

Tous les consommables et cosmétiques achetés en pièces coûtent cinq fois leur prix initial. Les raretés, les possessions existantes et les déblocages de niveau sont conservés. Exemples : indice 300 pièces, gomme 200, tenue Néon 2 400, cosmétique diamant 40 000.

Publier également `universe.js` et `universe.css`. Le cache actuel est `kalku-v18`.

Tests complémentaires : équipement et décoration après rechargement ; quatre défis résolus donnant exactement 90 pièces et 45 XP au total ; plafond conservé après rechargement ; états quotidiens inchangés ; coffre réclamable une seule fois. Validation Chrome locale sans écriture distante.

## Accès aux jeux et identité sonore

Mon univers devient un bandeau personnel compact. Juste dessous, Kalku et Lettra disposent de grandes cartes illustrées : tuiles de calcul violettes et citron pour Kalku, lettres crème sur vert profond pour Lettra. Les récompenses et le défi surprise suivent les jeux.

Chaque carte propose le défi quotidien, le Blitz et une écoute de sa signature sonore synthétisée localement. Le lancement anime brièvement le nom du jeu. Les effets respectent le réglage sonore et les transitions respectent la préférence de réduction des animations. Aucun fichier audio externe n’est nécessaire. Publier également `arcade.css` et `arcade.js`.

Vérification de cette itération : aperçu navigateur bureau, 390×844 et 320×740 sans débordement horizontal ; ouverture des deux jeux ; activation et désactivation des sons ; aucune erreur JavaScript observée. Test isolé des signatures : timbres distincts, six notes par jeu, silence avant et pendant la programmation des notes. Validation syntaxique des scripts et diff Git propres.

## Composition mobile et studio Bip

Les vignettes Kalku/Lettra ouvrent désormais l’accueil de leur jeu ; le défi quotidien et le Blitz se lancent depuis cet accueil. Les signatures sonores restent actives au changement de jeu lorsque le son est activé.

L’accueil principal utilise une largeur maximale de 430 px et un cadre sur bureau. Les deux jeux sont côte à côte, suivis des récompenses et du défi. La composition s’adapte aussi à la hauteur disponible, sans bloquer le zoom ni le défilement.

Le studio modal offre un aperçu en direct : nom, genre/pronom, six couleurs plus celle de la tenue, quatre couleurs d’yeux, cinq vêtements, six accessoires, quatre caractères et trois rythmes de mouvements. Le genre ne restreint aucun choix. Réactions câlin/danse/surprise, phrases selon le caractère, assortiment aléatoire et retour aux réglages classiques. Les tenues, thèmes et décors possédés restent accessibles.

Ces nouvelles préférences sont enregistrées localement dans `kalku:bip-style` ; elles ne sont pas synchronisées avec le compte. Les animations respectent la réduction des mouvements et le réglage Calme. Publier `mobile.css` et `mobile.js` avec les autres fichiers ; cache v18.

Vérifications de cette itération : accueil entier au-dessus de la navigation à 320×740 et 375×667, contrôle 390×844, pas de débordement horizontal ; pression sur l’illustration Kalku et bouton Lettra ouvrant chacun le bon accueil ; personnalisation visible, réaction déclenchée, absence de débordement du studio, nom/couleur/vêtement/accessoire/caractère/mouvement conservés après rechargement. Console sans erreur lors de ces parcours. Scripts externes et scripts inline validés par Node.

## Thèmes indépendants par univers

Mon univers, Kalku et Lettra possèdent chacun six palettes exclusives (18 au total). Les couleurs des cartes et des accueils gardent leurs identités violet et jade. Le sélecteur est accessible depuis le studio et depuis le bouton Ambiance de chaque accueil de jeu. Les ambiances de collection possédées restent sélectionnables et sont elles aussi affectées à un seul espace. Les réglages sont locaux, dans `kalku:realms`.

Dix accessoires SVG supplémentaires : canard perché, Saturne, banane, moustache, oreilles de lapin, champignon, lunettes cœur, hélicoptère, arc-en-ciel et étoile filante. Ils complètent les six accessoires du studio. Transitions de couleurs, apparition des fenêtres, pression des cartes et ombres retravaillées ; réduction des mouvements respectée.

Test navigateur : trois palettes différentes affectées simultanément ; fond de Mon univers inchangé pendant la modification de Kalku/Lettra ; chaque accueil restitue sa propre palette ; conservation de Kalku après rechargement ; accessoire canard visible. Palettes de référence rétablies après les tests. Console sans erreur et validation syntaxique de tous les nouveaux scripts et des scripts inline.

Publier aussi `realms.js` et `realms.css` ; service worker v18.

## Navigation et déblocages du studio

L’accueil garde deux boutons nommés Compte et Réglages, qui ouvrent la bonne section du profil. La barre du bas affiche Accueil, et les écrans secondaires utilisent « ‹ Retour » avec l’historique des sections visitées. Les accueils de jeux ont aussi un bouton Changer de jeu. Cliquer Bip sur un accueil ouvre le studio ; ses indices en partie restent inchangés.

Les nouvelles couleurs, yeux, vêtements, accessoires et ambiances supplémentaires se débloquent désormais en boutique avec des pièces. Les options de base, nom, genre, caractère et mouvements restent gratuits. Les objets verrouillés sont signalés et renvoient vers leur catégorie en boutique ; Retour rouvre le studio. Le tirage aléatoire utilise uniquement les options possédées. Les essais gratuits des versions précédentes ne constituent pas des achats. Les tenues déjà acquises dans l’ancien catalogue sont conservées.

Les nouveaux achats utilisent `wallet.studioOwned` et le portefeuille existant, avec contrôles de solde et de doublon. Comme l’économie existante, la validation reste côté client. Cache v19 ; publier aussi navigation.js, navigation.css et studio-shop.js.

Validation : navigation Lettra/boutique/Retour et studio/objet verrouillé/boutique/Retour testée dans le navigateur ; présentation 320×740 contrôlée ; console sans erreur. Tests isolés de l’historique et des achats (fonds insuffisants, débit exact, possession, doublon, identifiant inconnu) réussis. Syntaxe de tous les scripts et scripts inline validée.
