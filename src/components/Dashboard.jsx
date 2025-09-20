const Dashboard = () => {
  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Welcome to PostPilot</h3>
          <p className="text-sm text-muted-foreground">This is your dashboard where you can manage your content and analytics.</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">Create new content, schedule posts, and view analytics.</p>
        </div>
        <div className="p-4 border rounded-lg md:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">View your recent posts and engagement metrics.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
