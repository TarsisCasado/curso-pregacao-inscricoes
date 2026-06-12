/**
 * Configuração do sistema de inscrição.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ ARMAZENAMENTO EM NUVEM (Firebase / Firestore) — RECOMENDADO           │
 * └─────────────────────────────────────────────────────────────────────┘
 * As inscrições ficam guardadas em nuvem (banco de dados do Google),
 * acessíveis de qualquer dispositivo — sem precisar de planilha.
 *
 * Como configurar (passo a passo no README.md):
 *   1. Crie um projeto gratuito em https://console.firebase.google.com
 *   2. Ative o "Cloud Firestore" (modo de produção).
 *   3. Em "Configurações do projeto" → "Seus apps" → adicione um app Web (</>)
 *      e copie o objeto "firebaseConfig".
 *   4. Cole os valores em FIREBASE abaixo.
 *
 * Se FIREBASE ficar sem preencher, o sistema usa o "modo local":
 * as inscrições são salvas apenas no navegador (localStorage).
 */
window.INSCRICAO_CONFIG = {
  // Cole aqui o firebaseConfig do seu projeto (Console do Firebase).
  // Deixe os campos vazios para usar o modo local.
  FIREBASE: {
    apiKey: "AIzaSyCtMkbX0IcQJ1x2obJWit39SXrqWOidde8",
    authDomain: "curso-pregacao.firebaseapp.com",
    projectId: "curso-pregacao",
    storageBucket: "curso-pregacao.firebasestorage.app",
    messagingSenderId: "860878466477",
    appId: "1:860878466477:web:811bed2912bf11ff724524",
  },

  // Nome da "coleção" onde as inscrições serão guardadas no Firestore.
  COLLECTION: "inscricoes",

  // (Opcional) Endpoint de formulário (Formspree/Apps Script) como alternativa.
  // Só é usado se FIREBASE não estiver configurado.
  FORM_ENDPOINT: "",

  // Nome do curso (usado nas mensagens e no assunto do e-mail).
  CURSO: "Curso de Noções Básicas de Pregação e Oratória",

  // Chave de armazenamento local (fallback / cópia de segurança no aparelho).
  STORAGE_KEY: "inscricoes_curso_pregacao",
};
