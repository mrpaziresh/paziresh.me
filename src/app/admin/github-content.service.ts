import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface GithubCredentials {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export interface GithubFile {
  content: string;
  sha: string;
}

export class GithubApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const STORAGE_KEY = 'admin.github.credentials';

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64ToUtf8(base64: string): string {
  const binary = atob(base64.replace(/\n/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

@Injectable({ providedIn: 'root' })
export class GithubContentService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  getCredentials(): GithubCredentials | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GithubCredentials) : null;
  }

  saveCredentials(creds: GithubCredentials) {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
  }

  clearCredentials() {
    if (!this.isBrowser) return;
    localStorage.removeItem(STORAGE_KEY);
  }

  private headers(creds: GithubCredentials): HeadersInit {
    return {
      Authorization: `Bearer ${creds.token}`,
      Accept: 'application/vnd.github+json',
    };
  }

  private async request(url: string, init: RequestInit): Promise<Response> {
    const res = await fetch(url, init);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new GithubApiError(res.status, `GitHub API ${res.status}: ${body || res.statusText}`);
    }
    return res;
  }

  async getTextFile(creds: GithubCredentials, path: string): Promise<GithubFile> {
    const url = `https://api.github.com/repos/${creds.owner}/${creds.repo}/contents/${path}?ref=${creds.branch}`;
    const res = await this.request(url, { headers: this.headers(creds) });
    const json = await res.json();
    return { content: base64ToUtf8(json.content), sha: json.sha };
  }

  async putTextFile(creds: GithubCredentials, path: string, content: string, sha: string | null, message: string): Promise<void> {
    const url = `https://api.github.com/repos/${creds.owner}/${creds.repo}/contents/${path}`;
    await this.request(url, {
      method: 'PUT',
      headers: { ...this.headers(creds), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        content: utf8ToBase64(content),
        sha: sha ?? undefined,
        branch: creds.branch,
      }),
    });
  }

  async putBinaryFile(creds: GithubCredentials, path: string, base64Content: string, message: string): Promise<void> {
    const url = `https://api.github.com/repos/${creds.owner}/${creds.repo}/contents/${path}`;
    await this.request(url, {
      method: 'PUT',
      headers: { ...this.headers(creds), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        content: base64Content,
        branch: creds.branch,
      }),
    });
  }

  /**
   * Fetches a JSON file, applies `mutate`, and writes it back — retrying with
   * a fresh `sha` if another write landed in between (GitHub 409). A single
   * admin operator triggering two actions in quick succession is the normal
   * case that causes this, not a real conflict, so retrying is safe here.
   */
  async readModifyWriteJson<T>(
    creds: GithubCredentials,
    path: string,
    message: string,
    mutate: (data: T) => T,
    fallback: T,
    maxAttempts = 3
  ): Promise<T> {
    let lastErr: unknown;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let file: GithubFile | null;
      try {
        file = await this.getTextFile(creds, path);
      } catch (err) {
        if (err instanceof GithubApiError && err.status === 404) {
          file = null;
        } else {
          throw err;
        }
      }

      const data = file?.content.trim() ? (JSON.parse(file.content) as T) : fallback;
      const updated = mutate(data);

      try {
        await this.putTextFile(creds, path, JSON.stringify(updated, null, 2) + '\n', file?.sha ?? null, message);
        return updated;
      } catch (err) {
        lastErr = err;
        if (!(err instanceof GithubApiError && err.status === 409)) throw err;
        // sha went stale between our GET and PUT — loop to re-fetch and retry
      }
    }
    throw lastErr;
  }
}
