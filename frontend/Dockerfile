# Usa uma imagem leve do Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro (aproveita o cache do Docker)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY . .

# Expõe a porta que o Vite utiliza
EXPOSE 5173

# Roda o servidor com a flag --host para permitir acesso externo ao container
CMD ["npm", "run", "dev", "--", "--host"]