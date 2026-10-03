# VolumeMax — Plano de Construção

## Goal
Criar aplicativo desktop Electron (Windows) que amplifica volume acima de 100% (até 500%), com controle per-app, anti-distorção, visualizador e UI premium dark mode.

## Tasks

- [x] Task 1: Scaffold Electron + React + TypeScript + Vite → Verify: `npm run dev` / `npm run build` funcionando
- [x] Task 2: Main process (frameless window, tray, preload, IPC) → Verify: janela frameless com tray icon funcional e IPC bidirecional
- [x] Task 3: Design System CSS (variáveis, tipografia, animações) → Verify: arquivo `index.css` com tokens e animações completos
- [x] Task 4: TitleBar customizada + layout principal → Verify: barra de título com botões de fechar, minimizar e configurações
- [x] Task 5: MasterSlider (0-500%) com barra de nível e glow → Verify: slider controla valor, suporte a mute e animações
- [x] Task 6: APOBridge — leitura/escrita config Equalizer APO → Verify: sincronização automática do preamp em dB com detecção de instalação
- [x] Task 7: AudioManager — sessões de áudio com IPC → Verify: lista processos com áudio ativo e controle de ganho
- [x] Task 8: AppVolumeList — sliders per-app → Verify: exibe apps ativos e permite ajuste fino por processo
- [x] Task 9: AudioVisualizer — VU Meter estéreo L/R → Verify: barras estéreo animando em tempo real com indicador de clipping
- [x] Task 10: ProfileSelector + AntiDistortion + Settings → Verify: perfis pré-definidos (Música, Filme, Reunião, Games) e Limiter anti-distorção
- [x] Task 11: Hotkeys globais + auto-start → Verify: Ctrl+Shift+Up/Down altera boost globalmente e opção de inicialização com o Windows
- [x] Task 12: Verificação final — compilação bem-sucedida e build de produção pronto

## Done When
- [x] App estruturado, boost até 500%, per-app pronto, UI dark mode refinada, TypeScript e Vite compilando sem erros.
