BEGIN;

CREATE TABLE  IF NOT EXISTS users (
    id serial not null primary key,
    name varchar(30) not null,
    lastname  varchar(30) not null,
    email  varchar(50) not null unique,
    bio text check(length(bio) < 200),
    password text not null,
    posts int not null default 0,
    followers int not null default 0,
    following int not null default 0,
    date date  not null default now()
);


CREATE TABLE  IF NOT EXISTS post (
    id serial not null primary key,
    userid int not null references users(id) on delete cascade,
    image_url text,
    title varchar(100) check(length(text) <= 100),
    text text not null check(length(text) < 500),
    bg text ,
    date date  not null default now(),
    total_likes int not null DEFAULT 0,
    total_comment INT NOT NULL DEFAULT 0
);


CREATE TABLE  IF NOT EXISTS comment (
    id serial not null primary key,
    text text not null check(length(text) < 200),
    postId int not null references post(id),
    answers int not null default 0,
    date date not null default now(),
    userid int not null references users(id)  on delete cascade
);


CREATE TABLE  IF NOT EXISTS likes (
    id serial not null primary key,
    postId int not null references post(id) on delete cascade,
    userid int not null references users(id)  on delete cascade,
    date date NOT NULL DEFAULT now()
);

CREATE TABLE  IF NOT EXISTS answers (
    id serial not null primary key,
    text text not null check(length(text) < 200),
    commentid int not null references post(id) on delete cascade,
    date date not null default now(),
    userid int not null references users(id) on delete cascade
);


CREATE TABLE  IF NOT EXISTS notification (
    id serial not null primary key,
    type int not null,
    date date not null default now(),
    userid int not null references users(id) on delete cascade,
    postid int not null references post(id) on delete cascade
);

CREATE TABLE  IF NOT EXISTS folowers (
    id serial not null primary key,
    ownerid int not null references users(id) on delete cascade,
    followerid int not null references users(id) on delete cascade
);
CREATE TABLE  IF NOT EXISTS following (
    id serial not null primary key,
    ownerid int not null references users(id) on delete cascade,
    followingid int not null references users(id) on delete cascade
);
COMMIT ;