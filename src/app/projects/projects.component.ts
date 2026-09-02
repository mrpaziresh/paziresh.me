import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS, Project } from './projects.data';

interface LogoSlot {
  project: Project;
  top: number;
  left: number;
  rotation: number;
  visible: boolean;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects = PROJECTS;

  // The desktop grid is 3 columns — when the project count isn't a
  // multiple of 3, the last row has an empty cell. Fill it with a
  // rotating logo showcase instead of leaving it blank.
  showLogoShowcase = this.projects.length % 3 !== 0;

  logoSlots: LogoSlot[] = [];

  private readonly quadrants = [
    { top: [15, 35], left: [12, 38] },
    { top: [15, 35], left: [58, 84] },
    { top: [55, 80], left: [12, 38] },
    { top: [55, 80], left: [58, 84] }
  ];

  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
    // The recursive setTimeout cycle never lets zone.js reach a stable
    // state, which would hang SSR prerendering — only animate in the browser.
    if (!this.showLogoShowcase || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const slotCount = Math.min(this.quadrants.length, this.projects.length);
    const used = new Set<string>();

    for (let i = 0; i < slotCount; i++) {
      const project = this.pickProject(used);
      used.add(project.slug);

      const slot: LogoSlot = {
        project,
        ...this.randomPosition(i),
        visible: false
      };
      this.logoSlots.push(slot);

      // Stagger the initial fade-ins so slots don't all pop in together.
      this.timers.push(
        setTimeout(() => {
          slot.visible = true;
          this.scheduleCycle(slot, i);
        }, 300 + i * 400)
      );
    }
  }

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
  }

  private scheduleCycle(slot: LogoSlot, index: number): void {
    const holdTime = 3200 + Math.random() * 2200;

    this.timers.push(
      setTimeout(() => {
        slot.visible = false;

        this.timers.push(
          setTimeout(() => {
            const used = new Set(
              this.logoSlots.filter((other) => other !== slot).map((other) => other.project.slug)
            );
            slot.project = this.pickProject(used, slot.project.slug);
            Object.assign(slot, this.randomPosition(index));
            slot.visible = true;
            this.scheduleCycle(slot, index);
          }, 700)
        );
      }, holdTime)
    );
  }

  private pickProject(used: Set<string>, exclude?: string): Project {
    const candidates = this.projects.filter((project) => !used.has(project.slug) && project.slug !== exclude);
    const pool = candidates.length ? candidates : this.projects;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  private randomPosition(index: number): { top: number; left: number; rotation: number } {
    const quadrant = this.quadrants[index % this.quadrants.length];
    const top = quadrant.top[0] + Math.random() * (quadrant.top[1] - quadrant.top[0]);
    const left = quadrant.left[0] + Math.random() * (quadrant.left[1] - quadrant.left[0]);
    const rotation = -12 + Math.random() * 24;
    return { top, left, rotation };
  }
}
