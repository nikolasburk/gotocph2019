# GraphQL & Prisma Demo (GOTO Copenhagen 2019)

## Slides

You can find the slides of the talk [here](https://www.slideshare.net/nburk/nextgeneration-api-development-with-graphql-and-prisma).

## Usage

### 1. Clone repo

```
git clone git@github.com:nikolasburk/gotocph2019.git
cd gotocph2019
```

### 2. Provide database credentials

In `schema.prisma`, replace the `url` in the `datasource` configuration with the connection string for your PostgreSQL database, for example:

```prisma
datasource db {
  provider = "postgresql"
  url      = "postgresql://janedoe:janedoe@localhost:5432/goto-demo"
}
```

Or use a local SQLite file if you don't have a PostgreSQL server running:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./goto-demo.db"
}
```

### 3. Install dependencies

```
npm install
```

### 3. Run Prisma's development mode

Run the Prisma development mode. This will: 

- Migrate your database (i.e. it creates tables for the models in your Prisma schema)
- Generated the type-safe Photon.js database client

```
npx prisma2 dev
```

### 4. Start the server

```
npm run dev
```

### 5. Explore the GraphQL API

You can now go to [http://localhost:4000](http://localhost:4000) in your browser and start sending GraphQL queries and mutations ✨

## Learn more

To learn more about the Prisma Framework, go to the [official GitHub repo](https://github.com/prisma/prisma2).