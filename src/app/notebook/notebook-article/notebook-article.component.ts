import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { marked } from 'marked';
import { Article, getArticleBySlug, getArticleByShortCode, getExcerpt, estimateReadTime, shortCode } from '../notebook.data';

const SITE_TITLE = 'Paziresh.me';
const SITE_URL = 'https://paziresh.me';

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
      const code = params.get('code');
      this.article = code ? getArticleByShortCode(code) : getArticleBySlug(params.get('slug') ?? '');
      this.contentHtml = this.article ? (marked.parse(this.article.content) as string) : '';
      this.readTime = this.article ? estimateReadTime(this.article.content) : 0;

      if (this.article) {
        const title = this.article.title;
        const description = getExcerpt(this.article.content);
        const image = `${SITE_URL}/og/${this.article.slug}.png`;
        // Trailing slash matches the URL GitHub Pages serves directly (200) rather
        // than the no-slash path, which 301-redirects and trips up some link-preview bots.
        const url = code ? `${SITE_URL}/n/${code}/` : `${SITE_URL}/notebook/${this.article.slug}/`;

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
    const url = this.article ? `${SITE_URL}/n/${shortCode(this.article.slug)}/` : window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.linkCopied = true;
      setTimeout(() => (this.linkCopied = false), 2000);
    });
  }

  ngOnDestroy() {
    const defaultDescription = 'Ali Reza Paziresh is a startup founder and software engineer based in Tehran, Iran, building products and writing about software engineering, entrepreneurship, and startups.';
    this.titleService.setTitle(`Ali Reza Paziresh — Startup Founder & Software Engineer | ${SITE_TITLE}`);
    this.meta.updateTag({ name: 'description', content: defaultDescription });
    this.meta.updateTag({ property: 'og:title', content: 'Ali Reza Paziresh — Startup Founder & Software Engineer' });
    this.meta.updateTag({ property: 'og:description', content: defaultDescription });
    this.meta.updateTag({ property: 'og:image', content: `${SITE_URL}/website-preview.png` });
    this.meta.updateTag({ property: 'og:url', content: `${SITE_URL}/` });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Ali Reza Paziresh — Startup Founder & Software Engineer' });
    this.meta.updateTag({ name: 'twitter:description', content: defaultDescription });
    this.meta.updateTag({ name: 'twitter:image', content: `${SITE_URL}/website-preview.png` });
    this.meta.removeTag('property="article:published_time"');
    this.meta.removeTag('property="article:author"');
    this.meta.removeTag('property="article:section"');
  }
}
