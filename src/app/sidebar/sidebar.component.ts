import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ThemeService } from '../shared/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {
  selectedMenuItem: string = '';
  contactMenuOpen = false;
  resumeState: 'idle' | 'downloading' | 'done' = 'idle';

  constructor(private router: Router, public themeService: ThemeService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects.split('/')[1];
        this.selectedMenuItem = url;
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }


navigate(path: string) {
  this.selectedMenuItem = path;
  this.router.navigate([path]);
}

toggleContactMenu(event: MouseEvent) {
  event.stopPropagation();
  this.contactMenuOpen = !this.contactMenuOpen;
}

@HostListener('document:click')
closeContactMenu() {
  this.contactMenuOpen = false;
}

async downloadResume(event: MouseEvent) {
  event.preventDefault();

  if (this.resumeState !== 'idle') {
    return;
  }

  this.resumeState = 'downloading';

  try {
    const response = await fetch('./assets/Alireza-Paziresh-Cv.pdf');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'Alireza-Paziresh-Cv.pdf';
    link.click();

    window.URL.revokeObjectURL(url);
    this.resumeState = 'done';
  } catch {
    this.resumeState = 'idle';
    return;
  }

  setTimeout(() => (this.resumeState = 'idle'), 2000);
}

Socialmedia(media: string){
  this.contactMenuOpen = false;

  switch (media) {
    case "github":
    window.open('https://github.com/mrpaziresh')
    break;
    case "linkedin":
      window.open('https://www.linkedin.com/in/alirezapaziresh/')
    break;
    case "x":
      window.open('https://x.com/Mrpaziresh')
    break;
    case "telegram":
      window.open('https://telegram.me/mrpaziresh')
    break;
    case "email":
      window.location.href = 'mailto:hi@paziresh.me'
    break;

    default:
      break;
  }


}

}
