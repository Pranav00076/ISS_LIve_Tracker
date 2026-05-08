import axios from 'axios';

export interface TavilyArticle {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date: string;
  image?: string;
}

export interface TavilyResponse {
  query: string;
  results: TavilyArticle[];
}

export const tavilyService = {
  getLatestNews: async (query: string = "latest space news"): Promise<TavilyArticle[]> => {
    const apiKey = import.meta.env.VITE_TAVILY_API_KEY;
    
    if (!apiKey) {
      throw new Error('Tavily API key is missing. Please set VITE_TAVILY_API_KEY in your environment variables.');
    }

    try {
      const response = await axios.post<TavilyResponse>(
        'https://api.tavily.com/search',
        {
          api_key: apiKey,
          query: query,
          search_depth: "advanced",
          include_answer: false,
          include_images: true,
          max_results: 15, // Let's fetch 15 to have enough
          topic: "news"
        }
      );
      
      const articles = response.data.results.map(article => ({
        ...article,
        // Fallback for missing date or image
        published_date: article.published_date || new Date().toISOString(),
      }));

      return articles;
    } catch (error: any) {
      if (error.response?.status === 401) {
          throw new Error('Invalid Tavily API key');
      }
      if (error.response?.status === 429) {
          throw new Error('Tavily API rate limit exceeded');
      }
      throw new Error(error.response?.data?.message || error.message || 'Network error occurred while fetching news');
    }
  }
};
