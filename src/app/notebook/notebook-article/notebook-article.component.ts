import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { marked } from 'marked';
import { Article, getArticleBySlug, getExcerpt, estimateReadTime } from '../notebook.data';

const SITE_TITLE = 'AlirezaOS';

@Component({
  selector: 'app-notebook-article',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notebook-article.component.html',
  styleUrl: './notebook-article.component.scss'
})
export class NotebookArticleComponent implements OnDestroy {
  article: Article | undefined;
  contentHtml = '';
  readTime = 0;
  linkCopied = false;

  constructor(private route: ActivatedRoute, private titleService: Title, private meta: Meta) {
    this.route.paramMap.subscribe((params) => {
      this.article = getArticleBySlug(params.get('slug') ?? '');
      this.contentHtml = this.article ? (marked.parse(this.article.content) as string) : '';
      this.readTime = this.article ? estimateReadTime(this.article.content) : 0;

      if (this.article) {
        this.titleService.setTitle(`${this.article.title} — ${SITE_TITLE}`);
        this.meta.updateTag({ name: 'description', content: getExcerpt(this.article.content) });
      }
    });
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.linkCopied = true;
      setTimeout(() => (this.linkCopied = false), 2000);
    });
  }

  ngOnDestroy() {
    this.titleService.setTitle(SITE_TITLE);
  }
}
