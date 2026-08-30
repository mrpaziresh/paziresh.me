import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getProjectBySlug, Project } from '../projects.data';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
  project: Project | undefined;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.project = getProjectBySlug(params.get('slug') ?? '');
    });
  }
}
