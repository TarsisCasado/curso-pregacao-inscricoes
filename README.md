# curso-pregacao-inscricoes

Sistema de inscrição online — **Curso de Noções Básicas de Pregação e Oratória**
(Adelziro Junior / CONADEC).

Site estático (HTML, CSS e JavaScript puro), pronto para publicar no **GitHub Pages**.

## ✨ Funcionalidades

- Página de apresentação do curso (conteúdo, informações e instrutor).
- Formulário de inscrição responsivo com validação em português:
  - nome, e-mail, telefone/WhatsApp (com máscara), idade, cidade, igreja,
    função/ministério, experiência, motivação e consentimento de dados.
- **Armazenamento em nuvem (Firebase/Firestore)** — as inscrições ficam
  guardadas em um banco de dados gratuito do Google, acessíveis de qualquer
  dispositivo, **sem planilha**. (Alternativas: endpoint Formspree ou modo local.)
- Cópia de segurança das inscrições no navegador (`localStorage`).
- **Área administrativa** (`admin.html`) para visualizar e exportar as
  inscrições em **CSV** ou **JSON**.

## 📁 Estrutura

```
.
├── index.html          # Página principal + formulário de inscrição
├── admin.html          # Painel para visualizar/exportar inscrições
├── css/styles.css      # Estilos
├── js/
│   ├── config.js       # Configuração (Firebase, endpoint, nome do curso)
│   ├── firebase.js     # Inicialização do Firebase/Firestore
│   └── app.js          # Validação, máscara e envio
└── .github/workflows/deploy.yml  # Publicação automática no GitHub Pages
```

## 🚀 Como publicar (GitHub Pages)

1. Faça o merge deste conteúdo na branch `main`.
2. No repositório, vá em **Settings → Pages**.
3. Em **Build and deployment → Source**, selecione **GitHub Actions**.
4. A cada push na `main`, o workflow publica o site automaticamente.

O site ficará disponível em:
`https://<seu-usuario>.github.io/curso-pregacao-inscricoes/`

## ☁️ Guardando as inscrições em nuvem (Firebase) — recomendado

Assim as inscrições ficam num banco de dados gratuito do Google, acessíveis de
qualquer dispositivo — **sem planilha** e sem manter servidor.

### Passo a passo

1. Acesse o [Console do Firebase](https://console.firebase.google.com) e clique
   em **Adicionar projeto** (pode usar sua conta Google). Dê um nome
   (ex.: `curso-pregacao`) e conclua a criação.
2. No menu lateral, abra **Build → Firestore Database** e clique em
   **Criar banco de dados**. Escolha uma região (ex.: `southamerica-east1`) e
   inicie em **modo de produção**.
3. Registre um app Web: clique no ícone **`</>`** na visão geral do projeto,
   dê um apelido e **copie o objeto `firebaseConfig`** que aparece.
4. Cole esses valores em `js/config.js`, no campo `FIREBASE`:

   ```js
   window.INSCRICAO_CONFIG = {
     FIREBASE: {
       apiKey: "AIza...",
       authDomain: "curso-pregacao.firebaseapp.com",
       projectId: "curso-pregacao",
       storageBucket: "curso-pregacao.appspot.com",
       messagingSenderId: "123456789",
       appId: "1:123...:web:abc...",
     },
     COLLECTION: "inscricoes",
     // ...
   };
   ```

5. **Regras de segurança do Firestore.** Em **Firestore → Regras**, cole o
   bloco abaixo. Ele permite que qualquer visitante *crie* uma inscrição, mas
   só você (autenticado) consegue *ler/apagar* — protegendo os dados pessoais:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /inscricoes/{doc} {
         allow create: if true;
         allow read, update, delete: if request.auth != null;
       }
     }
   }
   ```

   > **Importante:** com essas regras, a página `admin.html` precisa de login
   > para listar as inscrições. A forma mais simples de ver os dados é pelo
   > próprio **Console do Firebase → Firestore Database**. Se preferir abrir o
   > `admin.html` sem login (apenas para testes), troque a linha de leitura por
   > `allow read: if true;` — mas aí qualquer pessoa com o link conseguiria ver
   > os dados, o que **não é recomendado** por causa da LGPD.

6. Faça commit e publique. Pronto: cada inscrição aparece no Firestore.

### Alternativa simples: Formspree (por e-mail)

Se preferir receber cada inscrição por e-mail sem configurar banco, crie um
formulário no [Formspree](https://formspree.io) e cole a URL em `FORM_ENDPOINT`
no `js/config.js` (deixe `FIREBASE` em branco).

Sem Firebase nem endpoint, as inscrições ficam salvas apenas no navegador
(modo local) e podem ser exportadas em `admin.html`.

## 🧪 Rodando localmente

Basta abrir `index.html` no navegador, ou servir a pasta:

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```
