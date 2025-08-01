# Discord Study Bot

A Discord bot built using the Discord.js package.

This bot will aim to help me with improving my Chinese reading and comprehension

Features I plan on including are:

-   Spaced repetition for reviewing content learned
-   Easy creation of flashcards
-   Maybe ability to sentence mine?? IDK

## Migrations

I'm using Kysely as my ORM.

New migration: `npx kysely migrate:make <migration_name>`
Apply latest migration batch: `npx kysely migrate:latest`
Rollback latest migration batch: `npx kysely migrate:rollback --all`
