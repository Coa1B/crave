# Back end

**Owner:** Colby

Owns the data, the rules, and keeping everyone's phone in sync.

## Responsibilities

| Area | What it does |
| --- | --- |
| Groups | Create a group, make a short join code, track who's in it, close old groups after a while |
| Restaurant data | Pull nearby places from a maps API (Google Places or Yelp) using the group's location and filters |
| Swipes | Save each person's yes or no for each place |
| Match logic | After every swipe, check whether everyone said yes to the same place |
| Live updates | Push "member joined" and "match found" to every phone right away (WebSockets) |
| Users | Nickname per group only; real accounts come later |
| Hosting | Server and database online so it works on real phones |

## Secrets

Copy `.env.example` to `.env` and fill it in. `.env` is git-ignored; never commit keys, and never send them to the front end.

## Stack

Not picked yet (week 1 task). Write the choice here once it's decided so Davin knows the base URL and how to run the server locally.

Tasks: see [`../TASKS.md`](../TASKS.md#back-end-colby).
