export interface ActivityEntry {
  date: string; // YYYY-MM-DD, local calendar day
  code: boolean;
  workout: boolean;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string; // markdown
  published: boolean;
}
