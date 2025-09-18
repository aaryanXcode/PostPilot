import { useEffect, useState } from "react";
import { getScheduledContent } from "../Services/ContentService";
import { useAuth } from "@/components/AuthContext";
import PublishedPosts from "./ScheduledCmponents/PublishedPosts";
import ScheduledPosts from "./ScheduledCmponents/ScheduledPosts";
import DraftPosts from "./ScheduledCmponents/DraftPosts"; 

const Scheduled = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10; // number of items per fetch

  // Fetch paginated data
  const fetchScheduledContent = async () => {
    if (!hasMore) return;

    try {
      const data = await getScheduledContent(token, page, pageSize);

      if (data.content && data.content.length > 0) {
        const mergedItems = [...items, ...data.content];
        const uniqueItems = Array.from(new Map(mergedItems.map(item => [item.id, item])).values());
        setItems(uniqueItems);
        setPage((prev) => prev + 1);

        if (page + 1 >= data.totalPages) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching scheduled content:", error);
      setHasMore(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchScheduledContent();
  }, []);

  // Split items into pending and completed
  const published = items.filter(
    (post) => post.contentStatus === "PUBLISHED" && !post.isScheduled
  );
  const scheduled = items.filter(
    (post) => post.contentStatus !== "PUBLISHED" && post.isScheduled
  );
  const drafts = items.filter(
    (post) => post.contentStatus !== "PUBLISHED" && !post.isScheduled
  );

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Scheduled Post Analytics</h1>

      {/* Pending Section */}
      <ScheduledPosts
        items={scheduled}
        fetchMore={fetchScheduledContent} // pass fetchMore for infinite scroll
        hasMore={hasMore}
      />

      {/* Completed Section */}
      <PublishedPosts items={published} />
      <DraftPosts items={drafts} />
    </div>
  );
};

export default Scheduled;
