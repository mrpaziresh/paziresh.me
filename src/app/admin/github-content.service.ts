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
      throw new Error(`GitHub API ${res.status}: ${body || res.statusText}`);
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
}
