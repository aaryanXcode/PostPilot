import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Download, 
  Trash2, 
  Eye, 
  Calendar,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { 
  fetchAllImages, 
  fetchAllImagesSimple,
  fetchImagesByUser,
  fetchImagesBySession,
  fetchImageById,
  uploadImage, 
  deleteImage, 
  deleteMultipleImages, 
  downloadImage,
  updateImageMetadata,
  getImageTags 
} from '../Services/ImageService';

const Gallery = () => {
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'generated', 'uploaded'
  const [selectedImages, setSelectedImages] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  });
  const [availableTags, setAvailableTags] = useState([]);
  const [deletingImages, setDeletingImages] = useState(new Set());
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    imageId: null,
    imageName: '',
    isBatch: false,
    count: 0
  });

  // Convert uploaded:// URLs to proper server URLs
  const convertUploadedUrl = (url) => {
    if (!url) return url;
    
    // If it's already a full server URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a relative server URL, convert to full URL
    if (url.startsWith('/api/images/')) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const fullUrl = `${baseUrl}${url}`;
      
      console.log('Gallery - Converting relative URL:', url);
      console.log('Gallery - To full URL:', fullUrl);
      return fullUrl;
    }
    
    // If it's an uploaded:// URL, convert it
    if (url.startsWith('uploaded://')) {
      const filename = url.replace('uploaded://', '');
      const encodedFilename = encodeURIComponent(filename);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const convertedUrl = `${baseUrl}/api/images/serve/${encodedFilename}`;
      
      console.log('Gallery - Converting uploaded URL:', url);
      console.log('Gallery - To server URL:', convertedUrl);
      return convertedUrl;
    }
    
    // For any other URL, return as is
    return url;
  };

  // URL validation function - more permissive
  const isValidUrl = (url) => {
    if (!url) return false;
    
    // Allow blob URLs (local file previews)
    if (url.startsWith('blob:')) return true;
    
    // Allow data URLs (base64 images)
    if (url.startsWith('data:')) return true;
    
    // Allow http/https URLs
    if (url.startsWith('http://') || url.startsWith('https://')) return true;
    
    // Allow uploaded:// URLs (server stored images) - will be converted
    if (url.startsWith('uploaded://')) return true;
    
    // Log what we're rejecting for debugging
    console.log('Gallery - Rejecting URL:', url);
    return false;
  };

  // Clean image URLs to handle invalid server URLs
  const cleanImageUrls = (images) => {
    if (!images) return images;
    
    return images.map(img => {
      const originalUrl = img.url || img.imageUrl;
      const convertedUrl = convertUploadedUrl(originalUrl);
      
      console.log('Gallery - Processing image:', {
        id: img.id,
        originalUrl: originalUrl,
        convertedUrl: convertedUrl,
        isValid: isValidUrl(originalUrl),
        fileName: img.fileName || img.name
      });
      
      if (originalUrl && !isValidUrl(originalUrl)) {
        console.warn('Invalid image URL detected in Gallery:', originalUrl);
        return {
          ...img,
          url: null,
          imageUrl: null,
          hasInvalidUrl: true
        };
      }
      
      // Return image with converted URL
      return {
        ...img,
        url: convertedUrl,
        imageUrl: convertedUrl,
        originalUrl: originalUrl
      };
    });
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const filters = {
          type: filterStatus === 'all' ? null : filterStatus,
          search: searchTerm || null
        };
        
        const result = await fetchAllImages(token, pagination.page, pagination.size, filters);
        
        console.log('Gallery - API result:', result);
        if (result.images) {
          console.log('Gallery - Sample image URLs:', result.images.slice(0, 3).map(img => ({
            id: img.id,
            url: img.url || img.imageUrl,
            fileName: img.fileName || img.name,
            isValid: isValidUrl(img.url || img.imageUrl)
          })));
        }
        
        if (result.error) {
          setError(result.error);
          // Fallback to mock data if API fails
          const mockImages = [
            {
              id: 1,
              fileName: 'AI Generated Marketing Banner',
              imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
              imagePrompt: 'Create a modern marketing banner',
              altText: 'Marketing banner for product promotion',
              fileSize: '2.4 MB',
              generatedAt: '2024-01-15T10:30:00Z'
            },
            {
              id: 2,
              fileName: 'Social Media Post Design',
              imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
              imagePrompt: 'Design a social media post',
              altText: 'Social media post design',
              fileSize: '1.8 MB',
              generatedAt: '2024-01-14T14:20:00Z'
            },
            {
              id: 3,
              fileName: 'Product Showcase Image',
              imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
              imagePrompt: 'Showcase product features',
              altText: 'Product showcase image',
              fileSize: '3.2 MB',
              generatedAt: '2024-01-13T09:15:00Z'
            }
          ];
          setImages(mockImages);
          setPagination({
            page: 0,
            size: 20,
            totalElements: mockImages.length,
            totalPages: 1
          });
        } else {
          // Map ContentImage entity to gallery format
          const mappedImages = (result.content || result.images || []).map(image => ({
            id: image.id,
            fileName: image.fileName || 'Untitled Image',
            imageUrl: image.imageUrl,
            imagePrompt: image.imagePrompt,
            altText: image.altText,
            fileSize: image.fileSize,
            generatedAt: image.generatedAt,
            // Add computed fields for gallery display
            name: image.fileName || 'Untitled Image',
            url: image.imageUrl,
            type: 'generated', // All images from your API are generated
            createdAt: image.generatedAt,
            tags: image.imagePrompt ? [image.imagePrompt.substring(0, 20) + '...'] : ['generated'],
            size: image.fileSize,
            dimensions: 'Unknown' // Not available in ContentImage entity
          }));
          
          setImages(mappedImages);
          setPagination({
            page: result.number || 0,
            size: result.size || 20,
            totalElements: result.totalElements || 0,
            totalPages: result.totalPages || 0
          });
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [token, pagination.page, filterStatus, searchTerm]);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const result = await getImageTags(token);
        if (!result.error) {
          setAvailableTags(result.tags || []);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [token]);

  const filteredImages = images.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || image.type === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleImageSelect = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleDownload = async (image) => {
    try {
      // Since we have direct image URLs, we can download them directly
      const link = document.createElement('a');
      link.href = image.url || image.imageUrl;
      link.download = image.name || image.fileName || `image-${image.id}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleDelete = (imageId) => {
    const image = images.find(img => img.id === imageId);
    setDeleteDialog({
      isOpen: true,
      imageId: imageId,
      imageName: image?.name || image?.fileName || 'this image',
      isBatch: false,
      count: 1
    });
  };

  const confirmDelete = async () => {
    const { imageId, isBatch } = deleteDialog;
    
    try {
      if (isBatch) {
        // Batch delete
        setDeletingImages(prev => new Set([...prev, ...selectedImages]));
        
        const result = await deleteMultipleImages(token, selectedImages);
        if (result.error) {
          console.error('Batch delete failed:', result.error);
          alert('Failed to delete images. Please try again.');
          return;
        }
        
        setImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
        setSelectedImages([]);
        console.log('Images deleted successfully');
      } else {
        // Single delete
        setDeletingImages(prev => new Set([...prev, imageId]));
        
        const result = await deleteImage(token, imageId);
        if (result.error) {
          console.error('Delete failed:', result.error);
          alert('Failed to delete image. Please try again.');
          return;
        }
        
        setImages(prev => prev.filter(img => img.id !== imageId));
        setSelectedImages(prev => prev.filter(id => id !== imageId));
        console.log('Image deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting image(s):', error);
      alert('Error deleting image(s). Please try again.');
    } finally {
      // Remove from deleting set
      if (isBatch) {
        setDeletingImages(prev => {
          const newSet = new Set(prev);
          selectedImages.forEach(id => newSet.delete(id));
          return newSet;
        });
      } else {
        setDeletingImages(prev => {
          const newSet = new Set(prev);
          newSet.delete(imageId);
          return newSet;
        });
      }
    }
    
    // Close dialog
    setDeleteDialog({
      isOpen: false,
      imageId: null,
      imageName: '',
      isBatch: false,
      count: 0
    });
  };

  const handleBatchDelete = () => {
    setDeleteDialog({
      isOpen: true,
      imageId: null,
      imageName: 'selected images',
      isBatch: true,
      count: selectedImages.length
    });
  };

  const handleBatchDownload = async () => {
    try {
      for (const imageId of selectedImages) {
        const image = images.find(img => img.id === imageId);
        if (image) {
          await handleDownload(image);
          // Add a small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error('Error downloading multiple images:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                Image Gallery
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage and view all your generated and uploaded images
              </p>
            </div>
            <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'generated' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('generated')}
                >
                  Generated
                </Button>
                <Button
                  variant={filterStatus === 'uploaded' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('uploaded')}
                >
                  Uploaded
                </Button>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
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

        {/* Images Grid/List */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No images found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload or generate some images to get started'}
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {console.log('Gallery - About to render images:', cleanImageUrls(filteredImages).length, 'images')}
            {cleanImageUrls(filteredImages).map((image) => (
              <Card 
                key={image.id} 
                className={`backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                  selectedImages.includes(image.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleImageSelect(image.id)}
              >
                <CardContent className="p-0">
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="relative">
                      {console.log('Gallery - Rendering grid image:', {
                        id: image.id,
                        hasInvalidUrl: image.hasInvalidUrl,
                        url: image.url || image.imageUrl,
                        fileName: image.fileName || image.name
                      })}
                      {image.hasInvalidUrl ? (
                        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Invalid URL
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-32">
                              {image.url || image.imageUrl}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={image.url || image.imageUrl}
                          alt={image.altText || image.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                          onLoad={() => {
                            console.log('Gallery - Image loaded successfully:', image.url || image.imageUrl);
                          }}
                          onError={(e) => {
                            console.error('Gallery - Image failed to load:', {
                              src: image.url || image.imageUrl,
                              alt: image.altText || image.name,
                              id: image.id
                            });
                            
                            // If it's a server URL that failed, show a better fallback
                            if (image.url && (image.url.includes('/api/images/serve/') || image.url.includes('/api/images/download/'))) {
                              console.log('Gallery - Server URL failed, showing fallback');
                              e.target.style.display = 'none';
                              const placeholder = e.target.parentElement.querySelector('.image-error-placeholder');
                              if (placeholder) {
                                placeholder.style.display = 'flex';
                                placeholder.innerHTML = `
                                  <div class="text-center">
                                    <div class="w-12 h-12 bg-gray-400 rounded mx-auto mb-2"></div>
                                    <p class="text-sm text-gray-500">Server Image</p>
                                    <p class="text-xs text-gray-400 truncate max-w-32">${image.fileName || image.name || 'Unknown'}</p>
                                  </div>
                                `;
                              }
                            } else {
                              e.target.style.display = 'none';
                              const placeholder = e.target.parentElement.querySelector('.image-error-placeholder');
                              if (placeholder) placeholder.style.display = 'flex';
                            }
                          }}
                        />
                      )}
                      <div className="image-error-placeholder absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center hidden">
                        <div className="text-center">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">Image not found</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Badge variant={image.type === 'generated' ? 'default' : 'secondary'}>
                          {image.type}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-6 w-6 p-0"
                          disabled={deletingImages.has(image.id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(image.id);
                          }}
                        >
                          {deletingImages.has(image.id) ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                          {image.name || image.fileName}
                        </h3>
                        {image.imagePrompt && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                            {image.imagePrompt}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {image.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {image.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{image.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                          <span>{image.dimensions || 'Generated'}</span>
                          <span>{image.size || image.fileSize}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="flex items-center p-4">
                      {console.log('Gallery - Rendering list image:', {
                        id: image.id,
                        hasInvalidUrl: image.hasInvalidUrl,
                        url: image.url || image.imageUrl,
                        fileName: image.fileName || image.name
                      })}
                      {image.hasInvalidUrl ? (
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      ) : (
                        <img
                          src={image.url || image.imageUrl}
                          alt={image.altText || image.name}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                          onLoad={() => {
                            console.log('Gallery List - Image loaded successfully:', image.url || image.imageUrl);
                          }}
                          onError={(e) => {
                            console.error('Gallery List - Image failed to load:', {
                              src: image.url || image.imageUrl,
                              alt: image.altText || image.name,
                              id: image.id
                            });
                            e.target.style.display = 'none';
                            const placeholder = e.target.parentElement.querySelector('.list-image-error-placeholder');
                            if (placeholder) placeholder.style.display = 'flex';
                          }}
                        />
                      )}
                      <div className="list-image-error-placeholder w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg mr-4 flex items-center justify-center hidden">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {image.name || image.fileName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant={image.type === 'generated' ? 'default' : 'secondary'}>
                              {image.type}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(image);
                              }}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-6 w-6 p-0"
                              disabled={deletingImages.has(image.id)}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(image.id);
                              }}
                            >
                              {deletingImages.has(image.id) ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        {image.imagePrompt && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-1">
                            {image.imagePrompt}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {image.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                          <span>{image.dimensions || 'Generated'} • {image.size || image.fileSize}</span>
                          <span>{formatDate(image.createdAt || image.generatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Image Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Images</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{images.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Generated</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{images.filter(img => img.type === 'generated').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Prompts</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{images.filter(img => img.imagePrompt).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {images.filter(img => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(img.generatedAt || img.createdAt) > weekAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
              disabled={pagination.page === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Page {pagination.page + 1} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages - 1, prev.page + 1) }))}
              disabled={pagination.page >= pagination.totalPages - 1}
            >
              Next
            </Button>
          </div>
        )}

        {/* Selected Images Actions */}
        {selectedImages.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleBatchDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline" onClick={handleBatchDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => {
          if (!open) {
            setDeleteDialog({
              isOpen: false,
              imageId: null,
              imageName: '',
              isBatch: false,
              count: 0
            });
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Delete {deleteDialog.isBatch ? 'Images' : 'Image'}
              </DialogTitle>
              <DialogDescription>
                {deleteDialog.isBatch ? (
                  <>
                    Are you sure you want to delete <strong>{deleteDialog.count} selected image{deleteDialog.count > 1 ? 's' : ''}</strong>? 
                    <br />
                    This action cannot be undone.
                  </>
                ) : (
                  <>
                    Are you sure you want to delete <strong>"{deleteDialog.imageName}"</strong>? 
                    <br />
                    This action cannot be undone.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({
                  isOpen: false,
                  imageId: null,
                  imageName: '',
                  isBatch: false,
                  count: 0
                })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteDialog.isBatch ? 
                  selectedImages.some(id => deletingImages.has(id)) : 
                  deletingImages.has(deleteDialog.imageId)
                }
              >
                {deleteDialog.isBatch ? 
                  (selectedImages.some(id => deletingImages.has(id)) ? 'Deleting...' : 'Delete All') :
                  (deletingImages.has(deleteDialog.imageId) ? 'Deleting...' : 'Delete')
                }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Gallery;
