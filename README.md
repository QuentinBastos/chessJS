# Installation

### Cloner le dépôt :

```sh
git clone https://github.com/QuentinBastos/chessJS.git
```

# Installer les dépendances :

### Backend :

```sh
cd backend
npm install
```

### Frontend :

```sh
cd frontend
npm install
```

# Démarrer les serveurs :

### Backend :

```sh
cd ../backend
npm start
```

### Frontend :

```sh
cd ../frontend
npm run dev
```


### Routes de l'Application

L'application comporte plusieurs routes, chacune ayant une fonction spécifique :

***
- Home (/) :
  Page d'accueil par défaut où l'utilisateur arrive. Aucune action n'est permise sans être connecté ; toute tentative redirige vers la page de connexion.
***
- Login (/login) et Register (/register) :
  Permettent la connexion ou la création de compte. Des utilisateurs sont déjà créés par défaut :

  1. user1 : mot de passe user1, elo 400
  2. user2 : mot de passe user2, elo 600
  3. user3 : mot de passe user3, elo 800
***
- Profil (/profil) :
  Permet de changer le username ou l'email de notre utilisateur.
***
- Game (/game) :
  Implémente les règles des échecs (premier déplacement des pions de 2 cases, promotion, etc., sauf roque et prise en passant). Les pièces se déplacent par un système de glisser-déposer. Sur le volet droit, l'utilisateur peut choisir si la partie est publique ou privée, nommer la partie, et utiliser des boutons pour lancer ou abandonner la partie. En dessous, le tour du joueur est affiché.
***
- Review (/review/:id) :
  Permet de revoir une partie avec des flèches pour avancer ou reculer dans les coups, et à droite, la liste des coups effectués.
***
- History (/history/:id) :
  Affiche la liste des parties jouées par l'utilisateur connecté, avec un bouton pour accéder à la revue de chaque partie.
***
- LeaderBoard (/leaderboard) :
  Classement de tous les joueurs en base, triés par leur elo.
***

## Bonus
  - Sound Design : un petit song à été rajouté au déplacement d'un pion.
  - Responsive Design : La page d'accueil est entièrement responsive.
  - Style : L'ensemble de l'application est stylisé avec le framework CSS [Tailwind CSS](https://tailwindcss.com).