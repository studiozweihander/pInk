-- Template para popular tabela Comics
-- Substitua os valores pelos dados reais

INSERT INTO "Comic" (title, issues, year, link, cover, "idiomId", "publisherId") 
VALUES 
(
    'NOME_DO_QUADRINHO',            -- title (string)
    1,                              -- issues (número total de edições)
    2024,                           -- year (ano de lançamento)
    'https://exemplo.com/link',     -- link (URL para download/leitura)
    'https://exemplo.com/capa.jpg', -- cover (URL da capa)
    1,                              -- idiomId (1=Português, 2=Inglês, etc.)
    1                               -- publisherId (ID da editora)
);

-- Exemplo de múltiplos registros:
INSERT INTO "Comic" (title, issues, year, link, cover, "idiomId", "publisherId") 
VALUES 
('Batman: Year One', 4, 1987, 'https://exemplo.com/batman', 'https://exemplo.com/batman-capa.jpg', 2, 3),
('Watchmen', 12, 1986, 'https://exemplo.com/watchmen', 'https://exemplo.com/watchmen-capa.jpg', 2, 3),
('Sandman', 75, 1989, 'https://exemplo.com/sandman', 'https://exemplo.com/sandman-capa.jpg', 1, 2);
