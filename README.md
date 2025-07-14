# FreeHunt

## Description

Plateforme de mise en relation entre freelances et entreprises permettant la gestion de projets, le suivi de jalons avec checkpoints, les paiements sécurisés via Stripe, et la communication en temps réel.

![Capture d'écran de l'application FreeHunt](./docs/freehunt.png)

## Installation et configuration locale

### Prérequis

- Docker et Docker Compose
- Node.js 22+
- Git

### Variables d'environnement

#### Backend
```bash
# Base de données
DATABASE_URL="postgresql://freehunt:password@localhost:5432/freehunt"
BACKEND_POSTGRES_USER="freehunt"
BACKEND_POSTGRES_PASSWORD="password"
BACKEND_POSTGRES_DB="freehunt"

# URLs et authentification
FRONTEND_URL="http://localhost:5173"
AUTHENTIK_URL="http://localhost:9000"
PORT="3000"

# Services externes
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stockage (MinIO pour le développement local)
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
S3_URL="http://localhost:10000"

# Authentik
AUTHENTIK_PG_PASS="authentik_password"
AUTHENTIK_PG_USER="authentik"
AUTHENTIK_PG_DB="authentik"
AUTHENTIK_SECRET_KEY="your-64-char-secret-key"

# Matomo
MATOMO_DB_ROOT_PASSWORD="matomo_root_password"
MATOMO_DB_NAME="matomo"
MATOMO_DATABASE_PASSWORD="matomo_password"
```

#### Frontend
```bash
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
NEXT_PUBLIC_MATOMO_URL="http://localhost:8090"
NEXT_PUBLIC_MATOMO_SITE_ID="1"
```

### Installation

1. **Cloner le projet**
```bash
git clone https://github.com/FreeHunt/freehunt.git
cd freehunt
```

2. **Créer les fichiers d'environnement**
```bash
# Copier le fichier d'exemple pour le backend
cp .env.example .env

# Copier le fichier d'exemple pour le frontend
cp frontend/.env.local.example frontend/.env.local

# Modifier les variables selon votre configuration (notamment les clés Stripe)
nano .env
```

3. **Démarrer les services d'infrastructure avec Docker Compose**
```bash
# Démarrer tous les services (base de données, Authentik, Matomo, MinIO)
docker compose -f compose.yaml -f compose.dev.yaml up -d

# Attendre que tous les services soient démarrés (environ 2-3 minutes)
docker compose ps
```

4. **Configurer Authentik (première fois uniquement)**

Voir le fichier **[AUTHENTIK.md](./AUTHENTIK.md)** pour les instructions détaillées de configuration d'Authentik.

5. **Configurer MinIO (stockage S3 local)**

Voir le fichier **[MINIO.md](./MINIO.md)** pour les instructions de configuration de MinIO pour le stockage de fichiers en local.

6. **Installer les dépendances du backend**
```bash
cd backend
npm install
```

7. **Installer les dépendances du frontend**
```bash
cd frontend
npm install
```

8. **Appliquer les migrations de base de données**
```bash
cd backend
npx prisma migrate dev
```

9. **Peupler la base de données (optionnel)**
```bash
cd backend
npx prisma db seed
```

10. **Lancer le backend en mode développement**
```bash
cd backend
npm run start:dev
```

11. **Lancer le frontend en mode développement**
```bash
cd frontend
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend API : http://localhost:3000
- Documentation API : http://localhost:3000/api
- Authentik : http://localhost:9000
- Matomo : http://localhost:8090
- Adminer : http://localhost:8080

### Gestion des services Docker

```bash
# Arrêter tous les services
docker compose -f compose.yaml -f compose.dev.yaml down

# Redémarrer les services
docker compose -f compose.yaml -f compose.dev.yaml restart

# Voir les logs des services
docker compose -f compose.yaml -f compose.dev.yaml logs -f

# Nettoyer complètement (attention : supprime les données)
docker compose -f compose.yaml -f compose.dev.yaml down -v
```

## Architecture de l'application

### Services principaux
- **Frontend** : Next.js 15 avec TypeScript, TailwindCSS et shadcn/ui
- **Backend** : NestJS avec TypeScript, Prisma ORM et validation
- **Base de données** : PostgreSQL avec migrations Prisma
- **Authentification** : Authentik (Single Sign-On)
- **Stockage fichiers** : AWS S3 (MinIO pour le développement)
- **Paiements** : Stripe avec webhooks
- **Analytics** : Matomo auto-hébergé
- **Proxy inverse** : Traefik pour la production
- **Communication temps réel** : Socket.IO pour le chat

### Architecture technique
- Microservices containerisés avec Docker
- API RESTful avec documentation Swagger/OpenAPI
- WebSocket pour la messagerie temps réel
- Upload de fichiers sécurisé vers S3
- Authentification centralisée avec Authentik
- Gestion des états de paiement avec Stripe
- Infrastructure as Code avec Terraform

## Fonctionnalités

### Sécurité
- Authentification et inscription sécurisée via Authentik
- Mots de passe forts requis (validation côté client et serveur)
- Protection CORS et validation des données
- Gestion sécurisée des sessions et cookies
- Guards d'autorisation pour les routes protégées

### Infrastructure
- Conteneurs Docker pour tous les services
- Orchestration Docker Compose (développement) et Docker Swarm (production)
- Déploiement automatisé avec GitHub Actions
- Registre Docker via GitHub Container Registry
- Configuration SSL/TLS en production
- Monitoring des services

### Fonctionnalités métier
- Plateforme complète freelance/entreprise avec rôles différenciés
- Création et gestion d'annonces de mission avec statuts
- Système de candidatures
- Gestion des projets avec jalons (checkpoints)
- Paiements automatisés via intégration Stripe
- Messagerie en temps réel entre utilisateurs
- Upload et gestion de documents (avatars, logos)
- Système de compétences techniques et humaines

### Design et interface
- Interface moderne et responsive avec TailwindCSS
- Composants réutilisables avec shadcn/ui
- Animations fluides avec Framer Motion
- Interface mobile optimisée

### Tests
- Tests end-to-end avec Jest et Supertest
- Tests unitaires des services backend
- Tests des endpoints API critiques
- Validation des fonctionnalités utilisateur
- Couverture des scénarios métier principaux

### Observabilité
- Monitoring des services avec Uptime Kuma
- Analytics avec Matomo

### Gestion de projet
- Suivi via Jira Software
- Validation des changements avec Pull Requests
- CI/CD automatisé avec GitHub Actions
- Déploiement automatique en production

### Sauvegarde et récupération
- Infrastructure as Code avec Terraform
- Réplication des services en production
- Secrets management avec Docker Swarm

### Fonctionnalités avancées
- Authentification via Authentik
- Paiements sécurisés avec Stripe Connect
- Communication temps réel WebSocket
- Stockage cloud AWS S3