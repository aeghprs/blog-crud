# Blog CRUD

A full-stack blog application with a React + Vite frontend and an Express + TypeScript backend. Users can register and sign in, browse blog posts, create and manage categories, and publish, edit, or delete their own blog posts.

## Project overview

This repository contains two separate apps:

- Frontend: blog-frontend-react
  - Built with React, TypeScript, Vite, Tailwind CSS, and React Query
  - Provides the UI for authentication, blog browsing, post creation, and category management
- Backend: blog-backend-express
  - Built with Express, TypeScript, PostgreSQL, JWT authentication, and Zod validation
  - Exposes REST APIs for users, blogs, and categories

## Main features

- User registration and login
- JWT-based authentication and protected routes
- Browse all published posts
- View full blog post details
- Create, edit, and delete blog posts
- Create, edit, and delete categories
- Rich text editor for blog content
- Pagination and basic post listing experience
- Responsive UI with light/dark theme support

## Where users can do things

- Home page: browse posts from the landing/home screen
- Register: visit /register
- Login: visit /login
- View a post: open /posts/:id
- Create a blog post: after logging in, go to /dashboard and click Write, or visit /posts/new
- Edit a blog post: open an existing post and use the edit route /posts/:id/edit
- Delete a blog post: from the dashboard list, use the delete action on a post card
- Create a category: after logging in, go to /category and click Add category
- Edit or delete a category: from the categories page, use the action buttons in the table

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL
- Docker

## Running the project with npm

### 1) Backend

```bash
cd blog-backend-express
npm install
```

Create a .env file in the backend folder with values like:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=blogdb
```

Initialize the database schema:

```bash
npm run setup
```

Start the backend server:

```bash
npm run dev
```

The API will be available at:

- http://localhost:3001

### 2) Frontend

In a new terminal:

```bash
cd blog-frontend-react
npm install
```

Create a .env.local file in the frontend folder:

```env
VITE_API_URL=http://localhost:3001
```

Start the frontend app:

```bash
npm run dev
```

Open the app at:

- http://localhost:5173

## Running the project with Docker

This repository includes Docker support for both apps and a PostgreSQL database.

From the project root:

```bash
docker compose up --build
```

Once the containers are running:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PostgreSQL: localhost:5432

To stop the containers:

```bash
docker compose down
```

To remove the database volume as well:

```bash
docker compose down -v
```

## Docker structure

- blog-backend-express/Dockerfile
- blog-frontend-react/Dockerfile
- blog-frontend-react/nginx.conf
- docker-compose.yml

## Notes

- The backend expects PostgreSQL to be available before the server starts.
- The first time you run with Docker, the database container will initialize the default database.
- If you change the backend environment variables, update the docker-compose.yml values as needed.
