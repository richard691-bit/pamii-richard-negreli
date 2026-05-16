import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Filme, criarFilme } from "../models/FilmeModel";

// ─── VALIDAÇÕES ───────────────────────────────────────────
const validarFilme = (
  titulo: string,
  ano: number,
  genero: string,
  sinopse: string,
  nota: number,
  diretorId: string
): string | null => {
  if (!titulo || titulo.trim().length < 2)
    return "Título deve ter pelo menos 2 caracteres.";

  if (!ano || isNaN(ano))
    return "Ano é obrigatório e deve ser um número.";

  const anoAtual = new Date().getFullYear();
  if (ano < 1888 || ano > anoAtual + 1)
    return `Ano deve estar entre 1888 e ${anoAtual + 1}.`;

  if (!genero || genero.trim().length < 3)
    return "Gênero deve ter pelo menos 3 caracteres.";

  if (!sinopse || sinopse.trim().length < 20)
    return "Sinopse deve ter pelo menos 20 caracteres.";

  if (nota === undefined || nota === null || isNaN(nota))
    return "Nota é obrigatória.";

  if (nota < 0 || nota > 10)
    return "Nota deve ser entre 0 e 10.";

  if (!diretorId)
    return "Selecione um diretor.";

  return null;
};

// ─── CADASTRAR ────────────────────────────────────────────
export const cadastrarFilme = async (
  titulo: string,
  ano: number,
  genero: string,
  sinopse: string,
  nota: number,
  diretorId: string,
  diretorNome: string
): Promise<{ sucesso: boolean; mensagem: string }> => {
  try {
    const erro = validarFilme(titulo, ano, genero, sinopse, nota, diretorId);
    if (erro) return { sucesso: false, mensagem: erro };

    const filme: Filme = criarFilme(titulo, ano, genero, sinopse, nota, diretorId, diretorNome);
    await addDoc(collection(db, "filmes"), filme);

    return { sucesso: true, mensagem: "Filme cadastrado com sucesso!" };
  } catch (error) {
    return { sucesso: false, mensagem: "Erro ao cadastrar filme." };
  }
};

// ─── LISTAR ───────────────────────────────────────────────
export const listarFilmes = async (): Promise<Filme[]> => {
  try {
    const q = query(collection(db, "filmes"), orderBy("titulo"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Filme, "id">),
    }));
  } catch (error) {
    console.error("Erro ao listar filmes:", error);
    return [];
  }
};

// ─── ATUALIZAR ────────────────────────────────────────────
export const atualizarFilme = async (
  id: string,
  dados: Partial<Filme>
): Promise<{ sucesso: boolean; mensagem: string }> => {
  try {
    if (!id) return { sucesso: false, mensagem: "ID inválido." };

    const ref = doc(db, "filmes", id);
    await updateDoc(ref, { ...dados });

    return { sucesso: true, mensagem: "Filme atualizado com sucesso!" };
  } catch (error) {
    return { sucesso: false, mensagem: "Erro ao atualizar filme." };
  }
};

// ─── DELETAR ──────────────────────────────────────────────
export const deletarFilme = async (
  id: string
): Promise<{ sucesso: boolean; mensagem: string }> => {
  try {
    if (!id) return { sucesso: false, mensagem: "ID inválido." };

    await deleteDoc(doc(db, "filmes", id));
    return { sucesso: true, mensagem: "Filme removido com sucesso!" };
  } catch (error) {
    return { sucesso: false, mensagem: "Erro ao remover filme." };
  }
};