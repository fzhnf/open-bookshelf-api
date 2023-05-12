npx create-next-app
npm install prisma jsonwebtoken bcrypt joi nanoid
npx prisma init
npx prisma db push

git checkout -b "ariqH"
git checkout -b "fzhnf"
schema.prisma:
```
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id           String      @id @default(nanoid())
  username     String      @unique
  email        String      @unique
  password     String

  books        Book[]
  bookshelves  Bookshelf[]
  Collaboration         Collaboration[]
  BookshelfBookActivity BookshelfBookActivity[]
}

model Book {
  id        Int      @id @default(autoincrement())
  title     String
  year      Int
  author    String
  user_id   String
  description           String?
  
  bookshelves           BookshelfBook[]
  BookshelfBookActivity BookshelfBookActivity[]
  user                  User                    @relation(fields: [user_id], references: [id], onDelete: Cascade)
  }

model Bookshelf {
  id            String                  @id @default(nanoid())
  name          String
  owner         String
  userId        String
 
  collaborators Collaboration[]
  books         BookshelfBook[]
  activities    BookshelfBookActivity[]
  user          User                    @relation(fields: [userId], references: [id])
}

model Collaboration {
  id          String    @id @default(nanoid())
  bookshelfId String
  userId      String
  
  user        User      @relation(fields: [userId], references: [id])
  bookshelf   Bookshelf @relation(fields: [bookshelfId], references: [id])
}

model BookshelfBook {
  id          String    @id @default(nanoid())
  bookId      Int 
  bookshelfId String
  
  book        Book      @relation(fields: [bookId], references: [id])
  bookshelf   Bookshelf @relation(fields: [bookshelfId], references: [id])
}

model BookshelfBookActivity {
  id          String    @id @default(nanoid())
  bookId      Int
  bookshelfId String
  userId      String
  action      String
  time        DateTime  @default(now())

  user        User      @relation(fields: [userId], references: [id])
  book        Book      @relation(fields: [bookId], references: [id])
  bookshelf   Bookshelf @relation(fields: [bookshelfId], references: [id])
}
```

folder structure:
```
└───src
    └───app
        │   favicon.ico
        │   globals.css
        │   layout.js
        │   page.js
        │
        ├───api
        │   ├───books
        │   │   │   route.js
        │   │   │
        │   │   └───[id]
        │   │           route.js
        │   │
        │   ├───bookshelves
        │   ├───collaborations
        │   ├───hello
        │   │       route.js
        │   │
        │   ├───login
        │   │       route.js
        │   │
        │   ├───register
        │   │       route.js
        │   │
        │   └───users
        │       └───me
        │               route.js
        │
        └───backend
            ├───errors
            │       AuthenticationError.js
            │       AuthorizationError.js
            │       ClientError.js
            │       InvariantError.js
            │       NotFoundError.js
            │
            ├───libs
            │       prismadb.js
            │
            ├───services
            │       bookService.js
            │       BookShelfService.js
            │       collaborationService.js
            │       userService.js
            │
            ├───token
            │       jsonwebtoken.js
            │
            ├───utils
            │       errorHandler.js
            │       getTokenHandler.js
            │
            └───validators
                    bookshelfValidator.js
                    bookValidator.js
                    collaborationValidator.js
                    loginValidator.js
                    registerValidator.js
```
