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
    slug: 'AISA School',
    title: 'AISA School',
    tagline: 'AI-powered Sign Language Learning Platform',
    description: 'An AI-powered platform that makes learning sign language accessible through interactive lessons and a digital ASL dictionary.',
    image: './assets/images/AISA-Banner.png',
    tags: ['Web', 'AI'],
    year: '2024',
    role: 'Founder & Engineer',
    overview: 'AISA School is an AI-powered platform designed to make sign language learning more accessible and engaging. The project started with a mission to bridge the communication gap between deaf and hearing communities by combining computer vision, AI, and interactive learning experiences. I built the platform from the ground up, developing the web application, AI-powered learning experiences, and product infrastructure. The platform helps users learn American Sign Language through structured lessons, interactive exercises, and a digital sign language dictionary.',
    highlights: [
      'Built an AI-powered sign language learning platform used by thousands of learners worldwide.',
      'Developed interactive ASL lessons and a sign language dictionary to make learning more accessible.',
      'Collaborated with NVIDIA and explored computer vision models for understanding sign language gestures and expressions.'
    ],
    stack: ['Angular', 'TypeScript', 'Tailwind CSS', 'Python', 'AI/Computer Vision'],
    liveUrl: '',
    repoUrl: ''
  },
  {
    slug: 'Joule',
    title: 'Joule',
    tagline: 'AI-powered Energy Optimization Assistant',
    description: 'An intelligent energy management platform that reduces energy waste while maintaining comfort in homes and small businesses.',
    image: './assets/images/joule.png',
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
