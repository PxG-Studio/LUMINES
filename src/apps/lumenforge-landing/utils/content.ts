/**
 * Content Management Utilities
 * EC-207, EC-208: Structured content configuration
 */
export interface HeroContent {
  headline: string;
  subheadline: string;
  description: string;
}

export interface SectionContent {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
}

export interface SiteContent {
  hero: HeroContent;
  sections: SectionContent[];
}

export const defaultContent: SiteContent = {
  hero: {
    headline: 'Your Entire Creative Pipeline in One Workspace',
    subheadline: 'Lumenforge.io unifies AI generation, design tokens, blueprint editing, live previews, and deployment into a single, high-velocity development environment built for modern teams.',
    description:
      'Describe what you want to build. LumenForge transforms ideas into shipping experiences with AI-assisted coding and one-click deployment.',
  },
  sections: [
    {
      id: 'spark',
      title: 'Spark IDE',
      subtitle: 'Create with natural language and AI-assisted workflows',
      bullets: [
        'Natural language to code',
        'Real-time AI assistance',
        'Multi-language support',
        'Smart autocomplete',
      ],
    },
    {
      id: 'ignis',
      title: 'Ignis Runtime',
      subtitle: 'WebContainer-powered execution environment',
      bullets: [
        'Instant code execution',
        'Hot module replacement',
        'Full NPM ecosystem',
        'Browser-native runtime',
      ],
    },
  ],
};
