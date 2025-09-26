import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Newspaper, 
  Search, 
  Filter,
  TrendingUp,
  Calendar,
  ExternalLink,
  Globe,
  Tag,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Bookmark,
  Share2
} from 'lucide-react';
import { 
  getTechNews, 
  getLatestTechNews, 
  getTechTrends, 
  searchTechNews, 
  getTechCategories 
} from '../Services/NewsService';

const News = () => {
  const { token } = useAuth();
  const [news, setNews] = useState([]);
  const [trends, setTrends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState('articles'); // 'articles' or 'trends'
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());

  // Mock data for fallback
  const mockNews = [
    {
      articleId: '1',
      title: 'AI Revolution: New Breakthrough in Machine Learning',
      description: 'Scientists develop new AI model that can process natural language with unprecedented accuracy.',
      content: 'A team of researchers has developed a new artificial intelligence model that can understand and generate human-like text with remarkable precision...',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      sourceName: 'TechCrunch',
      sourceUrl: 'https://techcrunch.com',
      category: 'technology',
      pubDate: new Date().toISOString(),
      author: 'John Smith',
      keywords: ['AI', 'Machine Learning', 'Technology']
    },
    {
      articleId: '2',
      title: 'Quantum Computing Breakthrough Announced',
      description: 'New quantum processor achieves quantum supremacy in specific calculations.',
      content: 'Researchers have announced a major breakthrough in quantum computing that could revolutionize cryptography and optimization problems...',
      imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      sourceName: 'Wired',
      sourceUrl: 'https://wired.com',
      category: 'science',
      pubDate: new Date(Date.now() - 86400000).toISOString(),
      author: 'Jane Doe',
      keywords: ['Quantum Computing', 'Science', 'Technology']
    },
    {
      articleId: '3',
      title: 'SpaceX Launches New Satellite Constellation',
      description: 'Elon Musk\'s SpaceX successfully launches 60 new Starlink satellites into orbit.',
      content: 'SpaceX has successfully launched another batch of Starlink satellites, bringing the total constellation closer to global coverage...',
      imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop',
      sourceName: 'Space News',
      sourceUrl: 'https://spacenews.com',
      category: 'technology',
      pubDate: new Date(Date.now() - 172800000).toISOString(),
      author: 'Mike Johnson',
      keywords: ['SpaceX', 'Satellites', 'Space']
    }
  ];

  const mockTrends = [
    {
      trendId: '1',
      title: 'Artificial Intelligence',
      description: 'AI technologies continue to dominate tech discussions',
      category: 'technology',
      articleCount: 45,
      topKeywords: ['AI', 'Machine Learning', 'Deep Learning'],
      trendScore: '8.5',
      lastUpdated: new Date().toISOString()
    },
    {
      trendId: '2',
      title: 'Quantum Computing',
      description: 'Quantum computing breakthroughs gaining momentum',
      category: 'science',
      articleCount: 23,
      topKeywords: ['Quantum', 'Computing', 'Physics'],
      trendScore: '7.2',
      lastUpdated: new Date(Date.now() - 3600000).toISOString()
    },
    {
      trendId: '3',
      title: 'Space Technology',
      description: 'Space exploration and satellite technology trends',
      category: 'technology',
      articleCount: 31,
      topKeywords: ['Space', 'Satellites', 'Exploration'],
      trendScore: '6.8',
      lastUpdated: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  const mockCategories = [
    'technology',
    'science',
    'business',
    'entertainment',
    'sports',
    'health',
    'politics'
  ];

  const countries = [
    { code: 'us', name: 'United States' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'ca', name: 'Canada' },
    { code: 'au', name: 'Australia' },
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
    { code: 'in', name: 'India' },
    { code: 'jp', name: 'Japan' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories first
        const categoriesResult = await getTechCategories(token);
        if (categoriesResult.error) {
          setCategories(mockCategories);
        } else {
          setCategories(categoriesResult);
        }

        // Fetch news and trends based on view mode
        if (viewMode === 'articles') {
          const newsResult = await getTechNews(token, currentPage, selectedCategory === 'all' ? null : selectedCategory, selectedCountry, selectedLanguage);
          if (newsResult.error) {
            setNews(mockNews);
            setTotalPages(1);
            setTotalResults(mockNews.length);
          } else {
            setNews(newsResult.results || []);
            setTotalPages(Math.ceil((newsResult.totalResults || 0) / 20));
            setTotalResults(newsResult.totalResults || 0);
          }
        } else {
          const trendsResult = await getTechTrends(token);
          if (trendsResult.error) {
            setTrends(mockTrends);
          } else {
            setTrends(trendsResult);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        // Set fallback data
        setNews(mockNews);
        setTrends(mockTrends);
        setCategories(mockCategories);
        setTotalPages(1);
        setTotalResults(mockNews.length);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, currentPage, selectedCategory, selectedCountry, selectedLanguage, viewMode]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setLoading(true);
      const result = await searchTechNews(token, searchTerm, currentPage);
      if (result.error) {
        setError(result.error);
      } else {
        setNews(result.results || []);
        setTotalPages(Math.ceil((result.totalResults || 0) / 20));
        setTotalResults(result.totalResults || 0);
      }
    } catch (error) {
      console.error('Error searching news:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = (articleId) => {
    setBookmarkedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const handleShare = async (article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.link || article.sourceUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(article.link || article.sourceUrl);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      science: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      business: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      entertainment: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      sports: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      health: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      politics: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[category] || colors.technology;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-y-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 animate-pulse delay-200">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></div>
        </div>
        <div className="absolute bottom-20 left-10 animate-pulse delay-400">
          <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg"></div>
        </div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Tech News & Trends
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Stay updated with the latest technology news and trends
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'articles' ? 'default' : 'outline'}
                onClick={() => setViewMode('articles')}
              >
                <Newspaper className="w-4 h-4 mr-2" />
                Articles
              </Button>
              <Button
                variant={viewMode === 'trends' ? 'default' : 'outline'}
                onClick={() => setViewMode('trends')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trends
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tech news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Country Filter */}
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Language Filter */}
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSearch} className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <div className="w-5 h-5 text-red-600 dark:text-red-400 mr-3">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  API Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}. Showing fallback data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {viewMode === 'articles' ? (
          <>
            {/* Articles Grid */}
            {news.length === 0 ? (
              <div className="text-center py-12">
                <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article) => (
                  <Card key={article.articleId} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="relative">
                        {article.imageUrl && (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                            onClick={() => handleBookmark(article.articleId)}
                          >
                            <Bookmark className={`h-4 w-4 ${bookmarkedArticles.has(article.articleId) ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                            onClick={() => handleShare(article)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className={getCategoryColor(article.category)}>
                            {article.category}
                          </Badge>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {article.sourceName}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {article.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(article.pubDate)}
                          </div>
                        </div>
                        {article.keywords && article.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {article.keywords.slice(0, 3).map((keyword, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(article.link || article.sourceUrl, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Read More
                          </Button>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Page {currentPage + 1} of {totalPages} ({totalResults} total results)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Trends View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trends.map((trend) => (
              <Card key={trend.trendId} className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(trend.category)}>
                      {trend.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <TrendingUp className="w-4 h-4" />
                      <span>{trend.trendScore}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{trend.title}</CardTitle>
                  <CardDescription>{trend.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Articles</span>
                      <span className="font-semibold">{trend.articleCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Last Updated</span>
                      <span>{formatDate(trend.lastUpdated)}</span>
                    </div>
                    {trend.topKeywords && trend.topKeywords.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Top Keywords</p>
                        <div className="flex flex-wrap gap-1">
                          {trend.topKeywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <Newspaper className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalResults}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Trends</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{trends.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                  <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                  <Bookmark className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bookmarked</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookmarkedArticles.size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default News;
