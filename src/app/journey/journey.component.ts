import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

interface Milestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  current?: boolean;
  images?: string[];
}

@Component({
  selector: 'app-journey',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journey.component.html',
  styleUrl: './journey.component.scss'
})
export class JourneyComponent {
  milestones: Milestone[] = [
    {
      year: '2019',
      title: 'Write my first line of code',
      subtitle: 'I started my programming journey by teaching myself Java and C++.',
      description: 'My first project was a simple BMI calculator, a small script but a huge milestone. With the support of my first mentor, M. Mosavi, I gained the confidence to keep learning.',
      tags: ['Curiosity']
    },
    {
      year: '2020',
      title: 'First Project, A Gift for My Mother!',
      subtitle: 'I created my first real prject for my uncle’s jewelry gallery.',
      description: 'For the first time in Iran, I created a smart jewelry concept as a gift for my mother. When she touched the necklace by phone, it played a personal voice message from me, reminding her how much I love her.',
        images: [
        './assets/images/journey/smart-jewerly.jpg'
      ],
      tags: ['Work']
    },
    {
      year: '2021',
      title: 'My First Application',
      subtitle: 'Simple practice became my first startup.',
      description: 'I built BUF with my best friend, an education platform designed to bring students together, make studying more social, and turn education into something fun.',
      tags: ['Education', 'Startup'],
      images: [
        './assets/images/journey/buf-poster.JPG',
        './assets/images/journey/buf-present-cs50.JPG',
        './assets/images/journey/mainbanner.jpg',
        './assets/images/journey/cs50interview.mp4'
      ]
    },
    {
      year: '2022',
      title: 'Working at a Large Company',
      subtitle: 'A small idea that helped a big tech company.',
      description: 'I had the opportunity to work with the largest buy-and-sell platform in the Middle East (Divar), helping solve fraud prevention challenges. A fun fact: I started this journey while still in school, working remotely after classes and on-site during weekends. Thanks to my mentor, Peyman Kazemi, for his guidance and trust.',
         images: [
        './assets/images/journey/Divar-events.jpeg',
        './assets/images/journey/paseban.jpeg',
        './assets/images/journey/Divar-photos.JPG',

      ],
      tags: ['Work', 'Growth']
    },
    {
      year: '2023',
      title: 'Won Iran Mobile Congress 🏆',
      subtitle: 'Building technology to make audio more accessible.',
      description: 'I built Podio, an AI-powered podcast platform that helps make audio content accessible for Deaf and hard-of-hearing individuals. At the Iran Mobile Congress, in front of leading figures from Iran’s startup ecosystem, Podio won 1st place among competing products.',
               images: [
        './assets/images/journey/padio-congress.JPG',
        './assets/images/journey/padio-pic.JPG',
        './assets/images/journey/Ahora-padio.JPG',

      ],
      tags: ['Award']
    },
        {
      year: '2023',
      title: 'Full-Time Job',
      subtitle: 'My first step into a professional tech career.',
      description: 'I joined Asan Pardakht (AP), one of the largest fintech companies in the Middle East, where I learned how to grow as a developer and build products at scale. I had an amazing experience working with talented teammates. Special thanks to H. Zafari, Dr. Hosseiny, and M. GhaderiAzar for their guidance and support throughout this journey.',
               images: [
        './assets/images/journey/AP-1.JPG',
        './assets/images/journey/AP-2.JPG',
        './assets/images/journey/AP-3.JPG',

      ],
      tags: ['Work']
    },
        {
      year: '2023',
      title: 'Quitting Full-Time Job to Build My Dream',
      subtitle: 'A side project that became my mission.',
      description: ' AISA started as a side project while I was working full-time, but over time it became a meaningful part of who I am. We built AISA to discover how much impact we could create in the world. Along the way, we met many people struggling with communication barriers with Deaf individuals and heard their stories. Could we help? Maybe. Could we change lives? I believe we are still far from our ultimate goal,  but every person we help brings us one step closer.',
      images: [
        './assets/images/journey/aisa-pic1.JPG',
        './assets/images/journey/AISA-Pic2.JPG',
        './assets/images/journey/websummit-aisa.jpeg',

      ],
      tags: ['Work']
    },
              {
      year: '2024',
      title: 'Running from Asia to Europe 🏃‍♂️🌍',
      subtitle: 'Turning my passion for running and traveling into a challenge.',
      description: 'Running and traveling have always been two of my favorite things, so I combined them into one unforgettable journey. After 6 months of training, I completed the Istanbul Marathon, running from the Asian side to the European side of the city.Huge thanks to my coach M. Farshidfar for the guidance and support throughout this journey.',
               images: [
        './assets/images/journey/Istanbul-m-1.jpg',
        './assets/images/journey/Istanbul-m-2.PNG',

      ],
      tags: ['Sport']
    },
              {
      year: '2024',
      title: 'Speaking at a Gen Z Seminar ',
      subtitle: 'Sharing experiences with the next generation of professionals.',
      description: 'I was invited to speak about Gen Z in the workplace and share my experiences with career growth, technology, and networking. I had the opportunity to connect with students and professionals at the Industrial Management Institute and share lessons from my journey.',
               images: [
        './assets/images/journey/gen-z-seminar.JPG',
        './assets/images/journey/gen-z-seminar1.JPG',

      ],
      tags: ['Talk']
    },
    {
      year: 'Now',
      title: 'Still geeking out',
      subtitle: 'Open to interesting problems',
      description: 'Currently looking for the next hard, weird, worth-solving problem. Ask me about it.',
      tags: ['Present'],
      current: true
    }
  ];

  lightboxImages: string[] = [];
  lightboxIndex = 0;

  openLightbox(images: string[], index: number): void {
    this.lightboxImages = images;
    this.lightboxIndex = index;
  }

  closeLightbox(): void {
    this.lightboxImages = [];
  }

  isVideo(path: string): boolean {
    return /\.(mp4|webm|mov|ogg)$/i.test(path);
  }

  showPrev(event: Event): void {
    event.stopPropagation();
    this.lightboxIndex = (this.lightboxIndex - 1 + this.lightboxImages.length) % this.lightboxImages.length;
  }

  showNext(event: Event): void {
    event.stopPropagation();
    this.lightboxIndex = (this.lightboxIndex + 1) % this.lightboxImages.length;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.lightboxImages.length) {
      return;
    }
    if (event.key === 'Escape') {
      this.closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      this.showPrev(event);
    } else if (event.key === 'ArrowRight') {
      this.showNext(event);
    }
  }
}
