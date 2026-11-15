// Camada de dados dos heróis.
//
// As telas pegam heróis SÓ pelas funções exportadas aqui (o "contrato"):
//   buscarHeroi(id)    -> um herói, ou null se o id não existir
//   buscarHerois(ids)  -> lista de heróis (ids inexistentes são ignorados)
//   listarHerois()     -> todos os heróis, em ordem alfabética
//
// Nenhuma tela importa o banco_herois.js direto. Se o formato do banco mudar
// (outro arquivo, um JSON...), só este arquivo muda.

import { HEROIS } from "./banco_herois";

// Herói no formato que as telas usam. A única diferença para o banco:
// `classe: "Lutador/Tanque"` vira `classes: ["Lutador", "Tanque"]`.
function preparar({ classe, ...resto }) {
  return { ...resto, classes: classe.split("/") };
}

// Índice por id: o Map acha um herói direto, sem percorrer o array.
// Montado uma vez só, quando o arquivo é carregado.
const heroisPorId = new Map(HEROIS.map((heroi) => [heroi.id, preparar(heroi)]));

// Ordem alfabética (pt-BR, sem diferenciar maiúsculas e acentos).
// Nomes iguais: o de id menor vem primeiro.
function compararPorNome(a, b) {
  const comparacao = a.nome.localeCompare(b.nome, "pt-BR", {
    sensitivity: "base",
    numeric: true,
  });
  return comparacao !== 0 ? comparacao : Number(a.id) - Number(b.id);
}

// Ordenada uma vez só. O freeze impede que alguém altere a lista sem querer
// (ex.: um .sort() numa tela), já que todas as telas recebem a mesma lista.
const heroisOrdenados = Object.freeze(
  [...heroisPorId.values()].sort(compararPorNome),
);

export function buscarHeroi(id) {
  return heroisPorId.get(String(id)) ?? null;
}

export function buscarHerois(ids = []) {
  return ids.map(buscarHeroi).filter(Boolean);
}

export function listarHerois() {
  return heroisOrdenados;
}
