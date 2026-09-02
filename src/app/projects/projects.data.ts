export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  logo: string;
  tags: string[];
  year: string;
  role: string;
  overview: string;
  highlights: string[];
  stack: string[];
  liveUrl?: string;
  liveLabel?: string;
  repoUrl?: string;
}

// Replace these with your real projects — every card and detail page reads from this array.
export const PROJECTS: Project[] = [
  {
    slug: 'AISA School',
    title: 'AISA School',
    tagline: 'AI-powered Sign Language Learning Platform',
    description: 'An AI-powered platform that makes learning sign language accessible through interactive lessons and a digital ASL dictionary.',
    image: './assets/images/AISA-Banner.png',
    logo: './assets/images/projects-logo/AISA-School.png',
    tags: ['Web', 'AI'],
    year: '2024',
    role: 'Founding Member & CTO',
    overview: 'AISA School is an AI-powered platform designed to make sign language learning more accessible and engaging. The project started with a mission to bridge the communication gap between deaf and hearing communities by combining computer vision, AI, and interactive learning experiences. I built the platform from the ground up, developing the web application, AI-powered learning experiences, and product infrastructure. The platform helps users learn American Sign Language through structured lessons, interactive exercises, and a digital sign language dictionary.',
    highlights: [
      'Built an AI-powered sign language learning platform used by thousands of learners worldwide.',
      'Developed interactive ASL lessons and a sign language dictionary to make learning more accessible.',
      'Collaborated with NVIDIA and explored computer vision models for understanding sign language gestures and expressions.'
    ],
    stack: ['Angular', 'TypeScript', 'Tailwind CSS', 'Python', 'AI/Computer Vision'],
    liveUrl: 'https://aisa.solutions/',
    liveLabel: 'View & Download',
    repoUrl: ''
  },
  {
    slug: 'Joule',
    title: 'Joule',
    tagline: 'AI-powered Energy Optimization Assistant',
    description: 'An intelligent energy management platform that reduces energy waste while maintaining comfort in homes and small businesses.',
    image: './assets/images/joule.png',
    logo: './assets/images/projects-logo/joule.png',
    tags: ['Web', 'AI'],
    year: '2025',
    role: 'Founder & Engineer',
    overview: "Joule is an intelligent energy management platform designed to reduce energy waste while maintaining comfort in homes and small businesses. The project started from a simple observation: a significant amount of energy is wasted because heating and cooling systems operate without understanding users' habits, environmental conditions, or actual needs. I built Joule to combine IoT, machine learning, and automation to optimize energy consumption. The system learns usage patterns, analyzes environmental data, and helps users make smarter decisions about heating and cooling — reducing costs while improving efficiency.",
    highlights: [
      'Built an intelligent energy optimization system for HVAC and building energy management.',
      'Developed an IoT-based solution for monitoring and controlling heating and cooling systems.',
      "Won the grand prize at Iran's largest student startup competition with Joule."
    ],
    stack: ['Python', 'Machine Learning', 'IoT', 'Embedded Systems', 'Angular', 'TypeScript'],
    liveUrl: '',
    repoUrl: ''
  },
  {
    slug: 'Miz',
    title: 'Miz',
    tagline: 'Personal Assistant in your new tab',
    description: 'A new-tab replacement that brings weather, clock, calendar, tasks, and quick links together on one clean screen, so you never have to open a dozen tabs just to check the basics.',
    image: './assets/images/Miz-poster.png',
    logo: './assets/images/projects-logo/miz.png',
    tags: ['TypeScript', 'Angular'],
    year: '2024',
    role: 'Developer',
    overview: "Miz replaces the default new-tab page with a calm, glassy dashboard built for desktop screens. Instead of juggling separate tabs and apps for the weather, the time, your calendar, and your to-do list, Miz brings all of it into one view. It auto-detects your location for live weather (no API key or account needed), shows an analog and digital clock, lets you navigate a full calendar, and keeps a daily checklist saved locally in your browser. A smart search bar accepts both queries and direct URLs, and quick-link shortcuts keep frequently visited sites one click away — all with no accounts, no cloud sync, and no data leaving your browser.",
    highlights: [
      'Built a full new-tab replacement dashboard combining weather, clock, calendar, tasks, and quick links.',
      'Integrated Open-Meteo and ipwho.is for key-free, privacy-friendly weather and location detection.',
      'Kept everything local-first — checklist and settings persist in browser storage with no account required.'
    ],
    stack: ['Angular', 'TypeScript', 'RxJS', 'Bootstrap 5', 'Open-Meteo API'],
    liveUrl: 'https://mrpaziresh.github.io/Miz/',
    repoUrl: 'https://github.com/mrpaziresh/Miz'
  },
  {
    slug: 'ApplyBooster',
    title: 'ApplyBooster',
    tagline: 'Resume scoring and instant feedback',
    description: 'A browser-based resume analysis tool that scores resumes out of 100 and gives actionable feedback, processing everything client-side with no server or upload required.',
    image: './assets/images/apply-booster-poster.png',
    logo: './assets/images/projects-logo/apply-booster.png',
    tags: ['Web', 'Angular'],
    year: '2024',
    role: 'Developer',
    overview: "ApplyBooster helps job seekers get instant, honest feedback on their resumes without waiting on a backend or handing their document to a third-party server. Users drag and drop a PDF resume, and a rule-based NLP engine running entirely in the browser analyzes contact info, section structure, formatting, action verbs, quantified achievements, and length. The tool returns an overall score out of 100 along with a clear breakdown of strengths to keep, weaknesses that could hurt in an interview, and specific rewrite suggestions — plus a dashboard that tracks score history and recurring weak points over time.",
    highlights: [
      'Built a fully client-side resume analyzer — PDF parsing and NLP scoring run in the browser with no backend.',
      'Designed a rule-based scoring engine covering structure, formatting, action verbs, and quantified achievements.',
      'Added a progress dashboard tracking check history, average/best scores, and recurring weaknesses over time.'
    ],
    stack: ['Angular', 'TypeScript', 'Angular Material', 'pdf.js', 'Compromise (NLP)', 'SCSS'],
    liveUrl: 'https://mrpaziresh.github.io/Apply-Booster/',
    repoUrl: 'https://github.com/mrpaziresh/Apply-Booster'
  },
    {
    slug: 'Buf',
    title: 'Buf',
    tagline: 'Resume scoring and instant feedback',
    description: 'A browser-based resume analysis tool that scores resumes out of 100 and gives actionable feedback, processing everything client-side with no server or upload required.',
    image: './assets/images/buf-poster.png',
    logo: './assets/images/projects-logo/buf.png',
    tags: ['Web', 'Angular'],
    year: '2024',
    role: 'Developer',
    overview: "ApplyBooster helps job seekers get instant, honest feedback on their resumes without waiting on a backend or handing their document to a third-party server. Users drag and drop a PDF resume, and a rule-based NLP engine running entirely in the browser analyzes contact info, section structure, formatting, action verbs, quantified achievements, and length. The tool returns an overall score out of 100 along with a clear breakdown of strengths to keep, weaknesses that could hurt in an interview, and specific rewrite suggestions — plus a dashboard that tracks score history and recurring weak points over time.",
    highlights: [
      'Built a fully client-side resume analyzer — PDF parsing and NLP scoring run in the browser with no backend.',
      'Designed a rule-based scoring engine covering structure, formatting, action verbs, and quantified achievements.',
      'Added a progress dashboard tracking check history, average/best scores, and recurring weaknesses over time.'
    ],
    stack: ['Angular', 'TypeScript', 'Angular Material', 'pdf.js', 'Compromise (NLP)', 'SCSS'],
    liveUrl: 'https://mrpaziresh.github.io/Apply-Booster/',
    repoUrl: 'https://github.com/mrpaziresh/Apply-Booster'
  },
  // {
  //   slug: 'project-three',
  //   title: 'Project Three',
  //   tagline: 'One-line summary of what this project is.',
  //   description: 'A short, punchy description of the problem this project solves and who it is for.',
  //   image: './assets/images/AISA-Banner.png',
  //   tags: ['Design', 'Tooling'],
  //   year: '2023',
  //   role: 'Designer & Engineer',
  //   overview: 'A longer paragraph explaining the motivation behind the project, the problem it addresses, and the outcome. Replace this with the real story of what you built and why.',
  //   highlights: [
  //     'Key feature or achievement number one.',
  //     'Key feature or achievement number two.',
  //     'Key feature or achievement number three.'
  //   ],
  //   stack: ['Figma', 'React'],
  //   liveUrl: '',
  //   repoUrl: ''
  // }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
