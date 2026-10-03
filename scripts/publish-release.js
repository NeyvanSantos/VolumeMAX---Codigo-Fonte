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

function main() {
  console.log('\n🚀 [VolumeMax] Iniciando Publicação de Release no GitHub...\n');

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

  // 2. Verificar executáveis na pasta release/
  const setupExe = path.join(RELEASE_DIR, `VolumeMax Setup ${version}.exe`);
  const portableExe = path.join(RELEASE_DIR, `VolumeMax ${version}.exe`);

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
  const notes = `### VolumeMax ${tag}\n\n- Motor de Áudio nativo Equalizer APO (Preamp até 500%)\n- Zero drivers virtuais intrusivos (Zero FxSound)\n- Controle individual de volume por aplicativo (WASAPI)\n- Atualizações automáticas integradas via GitHub Releases\n\n**Para instalar:** Baixe e execute \`VolumeMax Setup ${version}.exe\`.`;

  // 4. Criação da Tag Git
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

  // 5. Publicação no GitHub Releases via GitHub CLI
  console.log(`🌐 Publicando Release ${tag} no GitHub com o instalador anexado...`);

  const filesToUpload = [`"${setupExe}"`];
  if (fs.existsSync(portableExe)) {
    filesToUpload.push(`"${portableExe}"`);
  }

  try {
    // Tenta criar release
    run(
      `gh release create ${tag} ${filesToUpload.join(' ')} --title "${title}" --notes "${notes.replace(/"/g, '\\"')}"`,
      { GH_TOKEN: token }
    );
  } catch {
    console.log('⚠️ Release já existente detectada. Atualizando arquivos anexados...');
    run(
      `gh release upload ${tag} ${filesToUpload.join(' ')} --clobber`,
      { GH_TOKEN: token }
    );
  }

  console.log('\n🎉 RELEASE PUBLICADA COM SUCESSO NO GITHUB!');
  console.log(`🔗 Ver em: https://github.com/NeyvanSantos/VolumeMAX---Codigo-Fonte/releases/tag/${tag}\n`);
}

main();
