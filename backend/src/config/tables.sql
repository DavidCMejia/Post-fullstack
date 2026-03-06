-- Tables
CREATE TABLE IF NOT EXISTS saved_users (
  id INTEGER PRIMARY KEY,
  email VARCHAR NOT NULL,
  "firstName" VARCHAR NOT NULL,
  "lastName" VARCHAR NOT NULL,
  avatar VARCHAR,
  "savedAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  "authorUserId" INTEGER,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("authorUserId") REFERENCES saved_users(id) ON DELETE SET NULL
);

-- Seeds
INSERT INTO saved_users (id, email, "firstName", "lastName", avatar) VALUES
(1, 'george.bluth@reqres.in', 'George', 'Bluth', 'https://reqres.in/img/faces/1-image.jpg'),
(2, 'janet.weaver@reqres.in', 'Janet', 'Weaver', 'https://reqres.in/img/faces/2-image.jpg'),
(3, 'emma.wong@reqres.in', 'Emma', 'Wong', 'https://reqres.in/img/faces/3-image.jpg');

INSERT INTO posts (title, content, "authorUserId") VALUES
('Getting Started with TypeScript', 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.', 1),
('Why PostgreSQL?', 'PostgreSQL is a powerful, open source object-relational database system with over 35 years of active development.', 2),
('REST API Best Practices', 'Building a REST API requires careful planning around resource naming, HTTP methods, status codes, and error handling.', 3);