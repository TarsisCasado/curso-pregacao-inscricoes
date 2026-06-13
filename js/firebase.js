/**
 * Inicializa o Firebase (Firestore, Auth e Storage) se houver configuração.
 * Expõe:
 *   window.FIRESTORE       — banco de dados (ou null em modo local)
 *   window.FIREBASE_AUTH   — autenticação do admin (ou null)
 *   window.FIREBASE_STORAGE— armazenamento de comprovantes (ou null)
 *
 * Usa o SDK "compat" do Firebase, carregado via CDN no HTML.
 */
(function () {
  "use strict";

  var cfg = (window.INSCRICAO_CONFIG || {}).FIREBASE || {};
  window.FIRESTORE = null;
  window.FIREBASE_AUTH = null;
  window.FIREBASE_STORAGE = null;
  window.FIREBASE_READY = false;

  if (!cfg.apiKey || !cfg.projectId) {
    return; // Modo local: sem configuração de nuvem.
  }

  if (typeof firebase === "undefined") {
    console.error("Firebase SDK não carregou. Verifique os scripts no HTML.");
    return;
  }

  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(cfg);
    }
    window.FIRESTORE = firebase.firestore();
    if (firebase.auth) window.FIREBASE_AUTH = firebase.auth();
    if (firebase.storage) window.FIREBASE_STORAGE = firebase.storage();
    window.FIREBASE_READY = true;
  } catch (e) {
    console.error("Falha ao inicializar o Firebase:", e);
  }
})();
