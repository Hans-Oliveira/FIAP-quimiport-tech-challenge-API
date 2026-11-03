# ==========================================
# Estágio 1: Build (Compilação e Dependências)
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Dependências adicionais para compatibilidade nativa
RUN apk add --no-cache libc6-compat

# Variável de ambiente fictícia apenas para o prisma generate compilar os tipos
ENV DATABASE_URL="mysql://dummy:dummy@localhost:3306/quimiport"

# Copia arquivos de manifesto e configuração do Prisma
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Instala todas as dependências do projeto e gera o Prisma Client
RUN npm ci

# Copia arquivos de configuração e código-fonte
COPY tsconfig*.json nest-cli.json ./
COPY src ./src/

# Executa o build da aplicação NestJS
RUN npm run build

# Deixa apenas dependências de produção na pasta node_modules
RUN npm prune --omit=dev

# ==========================================
# Estágio 2: Runner (Imagem final de Produção)
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000

# Cria usuário não-root por boas práticas de segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia arquivos compilados e dependências prontas da etapa builder
COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.ts ./

# Atribui permissões ao usuário seguro
USER appuser

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
