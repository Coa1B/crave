# API contract (draft)

This is a **starting draft** for you both to edit in week 1–2. Field names here are suggestions; once you agree, treat this file as the source of truth and change it only when both of you are OK with it.

All requests and responses are JSON. The member's ID goes in a header so the server knows who's swiping:

```
X-Member-Id: m_7f3a
```

## Endpoints

| Action | Endpoint | Sends back |
| --- | --- | --- |
| Start a group | `POST /groups` | Group ID, join code, your member ID |
| Join a group | `POST /groups/:code/join` | Group info, members, your member ID |
| Get restaurant cards | `GET /groups/:id/restaurants` | List of places |
| Send a swipe | `POST /groups/:id/swipes` | OK, or a match if this swipe made one |
| Live updates | WebSocket `/groups/:id/live` | `member_joined`, `match_found` events |

### Start a group

`POST /groups`

```json
{
  "nickname": "Colby",
  "location": { "lat": 37.7749, "lng": -122.4194 },
  "filters": { "radiusMeters": 3000, "price": [1, 2], "cuisine": ["mexican", "thai"] }
}
```

Response `201`:

```json
{
  "groupId": "g_9c21",
  "joinCode": "TACO42",
  "memberId": "m_7f3a"
}
```

### Join a group

`POST /groups/TACO42/join`

```json
{ "nickname": "Davin" }
```

Response `200`:

```json
{
  "groupId": "g_9c21",
  "memberId": "m_b812",
  "members": [
    { "id": "m_7f3a", "nickname": "Colby" },
    { "id": "m_b812", "nickname": "Davin" }
  ]
}
```

### Get restaurant cards

`GET /groups/g_9c21/restaurants`

Every member gets the same list in the same order. See [`mock/restaurants.json`](mock/restaurants.json) for a full example.

```json
{
  "restaurants": [
    {
      "id": "r_001",
      "name": "La Taqueria",
      "photoUrl": "https://example.com/photo.jpg",
      "price": 1,
      "rating": 4.6,
      "distanceMeters": 850,
      "address": "2889 Mission St, San Francisco, CA",
      "hours": "11:00–21:00",
      "location": { "lat": 37.7509, "lng": -122.4181 }
    }
  ]
}
```

- `price`: 1–4 (shown as $ to $$$$)
- `rating`: 0–5, one decimal

### Send a swipe

`POST /groups/g_9c21/swipes`

```json
{ "restaurantId": "r_001", "liked": true }
```

Response `200`, no match yet:

```json
{ "ok": true, "match": null }
```

Response `200`, this swipe made a match:

```json
{ "ok": true, "match": { "restaurantId": "r_001" } }
```

### Live updates

Connect to `/groups/:id/live?memberId=m_7f3a`. The server sends:

```json
{ "type": "member_joined", "member": { "id": "m_b812", "nickname": "Davin" } }
```

```json
{ "type": "match_found", "restaurant": { "id": "r_001", "name": "La Taqueria", "address": "2889 Mission St, San Francisco, CA", "hours": "11:00–21:00", "location": { "lat": 37.7509, "lng": -122.4181 } } }
```

On connect (or reconnect), the server first sends a `state` event with the current members and match, so a phone that dropped can catch up:

```json
{ "type": "state", "members": [ … ], "match": null }
```

## Errors

Every error uses the same shape, so the front end can show `message` directly:

```json
{ "error": { "code": "GROUP_NOT_FOUND", "message": "That code doesn't match an open group." } }
```

| Code | HTTP | When |
| --- | --- | --- |
| `GROUP_NOT_FOUND` | 404 | Bad or expired join code / group ID |
| `GROUP_CLOSED` | 410 | Group timed out |
| `NICKNAME_TAKEN` | 409 | Someone in the group already has that nickname |
| `INVALID_INPUT` | 400 | Missing or bad fields |
| `NO_RESTAURANTS` | 200 + empty list | Nothing matched the filters (not an error; show the "widen filters" screen) |
| `SERVER_ERROR` | 500 | Anything else |

## Open questions

- [ ] Match rule: everyone says yes, or a majority? (Draft assumes everyone.)
- [ ] Does a person who joins late see the whole stack from the start?
- [ ] How many restaurants per group? (Suggest 20 to start.)
- [ ] Can the group creator change filters after people join?
