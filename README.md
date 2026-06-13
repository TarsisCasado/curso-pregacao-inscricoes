# curso-pregacao-inscricoes

Sistema de inscrição online — **Curso de Noções Básicas de Pregação e Oratória**,
ministrado por **Adelziro Junior** (curso independente).

Site estático (HTML, CSS e JavaScript puro), pronto para publicar no **GitHub Pages**.

## ✨ Funcionalidades

- Landing page elegante (azul escuro, dourado e branco) com apresentação do
  curso, do ministrante (com foto) e do investimento.
- Formulário de inscrição responsivo com validação em português:
  - **Dados pessoais:** nome, endereço completo, telefone/WhatsApp (com máscara), e-mail.
  - **Dados ministeriais:** congregação e condição ministerial (com campo "Outro").
  - **Pagamento:** forma (PIX/Dinheiro) e parcelamento (à vista / 2x).
  - **Comprovante:** upload opcional de JPG/PNG/PDF.
- **Armazenamento em nuvem (Firebase/Firestore)** — inscrições centralizadas,
  acessíveis só ao administrador, **sem planilha**.
- **Comprovantes** guardados no Firebase Storage, vinculados ao inscrito.
- **Área administrativa** (`admin.html`) com **login** (Firebase Auth):
  - Indicadores: total de inscritos, arrecadação prevista, pagamentos à vista
    e parcelados, inscrições por congregação.
  - Filtros (congregação, condição, pagamento) e busca por nome.
  - Exportação em **Excel (.xlsx)**, **PDF** e **CSV**.

## 📁 Estrutura

```
.
├── index.html          # Landing page + formulário de inscrição
├── admin.html          # Login + dashboard administrativo
├── css/styles.css      # Estilos (azul escuro / dourado / branco)
├── img/                # Foto do ministrante (adelziro.jpg)
├── js/
│   ├── config.js       # Configuração (Firebase, instrutor, valor)
│   ├── firebase.js     # Inicialização Firestore + Auth + Storage
│   └── app.js          # Validação, máscara, upload e envio
└── .github/workflows/deploy.yml  # Publicação automática no GitHub Pages
```

## 🚀 Como publicar (GitHub Pages)

1. Faça o merge na branch `main`.
2. **Settings → Pages → Source**: selecione a `main` (root) ou **GitHub Actions**.
3. O site fica em `https://<seu-usuario>.github.io/curso-pregacao-inscricoes/`.

## ⚙️ Configuração do Firebase (passos no Console)

O `js/config.js` já vem com as credenciais do projeto `curso-pregacao`. Para o
sistema funcionar por completo, ative os recursos abaixo no
[Console do Firebase](https://console.firebase.google.com):

### 1. Firestore (banco de dados) — regras de segurança

Em **Firestore Database → Regras**, cole e publique:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /inscricoes/{doc} {
      allow create: if true;                      // qualquer visitante se inscreve
      allow read, update, delete: if request.auth != null;  // só admin logado
    }
  }
}
```

### 2. Authentication (login do administrador)

1. **Build → Authentication → Começar**.
2. Em **Sign-in method**, ative **E-mail/senha**.
3. Aba **Users → Adicionar usuário**: cadastre o e-mail e a senha do
   administrador (Adelziro). Esse será o login usado em `admin.html`.
   > As senhas são armazenadas com criptografia pelo próprio Firebase.

### 3. Storage (comprovantes) — opcional

1. **Build → Storage → Começar** (pode exigir o plano *Blaze*, que tem cota
   gratuita; só é cobrado acima do limite).
2. Em **Storage → Regras**, cole e publique:

   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /comprovantes/{arquivo} {
         allow create: if true;                 // visitante envia comprovante
         allow read: if request.auth != null;   // só admin logado lê
       }
     }
   }
   ```

   Se o Storage não for ativado, a inscrição funciona normalmente — apenas o
   anexo do comprovante é ignorado.

## 🖼️ Foto do ministrante

Coloque a foto em `img/adelziro.jpg` (veja `img/LEIA-ME.txt`). Pelo site do
GitHub: pasta `img` → **Add file → Upload files** → enviar como `adelziro.jpg`.
Sem a foto, o site mostra as iniciais do instrutor automaticamente.

## 🧪 Rodando localmente

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```
