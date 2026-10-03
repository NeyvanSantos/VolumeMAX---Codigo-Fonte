# Regra: Sincronização Obrigatória com o GitHub

## 1. Princípio de Sincronização Contínua
- **Sempre ao final de cada intervenção, comando ou alteração realizada no código-fonte**, é **OBRIGATÓRIO** salvar, realizar o commit e enviar (`git push origin main`) as mudanças para o repositório no GitHub:
  - Repositório: [`github.com/NeyvanSantos/VolumeMAX---Codigo-Fonte`](https://github.com/NeyvanSantos/VolumeMAX---Codigo-Fonte)
- O código local e o repositório remoto devem estar **rigorosamente em paridade** ao término de cada tarefa.

## 2. Padrão de Commits
- As mensagens de commit devem ser claras, semânticas e descrever objetivamente o que foi implementado ou alterado (ex: `feat: ...`, `fix: ...`, `docs: ...`, `refactor: ...`).

## 3. Preservação e Limpeza
- Antes de realizar o push, sempre verificar com `git status` se não há arquivos temporários, arquivos pesados de build (`release/`, `dist/`, `node_modules/`) ou credenciais sendo commitados por engano.
- Somente arquivos de código-fonte, configurações oficiais, documentação e regras devem subir para o repositório remoto.
