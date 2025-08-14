-- CreateTable
CREATE TABLE "Idiom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Idiom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comic" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "idiomId" INTEGER NOT NULL,
    "publisherId" INTEGER NOT NULL,

    CONSTRAINT "Comic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "issueNumber" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "genres" TEXT[],
    "link" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "comicId" INTEGER NOT NULL,
    "idiomId" INTEGER NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComicAuthor" (
    "comicId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "ComicAuthor_pkey" PRIMARY KEY ("comicId","authorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Issue_comicId_issueNumber_key" ON "Issue"("comicId", "issueNumber");

-- AddForeignKey
ALTER TABLE "Comic" ADD CONSTRAINT "Comic_idiomId_fkey" FOREIGN KEY ("idiomId") REFERENCES "Idiom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comic" ADD CONSTRAINT "Comic_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_idiomId_fkey" FOREIGN KEY ("idiomId") REFERENCES "Idiom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComicAuthor" ADD CONSTRAINT "ComicAuthor_comicId_fkey" FOREIGN KEY ("comicId") REFERENCES "Comic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComicAuthor" ADD CONSTRAINT "ComicAuthor_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
