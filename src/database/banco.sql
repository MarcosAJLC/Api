drop table photo CASCADE;
CREATE TABLE IF NOT EXISTS photo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id INTEGER REFERENCES student(id) ON DELETE CASCADE ON UPDATE CASCADE,
  url text not NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
drop table student CASCADE;
CREATE TABLE IF NOT EXISTS student (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER NOT NULL,
  weight FLOAT NOT NULL,
  height FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES Users(id) ON DELETE CASCADE
);

drop table users CASCADE;
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
