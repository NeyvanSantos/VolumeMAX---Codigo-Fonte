# VolumeMax — Amplificador de Volume Profissional para Windows

> **VolumeMax** é um utilitário desktop moderno e ultraleve para Windows, projetado para elevar o volume do sistema operacional além do limite padrão de 100%, alcançando até **500% (+14 dB)** com alta fidelidade sonora e controle de mixagem por aplicativo.

---

## ⚡ Principais Recursos

- 🔊 **Super Amplificação (0% a 500%):** Controle de ganho estendido em tempo real sem latência.
- 🎚️ **Mixer por Aplicativo (Per-App Audio):** Controle o volume de cada aplicativo em execução (Spotify, Chrome, Discord, jogos, etc.) de forma individual.
- 📊 **VU Meter Estéreo em Tempo Real:** Medidor estéreo L/R com detecção dinâmica de clipping.
- 🎛️ **Perfis de Áudio Pré-configurados:** Alternância rápida entre perfis otimizados (*Música*, *Filme*, *Reunião*, *Gaming*).
- ⌨️ **Atalhos Globais do Teclado:**
  - `Ctrl + Shift + Seta para Cima`: Aumentar Boost (+10%)
  - `Ctrl + Shift + Seta para Baixo`: Diminuir Boost (-10%)
- 🪟 **Interface Flyout Moderna:** Abre diretamente da bandeja do sistema (*System Tray*) acima da barra de tarefas, com tema escuro e animações fluidas.
- 🛡️ **Motor Nativo via Equalizer APO:** Opera integrado diretamente ao driver de áudio do Windows (*Audio Processing Object*). Zero placas virtuais, zero programas terceiros invasivos e zero consumo desnecessário de CPU.
- 📦 **Instalador Inteligente (NSIS):** Instalador visual com Termos de Uso, verificação automática do Equalizer APO e integração segura.

---

## 📁 Estrutura do Projeto

```text
VolumeMax/
├── assets/                     # Recursos visuais (ícones, logos, assets do tray)
│   ├── icon.ico                # Ícone principal do aplicativo
│   ├── icon.png                # Ícone em alta resolução (PNG)
│   └── tray.png                # Ícone da bandeja do sistema
│
├── electron/                   # Backend desktop (Electron e C# CoreAudio)
│   ├── main.js                 # Processo principal, atalhos globais, IPC e controle de áudio
│   ├── preload.js              # Context Bridge seguro (IPC Renderer)
│   └── bin/
│       ├── VolumeBridge.cs     # Módulo C# CoreAudio (WASAPI, EndpointVolume e AudioSessions)
│       └── VolumeBridge.exe    # Binário compilado de alta performance
│
├── installer/                  # Recursos e automação do instalador Windows (NSIS)
│   ├── customInstaller.nsh     # Script NSIS com Termos de Uso e verificação de componentes
│   ├── EqualizerAPO-Installer.exe # Instalador embutido para configuração automática
│   └── terms.txt               # Termos de Uso e Licenciamento
│
├── src/                        # Frontend da Aplicação (React + TypeScript + Vite)
│   ├── components/             # Componentes modulares de interface
│   │   ├── AppIcon.tsx         # Renderizador dinâmico de ícones de processos
│   │   ├── AppVolumeList.tsx   # Mixer de volume por aplicativo
│   │   ├── HotkeyHint.tsx      # Exibição dos atalhos rápidos
│   │   ├── LevelMeter.tsx      # VU Meter estéreo e medidor de picos
│   │   ├── MasterSlider.tsx    # Slider circular mestre (0% a 500%)
│   │   ├── ProfileIcon.tsx     # Ícones temáticos para perfis de áudio
│   │   ├── QuickActions.tsx    # Ações rápidas (Mute, Limiter, Perfis)
│   │   ├── SettingsPanel.tsx   # Painel lateral de configurações e status do motor
│   │   └── TitleBar.tsx        # Barra de título frameless customizada
│   ├── types/
│   │   └── audio.ts            # Definições de tipos TypeScript do domínio de áudio
│   ├── App.tsx                 # Componente raiz da aplicação
│   ├── index.css               # Design System CSS (tokens, cores, animações)
│   └── main.tsx                # Ponto de entrada React
│
├── backup_v1_original/         # Backup de segurança da versão legada
├── release/                    # Executáveis finais de distribuição (Instaladores e Portables)
├── package.json                # Configurações do projeto e scripts npm
├── tsconfig.json               # Configurações do compilador TypeScript
└── vite.config.ts              # Configurações do bundler Vite
```

---

## 🛠️ Tecnologias Utilizadas

- **Shell / Runtime:** [Electron 28](https://www.electronjs.org/)
- **Frontend:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite 5](https://vitejs.dev/)
- **Estilização:** CSS Vanilla com Design Tokens CSS3 (Glassmorphism e Dark Mode)
- **Áudio Core / Win32:** C# .NET CoreAudio (MMDeviceAPI, EndpointVolume, AudioSessionManager2)
- **DSP Engine:** [Equalizer APO](https://equalizerapo.com/) (Audio Processing Object do Windows)
- **Empacotamento:** [electron-builder](https://www.electron.build/) + [NSIS](https://nsis.sourceforge.io/)

---

## 🚀 Como Executar em Desenvolvimento

### 1. Pré-requisitos
- Node.js 18 ou superior instalado
- Windows 10 ou 11 (64-bit)

### 2. Instalação de Dependências
```bash
npm install
```

### 3. Rodar em Modo Desenvolvimento
```bash
npm run electron:dev
```
*O comando iniciará o servidor Vite com Hot Reload e conectará automaticamente o Electron.*

---

## 📦 Como Gerar os Instaladores (Build)

Para compilar o frontend TypeScript e gerar os executáveis na pasta `release/`:

```bash
npm run electron:build
```

Os seguintes arquivos serão gerados na pasta `release/`:
* `VolumeMax Setup 2.0.0.exe`: Instalador completo do Windows com página de Termos e integração opcional.
* `VolumeMax 2.0.0.exe`: Versão portátil (sem instalação necessária).

---

## 🔒 Licença

Distribuído sob licença MIT. Consulte os [Termos de Uso](installer/terms.txt) para detalhes.
