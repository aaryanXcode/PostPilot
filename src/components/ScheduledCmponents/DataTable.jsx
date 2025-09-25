import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import CountdownTimer from "../CountdownTimer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; 
import { fetchPostById, updatePostById } from "../../Services/ContentService";
import { useAuth } from "@/components/AuthContext";
import { toast } from "sonner";

export const DataTable = ({ items, type }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [activePost, setActivePost] = useState(null);
  const [editorValue, setEditorValue] = useState("");
  const { token} = useAuth();
  // open dialog and fetch content by id
  const handleEdit = async (postId) => {
    try {
      const data = await fetchPostById(postId, token); // fetch content by row id
      setActivePost(data);
      setEditorValue(data.content || "");
      setOpenDialog(true);
    } catch (err) {
      console.error("Failed to fetch post content:", err);
    }
  };

  const handleSave = async () => {
    if (!activePost) return;

    try {
      await updatePostById(activePost.id, editorValue, token);
      // Optionally show a toast here
      toast.success("Content updated successfully!");
      setOpenDialog(false);
      setActivePost(null);
      setEditorValue("");
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };
  return (
    <>
    <Table className= "table-auto">
      <TableCaption>A list of your posts.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Title</TableHead>
          <TableHead>Platform</TableHead>
          <TableHead>Scheduled Time</TableHead>
          <TableHead>Time Remaining</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">
              <div className="max-w-[200px] truncate" title={post.title}>
                {post.title || "Untitled Post"}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                {post.platform && (
                  <>
                    {post.platform.toLowerCase() === 'linkedin' && (
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                    )}
                    {post.platform.toLowerCase() === 'facebook' && (
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                    )}
                    {post.platform.toLowerCase() === 'instagram' && (
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                    )}
                    {post.platform.toLowerCase() === 'twitter' && (
                      <div className="w-6 h-6 bg-sky-500 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </div>
                    )}
                    <span className="text-sm font-medium capitalize">
                      {post.platform}
                    </span>
                  </>
                )}
                {!post.platform && (
                  <span className="text-gray-500 text-sm">-</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {post.scheduledDate ? (
                  <div>
                    <div className="font-medium">
                      {new Date(post.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(post.scheduledDate).toLocaleTimeString()}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <CountdownTimer scheduledDate={post.scheduledDate} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex space-x-2 justify-end">
                {type === "draft" && (
                  <Button size="sm" variant="outline">
                    Post Now
                  </Button>
                )}

                {type === "scheduled" && (
                  <>
                    <Button size="sm" variant="outline">
                      Post Now
                    </Button>
                    <Button size="sm" variant="destructive">
                      Cancel
                    </Button>
                     <Button size="sm" variant="destructive" onClick={() => handleEdit(post.id)}>Edit</Button>
                  </>
                )}
              
                {type === "published" && (
                  <span className="text-green-600 text-sm font-medium">
                    Published
                  </span>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              Edit Post Content
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Make changes to your post content below. The dialog is scrollable for longer content.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-4">
              {/* Post Info Card */}
              {activePost && (
                <div className="backdrop-blur-sm bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Post Information</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">ID: {activePost.id}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>Character count: <span className="font-medium">{editorValue.length}</span></p>
                    <p>Word count: <span className="font-medium">{editorValue.split(/\s+/).filter(word => word.length > 0).length}</span></p>
                  </div>
                </div>
              )}

              {/* Content Editor */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Post Content
                </label>
                <Textarea
                  value={editorValue}
                  onChange={(e) => setEditorValue(e.target.value)}
                  placeholder="Enter your post content here..."
                  className="min-h-[200px] max-h-[400px] resize-none text-sm leading-relaxed border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800"
                />
              </div>

              {/* Preview Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preview
                </label>
                <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
                  {editorValue ? (
                    <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {editorValue}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Start typing to see a preview of your content...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {editorValue.length > 0 && (
                  <span className={editorValue.length > 280 ? "text-orange-500" : "text-green-500"}>
                    {editorValue.length > 280 ? "Content is long" : "Good length"}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setOpenDialog(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!editorValue.trim()}
                  className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </>
    
  );
};
