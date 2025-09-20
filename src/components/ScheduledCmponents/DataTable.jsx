import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"

export const DataTable = ({ items, type }) => {
  return (
    <Table>
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
  );
};
