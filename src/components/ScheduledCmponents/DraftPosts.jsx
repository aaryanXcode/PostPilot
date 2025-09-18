import { DataTable } from "./DataTable";

const DraftPosts = ({ items }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Draft Posts</h2>
      <DataTable items={items} type="draft" />
    </div>
  );
};

export default DraftPosts;
