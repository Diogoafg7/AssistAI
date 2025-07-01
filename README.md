# 🧠 Web App de Gestão para PMEs – Reservas, Tarefas e Horários

Este projeto é uma aplicação web desenvolvida em **Next.js**, com **Supabase** como base de dados e autenticação, e alojado na **Vercel**.

O objetivo é ajudar pequenas e médias empresas (PMEs) — como restaurantes, clínicas ou serviços — a gerirem **reservas**, **tarefas**, **horários da equipa** e **notificações automáticas**, com foco na simplicidade e produtividade.

---

## 📦 Funcionalidades MVP

### 🔐 Autenticação & Gestão de Equipas
- Login e registo via Supabase Auth (email/password)
- Cada utilizador pertence a uma equipa (`team_id`)
- Chefes criam e gerem a sua própria equipa
- Empregados apenas acedem aos dados da sua equipa

### 📅 Reservas
- Chefes criam, editam e removem reservas
- Campos: data, nome do cliente, contacto, notas
- Empregados visualizam as reservas da equipa

### ✅ Tarefas (únicas ou periódicas)
- Chefes criam tarefas para a equipa
- Tarefas têm título, descrição, data, recorrência e responsável
- Empregados visualizam tarefas atribuídas e podem marcar como concluídas
- Tarefas pessoais extra para cada empregado (ex: avisos internos)

### 🕓 Organização de Horários
- Chefes definem horários semanais por colaborador
- Horários por dia/turno e por user
- Envio automático do horário semanal por email para cada colaborador

### ✉️ Notificações por Email
- Envio de tarefas pendentes e horários por email (via Supabase Edge Functions ou API externa)
- Integração futura com WhatsApp, SMS ou Push

---

## 🧰 Stack Tecnológica

- **Next.js** (App Router)
- **Supabase** (Auth + PostgreSQL + Edge Functions)
- **Tailwind CSS** + **ShadCN/UI**
- **Vercel** para deploy e CI/CD
- **React Email** ou **Resend** (futuro) para envio de emails automáticos
