const { net } = require('electron');
const https = require('https');
const fs = require('fs');
const path = require('path');

const GITHUB_OWNER = 'NeyvanSantos';
const GITHUB_REPO = 'VolumeMAX---Codigo-Fonte';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;

/**
 * Compara duas versões semânticas (ex: "2.0.0" vs "2.1.0").
 * @returns true se remoteVersion for mais nova que localVersion
 */
function isNewerVersion(localVersion, remoteVersion) {
  const toNum = (v) => v.replace(/^v/, '').split('.').map(Number);
  const [lMaj, lMin, lPatch] = toNum(localVersion);
  const [rMaj, rMin, rPatch] = toNum(remoteVersion);

  if (rMaj !== lMaj) return rMaj > lMaj;
  if (rMin !== lMin) return rMin > lMin;
  return rPatch > lPatch;
}

/**
 * Busca o release mais recente na API do GitHub.
 * Retorna { version, downloadUrl, releaseNotes } ou null em caso de erro.
 */
function checkForUpdates(currentVersion) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`,
      method: 'GET',
      headers: {
        'User-Agent': `VolumeMax/${currentVersion}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      timeout: 8000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const release = JSON.parse(data);
          const remoteVersion = release.tag_name || release.name || '';

          if (!remoteVersion) {
            return resolve(null);
          }

          // Procura o asset de setup (.exe) para Windows x64
          const asset = (release.assets || []).find(
            (a) => a.name && a.name.toLowerCase().includes('setup') && a.name.toLowerCase().endsWith('.exe')
          );

          if (!asset) {
            return resolve(null);
          }

          if (!isNewerVersion(currentVersion, remoteVersion)) {
            return resolve(null); // Já está na versão mais recente
          }

          resolve({
            version: remoteVersion,
            downloadUrl: asset.browser_download_url,
            fileName: asset.name,
            releaseNotes: release.body || '',
          });
        } catch {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.end();
  });
}

/**
 * Baixa o arquivo de atualização com relatório de progresso.
 * @param {string} url - URL de download do asset GitHub
 * @param {string} destPath - Caminho local onde salvar o arquivo
 * @param {Function} onProgress - callback(percent: number)
 */
function downloadUpdate(url, destPath, onProgress) {
  return new Promise((resolve, reject) => {
    const doRequest = (requestUrl) => {
      const urlObj = new URL(requestUrl);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: { 'User-Agent': 'VolumeMax-Updater' },
      };

      const req = https.request(options, (res) => {
        // Segue redirecionamentos do GitHub (302 → CDN)
        if (res.statusCode === 302 || res.statusCode === 301) {
          return doRequest(res.headers.location);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }

        const totalSize = parseInt(res.headers['content-length'] || '0', 10);
        let downloaded = 0;

        const out = fs.createWriteStream(destPath);
        res.on('data', (chunk) => {
          downloaded += chunk.length;
          if (totalSize > 0 && onProgress) {
            onProgress(Math.round((downloaded / totalSize) * 100));
          }
        });
        res.pipe(out);
        out.on('finish', () => { out.close(); resolve(destPath); });
        out.on('error', (err) => { fs.unlink(destPath, () => {}); reject(err); });
      });

      req.on('error', reject);
      req.end();
    };

    doRequest(url);
  });
}

module.exports = { checkForUpdates, downloadUpdate };
