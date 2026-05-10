# Supabase JS Client — Cheatsheet

---

## Podstawy

```ts
const supabaseClient = useSupabaseClient<Database>()

const { data, error } = await supabaseClient
  .from('nazwa_tabeli')
  .select('kolumna1, kolumna2')
```

`data` — wynik zapytania (tablica obiektów lub null)
`error` — błąd jeśli coś poszło nie tak

---

## SELECT — co pobierać

```ts
// wszystkie kolumny
.select('*')

// konkretne kolumny
.select('id, name, price')

// zagnieżdżona tabela powiązana kluczem obcym
.select('id, status, order_items ( product_name, quantity )')

// dwie zagnieżdżone tabele naraz
.select(`
  id,
  status,
  total,
  customers ( first_name, last_name, email ),
  stores ( name )
`)
```

**Zagnieżdżony select działa tylko gdy między tabelami istnieje klucz obcy w schemacie.**
Supabase sam wykrywa relację i robi JOIN — nie musisz pisać JOIN ręcznie.

Wynik zagnieżdżonej relacji to obiekt (jeden-do-jednego) lub tablica (jeden-do-wielu):
```ts
// orders → order_items (jeden order ma wiele items) → tablica
order.order_items  // []

// orders → customers (wiele orders należy do jednego customer) → obiekt
order.customers    // {}
```

---

## WHERE — filtrowanie

```ts
// .eq = równa się (=)
.eq('status', 'delivered')

// .neq = różne od (!=)
.neq('status', 'cancelled')

// .gt / .gte = większe niż / większe lub równe (> / >=)
.gt('total', 100)
.gte('total', 100)

// .lt / .lte = mniejsze niż / mniejsze lub równe (< / <=)
.lt('quantity', 10)

// .in = wartość należy do listy (IN)
.in('status', ['delivered', 'shipped'])

// .is = null check
.is('deleted_at', null)

// zakres dat
.gte('ordered_at', '2024-01-01')
.lt('ordered_at', '2025-01-01')

// kilka warunków = chainujesz metody (AND)
.eq('store_id', 1)
.eq('status', 'delivered')
.gte('total', 500)
```

**Nie ma natywnego OR w prostym chainie** — do OR używasz `.or()`:
```ts
.or('status.eq.delivered,status.eq.shipped')
```

---

## ORDER BY — sortowanie

```ts
// rosnąco (domyślne)
.order('ordered_at', { ascending: true })

// malejąco
.order('ordered_at', { ascending: false })

// wiele kolumn
.order('store_id', { ascending: true })
.order('total', { ascending: false })
```

---

## LIMIT i paginacja

```ts
// limit
.limit(20)

// offset (strona 2 po 20 wyników)
.range(20, 39)
```

---

## Typowanie wyników

```ts
import type { Database } from '~/types/database.types'

// prosty typ z bazy
type Order = Database['public']['Tables']['orders']['Row']

// tylko wybrane kolumny
type OrderPreview = Pick<
  Database['public']['Tables']['orders']['Row'],
  'id' | 'status' | 'total' | 'ordered_at'
>

// z zagnieżdżoną relacją
type OrderWithItems = Pick<
  Database['public']['Tables']['orders']['Row'],
  'id' | 'status' | 'total' | 'ordered_at'
> & {
  order_items: Pick<
    Database['public']['Tables']['order_items']['Row'],
    'product_name' | 'quantity' | 'unit_price'
  >[]
}
```

Jeśli TypeScript marudzi na przypisanie `data`:
```ts
orders.value = data as OrderWithItems[]
```

---

## Pełny przykład — zamówienia klienta z pozycjami

```ts
const { data, error } = await supabaseClient
  .from('orders')
  .select(`
    id,
    status,
    total,
    ordered_at,
    order_items ( product_name, quantity, unit_price )
  `)
  .eq('customer_id', 1)
  .in('status', ['delivered', 'shipped'])
  .gte('ordered_at', '2024-01-01')
  .order('ordered_at', { ascending: false })
  .limit(50)

if (error) {
  console.error(error.message)
} else {
  orders.value = data
}
```

---

## SQL vs Supabase JS — porównanie

| SQL | Supabase JS |
|---|---|
| `SELECT id, name` | `.select('id, name')` |
| `WHERE status = 'x'` | `.eq('status', 'x')` |
| `WHERE id IN (1,2,3)` | `.in('id', [1, 2, 3])` |
| `WHERE total > 100` | `.gt('total', 100)` |
| `ORDER BY total DESC` | `.order('total', { ascending: false })` |
| `LIMIT 20` | `.limit(20)` |
| `JOIN order_items ON ...` | `order_items ( kolumny )` w select |

**Czego Supabase JS nie ogarnie** (potrzebujesz widoku w bazie):
- GROUP BY + agregacje (COUNT, SUM, AVG)
- HAVING
- złożone wielopoziomowe JOINy z warunkami na powiązanych tabelach

---

## Brak klucza obcego — dwa zapytania + mapowanie w JS

Zagnieżdżony select działa tylko gdy jest FK w schemacie. Gdy go nie ma — dwa osobne zapytania i sklejasz w JS.

```ts
// zapytanie 1 — pobierz zamówienia
const { data: orders } = await supabaseClient
  .from('orders')
  .select('id, status, total, store_id')

// zapytanie 2 — pobierz sklepy
const { data: stores } = await supabaseClient
  .from('stores')
  .select('id, name')

// mapowanie — sklejasz po store_id
const storeMap = new Map(stores.map(s => [s.id, s.name]))

const result = orders.map(order => ({
  ...order,
  store_name: storeMap.get(order.store_id)
}))
```

**Kiedy co stosować:**

| Sytuacja | Rozwiązanie |
|---|---|
| Jest FK między tabelami | zagnieżdżony select |
| Brak FK, proste dane | dwa zapytania + mapowanie w JS |
| GROUP BY, agregacje, HAVING | widok (VIEW) w bazie → `.from('nazwa_widoku')` |

---

## Widok (VIEW) w bazie — kiedy Supabase JS nie wystarczy

Widok to zapisane zapytanie SQL które zachowuje się jak tabela.
Odpytujesz go przez `.from()` jakby była zwykłą tabelą — ale w środku baza wykonuje SELECT za Ciebie.

**Krok 1 — tworzysz widok w migracji SQL:**
```sql
CREATE VIEW v_store_revenue AS
SELECT
  stores.id,
  stores.name,
  COUNT(orders.id)  AS liczba_zamowien,
  SUM(orders.total) AS przychod
FROM stores
JOIN orders ON orders.store_id = stores.id
WHERE orders.status = 'delivered'
GROUP BY stores.id, stores.name;
```

**Krok 2 — odpytujesz w Nuxt jak zwykłą tabelę:**
```ts
const { data } = await supabaseClient
  .from('v_store_revenue')
  .select('*')

// możesz też filtrować i sortować
const { data } = await supabaseClient
  .from('v_store_revenue')
  .select('*')
  .order('przychod', { ascending: false })
```

**Zalety:**
- GROUP BY, SUM, COUNT zostają w bazie — kod w Nuxt jest prosty
- możesz filtrować widok przez `.eq()`, `.order()` itd.

**Wada:**
- widok jest liczony przy każdym zapytaniu na żywo
- przy bardzo ciężkich zapytaniach używa się `MATERIALIZED VIEW` który cachuje wynik (ale to osobny temat)
