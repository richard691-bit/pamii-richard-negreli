export interface Diretor {
  id?: string;
  nome: string;
  nacionalidade: string;
  dataNascimento: string;
  premiado: boolean;
  criadoEm?: string;
}

export const criarDiretor = (
  nome: string,
  nacionalidade: string,
  dataNascimento: string,
  premiado: boolean
): Diretor => {
  return {
    nome: nome.trim(),
    nacionalidade: nacionalidade.trim(),
    dataNascimento: dataNascimento.trim(),
    premiado: premiado ?? false,
    criadoEm: new Date().toISOString(),
  };
};