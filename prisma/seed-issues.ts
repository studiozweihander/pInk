import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.issue.createMany({
        data: [
            {
                title: "Kick-Ass #1",
                issueNumber: 1,
                year: 2008,
                size: "08.67 MB",
                series: "Kick-Ass (2008)",
                genres: "Super-Herói",
                link: "assets/uploads/fatale/kick-ass-01.cbr",
                cover: "assets/covers/fatale/kick-ass-01.webp",
                synopsis: "A maior história em quadrinhos de super-heróis de todos os tempos finalmente chegou. A equipe de Wolverine: Enemy of the State, formada por Mark Millar (Guerra Civil) e John Romita Jr. (Guerra Mundial Hulk), se reúne para o melhor novo livro do século 21. Você já quis ser um super-herói? Já sonhou em vestir uma máscara e sair para dar umas porradas? Pois este é o livro para você - a história em quadrinhos que começa onde os outros livros de super-heróis traçam o limite. Kick-Ass é um super-herói realista levado ao próximo nível. Se perder, você será um idiota!",
                comicId: 4,
                idiomId: 1,
            },
            {
                title: "Kick-Ass #2",
                issueNumber: 2,
                year: 2008,
                size: "12.40 MB",
                series: "Kick-Ass (2008)",
                genres: "Super-Herói",
                link: "assets/uploads/fatale/kick-ass-02.cbr",
                cover: "assets/covers/fatale/kick-ass-02.webp",
                synopsis: "Violência repugnante... do jeito que você gosta. A história em quadrinhos de super-heróis mais maluca de todos os tempos continua no que certamente será o lançamento mais emocionante de 2008. O que aconteceria se você tentasse ser um super-herói? O que aconteceria quando um homem comum em um terno de látex ficasse cara a cara com o submundo do crime? Leia sobre super-heróis como você nunca os viu antes e sinta-se feliz por estar vivendo neste exato momento em que este livro está sendo publicado. Seus netos terão inveja de você. Os quadrinhos não ficam melhores do que isso.",
                comicId: 4,
                idiomId: 1,
            },
            {
                title: "Kick-Ass #3",
                issueNumber: 3,
                year: 2008,
                size: "16.00 MB",
                series: "Kick-Ass (2008)",
                genres: "Super-Herói",
                link: "assets/uploads/fatale/kick-ass-03.cbr",
                cover: "assets/covers/fatale/kick-ass-03.webp",
                synopsis: "Você ficou impressionado com as duas primeiras edições dessa história em quadrinhos. Mas espere até ler a terceira edição. Mark Millar (Guerra Civil) e John Romita Jr. (Guerra Mundial do Hulk) só aumentam as apostas aqui e o ritmo é de tirar o fôlego. Eu a li semanas atrás e ainda estou tendo pesadelos. Nunca vi uma violência tão doentia ser vendida aos leitores em nome do entretenimento. Se não estivesse vendendo tão bem, teríamos que parar de publicar esse monstro. Acompanhe a jornada de Dave, do zero ao herói, enquanto ele se torna uma celebridade do YouTube. Ele com certeza deu uma surra naqueles desistentes, não foi? Junte-se a nós nesta edição em que ele inspira outros a se vestirem e machucarem pessoas.",
                comicId: 4,
                idiomId: 1,
            },
            {
                title: "Kick-Ass #4",
                issueNumber: 4,
                year: 2008,
                size: "08.83 MB",
                series: "Kick-Ass (2008)",
                genres: "Super-Herói",
                link: "assets/uploads/fatale/kick-ass-04.cbr",
                cover: "assets/covers/fatale/kick-ass-04.webp",
                synopsis: "A nova personagem mais empolgante do ano estreia como Hit-Girl nas páginas de Kick-Ass. Ela tem nove anos de idade, adora a Hello Kitty e pode arrancar sua traqueia antes mesmo de você ter a chance de pedir misericórdia. Mas de onde ela veio? E quem é o Big Daddy? Além disso, Kick-Ass começa a descobrir o que acontece quando você irrita os criminosos do mundo real que o ignoraram até agora. As coisas ficam feias e isso só pode significar uma coisa... Meu Deus, essa história em quadrinhos é tão boa que eu poderia chorar. E eu sou muito másculo.",
                comicId: 4,
                idiomId: 1,
            },
            {
                title: "Kick-Ass #5",
                issueNumber: 5,
                year: 2008,
                size: "14.60 MB",
                series: "Kick-Ass (2008)",
                genres: "Super-Herói",
                link: "assets/uploads/fatale/kick-ass-05.cbr",
                cover: "assets/covers/fatale/kick-ass-05.webp",
                synopsis: "Desde que vestiu a roupa de mergulho verde e se tornou o Kick-Ass, Dave Lizewski quebrou as duas pernas, despedaçou as costas; foi atropelado por uma Mercedes, esmagado por latas de lixo e esmagado por gângsteres; tornou-se um fenômeno do YouTube e inspirou uma onda de vigilantes fantasiados... mas nada disso se compara ao que vai acontecer agora que John Genovese sabe quem ele é. A sensação de super-herói de 2008 continua, cortesia de Mark Millar (GUERRA CIVIL, WOLVERINE, 1985, QUATRO FANTÁSTICO) e John Romita Jr. (GUERRA MUNDIAL, HULK, AMAZING SPIDER-MAN)!",
                comicId: 4,
                idiomId: 1,
            },
            {
                title: "Kick-Ass #6",
                issueNumber: 6,
                year: 2009,
                size: "24.50 MB",
                series: "Kick-Ass (2008)",
                genres: "Super-Herói",
                link: "assets/uploads/fatale/kick-ass-06.cbr",
                cover: "assets/covers/fatale/kick-ass-06.webp",
                synopsis: "É este o momento para o qual Dave Lizewski passou toda a sua breve carreira como KICK-ASS se preparando. Quando as fichas caírem, quando tudo estiver em jogo... qual bunda será chutada? A história da origem de KICK-ASS se desenrola enquanto a história em quadrinhos do super-herói de maior sucesso de 2008 continua!!",
                comicId: 4,
                idiomId: 1,
            },
            {
                title: "Kick-Ass #7",
                issueNumber: 7,
                year: 2009,
                size: "10.30 MB",
                series: "Kick-Ass (2008)",
                genres: "Super-Herói",
                link: "assets/uploads/fatale/kick-ass-07.cbr",
                cover: "assets/covers/fatale/kick-ass-07.webp",
                synopsis: "QUADRINHO QUE EM BREVE SE TORNARÁ UM FILME DE GRANDE PORTE! Dave Lizewski já teve dias melhores. Quando ele vestiu o traje de super-herói pela primeira vez, foi a emoção de uma vida inteira. Desde então, ele já foi espancado, agredido, quebrado, espancado e todos os outros tipos de palavras ruins. Ele conheceu um assassino de 9 anos e participou de uma equipe de super-heróis. Ele viu pessoas morrerem e se tornou uma celebridade da Internet. Mas tudo isso não significa nada - comparado a esta noite. A saga do super-herói desbocado de MARK MILLAR e JOHN ROMITA JR. continua!",
                comicId: 4,
                idiomId: 1,
            },
            {
                title: "Kick-Ass #8",
                issueNumber: 8,
                year: 2009,
                size: "19.60 MB",
                series: "Kick-Ass (2008)",
                genres: "Super-Herói",
                link: "assets/uploads/fatale/kick-ass-08.cbr",
                cover: "assets/covers/fatale/kick-ass-08.webp",
                synopsis: "É ISSO!!! O confronto final em que KICK-ASS e HIT GIRL testam sua coragem. Corpos voarão e vilões morrerão enquanto a maior surpresa dos quadrinhos de super-heróis do século 21 atinge novos e chocantes patamares! Quem sobreviverá? Quem ficará moralmente indignado? MARK MILLAR (WOLVERINE: OLD MAN LOGAN) e JOHN ROMITA JR. (AMAZING SPIDER-MAN) sabem as respostas - e eles não têm nenhuma dúvida de que essa será a edição mais comentada do ano!",
                comicId: 4,
                idiomId: 1,
            },
        ]
    });

    console.log('✅ Issues de Kick-Ass (2008) criadas com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro ao criar issues:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
