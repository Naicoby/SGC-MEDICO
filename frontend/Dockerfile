# Frontend Dockerfile - Desarrollo
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 5173

# Comando para desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]