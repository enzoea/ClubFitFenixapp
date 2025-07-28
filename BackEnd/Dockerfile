# Usa imagem oficial do Node.js
FROM node:18

# Define diretório de trabalho
WORKDIR /app

# Copia os arquivos
COPY package*.json ./
RUN npm install

COPY . .

# Expõe a porta usada pelo backend (ajuste conforme seu app)
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]
