export type Insight = {
  insight: string;
  recommendation: string;
};

export type CommunityPost = {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string;
  content: string;
  likes: number;
  comments: number;
};
