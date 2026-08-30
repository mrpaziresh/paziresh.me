export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  tags: string[];
  year: string;
  role: string;
  overview: string;
  highlights: string[];
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
}

// Replace these with your real projects — every card and detail page reads from this array.
export const PROJECTS: Project[] = [
  {
    slug: 'project-one',
    title: 'Project One',
    tagline: 'One-line summary of what this project is.',
    description: 'A short, punchy description of the problem this project solves and who it is for.',
    image: './assets/images/AISA-Banner.png',
    tags: ['Web', 'AI'],
    year: '2025',
    role: 'Founder & Engineer',
    overview: 'A longer paragraph explaining the motivation behind the project, the problem it addresses, and the outcome. Replace this with the real story of what you built and why.',
    highlights: [
      'Key feature or achievement number one.',
      'Key feature or achievement number two.',
      'Key feature or achievement number three.'
    ],
    stack: ['Angular', 'TypeScript', 'Tailwind CSS'],
    liveUrl: '',
    repoUrl: ''
  },
  {
    slug: 'project-two',
    title: 'Project Two',
    tagline: 'One-line summary of what this project is.',
    description: 'A short, punchy description of the problem this project solves and who it is for.',
    image: './assets/images/AISA-Banner.png',
    tags: ['Mobile', 'Backend'],
    year: '2024',
    role: 'Engineer',
    overview: 'A longer paragraph explaining the motivation behind the project, the problem it addresses, and the outcome. Replace this with the real story of what you built and why.',
    highlights: [
      'Key feature or achievement number one.',
      'Key feature or achievement number two.',
      'Key feature or achievement number three.'
    ],
    stack: ['Node.js', 'PostgreSQL'],
    liveUrl: '',
    repoUrl: ''
  },
  {
    slug: 'project-three',
    title: 'Project Three',
    tagline: 'One-line summary of what this project is.',
    description: 'A short, punchy description of the problem this project solves and who it is for.',
    image: './assets/images/AISA-Banner.png',
    tags: ['Design', 'Tooling'],
    year: '2023',
    role: 'Designer & Engineer',
    overview: 'A longer paragraph explaining the motivation behind the project, the problem it addresses, and the outcome. Replace this with the real story of what you built and why.',
    highlights: [
      'Key feature or achievement number one.',
      'Key feature or achievement number two.',
      'Key feature or achievement number three.'
    ],
    stack: ['Figma', 'React'],
    liveUrl: '',
    repoUrl: ''
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
