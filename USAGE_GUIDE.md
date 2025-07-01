# 🚀 Aplicação AssistAI - Guia de Uso

## ✅ Estado Atual
A aplicação está **funcionando** e pode ser testada em: `http://localhost:3000`

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação
- **Registo de utilizadores** com email/password
- **Login** com redirecionamento automático
- **Roles**: Chefe ou Empregado
- **Middleware** de protecção de rotas
- **Logout** funcional

### ✅ Onboarding
- **Criar equipa** (para chefes)
- **Juntar-se a equipa** (para empregados)
- **Fluxo automático** após primeiro login

### ✅ Dashboard
- **Dashboard diferenciado** por role (Chefe vs Empregado)
- **Layout responsivo** com sidebar e header
- **Navegação** entre secções

### ✅ Base de Dados
- **Tabelas criadas** no Supabase
- **Políticas RLS** configuradas
- **Triggers** para criação automática de perfis
- **Funções** para tarefas recorrentes

## 🔧 Como Testar

### 1. Registar um Chefe
1. Ir para `/auth/register`
2. Preencher dados e selecionar role "Chefe"
3. Completar o registo
4. Criar uma equipa no onboarding

### 2. Registar um Empregado
1. Registar outro utilizador com role "Empregado"
2. Juntar-se à equipa criada pelo chefe

### 3. Testar Dashboards
- **Chefe**: Acesso a todas as funcionalidades de gestão
- **Empregado**: Acesso apenas às suas tarefas e visualizações

## 📊 Próximas Funcionalidades a Implementar

### 🎯 Priority 1 - Funcionalidades Core
- [ ] **Gestão de Reservas** (CRUD completo)
- [ ] **Gestão de Tarefas** (criar, atribuir, marcar como concluída)
- [ ] **Gestão de Horários** (definir horários semanais)
- [ ] **Tarefas Pessoais** (para cada empregado)

### 🎯 Priority 2 - Melhorias
- [ ] **Notificações** (email automático)
- [ ] **Relatórios** e estatísticas
- [ ] **Calendário** visual
- [ ] **Filtros** e pesquisa

### 🎯 Priority 3 - Avançado
- [ ] **API REST** completa
- [ ] **Integração WhatsApp/SMS**
- [ ] **PWA** (Progressive Web App)
- [ ] **Múltiplas equipas** por utilizador

## 🛠️ Comandos Úteis

```bash
# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar linter
npm run lint

# Deploy na Vercel (conectar repository)
vercel --prod
```

## 🐛 Resolução de Problemas

### Erro de Autenticação
- Verificar se as variáveis de ambiente estão corretas
- Confirmar se as tabelas foram criadas no Supabase
- Verificar se as políticas RLS estão ativas

### Erro de Compilação
- Executar `npm install` para atualizar dependências
- Verificar versões de React/Next.js
- Limpar cache: `npm run build`

### Problemas de Base de Dados
- Executar os scripts SQL na ordem correta
- Verificar se o RLS está ativado em todas as tabelas
- Testar queries diretamente no editor SQL do Supabase

## 📞 Suporte
Se encontrar problemas, verificar:
1. Console do browser (F12)
2. Terminal onde está a executar `npm run dev`
3. Logs do Supabase no painel de administração

---

**🎉 A aplicação está pronta para ser testada e desenvolvida!**
