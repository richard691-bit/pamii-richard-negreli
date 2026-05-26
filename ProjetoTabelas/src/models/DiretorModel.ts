export interface Diretor { // Define a interface Diretor para tipar os objetos de diretor
  id?: string;
  nome: string;
  nacionalidade: string;
  dataNascimento: string;
  premiado: boolean;
  criadoEm?: string;
}

export const criarDiretor = (   // Função para criar um objeto Diretor a partir dos dados fornecidos
  nome: string,
  nacionalidade: string,
  dataNascimento: string,
  premiado: boolean
): Diretor => {
  return {
    nome: nome.trim(), //
    nacionalidade: nacionalidade.trim(),
    dataNascimento: dataNascimento.trim(),
    premiado: premiado ?? false, // Garante que premiado seja um booleano, mesmo que seja undefined
    criadoEm: new Date().toISOString(), // Armazena a data de criação do diretor converte tipo de data em uma string
  };
};