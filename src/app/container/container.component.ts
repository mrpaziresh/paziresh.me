import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class ContainerComponent {
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLElement>;

  constructor(router: Router) {
    router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = 0;
      }
    });
  }
}
