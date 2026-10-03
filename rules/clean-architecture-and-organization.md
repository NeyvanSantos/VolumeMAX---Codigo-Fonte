# Regra: Organização Contínua e Integridade das Pastas

## 1. Princípio de Integridade Estrutural
- **Sempre ao final de CADA comando, intervenção ou alteração realizada no projeto**, é **OBRIGATÓRIO** deixar o projeto sólido, limpo e profissional.
- Nunca acumular arquivos temporários, instaladores soltos na raiz ou arquivos fora de seus devidos diretórios.

## 2. Mapa Rígido de Localização
- **`src/`:** Apenas arquivos de código-fonte da interface (React, TypeScript, CSS e componentes).
- **`electron/`:** Apenas o código do processo principal (`main.js`), ponte segura (`preload.js`) e submódulos CoreAudio C# (`bin/`).
- **`installer/`:** Apenas scripts de instalação NSIS (`customInstaller.nsh`), instalador embutido (`EqualizerAPO-Installer.exe`) e termos legais (`terms.txt`).
- **`assets/`:** Apenas imagens oficiais e ícones (`.ico`, `.png`). **Nunca** coloque instaladores ou executáveis aqui.
- **`release/`:** Apenas os executáveis e instaladores gerados oficialmente.
- **`scripts/`:** Apenas scripts utilitários de automação, publicação e CI/CD (ex: `publish-release.js`).
- **`rules/`:** Apenas as regras exclusivas do projeto.
- **Raiz do Projeto:** Deve conter exclusivamente os arquivos de configuração (`package.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore`, `README.md`).

## 3. Notificação Obrigatória ao Usuário
- Ao concluir qualquer resposta após alterações, o assistente **DEVE SEMPRE avisar explicitamente** que a checagem de organização das pastas e a integridade do projeto foram executadas e que a estrutura permanece sólida e fluida.
