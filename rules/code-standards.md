# Regra: Padrões de Código e Estrutura de Pastas

## 1. Organização Rígida de Pastas
O projeto deve manter sempre a separação limpa das responsabilidades:

- `src/`: Todo o código de frontend (React, TypeScript, CSS).
- `electron/`: Todo o código de backend desktop (Node.js Electron e C# CoreAudio).
- `installer/`: Exclusivo para recursos do instalador NSIS (`customInstaller.nsh`, `EqualizerAPO-Installer.exe`, `terms.txt`).
- `assets/`: Apenas recursos visuais oficiais (ícones `.ico`, `.png` e imagens). **PROIBIDO** armazenar executáveis ou instaladores em `assets/`.
- `release/`: Apenas os instaladores finais gerados (`.exe`).
- **Raiz do Projeto:** Deve conter apenas arquivos de configuração (`package.json`, `tsconfig.json`, `vite.config.ts`, `.gitignore`, `README.md`). **NUNCA** deixe arquivos de instalação soltos na raiz.

## 2. Padrões de Código Frontend
- **React 18 + TypeScript:** Tipagem estrita em `src/types/audio.ts`. Nunca use `any` sem justificativa sólida.
- **CSS:** Vanilla CSS puro com tokens HSL e variáveis no `:root` (`src/index.css`). Evite Tailwind a menos que explicitamente solicitado.
- **Sem Erros de Tipagem:** Antes de qualquer entrega, valide com `npx tsc --noEmit` e `npm run build`.

## 3. Padrões do Backend Electron
- `contextIsolation: true` e `nodeIntegration: false` são obrigatórios para segurança.
- Toda comunicação com o sistema operacional deve passar pelo `preload.js` através da API exposta em `window.volumemax`.
- Operações com C# CoreAudio devem utilizar o binário pré-compilado [`electron/bin/VolumeBridge.exe`](file:///g:/VolumeMax/electron/bin/VolumeBridge.exe) via IPC.
