import { Routes } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { HomeComponent } from './home/home.component';
import { NotebookComponent } from './notebook/notebook.component';
import { NotebookArticleComponent } from './notebook/notebook-article/notebook-article.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailComponent } from './projects/project-detail/project-detail.component';
import { JourneyComponent } from './journey/journey.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  {
    path: 'admin',
        component: AdminComponent
  },

  {
    path: '',
        component: HomeComponent
  },
  {
    path: 'notebook',
        component: NotebookComponent
  },
  {
    path: 'notebook/:slug',
        component: NotebookArticleComponent
  },
  {
    path: 'projects',
        component: ProjectsComponent
  },
  {
    path: 'projects/:slug',
        component: ProjectDetailComponent
  },
  {
    path: 'journey',
        component: JourneyComponent
  },

];
