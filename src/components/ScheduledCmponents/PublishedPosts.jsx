import { DataTable } from "./DataTable";

const PublishedPosts = ({ items }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Published Posts</h2>
      <DataTable items={items} type="published" />
    </div>
  );
};

export default PublishedPosts;
