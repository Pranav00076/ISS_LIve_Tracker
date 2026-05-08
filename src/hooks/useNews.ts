import { useState, useEffect, useCallback, useMemo } from "react";
import { tavilyService, TavilyArticle } from "../services/tavilyService";
import { getCachedData, setCachedData } from "../utils/cacheUtils";
import toast from "react-hot-toast";

const CACHE_KEY = "tavily_news_cache";

export type SortOption = "newest" | "oldest" | "source_az";
export type ArticleCategory =
  | "All"
  | "Space"
  | "Technology"
  | "Science"
  | "World"
  | "AI";

export function categorizeArticle(
  title: string,
  content: string,
): ArticleCategory {
  const text = (title + " " + content).toLowerCase();

  // Use regex for whole word match to avoid false positives (e.g., matching 'ai' in 'trail')
  if (
    /\b(?:ai|artificial intelligence|machine learning|deep learning)\b/i.test(
      text,
    )
  )
    return "AI";
  if (
    /\b(?:space|nasa|orbit|satellite|astronaut|spacex|mars|moon|galaxy)\b/i.test(
      text,
    )
  )
    return "Space";
  if (
    /\b(?:tech|software|hardware|apple|google|microsoft|cybersecurity|chip)\b/i.test(
      text,
    )
  )
    return "Technology";
  if (
    /\b(?:science|research|study|quantum|physics|discovery|scientist)\b/i.test(
      text,
    )
  )
    return "Science";
  return "World";
}

export function useNews() {
  const [articles, setArticles] = useState<TavilyArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtering and Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [selectedCategory, setSelectedCategory] =
    useState<ArticleCategory>("All");

  // Pagination State (Show 5 initially)
  const [visibleCount, setVisibleCount] = useState(5);

  const fetchNews = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!forceRefresh) {
        const cached = getCachedData<TavilyArticle[]>(CACHE_KEY);
        if (cached && cached.length > 0) {
          setArticles(cached);
          setIsLoading(false);
          return;
        }
      }

      // We combine topics to get a good mix of results since this is an ISS / News dashboard
      const data = await tavilyService.getLatestNews(
        "latest space exploration and technology news",
      );

      if (!data || data.length === 0) {
        throw new Error("No articles found");
      }

      setArticles(data);
      setCachedData(CACHE_KEY, data);

      if (forceRefresh) {
        toast.success("News updated successfully!");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch news");
      if (forceRefresh) {
        toast.error(`Update failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Handle Search and Sort
  const processedArticles = useMemo(() => {
    let result = [...articles];

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.content.toLowerCase().includes(lowerQuery) ||
          // try to extract domain for source filtering (naive extraction)
          new URL(article.url).hostname.toLowerCase().includes(lowerQuery),
      );
    }

    const categoryDistribution = {
      Space: 0,
      Technology: 0,
      Science: 0,
      World: 0,
      AI: 0,
    };

    result.forEach((article) => {
      const cat = categorizeArticle(article.title, article.content);
      if (cat !== "All") categoryDistribution[cat]++;
    });

    const categoryData = Object.entries(categoryDistribution)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(
        (article) =>
          categorizeArticle(article.title, article.content) ===
          selectedCategory,
      );
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.published_date).getTime();
      const dateB = new Date(b.published_date).getTime();

      if (sortOption === "newest") return dateB - dateA;
      if (sortOption === "oldest") return dateA - dateB;
      if (sortOption === "source_az") {
        const domainA = new URL(a.url).hostname.replace("www.", "");
        const domainB = new URL(b.url).hostname.replace("www.", "");
        return domainA.localeCompare(domainB);
      }
      return 0;
    });

    return { result, categoryData };
  }, [articles, searchQuery, sortOption, selectedCategory]);

  const visibleArticles = processedArticles.result.slice(0, visibleCount);
  const hasMore = visibleCount < processedArticles.result.length;

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const refreshNews = () => {
    setVisibleCount(5); // Reset visible count on refresh
    fetchNews(true);
  };

  return {
    articles: visibleArticles,
    totalCount: processedArticles.result.length,
    categoryData: processedArticles.categoryData,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    hasMore,
    loadMore,
    refreshNews,
  };
}
