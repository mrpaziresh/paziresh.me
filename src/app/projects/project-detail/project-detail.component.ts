import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getProjectBySlug, Project } from '../projects.data';
import { SeoService, SITE_URL } from '../../shared/seo.service';
import { ThemeService } from '../../shared/theme.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnDestroy {
  project: Project | undefined;

  constructor(private route: ActivatedRoute, private seo: SeoService, public themeService: ThemeService) {
    this.route.paramMap.subscribe((params) => {
      this.project = getProjectBySlug(params.get('slug') ?? '');

      if (this.project) {
        this.seo.set({
          title: this.project.title,
          description: this.project.description,
          path: `/projects/${encodeURIComponent(this.project.slug)}/`,
          image: `${SITE_URL}${this.project.image.replace(/^\./, '')}`,
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.seo.reset();
  }
}
