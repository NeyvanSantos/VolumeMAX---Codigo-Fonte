!include nsDialogs.nsh
!include LogicLib.nsh
!include WinMessages.nsh

!ifndef BUILD_UNINSTALLER

# Define o controle MultiText (Multiline Edit com barra de rolagem vertical)
!define __NSD_MultiText_CLASS EDIT
!define __NSD_MultiText_STYLE ${DEFAULT_STYLES}|${WS_TABSTOP}|${WS_VSCROLL}|${ES_MULTILINE}|${ES_WANTRETURN}|${ES_AUTOVSCROLL}|${ES_READONLY}
!define __NSD_MultiText_EXSTYLE ${WS_EX_WINDOWEDGE}|${WS_EX_CLIENTEDGE}
!insertmacro __NSD_DefineControl MultiText

Var Dialog
Var TextTerms
Var CheckboxApo
Var LabelDesc
Var CheckboxState
Var TermsContent

!macro customPageAfterChangeDir
  Page custom CustomTermsPageCreate CustomTermsPageLeave
!macroend

Function CustomTermsPageCreate
  # Atualiza o titulo e subtitulo do cabecalho Modern UI
  GetDlgItem $0 $HWNDPARENT 1037
  SendMessage $0 ${WM_SETTEXT} 0 "STR:Termos de Uso e Motor de Audio"
  GetDlgItem $0 $HWNDPARENT 1038
  SendMessage $0 ${WM_SETTEXT} 0 "STR:Leia os termos de uso e ative a integracao recomendada para continuar."

  nsDialogs::Create 1018
  Pop $Dialog
  ${If} $Dialog == error
    Abort
  ${EndIf}

  # Caixa de texto multilinhas com rolagem vertical e fundo branco
  ${NSD_CreateMultiText} 0 0 100% 110u ""
  Pop $TextTerms
  SetCtlColors $TextTerms 0x000000 0xFFFFFF

  # Monta o conteudo dos termos de forma estruturada
  StrCpy $TermsContent "TERMOS DE USO E LICENCA - VOLUMEMAX$\r$\n$\r$\n"
  StrCpy $TermsContent "$TermsContent1. FINALIDADE E FUNCIONAMENTO:$\r$\n"
  StrCpy $TermsContent "$TermsContentO VolumeMax e uma ferramenta avancada de aprimoramento e amplificacao de audio no Windows, oferecendo controle de 0% a 100% nativo e amplificacao estendida de 101% a 500%.$\r$\n$\r$\n"
  StrCpy $TermsContent "$TermsContent2. MOTOR DE AMPLIFICACAO (EQUALIZER APO):$\r$\n"
  StrCpy $TermsContent "$TermsContentPara permitir que o volume ultrapasse os 100% com fidelidade e sem latencia, o VolumeMax opera diretamente integrado com o Equalizer APO, processador de audio que se conecta ao driver de som do Windows.$\r$\n$\r$\n"
  StrCpy $TermsContent "$TermsContent3. RESPONSABILIDADE DO USUARIO E SAUDE AUDITIVA:$\r$\n"
  StrCpy $TermsContent "$TermsContentO usuario reconhece que volumes extremamente elevados (acima de 100% ate 500%) podem causar fadiga ou danos a audicao se utilizados de forma prolongada, especialmente com fones de ouvido. Recomenda-se elevar o ganho gradualmente.$\r$\n$\r$\n"
  StrCpy $TermsContent "$TermsContent4. LIMITACAO DE RESPONSABILIDADE:$\r$\n"
  StrCpy $TermsContent "$TermsContentSoftware distribuido gratuitamente 'como esta', sem garantias expressas ou implicitas.$\r$\n$\r$\n"
  StrCpy $TermsContent "$TermsContentAo prosseguir com a instalacao e marcar a opcao abaixo, voce declara estar ciente e de acordo com estes termos."

  SendMessage $TextTerms ${WM_SETTEXT} 0 "STR:$TermsContent"

  # Checkbox de ativacao recomendada
  ${NSD_CreateCheckbox} 0 115u 100% 13u "Instalar Equalizer APO (Recomendado)"
  Pop $CheckboxApo

  # Label informativo logo abaixo da checkbox
  ${NSD_CreateLabel} 12u 129u 95% 10u "Necessario para permitir a amplificacao de volume de 101% ate 500%."
  Pop $LabelDesc

  # Evento de clique na checkbox
  ${NSD_OnClick} $CheckboxApo OnApoCheckboxClick

  # O botao Avancar/Instalar inicia desabilitado ate que a caixa seja ativada
  GetDlgItem $0 $HWNDPARENT 1
  EnableWindow $0 0

  nsDialogs::Show
FunctionEnd

Function OnApoCheckboxClick
  Pop $0
  ${NSD_GetState} $CheckboxApo $CheckboxState
  GetDlgItem $0 $HWNDPARENT 1
  ${If} $CheckboxState == ${BST_CHECKED}
    EnableWindow $0 1
  ${Else}
    EnableWindow $0 0
  ${EndIf}
FunctionEnd

Function CustomTermsPageLeave
  ${NSD_GetState} $CheckboxApo $CheckboxState
  ${If} $CheckboxState != ${BST_CHECKED}
    MessageBox MB_ICONEXCLAMATION "Voce precisa marcar 'Instalar Equalizer APO (Recomendado)' para continuar."
    Abort
  ${EndIf}
FunctionEnd

!macro customInstall
  DetailPrint "Verificando integracao com o Equalizer APO..."
  ${If} ${FileExists} "C:\Program Files\EqualizerAPO\config\config.txt"
    DetailPrint "Equalizer APO ja se encontra presente no sistema."
  ${Else}
    DetailPrint "Iniciando instalacao do Equalizer APO..."
    File /oname=$TEMP\EqualizerAPO-Installer.exe "${PROJECT_DIR}\installer\EqualizerAPO-Installer.exe"
    ${If} ${FileExists} "$TEMP\EqualizerAPO-Installer.exe"
      ExecWait '"$TEMP\EqualizerAPO-Installer.exe"' $0
      DetailPrint "Instalacao do Equalizer APO finalizada com codigo $0"
      Delete "$TEMP\EqualizerAPO-Installer.exe"
    ${EndIf}
  ${EndIf}
!macroend

!endif
