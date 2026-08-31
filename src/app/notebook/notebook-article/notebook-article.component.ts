import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { marked } from 'marked';
import { Article, getArticleBySlug, getExcerpt, estimateReadTime } from '../notebook.data';

const SITE_TITLE = 'AlirezaOS';
const SITE_URL = 'https://mrpaziresh.github.io/paziresh.me';

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
        const title = this.article.title;
        const description = getExcerpt(this.article.content);
        const image = `${SITE_URL}/og/${this.article.slug}.png`;
        // Trailing slash matches the URL GitHub Pages serves directly (200) rather
        // than the no-slash path, which 301-redirects and trips up some link-preview bots.
        const url = `${SITE_URL}/notebook/${this.article.slug}/`;

        this.titleService.setTitle(`${title} — ${SITE_TITLE}`);
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.updateTag({ property: 'og:title', content: title });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:image', content: image });
        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:type', content: 'article' });
        this.meta.updateTag({ property: 'article:published_time', content: new Date(this.article.date).toISOString() });
        this.meta.updateTag({ property: 'article:author', content: 'Ali Reza Paziresh' });
        this.meta.updateTag({ property: 'article:section', content: 'Notebook' });
        this.meta.updateTag({ name: 'twitter:title', content: title });
        this.meta.updateTag({ name: 'twitter:description', content: description });
        this.meta.updateTag({ name: 'twitter:image', content: image });
      }
    });
  }

  copyLink() {
    const url = this.article ? `${SITE_URL}/notebook/${this.article.slug}/` : window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.linkCopied = true;
      setTimeout(() => (this.linkCopied = false), 2000);
    });
  }

  ngOnDestroy() {
    this.titleService.setTitle(SITE_TITLE);
    this.meta.updateTag({ name: 'description', content: 'Ali Reza Paziresh personal website' });
    this.meta.updateTag({ property: 'og:title', content: 'Paziresh.me' });
    this.meta.updateTag({ property: 'og:description', content: 'Ali Reza Paziresh personal website' });
    this.meta.updateTag({ property: 'og:image', content: `${SITE_URL}/website-preview.png` });
    this.meta.updateTag({ property: 'og:url', content: `${SITE_URL}/` });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Paziresh.me' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Ali Reza Paziresh personal website' });
    this.meta.updateTag({ name: 'twitter:image', content: `${SITE_URL}/website-preview.png` });
    this.meta.removeTag('property="article:published_time"');
    this.meta.removeTag('property="article:author"');
    this.meta.removeTag('property="article:section"');
  }
}
