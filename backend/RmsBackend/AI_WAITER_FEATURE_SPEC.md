# AI Waiter Integration — Feature Specification

## 1. Project Context

This is an existing restaurant management backend (see `API_REFERENCE.md` in this repo) with REST APIs already covering:

- **Vendors** — CRUD for suppliers
- **Users/Auth** — register, login, role management
- **Tables** — add, update, get, delete
- **Dishes** — parent/child model (e.g. parent "Pizza" → children "Margherita", "Pepperoni"), with fields like `dishName`, `description`, `price`, `imageUrl`, `tags`
- **Orders** — create order, add items, increase/decrease quantity, pending orders per table, remove dish
- **Payments** — process payment, pay dues, pending dues
- **Inventory** — CRUD on inventory items tied to vendors

This spec describes a **new feature**: an AI-powered conversational ordering assistant that runs on a tablet at each table, intended to reduce (not fully replace, see Section 5) the need for a human waiter to take orders.

## 2. Goal

Let a customer sit down at a table, talk naturally to an AI assistant on a tablet ("I want something spicy, chicken, under ₹300"), see matching dishes appear visually as they talk, refine the conversation, and confirm an order — which then gets pushed into the existing `order` APIs exactly as if a waiter had entered it.

## 3. High-Level Architecture

```
[Tablet at table]
   ↓ mic input
[Speech-to-Text: Whisper]
   ↓ transcribed text
[LLM Orchestrator — intent + recommendation layer]
   ↓ function calls (grounded, see Section 6)
[Existing REST API — /dish, /order, /table, /inventory]
   ↓ response
[LLM formats reply]
   ↓
[Tablet UI: chat bubble + side-by-side dish cards]
   ↓ optional TTS
[Spoken reply back to customer]
```

### Components to build

1. **STT service** — Whisper (local via `whisper.cpp`/`faster-whisper`, or hosted API) converts mic audio to text per utterance.
2. **LLM Orchestrator** — a backend service that:
   - Receives transcribed text + conversation history + table context (tableId, session).
   - Calls an LLM (e.g. Claude) with **function/tool calling** enabled.
   - Tools exposed to the LLM should map to *existing* backend endpoints — not invented ones. See Section 6.
   - Returns a structured response: `{ replyText, recommendedDishes[], action? }`.
3. **Tablet frontend** — chat-style UI + a menu grid panel that updates live as the LLM recommends dishes. Needs:
   - Push-to-talk or voice-activity-detected mic capture
   - Chat transcript view
   - Dish cards panel (image, name, price, tags) rendered from `imageUrl`/`price`/`tags` fields already in the dish model
   - "Add to order" confirmation step — **the AI should never silently place an order without a visible confirm tap**, given price/allergy stakes
4. **(Optional) TTS** — for the assistant to speak back, not just display text.

## 4. Conversation Flow (example)

1. Tablet session starts → orchestrator calls `GET /api/table/v1/get/{tableId}` to load table context, and `GET /api/dish/v1/get-all-parents` + children to warm a local menu cache.
2. Customer speaks → Whisper transcribes → text sent to orchestrator.
3. LLM interprets intent (cuisine, price range, spice level, veg/non-veg, allergies if mentioned) and searches the **cached menu data** (not its own knowledge) for matches.
4. LLM returns a short spoken-style reply + a list of matched `dishId`s.
5. Frontend renders those dish cards next to the chat.
6. Customer says "add the second one, two of those" → LLM resolves reference → confirms verbally → frontend shows confirm button.
7. On tap, frontend calls `POST /api/order/v1/create-order` (first item) or `POST /api/order/v1/add-items/{tableId}` (subsequent items) with the resolved `dishId` + `quantity`.
8. Order flows into the existing kitchen/backend pipeline unchanged.

## 5. Scope Guardrails (v1)

This is framed as an **AI ordering assistant**, not a full waiter replacement, for these reasons:

- Payments, complaints, and allergy disputes should still route to a human. Do not wire the AI into `/api/payment/*` in v1.
- The AI must **only recommend dishes that exist in the live menu data** pulled from `/api/dish/*`. No hallucinated dishes or prices — this is a hard requirement, not a nice-to-have.
- Every order placement needs an explicit customer confirmation step in the UI before hitting `create-order`/`add-items`. No fully autonomous ordering.
- Human staff should be able to see/override the AI-built cart before it's finalized (or immediately after), at least in v1.

## 6. LLM Tool/Function Definitions (map directly to existing APIs)

Define these as callable tools for the LLM — grounding it strictly in real backend data:

| Tool name | Maps to | Purpose |
|---|---|---|
| `get_menu_categories` | `GET /api/dish/v1/get-all-parents` | List parent dish categories |
| `get_dishes_in_category` | `GET /api/dish/v1/get-childs/{parentDishId}` | List child dishes with price/tags/imageUrl |
| `get_dish_details` | `GET /api/dish/v1/get-dish/{childDishId}` | Full detail on one dish |
| `get_table_status` | `GET /api/table/v1/get/{tableId}` | Confirm table context |
| `get_pending_order` | `GET /api/order/v1/pending-order/{tableId}` | Check what's already ordered at this table |
| `add_items_to_order` | `POST /api/order/v1/add-items/{tableId}` | Add confirmed items (only after UI confirm) |
| `create_order` | `POST /api/order/v1/create-order` | First order for a table |

The LLM should **never** be given free-text write access — only these structured, parameterized tools, so it can't construct arbitrary API calls.

## 7. Data/Model Notes

- Dish `tags` (string field on `AddChildDishRequest`/`UpdateDishRequest`) should be used for filtering (spicy, veg/non-veg, cuisine type) — confirm with backend team whether `tags` is free text or a controlled vocabulary; a controlled vocabulary will make LLM filtering much more reliable.
- `imageUrl` already exists on dishes — reuse directly for the tablet's visual cards, no new asset pipeline needed.
- No allergy field currently exists in the dish model — flag as a possible schema gap if allergy-aware filtering is wanted.

## 8. Open Questions to Resolve Before/During Build

- Which LLM provider/model for the orchestrator, and hosted vs. self-hosted Whisper?
- Multi-table concurrency: one orchestrator instance per table session, or a shared service handling many sessions?
- Language support: English only, or regional languages (relevant for Pune market)?
- Where does conversation history live — session-only, or persisted for analytics?
- Fallback UX: what happens if STT/LLM fails or the customer wants a human — needs a visible "call staff" button regardless of AI state.

## 9. Suggested Build Order

1. Menu-browsing chatbot (text-only, no voice) that recommends dishes from live `/dish` data — validates grounding and tool-calling before adding audio complexity.
2. Add Whisper STT input on top of the working text chatbot.
3. Add the tablet dish-card UI synced to LLM recommendations.
4. Add order confirmation → `create-order`/`add-items` wiring.
5. Add TTS for spoken replies.
6. Add "call staff" fallback and human-override view of AI-built carts.
