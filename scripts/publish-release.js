const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGE_PATH = path.join(ROOT_DIR, 'package.json');
const RELEASE_DIR = path.join(ROOT_DIR, 'release');

/**
 * Obtém o token do GitHub diretamente do Windows Credential Manager / Git.
 */
function getGitHubToken() {
  try {
    const out = execSync('git credential fill', {
      input: 'protocol=https\nhost=github.com\n\n',
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const match = out.match(/password=(.+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  } catch {
    // Silencioso se falhar
  }
  return process.env.GH_TOKEN || process.env.GITHUB_TOKEN || null;
}

/**
 * Executa comandos no shell com exibição ao vivo e retorno.
 */
function run(cmd, env = {}) {
  return execSync(cmd, {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: { ...process.env, ...env },
    encoding: 'utf-8',
  });
}

/**
 * Gera automaticamente o changelog com base no histórico recente de commits do Git.
 */
function generateChangelog() {
  try {
    const tags = execSync('git tag --sort=-creatordate', { encoding: 'utf-8' })
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    let logCmd = 'git log -n 12 --pretty=format:"%s"';
    if (tags.length > 1) {
      const prevTag = tags[1];
      logCmd = `git log ${prevTag}..HEAD --pretty=format:"%s"`;
    }

    const commits = execSync(logCmd, { encoding: 'utf-8' })
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    if (commits.length === 0) return '';

    const feats = [];
    const fixes = [];
    const docs = [];
    const others = [];

    for (const msg of commits) {
      if (/^feat(\([^)]+\))?:\s*/i.test(msg)) {
        feats.push(msg.replace(/^feat(\([^)]+\))?:\s*/i, ''));
      } else if (/^fix(\([^)]+\))?:\s*/i.test(msg)) {
        fixes.push(msg.replace(/^fix(\([^)]+\))?:\s*/i, ''));
      } else if (/^docs(\([^)]+\))?:\s*/i.test(msg)) {
        docs.push(msg.replace(/^docs(\([^)]+\))?:\s*/i, ''));
      } else {
        others.push(msg);
      }
    }

    let notes = '';
    if (feats.length > 0) {
      notes += '### 🚀 Novidades e Novos Recursos\n';
      notes += feats.map((f) => `- ${f}`).join('\n') + '\n\n';
    }
    if (fixes.length > 0) {
      notes += '### 🐛 Correções e Melhorias\n';
      notes += fixes.map((f) => `- ${f}`).join('\n') + '\n\n';
    }
    if (docs.length > 0) {
      notes += '### 📚 Documentação e Regras\n';
      notes += docs.map((d) => `- ${d}`).join('\n') + '\n\n';
    }
    if (others.length > 0 && feats.length === 0 && fixes.length === 0) {
      notes += '### 📝 Alterações nesta Versão\n';
      notes += others.map((o) => `- ${o}`).join('\n') + '\n\n';
    }

    return notes;
  } catch {
    return '';
  }
}

function main() {
  console.log('\n🚀 [VolumeMax] Publicador de Releases no GitHub com Changelog...\n');

  // 1. Ler package.json
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, 'utf-8'));
  let version = pkg.version;

  // Permite passar versão como argumento (ex: node publish-release.js 2.0.1)
  const argVersion = process.argv.find((a) => /^\d+\.\d+\.\d+$/.test(a));
  if (argVersion && argVersion !== version) {
    version = argVersion;
    pkg.version = version;
    fs.writeFileSync(PACKAGE_PATH, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
    console.log(`📌 Versão atualizada no package.json para: v${version}`);
  } else {
    console.log(`📌 Versão alvo: v${version}`);
  }

  // 2. Verificar instalador na pasta release/
  const setupExe = path.join(RELEASE_DIR, `VolumeMax Setup ${version}.exe`);

  const shouldBuild = !fs.existsSync(setupExe) || process.argv.includes('--build');

  if (shouldBuild) {
    console.log('🔨 Compilando novo instalador e executáveis (electron:build)...');
    run('npm run electron:build');
  }

  if (!fs.existsSync(setupExe)) {
    console.error(`❌ Erro: O instalador não foi encontrado em: ${setupExe}`);
    process.exit(1);
  }

  console.log(`✅ Instalador localizado: "${setupExe}"`);

  // 3. Obter token de autenticação
  const token = getGitHubToken();
  if (!token) {
    console.error('❌ Erro: Não foi possível obter o token de autenticação do GitHub.');
    console.error('Execute "gh auth login" ou verifique suas credenciais do Git.');
    process.exit(1);
  }

  const tag = `v${version}`;
  const title = `VolumeMax v${version}`;

  // 4. Montar Changelog / O que foi alterado
  console.log('📋 Coletando lista de alterações (Changelog)...');
  const dynamicChangelog = generateChangelog();

  // Permite notas personalizadas via argumento: --notes "..."
  const notesIndex = process.argv.indexOf('--notes');
  const customNotes = notesIndex !== -1 && process.argv[notesIndex + 1] ? process.argv[notesIndex + 1] : null;

  let releaseBody = `## VolumeMax ${tag}\n\n`;

  if (customNotes) {
    releaseBody += `### 📌 Destaques desta Versão:\n${customNotes}\n\n`;
  } else if (dynamicChangelog) {
    releaseBody += dynamicChangelog;
  } else {
    releaseBody += `### 🚀 Destaques:\n- Atualizações de desempenho e estabilidade do amplificador de áudio.\n\n`;
  }

  releaseBody += `### 📦 Como Instalar / Atualizar:\n`;
  releaseBody += `1. Baixe o instalador oficial: **\`VolumeMax Setup ${version}.exe\`** abaixo.\n`;
  releaseBody += `2. Execute a instalação. O instalador detectará e configurará o Equalizer APO nativamente se necessário.\n`;
  releaseBody += `3. Caso já utilize o aplicativo, o sistema de auto-atualização pode ser acionado diretamente pelo botão **Atualizar Agora** na interface.\n\n`;
  releaseBody += `---\n*VolumeMax — Ganho nativo de até 500% integrado ao driver de áudio do Windows (Zero FxSound).*`;

  // Salva temporariamente para evitar falhas de escape de aspas no shell do Windows
  const notesFile = path.join(RELEASE_DIR, 'release-notes-temp.md');
  fs.writeFileSync(notesFile, releaseBody, 'utf-8');

  // 5. Criação da Tag Git
  console.log(`🏷️  Criando e sincronizando tag ${tag}...`);
  try {
    run(`git tag -a ${tag} -m "${title}"`);
  } catch {
    console.log(`Tag ${tag} local já existe, prosseguindo...`);
  }

  try {
    run(`git push origin ${tag}`);
  } catch {
    console.log(`Tag ${tag} já está sincronizada no remoto.`);
  }

  // 6. Publicação no GitHub Releases via GitHub CLI com o Changelog
  console.log(`🌐 Publicando Release ${tag} no GitHub com notas e instalador anexado...`);

  const filesToUpload = [`"${setupExe}"`];

  try {
    // Tenta criar release com arquivo de notas
    run(
      `gh release create ${tag} ${filesToUpload.join(' ')} --title "${title}" --notes-file "${notesFile}"`,
      { GH_TOKEN: token }
    );
  } catch {
    console.log('⚠️ Release já existente detectada. Atualizando notas e arquivos anexados...');
    run(
      `gh release edit ${tag} --title "${title}" --notes-file "${notesFile}"`,
      { GH_TOKEN: token }
    );
    run(
      `gh release upload ${tag} ${filesToUpload.join(' ')} --clobber`,
      { GH_TOKEN: token }
    );
  }

  // Remove arquivo temporário de notas
  try {
    fs.unlinkSync(notesFile);
  } catch {}

  console.log('\n🎉 RELEASE PUBLICADA COM SUCESSO NO GITHUB COM CHANGELOG!');
  console.log(`🔗 Ver em: https://github.com/NeyvanSantos/VolumeMAX---Codigo-Fonte/releases/tag/${tag}\n`);
}

main();
