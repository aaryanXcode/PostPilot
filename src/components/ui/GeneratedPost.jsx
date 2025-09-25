"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon, SendIcon, PlugIcon,EditIcon } from "lucide-react";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import { Calendar24 } from "../DateTimePicker";
import { useState } from "react";
import { uploadImageForContent, deleteImageFromContent } from "../../Services/ImageService";
import { useAuth } from "../AuthContext";
const GeneratedContentCard = ({ 
  content, 
  platformType = "LinkedIn", 
  isConnected = false, 
  onPostNow, 
  onSchedule, 
  onConnect, 
  onEdit
}) => {
  console.log(JSON.stringify(content));
  if (!content) return null;
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const [uploadingImages, setUploadingImages] = useState(new Set());

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
      
      console.log('GeneratedPost - Converting relative URL:', url);
      console.log('GeneratedPost - To full URL:', fullUrl);
      return fullUrl;
    }
    
    // If it's an uploaded:// URL, convert it
    if (url.startsWith('uploaded://')) {
      const filename = url.replace('uploaded://', '');
      const encodedFilename = encodeURIComponent(filename);
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const convertedUrl = `${baseUrl}/api/images/serve/${encodedFilename}`;
      
      console.log('GeneratedPost - Converting uploaded URL:', url);
      console.log('GeneratedPost - To server URL:', convertedUrl);
      return convertedUrl;
    }
    
    // For any other URL, return as is
    return url;
  };

  // Clean up invalid URLs in existing images - more permissive
  const cleanImageUrls = (images) => {
    if (!images) return images;
    
    return images.map(img => {
      const originalUrl = img.imageUrl;
      const convertedUrl = convertUploadedUrl(originalUrl);
      
      if (originalUrl && !originalUrl.startsWith('http') && !originalUrl.startsWith('blob:') && !originalUrl.startsWith('data:') && !originalUrl.startsWith('uploaded://')) {
        console.warn('Invalid image URL detected:', originalUrl);
        // If we have a local URL, use it; otherwise, this image won't display
        return {
          ...img,
          imageUrl: img.localUrl || originalUrl
        };
      }
      
      // Return image with converted URL
      return {
        ...img,
        imageUrl: convertedUrl,
        originalUrl: originalUrl
      };
    });
  }; 

  const handleSave = () => {
    setIsEditing(false);
    onEdit(draft);
  };

  const handleCancel = () => {
    setDraft(content);
    setIsEditing(false);
  };

  const handleImageUpload = async (file) => {
    if (!content.id) {
      console.error('No generated content ID available');
      return;
    }

    const tempId = Date.now();
    setUploadingImages(prev => new Set([...prev, tempId]));

    try {
      const metadata = {
        fileName: file.name,
        altText: file.name,
        imagePrompt: 'User uploaded image',
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      };

      const result = await uploadImageForContent(token, file, content.id, metadata);
      
      if (result.error) {
        console.error('Failed to upload image:', result.error);
        return;
      }

      console.log('Upload result:', result);
      console.log('Image URL from server:', result.imageUrl);
      console.log('URL type:', typeof result.imageUrl);
      console.log('URL starts with:', result.imageUrl?.substring(0, 20));

      // Validate the image URL from server - more permissive
      const isValidUrl = (url) => {
        if (!url) return false;
        
        // Allow blob URLs (local file previews)
        if (url.startsWith('blob:')) return true;
        
        // Allow data URLs (base64 images)
        if (url.startsWith('data:')) return true;
        
        // Allow http/https URLs
        if (url.startsWith('http://') || url.startsWith('https://')) return true;
        
        // Log what we're rejecting for debugging
        console.log('GeneratedPost - Rejecting URL:', url);
        return false;
      };

      // Add the uploaded image to the draft
      const serverUrl = result.imageUrl && isValidUrl(result.imageUrl) ? result.imageUrl : null;
      const localUrl = URL.createObjectURL(file);
      
      const newImage = {
        id: result.id || tempId,
        imageUrl: serverUrl || localUrl,
        serverUrl: serverUrl, // Keep track of server URL separately
        localUrl: localUrl,   // Keep track of local URL separately
        altText: result.altText || file.name,
        fileName: result.fileName || file.name,
        fileSize: result.fileSize || metadata.fileSize,
        generatedAt: result.generatedAt || new Date().toISOString()
      };

      console.log('Using image URL:', newImage.imageUrl);
      console.log('Server URL valid:', !!serverUrl);

      setDraft({
        ...draft,
        imageUrls: [...(draft.imageUrls || []), newImage],
      });

    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });
    }
  };

  const handleImageDelete = async (imageId, imageIndex) => {
    if (!imageId || imageId === 'temp') {
      // If it's a temporary image (not saved to server), just remove from draft
      const updatedImages = draft.imageUrls.filter((_, i) => i !== imageIndex);
      setDraft({ ...draft, imageUrls: updatedImages });
      return;
    }

    try {
      const result = await deleteImageFromContent(token, imageId);
      
      if (result.error) {
        console.error('Failed to delete image:', result.error);
        return;
      }

      // Remove from draft after successful deletion
      const updatedImages = draft.imageUrls.filter((_, i) => i !== imageIndex);
      setDraft({ ...draft, imageUrls: updatedImages });
      
      console.log('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  

  return (
    <div className="mt-3 w-full max-w-2xl mx-auto">
      <div className="rounded-xl border bg-background shadow-sm p-3 sm:p-4 space-y-3 sm:space-y-4">
        {/* Title */}
        {isEditing ? (
          <input
            type="text"
            value={draft.title || ""}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="w-full border px-2 py-1 rounded"
          />
        ) : (
          draft.title && (
            <h4 className="text-base sm:text-lg font-semibold">
              {draft.title}
            </h4>
          )
        )}

        {/* Content */}
        {isEditing ? (
          <textarea
            value={draft.content || ""}
            onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            className="w-full border px-2 py-1 rounded min-h-[100px]"
          />
        ) : (
          draft.content && <Response>{draft.content}</Response>
        )}

        {/* Hashtags */}
        {isEditing ? (
          <input
            type="text"
            value={draft.hashtags || ""}
            onChange={(e) => setDraft({ ...draft, hashtags: e.target.value })}
            className="w-full border px-2 py-1 rounded"
            placeholder="Enter hashtags separated by space"
          />
        ) : (
          draft.hashtags && (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {draft.hashtags.split(" ").map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )
        )}

        {/* Image gallery */}
{draft.imageUrls?.length > 0 && (
  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
    {console.log('GeneratedPost - Rendering images:', draft.imageUrls?.length, 'images')}
    {cleanImageUrls(draft.imageUrls).map((img, idx) => {
      const convertedUrl = convertUploadedUrl(img.imageUrl);
      console.log('GeneratedPost - Rendering image:', {
        id: img.id,
        originalUrl: img.imageUrl,
        convertedUrl: convertedUrl,
        fileName: img.fileName || img.name,
        idx: idx
      });
      return (
        <div
          key={img.id || idx}
          className="relative flex-shrink-0 rounded-lg overflow-hidden border w-24 h-24 sm:w-36 sm:h-36 bg-gray-100"
        >
          <img
            src={convertUploadedUrl(img.imageUrl)}
            alt={img.altText || "generated image"}
            className="w-full h-full object-cover"
            onLoad={() => {
              console.log('GeneratedPost - Image loaded successfully:', convertedUrl);
            }}
            onError={(e) => {
              console.error('GeneratedPost - Image failed to load:', {
                src: convertedUrl,
                originalUrl: img.imageUrl,
                alt: img.altText || "generated image",
                id: img.id,
                idx: idx
              });
              
              // If it's a server URL that failed, try to show a fallback
              if (img.imageUrl && (img.imageUrl.includes('/api/images/serve/') || img.imageUrl.includes('/api/images/download/'))) {
                console.log('GeneratedPost - Server URL failed, showing fallback');
                e.target.style.display = 'none';
                const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                if (placeholder) {
                  placeholder.style.display = 'flex';
                  placeholder.innerHTML = `
                    <div class="text-center">
                      <div class="w-8 h-8 bg-gray-400 rounded mx-auto mb-2"></div>
                      <p class="text-xs text-gray-500">Server Image</p>
                      <p class="text-xs text-gray-400 truncate max-w-20">${img.fileName || 'Unknown'}</p>
                    </div>
                  `;
                }
              } else {
                e.target.style.display = 'none';
                const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                if (placeholder) placeholder.style.display = 'flex';
              }
            }}
          />
          <div className="image-placeholder absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500 text-xs hidden">
            <span>Invalid URL: {img.imageUrl?.substring(0, 20)}...</span>
          </div>
          {uploadingImages.has(img.id) && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          )}
          {isEditing && !uploadingImages.has(img.id) && (
            <button
              type="button"
              onClick={() => handleImageDelete(img.id, idx)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 py-0.5 text-xs hover:bg-red-600 transition-colors"
              title="Delete image"
            >
              ✕
            </button>
          )}
        </div>
      );
    })}
  </div>
)}

{/* Add new image in edit mode */}
{isEditing && (
  <div className="mt-2">
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          handleImageUpload(file);
        }
        // Reset the input so the same file can be selected again
        e.target.value = '';
      }}
      className="hidden"
      id="image-upload"
      disabled={uploadingImages.size > 0}
    />
    <label
      htmlFor="image-upload"
      className={`cursor-pointer px-3 py-1 border rounded-md text-sm text-blue-600 hover:bg-blue-50 ${
        uploadingImages.size > 0 ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {uploadingImages.size > 0 ? 'Uploading...' : '+ Add Image'}
    </label>
  </div>
)}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 border-t">
          {isConnected ? (
            isEditing ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center gap-1 w-full sm:w-auto"
                >
                  Save
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancel}
                  className="flex items-center gap-1 w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 w-full sm:w-auto"
                >
                  <EditIcon className="w-4 h-4" />
                  <span>Edit</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={onPostNow}
                  className="flex items-center gap-1 w-full sm:w-auto"
                >
                  <SendIcon className="w-4 h-4" />
                  <span className="hidden xs:inline">Post Now</span>
                  <span className="xs:hidden">Post</span>
                </Button>
                <Calendar24
                  onConfirm={(dateTime) => {
                    onSchedule(dateTime);
                  }}
                />
              </>
            )
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onConnect}
              className="flex items-center gap-1 w-full sm:w-auto"
            >
              <PlugIcon className="w-4 h-4" />
              <span className="hidden xs:inline">Connect {platformType}</span>
              <span className="xs:hidden">Connect</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedContentCard;
