# Front end

**Owner:** Davin

Everything people see and tap: screens, swipe gestures, animations, and the live "someone joined" / "it's a match" moments.

## Screens

| Screen | What it shows |
| --- | --- |
| Home | Start a group, or join one with a code |
| Group setup | Location, distance, price, food type |
| Waiting room | Who has joined so far (live) |
| Swipe | Restaurant cards: photo, name, price, rating, distance |
| Match | The fun moment, plus address, hours, and directions |
| No match | The stack ran out: widen filters or start over |

## Building before the back end is ready

Use the fake responses in [`../docs/mock/`](../docs/mock/). They match the shapes in [`../docs/API.md`](../docs/API.md), so switching to the real server should only mean changing the base URL.

## Brand

Logo files are in [`../assets/logo/`](../assets/logo/) (PNG at 2000px and 1024px, plus the original WebP). Primary color is `#EE4135`, the logo red. Both are placeholders until the style guide is done.

## Rules

- No API keys in this folder. Restaurant data comes from our back end, never straight from Google or Yelp.
- Every screen needs a loading, empty, and error state.

Tasks: see [`../TASKS.md`](../TASKS.md#front-end-davin).
