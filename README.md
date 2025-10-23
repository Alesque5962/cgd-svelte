# cgd-frontend (C'est Grave Docteur)

Description :
-------------

API permettant à un utilisateur de poser une question, écrite ou vocale, à l'API Mistral (Chat ou Voxtral)  
Déploiement effectué sur Render, projet accessible [ici](https://cgd-svelte.onrender.com)  

Run le projet en mode developement :
------------------------------------

`npm run rev`  
Se rendre à l'adresse localhost:5173 (serveur Vite).  

Tests E2E avec Playwright :
---------------------------

* Installation
`npm init playwright@latest`

* Construction de l'application  
`npm run build`  

* Exécution de tous les tests  
`npx playwright test`  

* Exécution des tests d'un seul composant  
`npx playwright test chat.spec.ts`  
`npx playwright test transcript.spec.ts`  

* Mode debug visuel  
`npx playwright test --debug`  

CI/CD avec Dagger :
-------------------

`dagger call docker-build-publish`  
Cette commande va : Lancer les tests avec playwright => Builder une image docker => Push sur Dockerhub  

