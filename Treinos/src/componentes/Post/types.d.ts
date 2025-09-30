export interface TreinoPost {
  usuario?: string;
  tipo: string;
  inicio: string | number | Date;
  fim: string | number | Date;
  legenda?: string;
  fotoPerfil?: string;
  fotos?: string[];
}

export interface PostProps {
  treino: TreinoPost;
}