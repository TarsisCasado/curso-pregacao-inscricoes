(function () {
  "use strict";

  var CONFIG = window.INSCRICAO_CONFIG || {};
  var STORAGE_KEY = CONFIG.STORAGE_KEY || "inscricoes_curso_pregacao";

  var form = document.getElementById("form-inscricao");
  var success = document.getElementById("form-success");
  var btnEnviar = document.getElementById("btn-enviar");
  var btnNova = document.getElementById("btn-nova");
  var anoEl = document.getElementById("ano");

  if (anoEl) anoEl.textContent = new Date().getFullYear();

  // ---- Instrutor (nome, foto, bio configuráveis) ----
  (function preencheInstrutor() {
    var inst = CONFIG.INSTRUTOR || {};
    var nomeEl = document.getElementById("instrutor-nome");
    var bioEl = document.getElementById("instrutor-bio");
    var fotoEl = document.getElementById("instrutor-foto");
    if (nomeEl && inst.nome) nomeEl.textContent = inst.nome;
    if (bioEl && inst.bio) bioEl.textContent = inst.bio;
    if (fotoEl) {
      if (inst.foto) {
        fotoEl.src = inst.foto;
        fotoEl.onerror = function () { mostraIniciais(fotoEl, inst.nome); };
      } else {
        mostraIniciais(fotoEl, inst.nome);
      }
    }
  })();

  function mostraIniciais(imgEl, nome) {
    var span = document.createElement("div");
    span.className = "instructor__photo instructor__placeholder";
    span.textContent = (nome || "?")
      .split(/\s+/).slice(0, 2).map(function (p) { return p.charAt(0); }).join("").toUpperCase();
    if (imgEl.parentNode) imgEl.parentNode.replaceChild(span, imgEl);
  }

  // ---- Máscara de telefone ----
  var telefone = document.getElementById("telefone");
  if (telefone) {
    telefone.addEventListener("input", function () {
      var v = telefone.value.replace(/\D/g, "").slice(0, 11);
      if (v.length > 6) {
        telefone.value = v.replace(/(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3").replace(/-$/, "");
      } else if (v.length > 2) {
        telefone.value = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
      } else if (v.length > 0) {
        telefone.value = v.replace(/(\d{0,2})/, "($1");
      }
    });
  }

  // ---- Campo condicional "Outro" ----
  var condicao = document.getElementById("condicao");
  var campoOutro = document.getElementById("campo-outro");
  var condicaoOutro = document.getElementById("condicao_outro");
  if (condicao && campoOutro) {
    condicao.addEventListener("change", function () {
      campoOutro.hidden = condicao.value !== "Outro";
    });
  }

  // ---- Validação ----
  function setError(name, message) {
    var input = form.elements[name];
    var errEl = form.querySelector('[data-error-for="' + name + '"]');
    if (input && input.classList) input.classList.toggle("invalid", !!message);
    if (errEl) errEl.textContent = message || "";
  }

  function reqText(name, min, msg) {
    var v = (new FormData(form).get(name) || "").trim();
    if (v.length < (min || 1)) { setError(name, msg); return false; }
    setError(name, ""); return true;
  }

  function validate() {
    var ok = true;
    var data = new FormData(form);

    if (!reqText("nome", 3, "Informe seu nome completo.")) ok = false;
    if (!reqText("endereco", 5, "Informe seu endereço completo.")) ok = false;

    var email = (data.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", "E-mail inválido."); ok = false; }
    else setError("email", "");

    var tel = (data.get("telefone") || "").replace(/\D/g, "");
    if (tel.length < 10) { setError("telefone", "Informe um telefone válido com DDD."); ok = false; }
    else setError("telefone", "");

    if (!reqText("congregacao", 2, "Informe sua congregação.")) ok = false;

    if (!data.get("condicao")) { setError("condicao", "Selecione a condição ministerial."); ok = false; }
    else setError("condicao", "");

    if (data.get("condicao") === "Outro" && !(data.get("condicao_outro") || "").trim()) {
      setError("condicao_outro", "Especifique a condição ministerial."); ok = false;
    } else setError("condicao_outro", "");

    if (!data.get("forma_pagamento")) { setError("forma_pagamento", "Selecione a forma de pagamento."); ok = false; }
    else setError("forma_pagamento", "");

    if (!data.get("parcelamento")) { setError("parcelamento", "Selecione o parcelamento."); ok = false; }
    else setError("parcelamento", "");

    var file = data.get("comprovante");
    if (file && file.size) {
      if (file.size > 5 * 1024 * 1024) { setError("comprovante", "Arquivo maior que 5 MB."); ok = false; }
      else if (!/(jpe?g|png|pdf)$/i.test(file.name)) { setError("comprovante", "Use JPG, PNG ou PDF."); ok = false; }
      else setError("comprovante", "");
    } else setError("comprovante", "");

    if (!form.elements["consentimento"].checked) {
      setError("consentimento", "É necessário autorizar o uso dos dados."); ok = false;
    } else setError("consentimento", "");

    return ok;
  }

  function collect() {
    var data = new FormData(form);
    var obj = {};
    data.forEach(function (value, key) {
      if (key === "comprovante") return; // tratado à parte
      obj[key] = typeof value === "string" ? value.trim() : value;
    });
    obj.consentimento = form.elements["consentimento"].checked;
    // Normaliza a condição ministerial.
    if (obj.condicao === "Outro" && obj.condicao_outro) {
      obj.condicao = obj.condicao_outro.trim();
    }
    delete obj.condicao_outro;
    obj.curso = CONFIG.CURSO || "";
    obj.valor = CONFIG.VALOR || null;
    obj.comprovanteUrl = "";
    obj.dataInscricao = new Date().toISOString();
    return obj;
  }

  function saveLocal(record) {
    try {
      var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      list.push(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Não foi possível salvar localmente:", e);
    }
  }

  function showSuccess() {
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Faz upload do comprovante (se houver) e retorna a URL pública.
  function uploadComprovante() {
    var file = form.elements["comprovante"] && form.elements["comprovante"].files[0];
    if (!file || !window.FIREBASE_STORAGE) return Promise.resolve("");
    var folder = CONFIG.STORAGE_FOLDER || "comprovantes";
    var nome = Date.now() + "_" + file.name.replace(/[^\w.\-]/g, "_");
    var ref = window.FIREBASE_STORAGE.ref(folder + "/" + nome);
    return ref.put(file).then(function (snap) {
      return snap.ref.getDownloadURL();
    }).catch(function (err) {
      console.warn("Falha no upload do comprovante (a inscrição segue normalmente):", err);
      return "";
    });
  }

  function sendToEndpoint(record) {
    return fetch(CONFIG.FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(record),
    }).then(function (res) {
      if (!res.ok) throw new Error("Falha no envio (" + res.status + ")");
      return res;
    });
  }

  function sendToFirestore(record) {
    var col = CONFIG.COLLECTION || "inscricoes";
    return window.FIRESTORE.collection(col).add(record);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var record = collect();
    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";

    var done = function () {
      saveLocal(record);
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Realizar inscrição";
      showSuccess();
    };

    var falhaEnvio = function (err) {
      console.error(err);
      saveLocal(record);
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Realizar inscrição";
      alert(
        "Não foi possível enviar agora, mas sua inscrição foi salva neste " +
        "dispositivo. Por favor, tente novamente ou entre em contato."
      );
    };

    // 1) Upload do comprovante (se houver); 2) grava a inscrição.
    uploadComprovante().then(function (url) {
      record.comprovanteUrl = url || "";
      if (window.FIRESTORE) {
        return sendToFirestore(record).then(done);
      } else if (CONFIG.FORM_ENDPOINT) {
        return sendToEndpoint(record).then(done);
      }
      return new Promise(function (r) { setTimeout(function () { done(); r(); }, 400); });
    }).catch(falhaEnvio);
  });

  if (btnNova) {
    btnNova.addEventListener("click", function () {
      form.reset();
      if (campoOutro) campoOutro.hidden = true;
      form.hidden = false;
      success.hidden = true;
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();
