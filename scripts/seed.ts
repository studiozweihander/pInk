import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding banco de dados...");

  console.log("🧦 Criando idiomas...");
  const portugues = await prisma.idiom.create({
    data: { name: "Português Brasileiro" },
  });
  const english = await prisma.idiom.create({ data: { name: "Inglês" } });

  console.log("🏢 Criando editoras...");
  const dynamite = await prisma.publisher.create({
    data: { name: "Dynamite" },
  });
  const imageComics = await prisma.publisher.create({
    data: { name: "Image Comics" },
  });
  const iconComics = await prisma.publisher.create({
    data: { name: "Icon Comics" },
  });

  console.log("✍️ Criando autores...");
  const [
    ericTrautmann,
    edBrubaker,
    seanPhillips,
    markMillar,
    johnRomitaJr,
    robertKirkman,
    tonyMoore,
  ] = await Promise.all([
    prisma.author.create({ data: { name: "Eric Trautmann" } }),
    prisma.author.create({ data: { name: "Ed Brubaker" } }),
    prisma.author.create({ data: { name: "Sean Phillips" } }),
    prisma.author.create({ data: { name: "Mark Millar" } }),
    prisma.author.create({ data: { name: "John Romita Jr." } }),
    prisma.author.create({ data: { name: "Robert Kirkman" } }),
    prisma.author.create({ data: { name: "Tony Moore" } }),
  ]);

  console.log("📚 Criando quadrinhos...");
  const vampirella = await prisma.comic.create({
    data: {
      title: "Vampirella",
      issues: 40,
      year: 2010,
      link: "./pInk/vampirella.html",
      cover: "https://www.dynamite.com/images/Vampi01-cov-Ross-RareVariant.jpg",
      idiomId: portugues.id,
      publisherId: dynamite.id,
    },
  });

  const incognito = await prisma.comic.create({
    data: {
      title: "Incognito",
      issues: 6,
      year: 2008,
      link: "./pInk/incognito.html",
      cover:
        "https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/2513399-01a_cropped.jpg",
      idiomId: portugues.id,
      publisherId: iconComics.id,
    },
  });

  const fatale = await prisma.comic.create({
    data: {
      title: "Fatale",
      issues: 24,
      year: 2012,
      link: "./pInk/fatale.html",
      cover:
        "https://cdn.imagecomics.com/assets/i/releases/18505/fatale-1_ea3e77a5f9.jpg",
      idiomId: portugues.id,
      publisherId: imageComics.id,
    },
  });

  const kickAss = await prisma.comic.create({
    data: {
      title: "Kick-Ass",
      issues: 8,
      year: 2008,
      link: "./pInk/kick-ass.html",
      cover:
        "https://comicvine.gamespot.com/a/uploads/scale_large/6/67663/2515095-01_red.jpg",
      idiomId: portugues.id,
      publisherId: iconComics.id,
    },
  });

  const walkingDead = await prisma.comic.create({
    data: {
      title: "The Walking Dead",
      issues: 193,
      year: 2003,
      link: "./pInk/cumming.html",
      cover:
        "https://s3.amazonaws.com/comicgeeks/comics/covers/large-9340635.jpg?1729986063",
      idiomId: portugues.id,
      publisherId: imageComics.id,
    },
  });

  console.log("🔗 Criando relacionamentos...");
  await prisma.comicAuthor.createMany({
    data: [
      { comicId: vampirella.id, authorId: ericTrautmann.id },
      { comicId: incognito.id, authorId: edBrubaker.id },
      { comicId: fatale.id, authorId: edBrubaker.id },
      { comicId: fatale.id, authorId: seanPhillips.id },
      { comicId: kickAss.id, authorId: markMillar.id },
      { comicId: kickAss.id, authorId: johnRomitaJr.id },
      { comicId: walkingDead.id, authorId: robertKirkman.id },
      { comicId: walkingDead.id, authorId: tonyMoore.id },
    ],
  });

  console.log("✅ Seed concluído com sucesso!");
  console.log(`📊 Dados inseridos:`);
  console.log(`   - ${await prisma.idiom.count()} idiomas`);
  console.log(`   - ${await prisma.publisher.count()} editoras`);
  console.log(`   - ${await prisma.author.count()} autores`);
  console.log(`   - ${await prisma.comic.count()} comics`);
  console.log(`   - ${await prisma.comicAuthor.count()} relacionamentos`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
