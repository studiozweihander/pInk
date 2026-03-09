# pInk

## ✨ Funcionalidades

- **Catálogo**: Interface limpa e intuitiva para buscar seu quadrinho favorito.
- **Filtros**: Filtrar por editora, idioma e ano com resultados instantâneos.
- **Modal**: Visualização detalhada de cada revista, incluindo sinopses, metadados e links de download direto.
- **Performance**: Desenvolvido com Bun e ElysiaJS para alta performance.

## 🛠️ Tecnologias

- **Frontend**: React + Vite
- **Backend (produção)**: Hono + Cloudflare Workers
- **Backend (local/compat)**: Express
- **Database**: Supabase (PostgreSQL)
- **Typing**: TypeScript

## 🚀 Setup

1.  **Instalar dependências**:

    ```bash
    bun install
    ```

2.  **Configurar ambiente**:
    Crie um arquivo `.env` baseado em `.env.example` com suas credenciais do Supabase.

3.  **Iniciar o ambiente de desenvolvimento**:

    ```bash
    # Iniciar o backend local (Express com hot-reload)
    bun run server

    # Iniciar o frontend
    bun run dev
    ```

4.  **Rodar backend em modo Worker local (opcional)**:

    ```bash
    bun run worker:dev
    ```

## 🚀 Deploy

- **Cloudflare Pages**: frontend (`dist/`).
- **Cloudflare Workers**: API Hono em `pink.zwei-han-der.com`.

```bash
# build frontend
bun run build

# configurar secrets do Worker (rodar uma vez por ambiente)
bunx wrangler secret put SUPABASE_URL
bunx wrangler secret put SUPABASE_ANON_KEY

# deploy do worker API
bun run worker:deploy
```

### Rotas esperadas em produção

- `https://pink.zwei-han-der.com/` -> Pages (frontend)
- `https://pink.zwei-han-der.com/api/*` -> Worker (API)
- `https://pink.zwei-han-der.com/health` -> Worker

Se o domínio estiver como `pInk.zwei-han-der.com`, mantenha essa forma no DNS. A resolução de host é case-insensitive, mas o recomendado para config é lowercase.

---

Desenvolvido por Zweihander
