-- Template para popular tabela Issues
-- Substitua os valores pelos dados reais

INSERT INTO "Issue" (title, "issueNumber", year, size, series, genres, link, cover, synopsis, "comicId", "idiomId")
VALUES 
(
    'NOME_DA_EDICAO',                      -- title (nome da edição)
    1,                                     -- issueNumber (número da edição)
    2024,                                  -- year (ano da edição)
    '22 páginas',                          -- size (tamanho/páginas)
    'NOME_DA_SERIE',                       -- series (nome da série)
    'Ação, Aventura, Drama',               -- genres (gêneros separados por vírgula)
    'https://exemplo.com/download',        -- link (URL para download)
    'https://exemplo.com/capa-edicao.jpg', -- cover (URL da capa da edição)
    'Sinopse da edição aqui...',           -- synopsis (descrição da edição)
    1,                                     -- comicId (ID do quadrinho pai)
    1                                      -- idiomId (1=Português, 2=Inglês, etc.)
);

-- Exemplo de múltiplas edições para o mesmo quadrinho:
INSERT INTO "Issue" (title, "issueNumber", year, size, series, genres, link, cover, synopsis, "comicId", "idiomId")
VALUES 
('Kick-Ass #1', 1, 2008, '09.09 MB', 'Kick-Ass (2008)', ARRAY['Super-Herói'], 'https://mnsrlwbitookavxxvyhp.supabase.co/storage/v1/object/public/files/kick-ass/kick-ass-01.cbr', 'https://mnsrlwbitookavxxvyhp.supabase.co/storage/v1/object/public/covers/kickass/kick-ass-01.webp', 'A maior história em quadrinhos de super-heróis de todos os tempos finalmente chegou. A equipe de Wolverine: Enemy of the State, formada por Mark Millar (Guerra Civil) e John Romita Jr. (Guerra Mundial Hulk), se reúne para o melhor novo livro do século 21. Você já quis ser um super-herói? Já sonhou em vestir uma máscara e sair para dar umas porradas? Pois este é o livro para você - a história em quadrinhos que começa onde os outros livros de super-heróis traçam o limite. Kick-Ass é um super-herói realista levado ao próximo nível. Se perder, você será um idiota!', 4, 1),