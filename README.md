# CGD-Frontend (C'est Grave Docteur ?)

Description :
-------------

API Frontend permettant à un utilisateur de poser une question, écrite ou vocale, via l'API Mistral (LLM Le Chat ou Voxtral).  
Déploiement de l'application complète effectué sur Render, accessible ici : [CGD](https://cgd-svelte.onrender.com)  

Run le projet en mode developement :
------------------------------------

`npm run dev`  
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

Pipeline CI/CD :
----------------

Utilisation de Dagger.  

* Exécution des tests E2E  
`dagger call run-tests`  

* Exécution du pipeline complet  
`dagger call docker-build-publish`  
Lance les tests avec playwright, build une image docker, publie l'image sur Dockerhub.  
