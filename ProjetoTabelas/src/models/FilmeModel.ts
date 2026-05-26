export interface Filme { // Define a interface Filme para tipar os objetos de filme
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

export const criarFilme = ( // Função para criar um objeto Filme a partir dos dados fornecidos
  titulo: string,
  ano: number,
  genero: string,
  sinopse: string,
  nota: number,
  diretorId: string,
  diretorNome: string
): Filme => {
  return {
    titulo: titulo.trim(), // Remove espaços extras do título
    ano: Number(ano),
    genero: genero.trim(),
    sinopse: sinopse.trim(),
    nota: Number(nota),
    diretorId,
    diretorNome,
    criadoEm: new Date().toISOString(),
  };
};