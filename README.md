# RPG Campaign Manager 

Um gerenciador de campanhas de RPG colaborativo, focado em escrita rica, organização de documentos e menções inteligentes entre arquivos. Desenvolvido com **Next.js** (Frontend) e **Go** (Backend).

## Funcionalidades

- **Editor Colaborativo**: Edição em tempo real usando Yjs e WebSockets.
- **Mentions Inteligentes**: Use `@` para citar outros documentos, personagens ou locais.
- **Organização por Pastas**: Gerencie suas campanhas com uma estrutura de arquivos intuitiva.
- **Templates**: Crie esqueletos de documentos para agilizar a criação de NPCs, Missões e mais.
- **Design Premium**: Interface escura e moderna com temática RPG.

## Como Rodar o Projeto

### Pré-requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

### Configuração
1. Clone o repositório:
   ```bash
   git clone https://github.com/CaioIOX/rpg-manager.git
   cd rpg-manager
   ```

2. Crie e configure o arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Preencha as variáveis conforme as instruções internas do arquivo.*

### Execução com Docker
Para subir todos os serviços (Banco de Dados, Backend e Frontend):
```bash
docker-compose up --build -d
```
Acesse `http://localhost:3000` (ou o domínio da sua VPS).

Desenvolvido por [CaioIOX](https://github.com/CaioIOX).