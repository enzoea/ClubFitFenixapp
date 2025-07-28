-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "objetivo" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "datanascimento" TIMESTAMP(3) NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profissional" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "objetivo" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "registro" TEXT NOT NULL,
    "profissao" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profissional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FichaTreino" (
    "id" SERIAL NOT NULL,
    "id_profissional" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "objetivo" TEXT,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FichaTreino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treino" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "legenda" TEXT,

    CONSTRAINT "Treino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExercicioFicha" (
    "id" SERIAL NOT NULL,
    "id_ficha" INTEGER NOT NULL,
    "nome_exercicio" TEXT NOT NULL,
    "series" INTEGER NOT NULL,
    "repeticoes" INTEGER NOT NULL,
    "carga" TEXT,
    "observacoes" TEXT,

    CONSTRAINT "ExercicioFicha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curtida" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "treino_id" INTEGER NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Curtida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "treino_id" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreinoFoto" (
    "id" SERIAL NOT NULL,
    "treino_id" INTEGER NOT NULL,
    "foto_url" TEXT NOT NULL,

    CONSTRAINT "TreinoFoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profissional_email_key" ON "Profissional"("email");

-- AddForeignKey
ALTER TABLE "FichaTreino" ADD CONSTRAINT "FichaTreino_id_profissional_fkey" FOREIGN KEY ("id_profissional") REFERENCES "Profissional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FichaTreino" ADD CONSTRAINT "FichaTreino_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treino" ADD CONSTRAINT "Treino_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercicioFicha" ADD CONSTRAINT "ExercicioFicha_id_ficha_fkey" FOREIGN KEY ("id_ficha") REFERENCES "FichaTreino"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curtida" ADD CONSTRAINT "Curtida_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curtida" ADD CONSTRAINT "Curtida_treino_id_fkey" FOREIGN KEY ("treino_id") REFERENCES "Treino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_treino_id_fkey" FOREIGN KEY ("treino_id") REFERENCES "Treino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreinoFoto" ADD CONSTRAINT "TreinoFoto_treino_id_fkey" FOREIGN KEY ("treino_id") REFERENCES "Treino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
