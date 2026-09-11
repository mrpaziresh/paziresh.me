import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>('light');
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (!this.isBrowser) return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    this.setTheme(stored ?? (media.matches ? 'dark' : 'light'));

    // Follow the OS-level theme live, but only while the user hasn't made an explicit choice here.
    media.addEventListener('change', (event) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        this.setTheme(event.matches ? 'dark' : 'light');
      }
    });
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }

  private setTheme(theme: Theme): void {
    this.theme.set(theme);
    if (this.isBrowser) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }
}
