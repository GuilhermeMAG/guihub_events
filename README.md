# 🚀 GuiHub EventPlatform: Plataforma Completa de Gestão de Eventos

Uma aplicação web full-stack moderna e robusta para criação, divulgação e gerenciamento de eventos. Desenvolvida do zero com as tecnologias mais atuais do ecossistema JavaScript, demonstrando uma arquitetura escalável e boas práticas de desenvolvimento.

**[➡️ Acesse a Demo Ao Vivo](https://link-para-seu-deploy-na-vercel.com)** (Você substituirá este link após o deploy)

---

### Prévia da Aplicação

![Prévia do EventPlatform em Ação](https://i.imgur.com/92027e.png)
*(Substitua pela sua própria imagem ou GIF da aplicação funcionando)*

---

## ✨ Sobre o Projeto

O EventPlatform nasceu da necessidade de uma ferramenta centralizada e intuitiva para organizadores de eventos e participantes. A plataforma permite que organizadores criem e gerenciem seus eventos de forma simples, enquanto participantes podem descobrir, se inscrever e interagir com uma comunidade vibrante.

Este projeto foi construído como um portfólio de um desenvolvedor Full Stack Sênior, focando não apenas na funcionalidade, mas também na qualidade do código, na arquitetura do sistema e na experiência do desenvolvedor.

---

## 🌟 Funcionalidades Implementadas

* **Autenticação Completa com JWT:**
    * Cadastro (`signup`) e Login (`login`) de usuários com senhas criptografadas (bcrypt).
    * Geração de JSON Web Tokens (JWT) para sessões seguras.
    * Rotas de API protegidas que exigem autenticação.

* **Navegação e Descoberta de Eventos:**
    * Página inicial com listagem de eventos, renderizada no servidor (SSR/SSG) para performance e SEO.
    * Paginação para lidar com um grande volume de eventos.
    * Página de detalhes para cada evento com informações completas.

* **Interação do Usuário:**
    * Inscrição de participantes em eventos (rota protegida).
    * Lógica para prevenir inscrições duplicadas.

* **Gerenciamento de Eventos (para Organizadores):**
    * Criação de novos eventos através de um formulário protegido.

* **Experiência do Usuário (UX) de Alta Qualidade:**
    * **Tema Dinâmico (Light/Dark Mode):** Seletor de tema com persistência no `localStorage`, implementado com `next-themes`.
    * **Validação de Formulários:** Validação robusta e em tempo real usando `Zod` e `react-hook-form`.
    * **Design Responsivo:** Interface construída com Tailwind CSS, adaptável a qualquer tamanho de tela.
    * **Feedback ao Usuário:** Estados de carregamento, sucesso e erro em todas as interações assíncronas.

* **Qualidade de Código e Backend:**
    * **Logging Estruturado:** Logs profissionais no backend com `Pino` para facilitar a depuração em produção.
    * **API GraphQL Robusta:** Uso de Custom Scalars (`DateTime`) para garantir a integridade dos tipos de dados.
    * **Código 100% TypeScript:** Tipagem de ponta a ponta (end-to-end) para máxima segurança e manutenibilidade.

---

## 🛠️ Stack Tecnológica

Este projeto utiliza uma arquitetura de monorepo gerenciada com `pnpm workspaces` para otimizar o desenvolvimento e o compartilhamento de código.

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)** | Framework React para renderização no servidor e no cliente, rotas e otimizações. |
| | **React 18** | Biblioteca para construção de interfaces de usuário. |
| | **TypeScript** | Garante a tipagem e segurança do código. |
| | **Tailwind CSS** | Framework de estilização utilitária para um design rápido e consistente. |
| | **Apollo Client** | Cliente GraphQL para gerenciamento de estado, cache e comunicação com a API. |
| | **Zod & React Hook Form**| Para validação de formulários robusta e performática. |
| | **next-themes** | Gerenciamento de tema (Dark/Light Mode). |
| **Backend** | **Node.js** | Ambiente de execução JavaScript no servidor. |
| | **Apollo Server 4** | Framework para construção do servidor GraphQL. |
| | **GraphQL** | Linguagem de consulta para a API, garantindo requisições eficientes. |
| | **graphql-scalars** | Para tipos customizados como `DateTime`. |
| | **JWT & bcrypt.js** | Para autenticação e criptografia de senhas. |
| **Banco de Dados** | **MongoDB** | Banco de dados NoSQL, flexível e escalável, gerenciado via MongoDB Atlas. |
| **DevOps & Tooling** | **pnpm** | Gerenciador de pacotes rápido e eficiente, com suporte a workspaces (monorepo). |
| | **Pino** | Biblioteca de logging de alta performance para o backend. |
| | **ESLint & Prettier** | Para padronização e qualidade do código. |

---

## 🚀 Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o ambiente de desenvolvimento.

### Pré-requisitos

* [Node.js](https://nodejs.org/en) (versão 18 ou superior)
* [pnpm](https://pnpm.io/installation) (instalado globalmente: `npm install -g pnpm`)
* Uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) para obter a string de conexão do banco de dados.

### Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    cd seu-repositorio
    ```

2.  **Instale todas as dependências** a partir da raiz do monorepo:
    ```bash
    pnpm install
    ```

3.  **Configure as Variáveis de Ambiente do Backend:**
    * Navegue até `apps/api`.
    * Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
    * Preencha as variáveis no arquivo `.env`:
        ```env
        # apps/api/.env
        MONGO_URI="sua_string_de_conexao_do_mongodb_atlas"
        JWT_SECRET="crie_um_segredo_muito_forte_e_aleatorio_aqui"
        ```

4.  **Configure as Variáveis de Ambiente do Frontend:**
    * Navegue até `apps/web`.
    * Crie um arquivo chamado `.env.local`.
    * Adicione a seguinte variável, apontando para a sua API local:
        ```env
        # apps/web/.env.local
        NEXT_PUBLIC_GRAPHQL_API_URL="http://localhost:4000/"
        ```

### Executando a Aplicação

Você precisará de dois terminais abertos na raiz do projeto (`guihub_events`).

1.  **Terminal 1 - Iniciar o Backend (API):**
    ```bash
    pnpm --filter api dev
    ```
    *Aguarde a mensagem `🚀 Servidor pronto em: http://localhost:4000/`*

2.  **Terminal 2 - Iniciar o Frontend (Web):**
    ```bash
    pnpm --filter web dev
    ```
    *Acesse `http://localhost:3000` no seu navegador.*

---

## 🗺️ Roadmap de Futuras Implementações

Este projeto tem uma base sólida para crescer. Os próximos passos planejados incluem:

* [ ] **Sistema de Pagamentos:** Integração com um gateway como Stripe ou Mercado Pago para eventos pagos.
* [ ] **Dashboard do Usuário:** Uma área para o participante ver seus eventos inscritos e gerenciar seu perfil.
* [ ] **Dashboard do Organizador:** Gerenciamento completo de eventos (editar, deletar, ver painel de inscritos).
* [ ] **Upload de Imagens:** Permitir que organizadores adicionem imagens de capa para seus eventos.
* [ ] **Notificações por E-mail:** Envio de confirmação de inscrição e lembretes de eventos.
* [ ] **Busca e Filtros:** Implementar um sistema de busca avançada por nome, data ou localização do evento.
* [ ] **Deploy:** Publicar o backend na Render e o frontend na Vercel.

---

## 👨‍💻 Autor

**Guilherme**

* **LinkedIn:** [https://www.linkedin.com/in/seu-linkedin](https://www.linkedin.com/in/seu-linkedin)
* **GitHub:** [https://github.com/seu-github](https://github.com/seu-github)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.