export interface Filme {
  id?: string;
  titulo: string;
  ano: number;
  genero: string;
  sinopse: string;
  nota: number;
  diretorId: string;
  diretorNome: string;
  criadoEm?: string;
}

export const criarFilme = (
  titulo: string,
  ano: number,
  genero: string,
  sinopse: string,
  nota: number,
  diretorId: string,
  diretorNome: string
): Filme => {
  return {
    titulo: titulo.trim(),
    ano: Number(ano),
    genero: genero.trim(),
    sinopse: sinopse.trim(),
    nota: Number(nota),
    diretorId,
    diretorNome,
    criadoEm: new Date().toISOString(),
  };
};