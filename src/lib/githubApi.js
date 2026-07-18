/*
 * Minimal GitHub Contents API client for writing single JSON files.
 * Used by the Budget section's admin CRUD to commit changes directly to
 * budget.json in the repo, triggering a Pages redeploy.
 *
 * The token is passed in from BudgetContext; nothing is stored here.
 * SCOPE: token needs Contents: read/write on jsl5710/sealresearch.
 * Fine-grained PATs restricted to this single repo are strongly preferred.
 */

const REPO_OWNER = 'jsl5710';
const REPO_NAME = 'sealresearch';
const BRANCH = 'main';

const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

const authHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
});

/** Base64 → UTF-8 string (handles unicode) */
export const b64ToUtf8 = (b64) => {
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

/** UTF-8 string → base64 (handles unicode) */
export const utf8ToB64 = (str) => {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin);
};

/** GET the current file — returns { sha, content, json } */
export async function getFile(path, token) {
  const url = `${API_BASE}/contents/${encodeURIComponent(path)}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: authHeaders(token) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`getFile ${path}: ${res.status} ${err.message || res.statusText}`);
  }
  const data = await res.json();
  const content = data.content ? b64ToUtf8(data.content.replace(/\n/g, '')) : '';
  let json = null;
  try { json = JSON.parse(content); } catch {}
  return { sha: data.sha, content, json };
}

/** PUT file update — content is a JS object (will be JSON.stringified) or raw string */
export async function putFile(path, contentObjOrString, sha, message, token) {
  const contentStr = typeof contentObjOrString === 'string'
    ? contentObjOrString
    : JSON.stringify(contentObjOrString, null, 2) + '\n';
  const url = `${API_BASE}/contents/${encodeURIComponent(path)}`;
  const body = {
    message,
    content: utf8ToB64(contentStr),
    sha,
    branch: BRANCH,
  };
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`putFile ${path}: ${res.status} ${err.message || res.statusText}`);
  }
  return res.json();
}

/** Quick validation: does the token have access to the repo? */
export async function testToken(token) {
  const res = await fetch(API_BASE, { headers: authHeaders(token) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`testToken: ${res.status} ${err.message || res.statusText}`);
  }
  const data = await res.json();
  return { name: data.full_name, permissions: data.permissions };
}
