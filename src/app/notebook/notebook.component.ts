import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Web3FormsService } from '../shared/web3forms.service';
import { ARTICLES, estimateReadTime, getExcerpt } from './notebook.data';

@Component({
  selector: 'app-notebook',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './notebook.component.html',
  styleUrl: './notebook.component.scss'
})
export class NotebookComponent {
  articles = ARTICLES;
  getExcerpt = getExcerpt;
  getReadTime = estimateReadTime;

  constructor(private web3forms: Web3FormsService) {}

  subscribeOpen = false;
  subscribeModalVisible = false;
  subscribeName = '';
  subscribeEmail = '';
  subscribeSubmitted = false;
  subscribeSending = false;
  subscribeError = false;

  openSubscribe() {
    this.subscribeName = '';
    this.subscribeEmail = '';
    this.subscribeSubmitted = false;
    this.subscribeSending = false;
    this.subscribeError = false;
    this.subscribeOpen = true;
    requestAnimationFrame(() => requestAnimationFrame(() => (this.subscribeModalVisible = true)));
  }

  closeSubscribe() {
    this.subscribeModalVisible = false;
    setTimeout(() => (this.subscribeOpen = false), 300);
  }

  async submitSubscribe() {
    if (!this.subscribeName.trim() || !this.subscribeEmail.trim() || this.subscribeSending) return;
    this.subscribeSending = true;
    this.subscribeError = false;

    const ok = await this.web3forms.submit({
      subject: 'Portfolio: new notebook subscriber',
      from_name: this.subscribeName.trim(),
      email: this.subscribeEmail.trim(),
      message: `${this.subscribeName.trim()} (${this.subscribeEmail.trim()}) subscribed to the notebook.`,
    });

    this.subscribeSending = false;
    if (ok) {
      this.subscribeSubmitted = true;
      setTimeout(() => this.closeSubscribe(), 1400);
    } else {
      this.subscribeError = true;
    }
  }
}
