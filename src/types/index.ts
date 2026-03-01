export type Language = 'c' | 'cpp' | 'python' | 'rust';

export interface CodeSnippet {
  iterative: string;
  recursive?: string;
}

export interface Complexity {
  time: string;
  space: string;
  timeRating: 'good' | 'average' | 'bad';
  spaceRating: 'good' | 'average' | 'bad';
}

export interface Asset {
  id: string;
  name: string;
  type: 'pdf' | 'text' | 'image' | 'video';
  data: string; // Base64 or Object URL
}

export interface Algorithm {
  id: string;
  name: string;
  category: string;
  icon?: string;
  description: string;
  complexity: Complexity;
  code: Record<Language, CodeSnippet>;
  explanation: {
    problem: string;
    intuition: string;
    walkthrough: string;
    whenToUse: string;
    funFact?: string;
    researchLinks?: { title: string; url: string }[];
  };
  assets?: Asset[];
}

export type Category = {
  name: string;
  icon: string;
  algorithms: string[];
};
