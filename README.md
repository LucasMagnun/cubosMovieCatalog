# 🎬 Catálogo de filmes

Um catálogo pessoal de filmes desenvolvido com o objetivo de permitir que o usuário cadastre seus filmes favoritos. Quando um filme possui uma data de lançamento futura, o sistema envia um e-mail notificando sobre a estreia.

## 🧰 Tecnologias Utilizadas

**Backend:**
- [NestJS](https://nestjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [PrismaORM](https://www.prisma.io/)
- Node.js 18+

**Frontend:**
- [React](https://reactjs.org/) com [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

**Integrações:**
- [AWS S3]
- [ETHEREAL]

---

## 🚀 Como executar o projeto

### 1. Clone o repositório

git clone https://github.com/LucasMagnun/cubosMovieCatalog
cd MoviesChallenge

### 2. Configure as variáveis de ambiente
Copie o arquivo .env.example e renomeie para .env:

cp .env.example .env

Preencha os seguintes campos no arquivo .env:

DATABASE_URL=

PORT=

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=

AWS_SECRET_ACCESS_KEY=

AWS_REGION=

AWS_BUCKET_NAME=

### 3. Instale as dependecias do Backend

cd backend

npm install

npx prisma migrate dev --name initial-schema

npx prisma generate

### 4. Execute a seed para popular o sistema

npm run seed

Esse comando irá gerar um usuário padrão para testes:

Email: admin@example.com

Senha: admin123

npm run start:dev

### 5. Rode o Frontend
Em outro terminal:

cd frontend

npm install

npm run dev

### 6. Testando o envio de e-mail

Foi usado cron para o envio.
No backend, quando um e-mail for enviado após a chegada da data do lançamento de um filme, o link para visualizar a mensagem será exibido automaticamente no console (terminal).

Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

### ✅ Funcionalidades
Adição de filmes ao catálogo

Envio automático de e-mail para filmes com data de estreia futura

Upload de imagens para o AWS S3

Interface moderna e responsiva

Login com usuário administrador
