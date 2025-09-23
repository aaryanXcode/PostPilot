import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button"
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
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Scheduled Status</TableHead>
          <TableHead>Scheduled for</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell className="font-medium">
              {post.isScheduled ? "True" : "False"}
            </TableCell>
            <TableCell className="font-medium">
              {post.scheduledDate
                ? new Date(post.scheduledDate).toLocaleString()
                : "-"}
            </TableCell>

            <TableCell className="text-right space-x-2">
              {type === "draft" && (
                <Button >
                  Post
                </Button>
              )}

              {type === "scheduled" && (
                <>
                  <Button onClick={() => handleEdit(post.id)}>Edit</Button>
                  <Button >
                    Post Now
                  </Button>
                  <Button>
                    Cancel
                  </Button>
                </>
              )}

              {/* Published has no actions */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>Update your post content below:</DialogDescription>
          </DialogHeader>

          <Textarea
            value={editorValue}
            onChange={(e) => setEditorValue(e.target.value)}
            placeholder="Edit your post content..."
            className="min-h-[150px]"
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      </>
    
  );
};
