import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivityEntry, Post } from '../data/types';
import { GithubContentService, GithubCredentials } from './github-content.service';

const ACTIVITY_PATH = 'src/app/data/activity.json';
const POSTS_PATH = 'src/app/data/posts.json';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  creds: GithubCredentials | null = null;
  formCreds: GithubCredentials = { token: '', owner: '', repo: '', branch: 'main' };

  activityBusy = false;
  activityMessage = '';

  posts: Post[] = [];
  postsLoading = false;
  postsError = '';

  editingSlug: string | null = null;
  form = { title: '', slug: '', content: '', published: true };
  imageFile: File | null = null;
  saving = false;
  saveError = '';

  constructor(private github: GithubContentService) {
    this.creds = this.github.getCredentials();
    if (this.creds) this.loadPosts();
  }

  saveCredentials() {
    this.github.saveCredentials(this.formCreds);
    this.creds = this.formCreds;
    this.loadPosts();
  }

  forgetCredentials() {
    this.github.clearCredentials();
    this.creds = null;
    this.posts = [];
  }

  private todayKey(): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tehran' }).format(new Date());
  }

  async logActivity(kind: 'code' | 'workout' | 'both') {
    if (!this.creds || this.activityBusy) return;
    this.activityBusy = true;
    this.activityMessage = '';
    const key = this.todayKey();
    try {
      await this.github.readModifyWriteJson<ActivityEntry[]>(
        this.creds,
        ACTIVITY_PATH,
        `Log ${kind} activity for ${key}`,
        (entries) => {
          let entry = entries.find((e) => e.date === key);
          if (!entry) {
            entry = { date: key, code: false, workout: false };
            entries.push(entry);
          }
          if (kind === 'code' || kind === 'both') entry.code = true;
          if (kind === 'workout' || kind === 'both') entry.workout = true;
          return entries;
        },
        []
      );
      this.activityMessage = `Logged ${kind} for ${key}. Site will redeploy shortly.`;
    } catch (err) {
      this.activityMessage = `Failed: ${(err as Error).message}`;
    } finally {
      this.activityBusy = false;
    }
  }

  async loadPosts() {
    if (!this.creds) return;
    this.postsLoading = true;
    this.postsError = '';
    try {
      const file = await this.github.getTextFile(this.creds, POSTS_PATH);
      this.posts = JSON.parse(file.content || '[]');
    } catch (err) {
      this.postsError = `Failed to load posts: ${(err as Error).message}`;
    } finally {
      this.postsLoading = false;
    }
  }

  onTitleChange() {
    if (!this.editingSlug) {
      this.form.slug = slugify(this.form.title);
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.imageFile = input.files?.[0] ?? null;
  }

  editPost(post: Post) {
    this.editingSlug = post.slug;
    this.form = { title: post.title, slug: post.slug, content: post.content, published: post.published };
    this.imageFile = null;
    this.saveError = '';
  }

  newPost() {
    this.editingSlug = null;
    this.form = { title: '', slug: '', content: '', published: true };
    this.imageFile = null;
    this.saveError = '';
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async submitPost() {
    if (!this.creds || this.saving || !this.form.title.trim() || !this.form.slug.trim()) return;
    this.saving = true;
    this.saveError = '';

    try {
      let content = this.form.content;

      if (this.imageFile) {
        const ext = this.imageFile.name.split('.').pop() || 'png';
        const filename = `${this.form.slug}-${Date.now()}.${ext}`;
        const base64 = await this.fileToBase64(this.imageFile);
        await this.github.putBinaryFile(
          this.creds,
          `src/assets/uploads/${filename}`,
          base64,
          `Add image for post ${this.form.slug}`
        );
        content += `\n\n![](assets/uploads/${filename})`;
      }

      const editingSlug = this.editingSlug;
      const form = this.form;
      const posts = await this.github.readModifyWriteJson<Post[]>(
        this.creds,
        POSTS_PATH,
        editingSlug ? `Update post ${form.slug}` : `Add post ${form.slug}`,
        (posts) => {
          const existing = posts.find((p) => p.slug === editingSlug);
          if (existing) {
            existing.title = form.title;
            existing.slug = form.slug;
            existing.content = content;
            existing.published = form.published;
          } else {
            posts.unshift({
              slug: form.slug,
              title: form.title,
              date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              content,
              published: form.published,
            });
          }
          return posts;
        },
        []
      );

      this.posts = posts;
      this.newPost();
    } catch (err) {
      this.saveError = `Failed to save: ${(err as Error).message}`;
    } finally {
      this.saving = false;
    }
  }

  async togglePublished(post: Post) {
    if (!this.creds) return;
    post.published = !post.published;
    try {
      this.posts = await this.github.readModifyWriteJson<Post[]>(
        this.creds,
        POSTS_PATH,
        `${post.published ? 'Publish' : 'Unpublish'} post ${post.slug}`,
        (posts) => {
          const target = posts.find((p) => p.slug === post.slug);
          if (target) target.published = post.published;
          return posts;
        },
        []
      );
    } catch (err) {
      post.published = !post.published; // revert on failure
      this.postsError = `Failed to update: ${(err as Error).message}`;
    }
  }

  async deletePost(post: Post) {
    if (!this.creds || !this.isBrowser || !confirm(`Delete "${post.title}"?`)) return;
    try {
      this.posts = await this.github.readModifyWriteJson<Post[]>(
        this.creds,
        POSTS_PATH,
        `Delete post ${post.slug}`,
        (posts) => posts.filter((p) => p.slug !== post.slug),
        []
      );
    } catch (err) {
      this.postsError = `Failed to delete: ${(err as Error).message}`;
    }
  }
}
