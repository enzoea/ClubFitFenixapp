# Dockerfile
FROM node:18

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante da aplicação
COPY . .

# Gera os clientes Prisma
RUN npx prisma generate

# Expõe a porta
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]
