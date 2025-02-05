🚀 NestJS Template

Este é um template base para projetos utilizando NestJS, um framework progressivo para Node.js focado em escalabilidade e modularidade.

📌 Pré-requisitos

Certifique-se de ter instalado em sua máquina:

Node.js (versão recomendada: 18+)

Yarn ou npm

Banco de dados (PostgreSQL, MySQL, MongoDB, etc., conforme a configuração desejada)

🔧 Instalação

Clone este repositório e instale as dependências:

# Clonar o repositório
git clone https://github.com/seu-usuario/nest-template.git
cd nest-template

# Instalar dependências
yarn install # ou npm install

⚙️ Configuração

Copie o arquivo .env.example para .env.development e configure as variáveis de ambiente conforme necessário:

cp .env.example .env.development

Edite o arquivo .env para definir as configurações do banco de dados e outras variáveis necessárias.

▶️ Executando a Aplicação

Para rodar o projeto em ambiente de desenvolvimento:

yarn prisma:migrate:dev

yarn prisma:generate:dev

yarn start:dev # ou npm run start:dev

Para rodar em produção:

yarn build && yarn start:prod # ou npm run build && npm run start:prod

🏗 Estrutura do Projeto

├── src
│   ├── modules          # Módulos da aplicação
│   │   ├── auth         # Autenticação e autorização
│   │   ├── users        # Usuários
│   │   ├── ...          # Outros módulos
│   ├── common           # Código reutilizável (interceptors, filtros, pipes)
│   ├── config           # Configurações do projeto
│   ├── main.ts          # Arquivo principal
│   ├── app.module.ts    # Módulo raiz
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json         # Dependências do projeto
├── tsconfig.json        # Configuração do TypeScript

🛠️ Comandos Úteis

Rodar Testes

yarn test # ou npm run test

Rodar ESLint e Prettier

yarn lint # ou npm run lint

Gerar Build

yarn build # ou npm run build

📌 Tecnologias Utilizadas

NestJS

TypeScript

Prisma (ou outro ORM)

JWT para autenticação

Docker (opcional)

📜 Licença

Este projeto está licenciado sob a MIT License.

