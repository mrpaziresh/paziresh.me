import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { marked } from 'marked';
import { Article, getArticleBySlug, getArticleByShortCode, getExcerpt, estimateReadTime, shortCode } from '../notebook.data';
import { SeoService, SITE_URL } from '../../shared/seo.service';

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

  constructor(private route: ActivatedRoute, private seo: SeoService) {
    this.route.paramMap.subscribe((params) => {
      const code = params.get('code');
      this.article = code ? getArticleByShortCode(code) : getArticleBySlug(params.get('slug') ?? '');
      this.contentHtml = this.article ? (marked.parse(this.article.content) as string) : '';
      this.readTime = this.article ? estimateReadTime(this.article.content) : 0;

      if (this.article) {
        // Trailing slash matches the URL GitHub Pages serves directly (200) rather
        // than the no-slash path, which 301-redirects and trips up some link-preview bots.
        const path = code ? `/n/${code}/` : `/notebook/${this.article.slug}/`;

        this.seo.set({
          title: this.article.title,
          description: getExcerpt(this.article.content),
          path,
          image: `${SITE_URL}/og/${this.article.slug}.png`,
          type: 'article',
          publishedTime: new Date(this.article.date).toISOString(),
          section: 'Notebook',
        });
      }
    });
  }

  copyLink() {
    const url = this.article ? `${SITE_URL}/n/${shortCode(this.article.slug)}/` : window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.linkCopied = true;
      setTimeout(() => (this.linkCopied = false), 2000);
    });
  }

  ngOnDestroy() {
    this.seo.reset();
  }
}
