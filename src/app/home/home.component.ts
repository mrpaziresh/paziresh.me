import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import activityData from '../data/activity.json';
import { ActivityEntry } from '../data/types';
import { ARTICLES } from '../notebook/notebook.data';
import { Web3FormsService } from '../shared/web3forms.service';

interface DayData {
  date: Date;
  code?: number;    // 0-4
  workout?: number; // 0-4
}

interface MediaItem {
  title: string;
  subtitle: string;
  color: string;
  thumbUrl: string;
  coverUrl: string;
  failed?: boolean;
}

interface ScrollState {
  atStart: boolean;
  atEnd: boolean;
  hasOverflow: boolean;
}

interface PressItem {
  title: string;
  subtitle: string;
  description: string;
  mediaUrl: string; // full-res image or video, shown in the detail panel
  thumbUrl?: string; // small grid/preview thumbnail — generated for local media, see scripts/generate-journey-thumbnails.mjs
  link?: string; // external page/video this item points to — shown as a button instead of inline playback
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private web3forms: Web3FormsService) {}

  visitedCountries = [
    { name: 'Qatar', flag: '🇶🇦 -' },
    { name: 'Turkey', flag: '🇹🇷 -' },
    { name: 'Iran', flag: '🇮🇷 -' },
    { name: 'Saudi Arabia', flag: '🇸🇦 .' }
  ];

  books: MediaItem[] = [
    { title: 'Build', subtitle: 'Tony Fadell', color: 'bg-gray-700', thumbUrl: 'https://covers.openlibrary.org/b/isbn/9781787634114-M.jpg', coverUrl: 'https://covers.openlibrary.org/b/isbn/9781787634114-L.jpg' },
    { title: 'Reboot', subtitle: 'Jerry Colonna', color: 'bg-gray-800', thumbUrl: 'https://covers.openlibrary.org/b/isbn/9780062977120-M.jpg', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062977120-L.jpg' },
    { title: 'Scramble', subtitle: 'Marty Neumeier', color: 'bg-gray-600', thumbUrl: 'https://images.squarespace-cdn.com/content/v1/57b27c5be58c62b96df66901/1527626332973-S1XLI5LS3OJC5GAYXFN8/SCRAMBLE-cover_vertical_300pxbook.png', coverUrl: 'https://images.squarespace-cdn.com/content/v1/57b27c5be58c62b96df66901/1527626332973-S1XLI5LS3OJC5GAYXFN8/SCRAMBLE-cover_vertical_300pxbook.png' },
    { title: 'Thinking, Fast and Slow', subtitle: 'Daniel Kahneman', color: 'bg-gray-800', thumbUrl: 'https://covers.openlibrary.org/b/isbn/9780374533557-M.jpg', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg' },
    { title: 'The Pragmatic Programmer', subtitle: 'Hunt & Thomas', color: 'bg-gray-700', thumbUrl: 'https://covers.openlibrary.org/b/isbn/9780201616224-M.jpg', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780201616224-L.jpg' },
    { title: 'Clean Code', subtitle: 'Robert C. Martin', color: 'bg-gray-600', thumbUrl: 'https://covers.openlibrary.org/b/isbn/9780132350884-M.jpg', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg' },
    { title: 'Sapiens', subtitle: 'Yuval Noah Harari', color: 'bg-gray-900', thumbUrl: 'https://covers.openlibrary.org/b/isbn/9780062316097-M.jpg', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg' },
    { title: 'Deep Work', subtitle: 'Cal Newport', color: 'bg-gray-500', thumbUrl: 'https://covers.openlibrary.org/b/isbn/9781455586691-M.jpg', coverUrl: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg' },
    { title: 'The Design of Everyday Things', subtitle: 'Don Norman', color: 'bg-gray-700', thumbUrl: 'https://covers.openlibrary.org/b/isbn/9780465050659-M.jpg', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg' },
    { title: 'Superintelligence', subtitle: 'Nick Bostrom', color: 'bg-gray-800', thumbUrl: 'https://covers.openlibrary.org/b/isbn/9780199678112-M.jpg', coverUrl: 'https://covers.openlibrary.org/b/isbn/9780199678112-L.jpg' },
  ];

  movies: MediaItem[] = [
    { title: 'Silicon Valley', subtitle: '2014', color: 'bg-gray-700', thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Silicon_Valley_Season_1.jpg', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Silicon_Valley_Season_1.jpg' },
    { title: 'From', subtitle: '2022', color: 'bg-gray-800', thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fa/From_title_card.jpg', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fa/From_title_card.jpg' },
    { title: 'Free Guy', subtitle: '2021', color: 'bg-gray-600', thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Free_Guy_2021_Poster.jpg', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Free_Guy_2021_Poster.jpg' },
    { title: 'The Matrix', subtitle: '1999', color: 'bg-gray-800', thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/d/db/The_Matrix.png', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/db/The_Matrix.png' },
    { title: 'Interstellar', subtitle: '2014', color: 'bg-gray-700', thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg' },
    { title: 'The Social Network', subtitle: '2010', color: 'bg-gray-600', thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8c/The_Social_Network_film_poster.png', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8c/The_Social_Network_film_poster.png' },
    { title: 'Ex Machina', subtitle: '2014', color: 'bg-gray-900', thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Ex-machina-uk-poster.jpg', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Ex-machina-uk-poster.jpg' },
    { title: 'Inception', subtitle: '2010', color: 'bg-gray-500', thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg' },
    { title: 'Whiplash', subtitle: '2014', color: 'bg-gray-700', thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/0/01/Whiplash_poster.jpg', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/01/Whiplash_poster.jpg' },
    { title: 'Her', subtitle: '2013', color: 'bg-gray-800', thumbUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Her2013Poster.jpg', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Her2013Poster.jpg' },
  ];

  // Sample entries — swap in real press/speaking links & write-ups as they happen.
  pressItems: PressItem[] = [
    {
      title: 'Digiato — Elecomp Pitch Winners',
      subtitle: 'Digiato · Elecomp Competition',
      description: "Digiato's coverage of the Elecomp Pitch competition, where the top prize went to a medical AI startup.",
      mediaUrl: './assets/images/journey/digiato-news.png',
      thumbUrl: './assets/images/journey/thumbs/digiato-news.jpg'
    },
    {
      title: 'European Young Innovators Award',
      subtitle: 'World Summit Award (WSA) · Austria',
      description: 'AISA School was named a winner by the World Summit Award (WSA) Global, recognizing European young innovators.',
      mediaUrl: 'https://wsa-global.org/wp-content/uploads/2024/09/thumbnail_IMG_0631.jpg',
      link: 'https://wsa-global.org/winner/aisa-school/'
    },
     {
      title: 'Featured on TV Channel 5 News',
      subtitle: 'Channel 5 · TV News',
      description: 'A segment on Channel 5 TV news.',
      mediaUrl: './assets/images/journey/thumbs/TV5.mp4',
      thumbUrl: './assets/images/journey/thumbs/TV5.jpg'
    },
    {
      title: 'Peivast — Web Summit Qatar',
      subtitle: 'Peivast News · Web Summit Qatar',
      description: 'Peivast covered our presence at Web Summit Qatar, one of the largest tech events in the region.',
      mediaUrl: './assets/images/journey/thumbs/payvast.mp4',
      thumbUrl: './assets/images/journey/thumbs/payvast.jpg'
    },

    {
      title: 'Talk — Networking for Gen Z',
      subtitle: 'Speech · Career & Networking',
      description: 'A talk on networking and career growth for Gen Z.',
      // Google Drive's thumbnail endpoint gets blocked by Chrome's Opaque
      // Response Blocking when hotlinked directly, so this is a local copy.
      mediaUrl: './assets/images/journey/gen-z-seminar1.JPG',
      thumbUrl: './assets/images/journey/gen-z-seminar1.JPG',
      link: 'https://drive.google.com/file/d/17N8qb6wDa0iMYCGQvqlFGUNi62wPXcfz/view?usp=drive_link'
    },
    {
      title: 'CS50x Iran Interview',
      subtitle: 'CS50x Iran · 2021',
      description: 'Interviewed for CS50x Iran about BUF, the education platform I built with my best friend to make studying more social.',
      mediaUrl: './assets/images/journey/cs50interview.mp4',
      thumbUrl: './assets/images/journey/thumbs/cs50interview.jpg'
    }
  ];

  selectedPress: PressItem | null = null;
  pressPanelVisible = false;

  selectedMedia: MediaItem | null = null;
  mediaModalVisible = false;
  mediaCoverFailed = false;

  bookScrollState: ScrollState = { atStart: true, atEnd: false, hasOverflow: false };
  movieScrollState: ScrollState = { atStart: true, atEnd: false, hasOverflow: false };
  pressScrollState: ScrollState = { atStart: true, atEnd: false, hasOverflow: false };

  @ViewChild('booksRow') booksRow?: ElementRef<HTMLElement>;
  @ViewChild('moviesRow') moviesRow?: ElementRef<HTMLElement>;
  @ViewChild('pressRow') pressRow?: ElementRef<HTMLElement>;

  suggestKind: 'book' | 'movie' | null = null;
  suggestModalVisible = false;
  suggestValue = '';
  suggestSubmitted = false;
  suggestSending = false;
  suggestError = false;

  @ViewChild('suggestInput') suggestInputRef?: ElementRef<HTMLInputElement>;

  weeks: DayData[][] = [];
  monthLabels: string[] = [];

  latestPosts = ARTICLES.slice(0, 3);

  @ViewChild('gridScroll') gridScroll?: ElementRef<HTMLElement>;
  @ViewChild('tooltip') tooltip?: ElementRef<HTMLElement>;

  private formatDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  ngOnInit() {
    const activityByDate = new Map<string, ActivityEntry>(
      (activityData as ActivityEntry[]).map((entry) => [entry.date, entry])
    );

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6); // 6 months ago
    startDate.setDate(startDate.getDate() - startDate.getDay()); // align to Sunday

    const today = new Date();
    const current = new Date(startDate);
    const weeks: DayData[][] = [];

    while (current <= today) {
      const week: DayData[] = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(current);
        const entry = activityByDate.get(this.formatDateKey(day));
        week.push({
          date: day,
          code: entry?.code ? 4 : 0,
          workout: entry?.workout ? 4 : 0
        });
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }

    this.weeks = weeks;
    this.monthLabels = weeks.map((week, i) => {
      const month = week[0].date.toLocaleDateString('en-US', { month: 'short' });
      const prevMonth = i > 0 ? weeks[i - 1][0].date.toLocaleDateString('en-US', { month: 'short' }) : null;
      return month !== prevMonth ? month : '';
    });
  }

  ngAfterViewInit() {
    const el = this.gridScroll?.nativeElement;
    if (el) {
      const scrollToEnd = () => (el.scrollLeft = el.scrollWidth);
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        document.fonts.ready.then(scrollToEnd);
      } else {
        setTimeout(scrollToEnd);
      }
    }

    setTimeout(() => {
      this.updateScrollState(this.booksRow?.nativeElement, this.bookScrollState);
      this.updateScrollState(this.moviesRow?.nativeElement, this.movieScrollState);
      this.updateScrollState(this.pressRow?.nativeElement, this.pressScrollState);
    });
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateScrollState(this.booksRow?.nativeElement, this.bookScrollState);
    this.updateScrollState(this.moviesRow?.nativeElement, this.movieScrollState);
    this.updateScrollState(this.pressRow?.nativeElement, this.pressScrollState);
  }

  updateScrollState(el: HTMLElement | undefined, state: ScrollState) {
    if (!el) return;
    state.hasOverflow = el.scrollWidth > el.clientWidth + 1;
    state.atStart = el.scrollLeft <= 4;
    state.atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
  }

  scrollRow(el: HTMLElement | undefined, direction: 'left' | 'right') {
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }

  showTooltip(day: DayData, cellEl: HTMLElement) {
    this.displayTooltip(this.getTooltipText(day), cellEl);
  }

  showMediaTooltip(item: MediaItem, el: HTMLElement) {
    this.displayTooltip(`${item.title} — ${item.subtitle}`, el);
  }

  private displayTooltip(text: string, targetEl: HTMLElement) {
    const tooltip = this.tooltip?.nativeElement;
    if (!tooltip) return;

    tooltip.textContent = text;
    tooltip.style.display = 'block';

    const margin = 8;
    const targetRect = targetEl.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - tooltipRect.width - margin));

    let top = targetRect.top - tooltipRect.height - margin;
    if (top < margin) {
      top = targetRect.bottom + margin; // flip below if there's no room above
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  hideTooltip() {
    const tooltip = this.tooltip?.nativeElement;
    if (tooltip) tooltip.style.display = 'none';
  }

  isVideo(path: string): boolean {
    return /\.(mp4|webm|mov|ogg)$/i.test(path);
  }

  // Distinguishes a tap from a scroll-drag on horizontally scrolling rows —
  // otherwise a touch-drag scroll on mobile also fires a click and opens the item.
  private rowDragStart: { x: number; y: number } | null = null;
  private rowDragged = false;

  onRowPointerDown(event: PointerEvent) {
    this.rowDragStart = { x: event.clientX, y: event.clientY };
  }

  onRowPointerUp(event: PointerEvent) {
    if (this.rowDragStart) {
      const dx = Math.abs(event.clientX - this.rowDragStart.x);
      const dy = Math.abs(event.clientY - this.rowDragStart.y);
      this.rowDragged = dx > 6 || dy > 6;
    }
    this.rowDragStart = null;
  }

  private consumeRowDrag(): boolean {
    const dragged = this.rowDragged;
    this.rowDragged = false;
    return dragged;
  }

  openPress(item: PressItem) {
    if (this.consumeRowDrag()) return;
    this.selectedPress = item;
    requestAnimationFrame(() => requestAnimationFrame(() => (this.pressPanelVisible = true)));
  }

  closePress() {
    this.pressPanelVisible = false;
    setTimeout(() => (this.selectedPress = null), 300);
  }

  openMedia(item: MediaItem) {
    if (this.consumeRowDrag()) return;
    this.mediaCoverFailed = false;
    this.selectedMedia = item;
    requestAnimationFrame(() => requestAnimationFrame(() => (this.mediaModalVisible = true)));
  }

  closeMedia() {
    this.mediaModalVisible = false;
    setTimeout(() => (this.selectedMedia = null), 300);
  }

  openSuggest(kind: 'book' | 'movie') {
    this.suggestKind = kind;
    this.suggestValue = '';
    this.suggestSubmitted = false;
    this.suggestError = false;
    this.suggestSending = false;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      this.suggestModalVisible = true;
      this.suggestInputRef?.nativeElement.focus();
    }));
  }

  closeSuggest() {
    this.suggestModalVisible = false;
    setTimeout(() => (this.suggestKind = null), 300);
  }

  async submitSuggestion() {
    if (!this.suggestValue.trim() || this.suggestSending) return;
    this.suggestSending = true;
    this.suggestError = false;

    const ok = await this.web3forms.submit({
      subject: `Portfolio: new ${this.suggestKind} suggestion`,
      from_name: `Suggest a ${this.suggestKind}`,
      message: this.suggestValue.trim(),
    });

    this.suggestSending = false;
    if (ok) {
      this.suggestSubmitted = true;
      setTimeout(() => this.closeSuggest(), 1400);
    } else {
      this.suggestError = true;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.selectedMedia) this.closeMedia();
    if (this.suggestKind) this.closeSuggest();
    if (this.selectedPress) this.closePress();
  }

  getCellClass(code?: number, workout?: number): string {
    if (code && workout) {
      return 'bg-green-purple'; // custom diagonal gradient
    }
    if (code) {
      return 'bg-green-400';
    }
    if (workout) {
      return 'bg-purple-400';
    }
    return 'bg-gray-100'; // default (empty)
  }



  getTooltipText(day: { code?: number, workout?: number, date?: Date }): string {
    if (!day?.date) return '';
  
    const dateStr = new Date(day.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  
    if (day.code && day.workout) {
      return `Git contribution & Gym workout on ${dateStr}`;
    }
    if (day.code) {
      return `Git contribution on ${dateStr}`;
    }
    if (day.workout) {
      return `Gym workout on ${dateStr}`;
    }
    return `No activity on ${dateStr}`;
  }
  
  


  getIntensityColor(type: 'code' | 'workout', level: number): string {
    const shades = type === 'code'
      ? ['#d1fae5', '#6ee7b7']  // green
      : ['#e9d5ff', '#d8b4fe']; // purple
    return shades[level] || '#e5e7eb'; // default gray
  }
  
  getSingleColorClass(code?: number, workout?: number): string {
    if (code && code > 0) return 'bg-green-400';
    if (workout && workout > 0) return 'bg-purple-400';
    return 'bg-gray-100'; // default (empty)
  }
  
  
  
  getDiagonalGradient(code: number, workout: number): string {
    const green = this.getIntensityColor('code', code);
    const purple = this.getIntensityColor('workout', workout);
    return `linear-gradient(135deg, ${green} 50%, ${purple} 50%)`;
  }
  
}
