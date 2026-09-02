import { CommonModule } from '@angular/common';
import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

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

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects.split('/')[1];
        this.selectedMenuItem = url;
      }
    });
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
