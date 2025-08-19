# Projeto pInk - Refatoração

## 📋 Contexto do Projeto

**Projeto Original**: pInk - Catálogo de quadrinhos  
**Localização**: `c:/Users/Zweihander/pInk/`  
**Repositório**: https://github.com/studio-zweihander/pInk  

**Objetivo**: Refatorar completamente a estrutura do projeto mantendo o design existente, mas usando tecnologias mais simples e acessíveis para o desenvolvedor.

## 🔄 Motivação da Refatoração

- **Problema atual**: Estrutura complexa com Next.js, Prisma, TypeScript que dificulta manutenção para desenvolvedor iniciante
- **Solução**: Migrar para tecnologias mais básicas (Vite + Vanilla JS + Express) mantendo todas as funcionalidades

## 🛠️ Tecnologias

### Projeto Atual (Original)
- **Frontend**: Next.js 15 + React + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Database**: Supabase PostgreSQL
- **Cache**: Redis (Upstash)
- **Deploy**: Vercel

### Novo Projeto (Implementado)
- **Frontend**: Vite + Vanilla JavaScript + CSS
- **Backend**: Express.js + pg (PostgreSQL client)
- **Database**: Supabase PostgreSQL (reutilizar dados existentes)
- **Estrutura**: Monorepo unificado na pasta raiz
- **Deploy**: Configurado para produção (plataforma a definir)

## 📊 Estrutura do Banco de Dados

```sql
-- Tabelas principais identificadas no schema.prisma:
- Idiom (id, name)
- Publisher (id, name) 
- Author (id, name)
- Comic (id, title, issues, year, link, cover, idiomId, publisherId)
- Issue (id, title, issueNumber, year, size, series, genres, link, cover, synopsis, comicId, idiomId)
- ComicAuthor (comicId, authorId) -- Tabela de relacionamento
```

## 🎯 Funcionalidades Definidas

### Página Inicial
- **Layout**: Header fixo (logo esquerda + pesquisa direita) + main scrollável
- **Conteúdo**: Grid de cards dos quadrinhos
- **Dados do card**: Capa, título, ano, idioma, número de edições
- **Interação**: Clique redireciona para página de edições

### Página de Edições
- **Layout**: Mesmo design da inicial
- **Conteúdo**: Lista de todas as edições do quadrinho específico
- **Metadados**: Informações do quadrinho (como no card inicial)
- **Interação**: Clique na edição abre modal

### Modal de Detalhes
- **Layout**: Imagem esquerda + informações direita
- **Conteúdo**: Botão download, sinopse, metadados detalhados
- **Dados**: Informações completas da edição específica

## 📁 Estrutura Atual do Projeto

```
pInk/
├── src/               # Frontend (components, pages, styles, utils, api)
├── public/            # Assets estáticos  
├── api/               # Rotas da API
├── routes/            # Express routes
├── controllers/       # Lógica de negócio
├── config/            # Configurações
├── docs/              # Documentação
│   ├── Git Flow.md    # Estratégia de versionamento
│   └── AGENT.md       # Este arquivo de contexto
├── assets/            # Recursos estáticos
├── shared/            # Código compartilhado
├── server.js          # Express server
├── index.html         # Frontend entry point
├── vite.config.js     # Vite config
└── package.json       # Dependências unificadas
```

## 🔌 APIs Necessárias

- **GET `/api/comics`** - Lista todos os quadrinhos com metadados básicos
- **GET `/api/comics/:id`** - Detalhes de um quadrinho específico
- **GET `/api/comics/:id/issues`** - Lista edições de um quadrinho
- **GET `/api/issues/:id`** - Detalhes completos de uma edição

## ✅ Progresso das Tarefas

### ✅ Concluído (Backend)
- [x] Análise da estrutura atual do projeto
- [x] Definição das tecnologias para nova versão
- [x] Verificação do schema do banco de dados
- [x] Definição da arquitetura do novo projeto
- [x] Levantamento das funcionalidades necessárias
- [x] Análise visual do design atual (código HTML/CSS analisado)
- [x] Criação da estrutura do novo projeto
- [x] Inicialização do projeto Vite
- [x] Organização da estrutura de pastas
- [x] Configuração inicial do Git
- [x] Documentação completa do projeto
- [x] Instalação e configuração do Express
- [x] Configuração específica para Supabase
- [x] **Server.js refatorado completamente** (rotas organizadas integradas)
- [x] **Controllers implementados** (comics + issues com tratamento completo)
- [x] **Rotas REST organizadas** (4 endpoints funcionais)
- [x] **Conflitos de porta corrigidos** (padronizado 3000)
- [x] **Schema database validado** (queries Supabase funcionais)
- [x] **Error handling implementado** (global + específico)
- [x] **Estrutura de startup robusta** (test connection + logs)

### ✅ Concluído (Frontend Base)
- [x] **API Client implementado** (fetch com timeout + error handling)
- [x] **Estrutura HTML completa** (header + search + cards container)
- [x] **JavaScript funcional** (loading states + error handling + busca)
- [x] **Main.js com todas as funções** (loadComics + filter + card creation)

### ⚠️ Pendente (Crítico)
- [ ] **Configuração das credenciais Supabase (.env)** - BLOQUEANTE
- [ ] **Teste do servidor completo** - Validar APIs funcionando
- [ ] **CSS responsivo implementado** - Design system aplicado

### 📝 Pendente (Funcionalidades)
- [ ] **Página de edições** - Navegação para lista de issues
- [ ] **Modal de detalhes** - Popup com informações + download
- [ ] **Assets preparados** - Logo SVG + capas default
- [ ] **Tratamento de imagens** - Fallback para capas inexistentes
- [ ] **Busca avançada** - Filtros por idioma/publisher
- [ ] **Loading states visuais** - Spinners + skeletons
- [ ] **Responsividade completa** - Mobile-first testado

### 🚀 Pendente (Deploy)
- [ ] **Build de produção** - Vite build + otimizações
- [ ] **Configuração de deploy** - Escolha de plataforma
- [ ] **Environment variables** - Produção vs desenvolvimento
- [ ] **Testes e validação** - QA completo
- [ ] **Documentação de deploy** - Instruções para futuro

## 🎨 Design System - Backup Completo

### Variáveis CSS Principais
```css
--primary-color: #e78fde;
--primary-surface: #181818;
--secondary-surface: #242424;
--primary-font: #e78fde;
--secondary-font: #f4c1ed;
--font: 'Poppins', sans-serif;
--font2: 'JetBrains Mono', monospace;
```

### Breakpoints Responsivos
- Mobile: base (design mobile-first)
- Tablet Pequeno: 480px+
- Tablet: 600px+
- Tablet Grande: 768px+
- Desktop: 1024px+
- Desktop Grande: 1440px+

### Componentes Principais
1. **Header**: Grid 2 colunas desktop, 1 coluna mobile
2. **Cards**: Grid auto-fit, min-width responsivo (250px-400px)
3. **Modal**: Layout flexível, side-by-side em desktop
4. **Search**: Input com ícone SVG, max-width variável

### Assets Importantes
- Logo: `assets/images/pInk.svg`
- Covers: `assets/covers/` (imagens dos quadrinhos)
- Fonts: Google Fonts (Poppins, JetBrains Mono)

### JavaScript Structure
- API calls via fetch com timeout
- Event listeners para busca
- Modal management
- Error handling e loading states

## 🌊 Git Flow Strategy

### Branches Structure
- **`main`**: Produção (apenas via PR da develop)
- **`develop`**: Integração principal (sempre pronto para produção)
- **`feature/*`**: Novas funcionalidades (ex: `feature/comic-cards`)
- **`hotfix/*`**: Correções críticas (mesclado em main + develop)

### Commit Strategy
- Commits atômicos e descritivos
- Padrão: `feat:`, `fix:`, `refactor:`, `style:`
- PRs obrigatórios para main e develop
- Code review obrigatório
- Sincronização frequente com develop

### Workflow
1. `git checkout develop && git pull origin develop`
2. `git checkout -b feature/nome-feature`
3. Trabalho + commits atômicos
4. `git push -u origin feature/nome-feature`
5. PR para develop + review + merge

## 📝 Decisões Tomadas

1. **Manter design existente**: Desenvolvedor orgulhoso do design criado
2. **Tecnologias simples**: Priorizar facilidade de manutenção sobre modernidade
3. **Estrutura unificada**: Monorepo na pasta raiz (não separação frontend/backend)
4. **Reutilizar banco**: Dados já populados no Supabase PostgreSQL
5. **Documentação como AGENT.md**: Compatibilidade com outros chats/contextos

## 🔄 Próximos Passos

1. ✅ Estrutura Vite criada e funcionando
2. ✅ Git inicializado com branches (main/develop)
3. ✅ Documentação completa
4. ✅ Express configurado específico para Supabase
5. ✅ **Server.js refatorado com rotas organizadas**
6. ✅ **Controllers implementados (4 endpoints funcionais)**
7. ✅ **Conflitos de porta e schema corrigidos** (padronizado 3000)
8. **Configurar credenciais Supabase (.env)** - BLOQUEANTE ATUAL
9. **Testar servidor completo** - Validar APIs funcionando
10. **Implementar CSS responsivo** - Aplicar design system
11. **Desenvolver funcionalidades restantes** (modal, navegação)
12. **Preparar assets** (logo, capas default)
13. **Deploy em produção** (plataforma a definir)

## 💡 Comandos Importantes

### Desenvolvimento
```bash
npm run dev    # Frontend: Servidor de desenvolvimento (Vite)
npm run server # Backend: Servidor Express com auto-reload (nodemon)
npm start      # Backend: Servidor Express produção
```

### Git Flow
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-feature
# ... trabalho ...
git push -u origin feature/nome-da-feature
# Criar PR para develop
```

## 🚨 Pontos Críticos Identificados

### Backend Funcional ✅
- **Server Express**: Completamente refatorado e organizado
- **4 APIs REST**: Todas implementadas com error handling robusto
- **Database queries**: Validadas e funcionais (aguarda credenciais)
- **Error handling**: Global e específico implementado
- **Startup robusta**: Testa conexão antes de aceitar requests

### Frontend Base Completo ✅  
- **HTML estrutura**: Header + search + cards container
- **JavaScript funcional**: API client + loading states + busca
- **CSS básico**: Presente mas precisa ser expandido

### Bloqueadores Atuais ⚠️
1. **Credenciais Supabase**: `.env` existe mas conteúdo não verificável
2. **CSS responsivo**: Design system documentado mas não aplicado
3. **Assets faltando**: Logo SVG + capas default não encontrados

### Missing Components 📋
- **Modal sistema**: Para detalhes das edições
- **Navegação**: Entre páginas inicial ↔ edições  
- **Loading spinners**: Apenas texto atualmente
- **Error states**: Visuais básicos implementados

---
**Última atualização**: 19/08/2025  
**Status**: Backend funcional, Frontend estruturado, bloqueado por credenciais Supabase  
**Repositório**: https://github.com/studio-zweihander/pInk  
**Desenvolvido por**: Zweihander
