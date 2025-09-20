const Analytics = () => {
  return (
    <div className="p-2 sm:p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Posts</h3>
          <p className="text-2xl font-bold text-blue-600">0</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Engagement</h3>
          <p className="text-2xl font-bold text-green-600">0</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Reach</h3>
          <p className="text-2xl font-bold text-purple-600">0</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Impressions</h3>
          <p className="text-2xl font-bold text-orange-600">0</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
