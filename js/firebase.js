/**
 * Inicializa o Firebase/Firestore se houver configuração válida.
 * Expõe window.FIRESTORE (instância) ou null (modo local).
 *
 * Usa o SDK "compat" do Firebase, carregado via CDN no HTML.
 */
(function () {
  "use strict";

  var cfg = (window.INSCRICAO_CONFIG || {}).FIREBASE || {};
  window.FIRESTORE = null;
  window.FIREBASE_READY = false;

  var configurado = cfg.apiKey && cfg.projectId;

  if (!configurado) {
    // Modo local: nenhuma configuração de nuvem informada.
    return;
  }

  if (typeof firebase === "undefined") {
    console.error(
      "Firebase SDK não carregou. Verifique se os scripts do Firebase " +
      "estão incluídos no HTML antes de firebase.js."
    );
    return;
  }

  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(cfg);
    }
    window.FIRESTORE = firebase.firestore();
    window.FIREBASE_READY = true;
  } catch (e) {
    console.error("Falha ao inicializar o Firebase:", e);
  }
})();
