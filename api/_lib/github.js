const DEFAULT_SITE_PATH = 'data/site.json';
const DEFAULT_MESSAGES_PATH = 'data/messages.json';

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function repoConfig() {
  return {
    owner: requiredEnv('GITHUB_OWNER'),
    repo: requiredEnv('GITHUB_REPO'),
    branch: process.env.GITHUB_BRANCH || 'main',
    token: requiredEnv('GITHUB_TOKEN'),
  };
}

function headers(token) {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

function encodeContent(content) {
  return Buffer.from(content, 'utf8').toString('base64');
}

function decodeContent(content) {
  return Buffer.from(content, 'base64').toString('utf8');
}

async function githubRequest(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || response.statusText);
  }

  return text ? JSON.parse(text) : {};
}

export async function readRepoJson(path, fallback) {
  const { owner, repo, branch, token } = repoConfig();
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: headers(token),
  });

  if (response.status === 404) {
    return { data: fallback, sha: null };
  }

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || response.statusText);
  }

  const payload = text ? JSON.parse(text) : {};
  const raw = typeof payload.content === 'string' ? decodeContent(payload.content.replace(/\n/g, '')) : '';

  return {
    data: raw ? JSON.parse(raw) : fallback,
    sha: payload.sha || null,
  };
}

export async function writeRepoJson(path, data, message) {
  const { owner, repo, branch, token } = repoConfig();
  const existing = await readRepoJson(path, null);
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const body = {
    message,
    content: encodeContent(`${JSON.stringify(data, null, 2)}\n`),
    branch,
  };

  if (existing.sha) {
    body.sha = existing.sha;
  }

  return githubRequest(url, {
    method: 'PUT',
    headers: {
      ...headers(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function readSiteData(fallback = {}) {
  const result = await readRepoJson(process.env.GITHUB_SITE_PATH || DEFAULT_SITE_PATH, fallback);
  return result.data;
}

export async function saveSiteData(data) {
  return writeRepoJson(
    process.env.GITHUB_SITE_PATH || DEFAULT_SITE_PATH,
    data,
    'Update site content from Vision Fitness admin'
  );
}

export async function readMessages() {
  const result = await readRepoJson(process.env.GITHUB_MESSAGES_PATH || DEFAULT_MESSAGES_PATH, []);
  return Array.isArray(result.data) ? result.data : [];
}

export async function saveMessages(list) {
  return writeRepoJson(
    process.env.GITHUB_MESSAGES_PATH || DEFAULT_MESSAGES_PATH,
    list,
    'Update contact messages from Vision Fitness admin'
  );
}
