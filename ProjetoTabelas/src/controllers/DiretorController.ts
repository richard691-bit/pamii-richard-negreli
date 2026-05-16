import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy,} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Diretor, criarDiretor } from "../models/DiretorModel";

// ─── VALIDAÇÕES ───────────────────────────────────────────
const validarDiretor = (
  nome: string,
  nacionalidade: string,
  dataNascimento: string
): string | null => {
  if (!nome || nome.trim().length < 3)
    return "Nome deve ter pelo menos 3 caracteres.";

  if (!nacionalidade || nacionalidade.trim().length < 3)
    return "Nacionalidade deve ter pelo menos 3 caracteres.";

  if (!dataNascimento)
    return "Data de nascimento é obrigatória.";

  const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dataRegex.test(dataNascimento))
    return "Data deve estar no formato DD/MM/AAAA.";

  const [dia, mes, ano] = dataNascimento.split("/").map(Number);
  const data = new Date(ano, mes - 1, dia);
  const hoje = new Date();

  if (data >= hoje)
    return "Data de nascimento deve ser no passado.";

  if (ano < 1880)
    return "Data de nascimento inválida.";

  return null;
};

// ─── CADASTRAR ────────────────────────────────────────────
export const cadastrarDiretor = async (
  nome: string,
  nacionalidade: string,
  dataNascimento: string,
  premiado: boolean
): Promise<{ sucesso: boolean; mensagem: string }> => {
  try {
    const erro = validarDiretor(nome, nacionalidade, dataNascimento);
    if (erro) return { sucesso: false, mensagem: erro };

    const diretor: Diretor = criarDiretor(nome, nacionalidade, dataNascimento, premiado);
    await addDoc(collection(db, "diretores"), diretor);

    return { sucesso: true, mensagem: "Diretor cadastrado com sucesso!" };
  } catch (error) {
    return { sucesso: false, mensagem: "Erro ao cadastrar diretor." };
  }
};

// ─── LISTAR ───────────────────────────────────────────────
export const listarDiretores = async (): Promise<Diretor[]> => {
  try {
    const q = query(collection(db, "diretores"), orderBy("nome"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Diretor, "id">),
    }));
  } catch (error) {
    console.error("Erro ao listar diretores:", error);
    return [];
  }
};

// ─── ATUALIZAR ────────────────────────────────────────────
export const atualizarDiretor = async (
  id: string,
  dados: Partial<Diretor>
): Promise<{ sucesso: boolean; mensagem: string }> => {
  try {
    if (!id) return { sucesso: false, mensagem: "ID inválido." };

    const ref = doc(db, "diretores", id);
    await updateDoc(ref, { ...dados });

    return { sucesso: true, mensagem: "Diretor atualizado com sucesso!" };
  } catch (error) {
    return { sucesso: false, mensagem: "Erro ao atualizar diretor." };
  }
};

// ─── DELETAR ──────────────────────────────────────────────
export const deletarDiretor = async (
  id: string
): Promise<{ sucesso: boolean; mensagem: string }> => {
  try {
    if (!id) return { sucesso: false, mensagem: "ID inválido." };

    await deleteDoc(doc(db, "diretores", id));
    return { sucesso: true, mensagem: "Diretor removido com sucesso!" };
  } catch (error) {
    return { sucesso: false, mensagem: "Erro ao remover diretor." };
  }
};