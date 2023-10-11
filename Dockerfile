# Utilisez une image Node.js
FROM node:16.17.0

# Définissez le répertoire de travail
WORKDIR /app

# Copiez les fichiers du back-end dans le conteneur
COPY . .

# Installez les dépendances
RUN npm install

# Exposez le port sur lequel le back-end écoute
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["npm", "start"]
