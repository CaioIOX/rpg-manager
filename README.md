# RPG Campaign Manager

Um gerenciador de campanhas de RPG colaborativo, focado em escrita rica, organização de documentos e ferramentas inteligentes para Mestres e Jogadores. Desenvolvido com uma arquitetura moderna (Next.js e Go) para garantir velocidade e confiabilidade.

## Funcionalidades

- **Editor de Texto Rico (Rich Text)**: Crie documentos detalhados para sua história, personagens e itens.
- **Lorena - A Guardiã do Conhecimento (IA)**: Uma inteligência artificial integrada baseada em seus documentos. Faça perguntas sobre a sua campanha e a Lorena lerá suas anotações para responder ativamente e com contexto, alimentada pela IA!
- **Mapas Interativos da Campanha**: Faça upload dos mapas do seu mundo ou masmorras e adicione marcadores interativos em tempo real para acompanhar locais e eventos vitais.
- **Menções Inteligentes (@)**: Conecte seu mundo de forma rápida. Digite `@` no meio do texto para citar outros documentos existentes em sua campanha instantaneamente.
- **Suporte a Múltiplos Idiomas**: Totalmente traduzido e disponível em Português e Inglês.

---

## Como Rodar o Projeto (Para Iniciantes / Públicos em Geral)

Se você não tem costume com programação, uso de "Git" ou linhas de código, não se preocupe! Siga este passo a passo para fazer o projeto rodar no seu computador:

### Passo 1: O que você precisa baixar?
O programa usa uma tecnologia chamada **Docker**. Ela garante que tudo que é preciso para o jogo funcionar seja instalado automaticamente em segundo plano.
1. Acesse o site e baixe o aplicativo [Docker Desktop para Windows (ou Mac)](https://www.docker.com/products/docker-desktop/).
2. Instale o programa no seu computador (é só seguir avançando na instalação).
3. Talvez ele peça para criar uma conta e acessar, pode criar (é gratuito).
4. Deixe o aplicativo do Docker **aberto**. Ele deve aparecer na barra de relógio do Windows depois de pronto.

### Passo 2: Baixando o Código do RPG Manager
Você não precisa de comandos de desenvolvedor, basta baixar os arquivos na própria página:
1. No topo desta página aqui do GitHub, procure um grande botão **Verde** escrito **"<> Code"**.
2. Clique nele e escolha a última opção: **"Download ZIP"**.
3. Assim que o download concluir, clique com o botão direito no arquivo baixado (`.zip`) e extraia a pasta para a sua _Área de Trabalho_ (ou onde preferir para ficar fácil de achar).
4. Abra a pasta principal chamada `rpg-manager`.

### Passo 3: Configuração Inicial
O sistema precisa saber como "ligar as chaves" de segurança. Mas já está tudo pronto! Só precisamos confirmar algumas coisas.
1. Dentro da pasta que você extraiu as coisas, procure um arquivo com o nome `.env.example`.
2. **Copie e cole** este arquivo lá mesmo. Ficará algo como "`.env.example - Copia`".
3. Clique com o botão direito nessa cópia e mande **Renomear**.
4. Mude o nome do arquivo para apenas: `.env` (certifique-se de apagar a parte do "- Copia" e do "example"). Pressione Enter e confirme caso o Windows pergunte se tem certeza.

### Passo 3.5: Configurando Email e IA (Importante!)
Algumas funcionalidades (como a IA Lorena e a recuperação de senhas) precisam de chaves virtuais gratuitas para funcionar.
1. Clique no seu arquivo `.env` com o botão direito do mouse, escolha **"Abrir com"** e selecione o **"Bloco de Notas"** (ou qualquer outro editor de texto).
2. **Para a Inteligência Artificial (Lorena)**: Acesse o [Google AI Studio](https://aistudio.google.com/app/apikey) usando sua conta do Google, crie uma "API Key" gratuita e cole-a no lugar do texto `sua-gemini-api-key-aqui` na linha que diz `GEMINI_API_KEY=`.
3. **Para Envio de E-mails (Recuperar Senha)**: O projeto usa a plataforma **Brevo**. Crie uma conta gratuita no Brevo, defina um remetente e pegue suas informações de "SMTP e API". Depois, preencha as linhas do bloco de notas que começam com `SMTP_` (como `SMTP_USER` com seu e-mail de login, e `SMTP_PASSWORD` com a senha SMTP fornecida por eles).
4. Salve o arquivo (Arquivo > Salvar ou Ctrl+S) e feche o Bloco de Notas.

### Passo 4: Iniciando a Magia
1. Ainda dentro dessa mesma pasta, segure a tecla **Shift** no seu teclado.
2. Com o Shift segurado, clique com o botão **Direito** do mouse no espaço em branco (vazio) da janela.
3. Escolha a opção **"Abrir janela do PowerShell aqui"** ou **"Abrir no Terminal"** (se estiver usando o Windows 11).
4. Uma tela preta com letras vai abrir. Calma! Apenas digite ou copie e cole exatamente este comando abaixo e aperte **Enter**:
   ```bash
   docker compose up --build -d
   ```
5. Agora é só esperar. Na primeira vez que você fizer isso, o computador vai baixar peças do servidor e configurar tudo para você. Pode demorar alguns minutos.
6. Quando o terminal listar linhas dizendo `Started` verde e deixar você escrever novos comandos, estará tudo pronto.

### Passo 5: Usando e Jogando! 
1. Abra o navegador que você usa de costume (Chrome, Firefox, Safari...).
2. Digite na barra de endereços: `http://localhost:3000` (assim mesmo, e depois aperte enter).
3. **Pronto!** Você acabou de acessar o seu RPG Manager rodando no próprio PC! Basta "Criar Conta" na página incial se cadastrando e usar.

> **Como desligar?** Quando não quiser mais usar e for desligar ou fazer algo pesado no PC, lá naquela tela preta novamente (terminal) escreva `docker compose down` e aperte enter.

---

## Para Desenvolvedores (Git e Linha de Comando)

Se você já lida com desenvolvimento, Github e usa CLI:

1. Clone o repositório:
   ```bash
   git clone https://github.com/CaioIOX/rpg-manager.git
   cd rpg-manager
   ```
2. Crie e preencha as variáveis de ambiente base:
   ```bash
   cp .env.example .env
   ```
   *(Cuidado: Caso deseje utilizar o chat da AI "Lorena", é preciso adicionar a sua respectiva `GEMINI_API_KEY` dentro do arquivo `.env`).*
3. Suba as instâncias dos containers:
   ```bash
   docker compose up --build -d
   ```
4. Acesse tudo rodando em `http://localhost:3000`.

---

## Licença

Este projeto está licenciado sob a **GNU Affero General Public License v3 (AGPLv3)**. Isso significa que você é livre para usar, modificar e distribuir o código, desde que as versões modificadas também sejam distribuídas sob a mesma licença e o código-fonte seja disponibilizado para os usuários que interagem com o software através de uma rede.

---
Desenvolvido por [CaioIOX](https://github.com/CaioIOX)