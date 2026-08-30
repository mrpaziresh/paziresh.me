import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ARTICLES, estimateReadTime, getExcerpt } from './notebook.data';

@Component({
  selector: 'app-notebook',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notebook.component.html',
  styleUrl: './notebook.component.scss'
})
export class NotebookComponent {
  articles = ARTICLES;
  getExcerpt = getExcerpt;
  getReadTime = estimateReadTime;
}
