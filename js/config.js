/**
 * Configuração do sistema de inscrição.
 *
 * ARMAZENAMENTO EM NUVEM (Firebase / Firestore)
 * As inscrições ficam guardadas em nuvem (banco de dados do Google),
 * acessíveis apenas ao administrador autenticado — sem planilha.
 * Passo a passo de configuração no README.md.
 */
window.INSCRICAO_CONFIG = {
  // Credenciais do projeto Firebase (Console do Firebase → Configurações).
  FIREBASE: {
    apiKey: "AIzaSyCtMkbX0IcQJ1x2obJWit39SXrqWOidde8",
    authDomain: "curso-pregacao.firebaseapp.com",
    projectId: "curso-pregacao",
    storageBucket: "curso-pregacao.firebasestorage.app",
    messagingSenderId: "860878466477",
    appId: "1:860878466477:web:811bed2912bf11ff724524",
  },

  // Coleção do Firestore onde as inscrições são guardadas.
  COLLECTION: "inscricoes",

  // Pasta no Firebase Storage para os comprovantes de pagamento.
  STORAGE_FOLDER: "comprovantes",

  // ----- Conteúdo do curso -----
  CURSO: "Curso de Noções Básicas de Pregação e Oratória",

  INSTRUTOR: {
    nome: "Adelziro Junior",
    // Foto do ministrante. Coloque o arquivo em img/adelziro.jpg
    // (ou troque o caminho/URL aqui). Se não existir, mostra as iniciais.
    foto: "img/adelziro.jpg.jpg",
    bio:
      "Curso ministrado por Adelziro Junior, Graduado em Bacharel em Teologia " +
      "e Presidente do Conselho de Doutrina, Educação e Cultura da CONADEC.",
  },

  // Investimento (R$). Usado no site e no cálculo de arrecadação prevista.
  VALOR: 100,

  // (Opcional) Endpoint Formspree, usado só se o Firebase não estiver configurado.
  FORM_ENDPOINT: "",

  // Chave de armazenamento local (cópia de segurança no aparelho).
  STORAGE_KEY: "inscricoes_curso_pregacao",
};
