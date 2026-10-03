# Diretrizes e Regras do Projeto — VolumeMax

Esta pasta contém as regras arquiteturais, técnicas e comportamentais exclusivas do projeto **VolumeMax**.
Qualquer desenvolvedor ou assistente de IA que atue neste repositório **DEVE** seguir estas diretrizes obrigatoriamente.

---

## 📑 Índice de Regras

1. [Motor de Áudio e Integrações](audio-engine.md) — Regras de amplificação de som, Equalizer APO e proibição do FxSound.
2. [Instalador e Empacotamento NSIS](installer-nsis.md) — Regras de fluxo do instalador, termos de uso e tela personalizada.
3. [Padrões de Código e Estrutura de Pastas](code-standards.md) — Organização estrita de diretórios e padrões TypeScript/Electron.
4. [Comunicação e Políticas de Build](communication-and-delivery.md) — Idioma PT-BR e política de geração de executáveis.
5. [Organização Contínua e Integridade](clean-architecture-and-organization.md) — Obrigação de manter as pastas organizadas e notificar ao final.

---

## 🎯 Regra de Ouro do VolumeMax
> O VolumeMax é uma solução leve, limpa e independente de drivers virtuais intrusivos. O ganho acima de 100% (até 500%) é sempre realizado através do **Equalizer APO** integrado ao driver de áudio do Windows, mantendo zero latência e máxima fidelidade sonora.
