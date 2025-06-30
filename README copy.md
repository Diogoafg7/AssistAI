# Gestão de Equipas - Team Management App

Uma aplicação web completa para gestão de equipas, tarefas, horários e reservas, construída com Next.js e Supabase.

## 🚀 Funcionalidades

### Autenticação
- Login/Register via Supabase Auth
- Dois tipos de utilizadores: Chefe e Empregado
- Sistema de equipas com isolamento de dados

### Para Chefes (Admin)
- ✅ Criar e gerir equipas
- ✅ Gerir reservas (CRUD completo)
- ✅ Atribuir tarefas à equipa
- ✅ Planear horários semanais
- ✅ Visualizar dashboard com métricas
- 🔄 Notificações por email (em desenvolvimento)

### Para Empregados
- ✅ Visualizar tarefas pessoais
- ✅ Ver horário semanal
- ✅ Consultar reservas da equipa
- ✅ Dashboard personalizado
- 🔄 Receber notificações (em desenvolvimento)

### Funcionalidades Técnicas
- ✅ Row Level Security (RLS) no Supabase
- ✅ Middleware de autenticação
- ✅ Tarefas recorrentes (diária, semanal, mensal)
- ✅ Interface responsiva com Tailwind CSS
- ✅ Componentes reutilizáveis com shadcn/ui

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel
- **Database**: PostgreSQL com Row Level Security

## 📦 Instalação e Setup

### 1. Clonar o repositório
\`\`\`bash
git clone <repository-url>
cd team-management-app
\`\`\`

### 2. Instalar dependências
\`\`\`bash
npm install
\`\`\`

### 3. Configurar Supabase

1. Criar um novo projeto no [Supabase](https://supabase.com)
2. Executar os scripts SQL na seguinte ordem:
   - `scripts/01-create-tables.sql`
   - `scripts/02-create-policies.sql`
   - `scripts/03-create-functions.sql`

### 4. Configurar variáveis de ambiente

Copiar `.env.local.example` para `.env.local` e preencher:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 5. Executar em desenvolvimento
\`\`\`bash
npm run dev
\`\`\`

A aplicação estará disponível em `http://localhost:3000`

## 🗄️ Estrutura da Base de Dados

### Tabelas Principais

- **users**: Perfis de utilizadores (extends auth.users)
- **teams**: Equipas e seus chefes
- **reservas**: Reservas de clientes
- **tarefas**: Tarefas da equipa
- **personal_tasks**: Tarefas pessoais dos empregados
- **horarios**: Horários semanais por utilizador

### Políticas de Segurança (RLS)

- Utilizadores só acedem a dados da sua equipa
- Chefes têm acesso total à sua equipa
- Empregados têm acesso limitado (só visualização)

## 🚀 Deploy na Vercel

### 1. Conectar ao GitHub
1. Fazer push do código para o GitHub
2. Conectar o repositório na Vercel

### 2. Configurar variáveis de ambiente
Na Vercel, adicionar as mesmas variáveis do `.env.local`

### 3. Deploy automático
A Vercel fará deploy automático a cada push para a branch main

## 📱 Como Usar

### Primeiro Acesso
1. Registar uma conta (escolher tipo: Chefe ou Empregado)
2. **Chefes**: Criar uma nova equipa
3. **Empregados**: Juntar-se a uma equipa existente usando o código

### Fluxo do Chefe
1. Criar equipa no onboarding
2. Partilhar código da equipa com empregados
3. Gerir reservas, tarefas e horários no dashboard

### Fluxo do Empregado
1. Juntar-se à equipa usando código
2. Visualizar tarefas e horários atribuídos
3. Marcar tarefas como concluídas

## 🔧 Desenvolvimento

### Estrutura de Pastas
\`\`\`
/app
  /auth          # Páginas de autenticação
  /dashboard     # Dashboard principal e sub-páginas
/components
  /auth          # Componentes de autenticação
  /dashboard     # Componentes do dashboard
  /layout        # Layout components
  /onboarding    # Fluxo de onboarding
  /ui            # shadcn/ui components
/lib
  /supabase      # Clientes Supabase
/types           # TypeScript types
/scripts         # Scripts SQL
\`\`\`

### Comandos Úteis
\`\`\`bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Executar build
npm run lint         # Linting
\`\`\`

## 🔮 Próximas Funcionalidades

- [ ] Notificações por email via Supabase Edge Functions
- [ ] Sistema de aprovação de tarefas
- [ ] Relatórios e analytics
- [ ] Integração com calendário
- [ ] App mobile com React Native
- [ ] Sistema de chat da equipa

## 🤝 Contribuição

1. Fork o projeto
2. Criar branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit das mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Ver `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, abrir uma issue no GitHub ou contactar [seu-email@exemplo.com]
