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

  // ---- Validação ----
  function setError(name, message) {
    var input = form.elements[name];
    var errEl = form.querySelector('[data-error-for="' + name + '"]');
    if (input && input.classList) input.classList.toggle("invalid", !!message);
    if (errEl) errEl.textContent = message || "";
  }

  function validate() {
    var ok = true;
    var data = new FormData(form);

    var nome = (data.get("nome") || "").trim();
    if (nome.length < 3) { setError("nome", "Informe seu nome completo."); ok = false; }
    else setError("nome", "");

    var email = (data.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", "E-mail inválido."); ok = false; }
    else setError("email", "");

    var tel = (data.get("telefone") || "").replace(/\D/g, "");
    if (tel.length < 10) { setError("telefone", "Informe um telefone válido com DDD."); ok = false; }
    else setError("telefone", "");

    var idade = data.get("idade");
    if (idade && (Number(idade) < 10 || Number(idade) > 120)) {
      setError("idade", "Idade inválida."); ok = false;
    } else setError("idade", "");

    if (!form.elements["consentimento"].checked) {
      setError("consentimento", "É necessário autorizar o uso dos dados."); ok = false;
    } else setError("consentimento", "");

    return ok;
  }

  function collect() {
    var data = new FormData(form);
    var obj = {};
    data.forEach(function (value, key) {
      obj[key] = typeof value === "string" ? value.trim() : value;
    });
    obj.consentimento = form.elements["consentimento"].checked;
    obj.curso = CONFIG.CURSO || "";
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
      btnEnviar.textContent = "Confirmar inscrição";
      showSuccess();
    };

    if (CONFIG.FORM_ENDPOINT) {
      sendToEndpoint(record).then(done).catch(function (err) {
        console.error(err);
        // Mesmo com erro de rede, mantemos a cópia local para não perder o dado.
        saveLocal(record);
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Confirmar inscrição";
        alert(
          "Não foi possível enviar agora, mas sua inscrição foi salva neste " +
          "dispositivo. Por favor, tente novamente ou entre em contato."
        );
      });
    } else {
      // Modo local (sem endpoint configurado).
      setTimeout(done, 400);
    }
  });

  if (btnNova) {
    btnNova.addEventListener("click", function () {
      form.reset();
      form.hidden = false;
      success.hidden = true;
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();
