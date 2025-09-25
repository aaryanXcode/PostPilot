# Analytics Environment Setup

Add these environment variables to your `.env.local` file:

```env
# Analytics Endpoints
VITE_ANALYTICS_URL=/analytics
VITE_POST_ANALYTICS_URL=/analytics/posts
VITE_ENGAGEMENT_METRICS_URL=/analytics/engagement
```

## Expected Backend API Response Format

Your backend should return analytics data in this format:

```json
{
  "totalPosts": 25,
  "totalEngagement": 1250,
  "totalReach": 5000,
  "totalImpressions": 15000,
  "avgEngagementRate": 2.5,
  "bestPostEngagement": 150,
  "totalFollowers": 1200,
  "recentPosts": [
    {
      "id": 1,
      "title": "AI in Social Media",
      "engagement": 45,
      "reach": 200,
      "impressions": 500
    },
    {
      "id": 2,
      "title": "Content Strategy Tips",
      "engagement": 38,
      "reach": 180,
      "impressions": 450
    }
  ]
}
```

## Backend API Endpoints to Implement

1. **GET /api/analytics** - Main analytics dashboard data
2. **GET /api/analytics/posts/{postId}** - Individual post analytics
3. **GET /api/analytics/engagement** - Engagement metrics with date filtering

## Query Parameters Support

- `startDate` - Filter data from this date
- `endDate` - Filter data until this date
- Example: `/api/analytics?startDate=2024-01-01&endDate=2024-01-31`

