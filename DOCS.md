# 🚀 PostPilot - AI-Powered Content Management Platform

A comprehensive **React + Spring Boot** application for AI-powered content generation, scheduling, and management with advanced analytics and social media integration.


## 📋 Table of Contents

* [🎯 Overview](#-overview)
* [✨ Features](#-features)
* [🏗️ Technical Architecture](#%EF%B8%8F-technical-architecture)
* [🛠️ Prerequisites](#%EF%B8%8F-prerequisites)
* [⚙️ Configuration](#%EF%B8%8F-configuration)
* [🚀 Getting Started](#-getting-started)
* [🐳 Docker Deployment](#-docker-deployment)
* [📱 API Documentation](#-api-documentation)
* [🔧 Development](#-development)
* [📊 Analytics & Monitoring](#-analytics--monitoring)
* [🔒 Security](#-security)
* [🤝 Contributing](#-contributing)
* [📄 License](#-license)


## 🎯 Overview

PostPilot is a modern, AI-powered content management platform that helps users create, schedule, and manage social media content with intelligent automation. The platform combines advanced AI capabilities with user-friendly interfaces to streamline content creation workflows.

### 🎯 Use Cases

* **Content Creators**: Generate engaging social media posts with AI assistance
* **Social Media Managers**: Schedule and manage multiple platform content
* **Marketing Teams**: Analyze content performance and optimize strategies
* **Businesses**: Automate content creation and maintain consistent brand voice
* **Developers**: Integrate AI-powered content generation into existing workflows


## ✨ Features

### 🤖 AI-Powered Content Generation

* **Multi-Model Support**: Integration with various AI models for content generation
* **Context-Aware Generation**: Smart content creation based on user preferences and history
* **Real-time Chat Interface**: Interactive AI assistant for content brainstorming
* **Content Templates**: Pre-built templates for different content types

### 📅 Content Scheduling & Management

* **Multi-Platform Scheduling**: Support for LinkedIn, Twitter, Facebook, and more
* **Bulk Operations**: Manage multiple posts simultaneously
* **Draft Management**: Save and edit content before publishing
* **Content Calendar**: Visual calendar view for content planning

### 📊 Advanced Analytics

* **Performance Metrics**: Track engagement, reach, and conversion rates
* **Visual Dashboards**: Interactive charts and graphs for data visualization
* **Content Insights**: AI-powered content analysis and recommendations
* **Export Capabilities**: Download reports in various formats

### 🖼️ Media Management

* **Image Gallery**: Centralized media library with search and filtering
* **AI Image Generation**: Create custom images for content
* **Image Optimization**: Automatic resizing and format optimization
* **Cloud Storage**: Secure file storage with CDN integration

### 🔐 Authentication & Security

* **JWT Authentication**: Secure token-based authentication
* **Role-Based Access**: Different permission levels for users
* **Session Management**: Automatic logout on token expiry
* **Protected Routes**: Secure access to application features

### 🔔 Real-time Notifications

* **WebSocket Integration**: Real-time updates and notifications
* **Email Notifications**: Automated email alerts for important events
* **Push Notifications**: Browser-based push notifications
* **Custom Alerts**: User-defined notification preferences


## 🏗️ Technical Architecture

### Frontend (React + Vite)

```
PostPilotFrontEnd/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── Gallery.jsx       # Image gallery
│   │   ├── Analytics.jsx    # Analytics dashboard
│   │   └── Scheduled.jsx    # Content scheduling
│   ├── Services/            # API service layer
│   │   ├── AuthService.js   # Authentication
│   │   ├── ChatService.js   # AI chat integration
│   │   ├── ContentService.js # Content management
│   │   └── ImageService.js  # Media management
│   ├── hooks/               # Custom React hooks
│   └── ReduxSlice/         # State management
├── public/                  # Static assets
├── Dockerfile              # Container configuration
└── docker-compose.yml      # Multi-container setup
```

### Backend (Spring Boot)

```
PostPilotBackend/
├── src/main/java/
│   ├── controller/          # REST API controllers
│   ├── service/            # Business logic layer
│   ├── repository/         # Data access layer
│   ├── entity/            # JPA entities
│   ├── dto/               # Data transfer objects
│   └── config/            # Configuration classes
├── src/main/resources/
│   ├── application.yml     # Application configuration
│   └── static/           # Static resources
└── Dockerfile            # Container configuration
```

### Technology Stack

#### Frontend

* **React 19.1.1**: Modern React with latest features
* **Vite 7.1.2**: Fast build tool and dev server
* **React Router DOM 7.8.2**: Client-side routing
* **Tailwind CSS 4.1.12**: Utility-first CSS framework
* **Shadcn/ui**: Modern UI component library
* **Recharts 3.2.1**: Data visualization library
* **Redux 5.0.1**: State management
* **JWT Decode 4.0.0**: Token handling

#### Backend

* **Spring Boot 3.x**: Java framework
* **Spring Security**: Authentication and authorization
* **Spring Data JPA**: Database abstraction
* **PostgreSQL**: Primary database
* **Redis**: Caching and session storage
* **WebSocket**: Real-time communication
* **Docker**: Containerization

#### DevOps & Deployment

* **Docker**: Containerization
* **Docker Compose**: Multi-container orchestration
* **Nginx**: Reverse proxy and static file serving
* **Git**: Version control
* **CI/CD**: Automated deployment pipelines


## 🛠️ Prerequisites

### System Requirements

* **Node.js**: 18.x or higher
* **Java**: 17 or higher
* **Docker**: 20.x or higher
* **Docker Compose**: 2.x or higher
* **Git**: Latest version

### Development Tools

* **IDE**: VS Code, IntelliJ IDEA, or Eclipse
* **Database**: PostgreSQL 13+
* **Redis**: 6.x or higher (for caching)
* **Browser**: Chrome, Firefox, Safari, or Edge


## ⚙️ Configuration

### Environment Variables

#### Frontend (.env)

```
# API Configuration
VITE_API_BASE_URL=http://localhost:8080

# Authentication Endpoints
VITE_AUTH_LOGIN_URL=/auth/login
VITE_USER_PROFILE_URL=/user/profile

# Chat Endpoints
VITE_CHAT_ASSISTANT_URL=/chat/assistant
VITE_CHAT_HISTORY_URL=/user/chat_history
VITE_CHAT_MESSAGES_URL=/chat/{sessionId}/messages
VITE_CHAT_CREATE_SESSION_URL=/chat/create/session
VITE_CHAT_DELETE_SESSION_URL=/chat/delete/session/{sessionId}
VITE_CHAT_UPDATE_TITLE_URL=/chat/update/title/{sessionId}
VITE_CHAT_MODELS_URL=/chat/models

# Content Endpoints
VITE_GENERATED_CONTENT_URL=/generated-content
VITE_CONTENT_POST_URL=/content/post
VITE_CONTENT_UPDATE_URL=/generated-content/update/content
VITE_CONTENT_SCHEDULE_URL=/content/schedule
VITE_SCHEDULED_CONTENT_URL=/generated-content/scheduled

# LinkedIn Integration Endpoints
VITE_LINKEDIN_AUTH_URL=/linkedin/auth-url
VITE_LINKEDIN_AUTH_STATUS_URL=/linkedin/auth-status

# WebSocket Configuration
VITE_WS_BROKER_URL=ws://localhost:8080/ws
VITE_WS_USER_NOTIFICATIONS=/user/queue/notifications
VITE_WS_ADMIN_NOTIFICATIONS=/topic/admin

# Image Gallery Endpoints
VITE_IMAGES_URL=/api/images
VITE_IMAGE_UPLOAD_URL=/api/images/upload
VITE_IMAGE_DELETE_URL=/api/images/{imageId}
VITE_IMAGE_DOWNLOAD_URL=/api/images/{imageId}/download
```

#### Backend (application.yml)

```
server:
  port: 8080
  servlet:
    context-path: /

spring:
  application:
    name: postpilot-backend
  
  datasource:
    url: jdbc:postgresql://localhost:5432/postpilot
    username: ${DB_USERNAME:postpilot}
    password: ${DB_PASSWORD:password}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  security:
    jwt:
      secret: ${JWT_SECRET:your-secret-key}
      expiration: 86400000 # 24 hours
  
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

# Image upload configuration
image:
  upload:
    directory: uploads/images/
  serve:
    url-prefix: /api/images/serve/

# Redis configuration
redis:
  host: localhost
  port: 6379
  password: ${REDIS_PASSWORD:}
  database: 0
```


## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/PostPilot_backup.git
cd PostPilot_backup
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd PostPilotBackend

# Install dependencies (if using Maven)
./mvnw clean install

# Or if using Gradle
./gradlew build

# Run the application
./mvnw spring-boot:run
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd PostPilotFrontEnd

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Database Setup

```bash
# Create PostgreSQL database
createdb postpilot

# Run database migrations (if applicable)
# The application will create tables automatically with JPA
```

### 5. Access the Application

* **Frontend**: <http://localhost:5173>
* **Backend API**: <http://localhost:8080>
* **API Documentation**: <http://localhost:8080/swagger-ui.html>


## 🐳 Docker Deployment

### Development Environment

```bash
# Start development containers
docker compose --profile dev up

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
```

### Production Environment

```bash
# Build and start production containers
docker compose --profile prod up --build -d

# Check container status
docker compose ps

# View logs
docker compose logs -f
```

### Container Management

```bash
# Stop all containers
docker compose down

# Stop and remove volumes
docker compose down -v

# Clean up unused resources
docker system prune -f
```


## 📱 API Documentation

### Authentication Endpoints

```http
POST /auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password"
}
```

### Content Management

```http
# Get all generated content
GET /generated-content

# Create new content
POST /generated-content
Content-Type: application/json

{
  "title": "Post Title",
  "content": "Post content...",
  "platform": "linkedin",
  "scheduledAt": "2024-01-15T10:00:00Z"
}
```

### Image Management

```http
# Upload image
POST /api/images/upload-for-content
Content-Type: multipart/form-data

# Get all images
GET /api/images

# Delete image
DELETE /api/images/{imageId}
```

### WebSocket Endpoints

```javascript
// Connect to WebSocket
const socket = new WebSocket('ws://localhost:8080/ws');

// Subscribe to user notifications
socket.send(JSON.stringify({
  destination: '/app/user/notifications',
  body: JSON.stringify({ userId: 'user-id' })
}));
```


## 🔧 Development

### Project Structure

```
PostPilot_backup/
├── PostPilotFrontEnd/          # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── Services/          # API services
│   │   ├── hooks/             # Custom hooks
│   │   └── ReduxSlice/        # State management
│   ├── public/                # Static assets
│   ├── Dockerfile            # Frontend container
│   └── docker-compose.yml    # Frontend orchestration
├── PostPilotBackend/          # Spring Boot backend
│   ├── src/main/java/         # Java source code
│   ├── src/main/resources/    # Configuration files
│   └── Dockerfile            # Backend container
└── README.md                 # This file
```

### Development Workflow



1. **Feature Development**: Create feature branches from `main`
2. **Code Review**: Submit pull requests for review
3. **Testing**: Run tests before merging
4. **Deployment**: Use Docker for consistent environments

### Code Quality

* **ESLint**: JavaScript/React linting
* **Prettier**: Code formatting
* **TypeScript**: Type safety (optional)
* **Jest**: Unit testing
* **Cypress**: E2E testing


## 📊 Analytics & Monitoring

### Built-in Analytics

* **Content Performance**: Track engagement metrics
* **User Activity**: Monitor user interactions
* **System Health**: Monitor application performance
* **Error Tracking**: Automatic error logging and reporting

### Monitoring Tools

* **Application Metrics**: Built-in performance monitoring
* **Database Monitoring**: Query performance tracking
* **Log Aggregation**: Centralized logging system
* **Alert System**: Automated alerting for critical issues


## 🔒 Security

### Authentication & Authorization

* **JWT Tokens**: Secure token-based authentication
* **Password Hashing**: BCrypt password encryption
* **Session Management**: Automatic session timeout
* **CORS Configuration**: Cross-origin request security

### Data Protection

* **Input Validation**: Server-side input sanitization
* **SQL Injection Prevention**: Parameterized queries
* **XSS Protection**: Content Security Policy headers
* **HTTPS Enforcement**: SSL/TLS encryption

### Security Best Practices

* **Environment Variables**: Secure configuration management
* **Dependency Scanning**: Regular security updates
* **Access Control**: Role-based permissions
* **Audit Logging**: Security event tracking


## 🤝 Contributing

### Getting Started



1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines

* Follow the existing code style
* Write meaningful commit messages
* Add documentation for new features
* Ensure all tests pass
* Update the README if needed

### Code Review Process

* All changes require review
* Maintain test coverage
* Follow security best practices
* Document breaking changes


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🆘 Support

### Getting Help

* **Documentation**: Check this README and inline code comments
* **Issues**: Create GitHub issues for bugs and feature requests
* **Discussions**: Use GitHub Discussions for questions
* **Email**: Contact the development team

### Troubleshooting

* **Common Issues**: Check the troubleshooting section
* **Logs**: Review application logs for errors
* **Debug Mode**: Enable debug logging for detailed information
* **Community**: Join our community forum


## 🎉 Acknowledgments

* **React Team**: For the amazing React framework
* **Spring Team**: For the robust Spring Boot framework
* **Open Source Community**: For the incredible tools and libraries
* **Contributors**: All the developers who have contributed to this project


**Made with ❤️ by the PostPilot Team**