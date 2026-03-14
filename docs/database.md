# Database

## Working with database schema (TypeOrm)

### Generate migration

1. Create entiy file with extension `.entity.ts`. For example `post.entity.ts`

   ```ts
   // /src/posts/infrastructure/persistence/relational/entities/post.entity.ts

   import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
   import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper'

   @Entity()
   export class Post extends EntityRelationalHelper {
     @PrimaryGeneratedColumn()
     id: number

     @Column()
     title: string

     @Column()
     body: string

     // Here any fields that you need
   }
   ```

2. Next generate migration file

```bash
npm run migration:generate -- src/database/migrations/CreatePostTable
```

3. Apply this migration to database via [npm run migration:run](#run-migration).

### Create database

### Grant privilege for user

### Run migration

```bash
npm run migration:run
```

### Revert migration

```bash
npm run migration:revert
```

### Drop all tables in database

```bash
npm run schema:drop
```

---

## Generate new module

```bash
pnpm run generate:resource:relational -- --name Category
```
