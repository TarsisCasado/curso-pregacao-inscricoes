/**
 * Configuração do sistema de inscrição.
 *
 * Para receber as inscrições por e-mail sem manter um servidor, use um
 * serviço de formulários como o Formspree (https://formspree.io) ou um
 * Google Apps Script Web App.
 *
 * 1. Crie um formulário no serviço escolhido.
 * 2. Cole a URL de envio (endpoint) em FORM_ENDPOINT abaixo.
 *
 * Se FORM_ENDPOINT ficar vazio, o sistema funciona em "modo local":
 * as inscrições são salvas no navegador (localStorage) e podem ser
 * visualizadas e exportadas em CSV na página admin.html.
 */
window.INSCRICAO_CONFIG = {
  // Ex.: "https://formspree.io/f/seu-id"
  FORM_ENDPOINT: "",

  // Nome do curso (usado nas mensagens e no assunto do e-mail).
  CURSO: "Curso de Noções Básicas de Pregação e Oratória",

  // Chave de armazenamento local.
  STORAGE_KEY: "inscricoes_curso_pregacao",
};
