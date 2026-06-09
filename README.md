# curso-pregacao-inscricoes

Sistema de inscrição online — **Curso de Noções Básicas de Pregação e Oratória**
(Adelziro Junior / CONADEC).

Site estático (HTML, CSS e JavaScript puro), pronto para publicar no **GitHub Pages**.

## ✨ Funcionalidades

- Página de apresentação do curso (conteúdo, informações e instrutor).
- Formulário de inscrição responsivo com validação em português:
  - nome, e-mail, telefone/WhatsApp (com máscara), idade, cidade, igreja,
    função/ministério, experiência, motivação e consentimento de dados.
- Envio das inscrições para um endpoint configurável (Formspree, Google Apps
  Script etc.). Sem endpoint, funciona em **modo local**.
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
│   ├── config.js       # Configuração (endpoint, nome do curso)
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

## ✉️ Recebendo as inscrições por e-mail

Por ser um site estático, ele não tem servidor próprio. Para receber as
inscrições por e-mail ou planilha sem manter backend:

1. Crie um formulário no [Formspree](https://formspree.io) (ou um Google Apps
   Script Web App).
2. Copie a URL de envio e cole em `FORM_ENDPOINT` no arquivo `js/config.js`:

   ```js
   window.INSCRICAO_CONFIG = {
     FORM_ENDPOINT: "https://formspree.io/f/seu-id",
     // ...
   };
   ```

Sem endpoint configurado, as inscrições ficam salvas apenas no navegador e
podem ser consultadas/exportadas em `admin.html`.

## 🧪 Rodando localmente

Basta abrir `index.html` no navegador, ou servir a pasta:

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```
