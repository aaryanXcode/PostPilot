import { DataTable } from "./DataTable";

const ScheduledPosts = ({ items }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Scheduled Posts</h2>
      <DataTable items={items} type="scheduled" />
    </div>
  );
};

export default ScheduledPosts;
