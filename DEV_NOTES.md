# Crave

## Overview

A group of friends can't agree on where to eat. This app fixes that: everyone swipes yes or no on nearby restaurants, and the app shows a match when the whole group likes the same place.

- **Front end:** Davin (what people see and tap)
- **Back end:** Colby (data, match logic, live updates)

The repo is the source of truth. See `README.md`, `TASKS.md`, and `docs/API.md` (the API contract) for the latest.

### How it works

1. One person starts a group and picks a location and filters (distance, price, food type).
2. They share a short join code or link with friends.
3. Everyone joins and sees the same stack of restaurant cards.
4. Each person swipes right (yes) or left (no) on their own phone.
5. When everyone says yes to the same place, all phones show a match screen.
6. The match screen shows the address, hours, and a button to open directions.

### First version (keep it small)

- Join with a code, nickname only (no accounts yet)
- Filters: location, distance, price
- Swipe yes or no
- Match when everyone says yes
- Address and directions on match

Later, not now: accounts, saved groups, diet filters, "super like", top-3 results when no full match, reservations.

## Tech stack (proposed)

- **Language:** TypeScript on both sides
- **Front end:** React Native with Expo
- **Back end:** Node.js + Express, Socket.io for live updates, PostgreSQL
- Restaurant data comes from a maps API (Google Places or Yelp), called from the back end only. Never put API keys in front-end code.

## Front end

### Design

- **Figma:** [restaurant-decider](https://www.figma.com/design/lYxE6biWog3mcg3FSmI08K/restaurant-decider?node-id=0-1&p=f&t=VVPt3RpxGC2WyTOJ-0)
- The Figma file is the source of truth for layout, colors, type, and spacing. Match it closely. If something in code needs to differ from Figma, flag it instead of guessing.
- Build shared styles (colors, font sizes, spacing, button and card styles) in one theme file and use them everywhere. No one-off hex codes in screens.

### Brand

- Name: Crave
- Logo: `assets/logo/` (heart with a fork, line style; placeholder for now)
- Primary color: `#EE4135` (the logo red)
- Background: `#FFFFFF`

### Look and feel

- Fun, fast, and simple. A group should get from opening the app to swiping in under a minute.
- Mobile first. Big tap targets, one main action per screen.
- Restaurant photos are the star of the swipe screen. Keep text on cards short.
- The match screen is the big moment. It should feel like a celebration (animation, bold type), then get out of the way with clear directions.
- Plain, friendly wording in the UI. No jargon.

### Screens

| Screen | What it does |
| --- | --- |
| Home | Start a group or join one with a code |
| Group setup | Pick location, distance, price, food type |
| Waiting room | Shows who has joined; host starts swiping |
| Swipe | Restaurant cards: photo, name, price, rating, distance. Swipe right = yes, left = no. Also yes/no buttons for people who don't swipe |
| Match | Celebration, then address, hours, and directions button |
| No match | Stack ran out: widen filters or start over |

### Front-end rules

- Swipe gestures and card animations should feel smooth (aim for 60fps).
- Every screen needs loading, empty, and error states. The app should never look broken or frozen.
- Live updates (someone joined, match found) come from the back end over WebSockets. Show them right away.
- Until an endpoint is ready, use the fake data in `docs/mock/`, which matches the agreed data shape, so the front end isn't blocked.

## Where front end and back end connect

The full contract lives in `docs/API.md`. Agree on changes with Colby before merging; change them together, not alone.

| Action | Endpoint | Returns |
| --- | --- | --- |
| Start a group | `POST /groups` | Group ID and join code |
| Join a group | `POST /groups/:code/join` | Group info and members |
| Get restaurant cards | `GET /groups/:id/restaurants` | Places: name, photo, price, rating, distance, address |
| Send a swipe | `POST /groups/:id/swipes` | OK, or a match if this swipe made one |
| Live updates | WebSocket per group | "member joined" and "match found" events |

Still to decide:
- Exact field names for a restaurant card
- Whether a match means everyone says yes, or most people
- What error responses look like
