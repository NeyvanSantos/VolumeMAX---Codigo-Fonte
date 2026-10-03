# Regra: Instalador Windows e Empacotamento NSIS

## 1. Fluxo Obrigatório do Instalador
O instalador do VolumeMax gerado via `electron-builder` com o script [`installer/customInstaller.nsh`](file:///g:/VolumeMax/installer/customInstaller.nsh) deve SEMPRE conter a seguinte sequência:

1. **Tela de Termos de Uso:**
   - Exibir os termos contidos em [`installer/terms.txt`](file:///g:/VolumeMax/installer/terms.txt) em uma caixa de texto multilinha (`ES_MULTILINE | WS_VSCROLL`) com rolagem vertical funcional.
   - **Fundo da Caixa:** O fundo da caixa de termos DEVE ser configurado obrigatoriamente como **Branco Puro** (`#FFFFFF` ou `0xFFFFFF`) via `SetCtlColors $TextTerms 0x000000 0xFFFFFF`.
   - **Cabeçalho:** O cabeçalho da página no topo do instalador deve exibir claramente:
     - Título: `Termos de Uso e Motor de Audio`
     - Subtítulo: `Leia os termos de uso e ative a integracao recomendada para continuar.`

2. **Caixa de Ativação Obrigatória (Checkbox):**
   - Rótulo exato: `Instalar Equalizer APO (Recomendado)`
   - Texto de apoio abaixo da caixa: `Necessario para permitir a amplificacao de volume de 101% ate 500%.`

3. **Comportamento do Botão "Avançar / Instalar":**
   - O botão **DEVE iniciar desabilitado** (`EnableWindow $0 0`).
   - O botão só pode ser liberado no momento em que a checkbox for **ativada/marcada**.
   - Se o usuário desmarcar a caixa, o botão deve voltar a ser desabilitado imediatamente.

4. **Instalação do Componente em Máquinas Novas:**
   - Ao avançar, o instalador deve checar se `C:\Program Files\EqualizerAPO\config\config.txt` já existe no sistema.
   - Se já existir, segue a instalação sem interrupções.
   - Se NÃO existir, deve executar o instalador embutido localizado em [`installer/EqualizerAPO-Installer.exe`](file:///g:/VolumeMax/installer/EqualizerAPO-Installer.exe).
