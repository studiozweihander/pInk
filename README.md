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

---

Desenvolvido por Zweihander
