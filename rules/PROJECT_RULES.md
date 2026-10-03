# VolumeMax — Diretrizes e Regras do Projeto (Consolidado)

Este documento consolida as regras fundamentais do projeto **VolumeMax**. Ele governa qualquer interação, desenvolvimento ou manutenção neste repositório.

---

### 1. Motor de Áudio
* **Boost Acima de 100% (até 500%):** Controlado exclusivamente via **Equalizer APO** no arquivo `C:\Program Files\EqualizerAPO\config\config.txt`.
* **Zero FxSound:** É terminantemente proibido reintroduzir o FxSound.
* **Volume 0% a 100%:** Controlado via CoreAudio mestre do Windows (`VolumeBridge.exe set-volume`).
* **Mixer por Aplicativo:** Controlado via `VolumeBridge.exe` através das APIs WASAPI de sessão de áudio.

---

### 2. Instalador Windows (NSIS)
* **Termos de Uso:** Caixa de texto rolável multilinha com **fundo branco puro** (`#FFFFFF` via `SetCtlColors $TextTerms 0x000000 0xFFFFFF`).
* **Caixa Obrigatória:** `"Instalar Equalizer APO (Recomendado)"`.
* **Botão Avançar:** Inicia bloqueado e só é destravado quando a caixa for marcada.
* **Arquivo Instalador:** Sempre mantido em [`installer/EqualizerAPO-Installer.exe`](file:///g:/VolumeMax/installer/EqualizerAPO-Installer.exe).

---

### 3. Estrutura de Diretórios
* `src/`: Frontend React 18 + TypeScript + Vite.
* `electron/`: Backend Node.js Electron + C# CoreAudio (`bin/VolumeBridge.exe`).
* `installer/`: Scripts NSIS, termos e instalador embutido.
* `assets/`: Apenas ícones e imagens. Proibido guardar instaladores aqui.
* `release/`: Executáveis de distribuição.
* `scripts/`: Scripts utilitários e de automação de releases.
* `rules/`: Esta pasta de regras exclusivas do projeto.

---

### 4. Políticas de Atendimento e Build
* **Idioma:** 100% Português do Brasil (PT-BR).
* **Geração de Builds:** Nunca gerar instaladores sem solicitação expressa.
* **Pergunta ao Final:** Ao término de cada atividade, perguntar se o usuário deseja que o executável seja gerado.

---

### 5. Organização Contínua e Aviso Obrigatório
* **Integridade das Pastas:** Sempre ao final de cada comando ou alteração, é obrigatório deixar o projeto sólido, com cada arquivo em sua devida pasta, sem misturar responsabilidades e mantendo o fluxo liso.
* **Aviso Obrigatório:** Sempre notificar expressamente ao final da resposta que a organização das pastas foi conferida e mantida sólida.

---

### 6. Sincronização Obrigatória com o GitHub
* **Envio Contínuo:** Sempre ao final de cada comando ou alteração concluída, é obrigatório realizar o commit e o envio (`git push origin main`) para o repositório remoto no GitHub (`NeyvanSantos/VolumeMAX---Codigo-Fonte`), mantendo a paridade absoluta entre a máquina local e o repositório.
