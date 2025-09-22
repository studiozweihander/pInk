# pInk Comics

O website pInk é um catálogo web de quadrinhos desenvolvido em JavaScript utilizando Supabase PostgreSQL como banco de dados.

## 🛠️ Tecnologias

- **Frontend:** JavaScript
- **Backend:** Express.js
- **Database:** Supabase PostgreSQL

## ⚙ Funcionalidades

- **Catálogo:** A página inicial conta com o catálogo onde você poderá visualizar todos os quadrinhos cadastrados, ao selecionar um quadrinho específico você é direcionado à página das edições.
- **Pesquisa:** A pesquisa está presente tanto na página inicial quanto na página das edições.
- **Layout:** Você pode alterar a disposição dos cards entre grade e lista em ambas as páginas.
- **Filtro:** Com o filtro você pode selecionar entre as categorias editora, ano de lançamento e idioma para encontrar o seu quadrinho desejado. Esta funcionalidade ainda está sendo trabalhada, então pode haver alguns bugs.

## 📁 Estrutura do Projeto

```
pInk/
├── src/
├── public/
├── api/
├── routes/
├── controllers/
├── config/
├── docs/
├── assets/
└── index.html
```

## 🚀 Como Rodar

```bash
npm install
npm run dev    # Desenvolvimento (Vite)
npm start      # Produção (Express)
```
---
Desenvolvido por Zweihander
