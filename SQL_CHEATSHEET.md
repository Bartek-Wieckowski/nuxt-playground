# SQL Cheatsheet — słowa kluczowe i kiedy ich używać

---

## Kolejność klauzul — zawsze taka sama

```sql
SELECT   -- co chcę zobaczyć
FROM     -- skąd biorę dane (tabela główna)
JOIN     -- doklejam inne tabele
WHERE    -- filtruję wiersze (przed grupowaniem)
GROUP BY -- grupuję wiersze
HAVING   -- filtruję grupy (po grupowaniu)
ORDER BY -- sortuję wynik
LIMIT    -- ograniczam liczbę wyników
```

---

## WHERE — filtrowanie surowych wierszy

"Surowe wiersze" = dane zanim cokolwiek policzyłeś. Wyobraź sobie że masz arkusz Excel
z 4000 wierszami zamówień — WHERE to autofiltr który ukrywa wiersze zanim zaczniesz liczyć.

**Przed WHERE** — wszystkie zamówienia:
| id | store_id | status    | total |
|----|----------|-----------|-------|
| 1  | 1        | delivered | 500   |
| 2  | 1        | cancelled | 200   |
| 3  | 2        | delivered | 800   |
| 4  | 2        | pending   | 150   |

**Po `WHERE status = 'delivered'`** — zostają tylko te wiersze:
| id | store_id | status    | total |
|----|----------|-----------|-------|
| 1  | 1        | delivered | 500   |
| 3  | 2        | delivered | 800   |

Dopiero na tych przefiltrowanych wierszach działa GROUP BY i agregacje.

**Czego nie możesz w WHERE:**
```sql
-- ŹLE — WHERE nie wie jeszcze ile jest produktów, bo nie grupował
WHERE COUNT(products.id) > 10

-- DOBRZE — WHERE działa na kolumnach które istnieją w wierszu
WHERE products.base_price > 100
```

---

## GROUP BY — grupowanie wierszy

GROUP BY zwija wiele wierszy w jeden na podstawie wspólnej wartości.
Bez GROUP BY każdy wiersz to osobna linia. Z GROUP BY — jedna linia na grupę.

**Przed GROUP BY** (po JOIN orders + stores):
| store_name | order_id | total |
|------------|----------|-------|
| TechMart   | 1        | 500   |
| TechMart   | 2        | 200   |
| TechMart   | 3        | 900   |
| ModaHouse  | 4        | 800   |
| ModaHouse  | 5        | 150   |

**Po `GROUP BY store_name`** — jeden wiersz na sklep, reszta jest liczona:
| store_name | COUNT(order_id) | SUM(total) |
|------------|-----------------|------------|
| TechMart   | 3               | 1600       |
| ModaHouse  | 2               | 950        |

Zasada: w SELECT możesz mieć tylko to co jest w GROUP BY **albo** jest agregacją (COUNT, SUM...).
Wszystko inne nie ma sensu — skąd baza ma wiedzieć który `order_id` pokazać skoro zwinęła 3 wiersze w 1?

---

## HAVING — filtrowanie po grupowaniu

HAVING to WHERE ale dla grup — działa **po** GROUP BY, na wynikach agregacji.

**Po GROUP BY** masz grupy:
| store_name | liczba_zamowien | przychod |
|------------|-----------------|----------|
| TechMart   | 3               | 1600     |
| ModaHouse  | 2               | 950      |

**Po `HAVING liczba_zamowien > 2`** — zostają tylko grupy które spełniają warunek:
| store_name | liczba_zamowien | przychod |
|------------|-----------------|----------|
| TechMart   | 3               | 1600     |

**Dlaczego nie WHERE?**
Bo w momencie gdy działa WHERE, grupy jeszcze nie istnieją — baza nie wie ile jest zamówień na sklep.
WHERE widzi surowe wiersze (przed grupowaniem), HAVING widzi grupy (po grupowaniu).

```sql
-- BŁĄD — WHERE nie zna COUNT bo jeszcze nie grupował
WHERE COUNT(orders.id) > 2

-- DOBRZE
HAVING COUNT(orders.id) > 2
```

---

## Pełny przykład z wizualizacją każdego kroku

```sql
SELECT
  stores.name         AS sklep,
  COUNT(orders.id)    AS liczba_zamowien,
  SUM(orders.total)   AS przychod
FROM stores
JOIN orders ON orders.store_id = stores.id
WHERE orders.status = 'delivered'
GROUP BY stores.id, stores.name
HAVING COUNT(orders.id) > 100
ORDER BY przychod DESC;
```

**Krok 1 — FROM + JOIN:**
Sklejasz `stores` z `orders` — dostajesz jeden wiersz na każde zamówienie z danymi sklepu.
4000 zamówień = 4000 wierszy.

**Krok 2 — WHERE:**
Zostajesz tylko z zamówieniami `delivered`.
4000 → np. 1200 wierszy.

**Krok 3 — GROUP BY:**
Zwijasz 1200 wierszy do 2 grup (jeden na sklep).
1200 → 2 wiersze.

**Krok 4 — HAVING:**
Zostajesz tylko ze sklepami które mają > 100 zamówień.
2 → 1 lub 2 wiersze (zależnie od danych).

**Krok 5 — ORDER BY:**
Sortujesz wynik po przychodzie.

**Krok 6 — SELECT:**
Pokazujesz tylko te kolumny które zdefiniowałeś.

---

## Każde słowo kluczowe — skrót

### SELECT
Co ma być w wyniku — kolumny, wyrażenia, agregacje.
```sql
SELECT name, price, price * 1.23 AS cena_brutto
```

### FROM
Tabela główna — od niej zaczynasz.
```sql
FROM orders
```

### JOIN
Doklejasz drugą tabelę po wspólnej kolumnie. Bez ON nie wiesz po czym sklejać.
```sql
JOIN customers ON customers.id = orders.customer_id
```

### ORDER BY
Sortujesz wynik. `ASC` = rosnąco (domyślne), `DESC` = malejąco.
Możesz użyć aliasu z SELECT.
```sql
ORDER BY total DESC
ORDER BY store_name ASC, total DESC  -- wiele kolumn
```

### LIMIT
Ograniczasz liczbę zwróconych wierszy.
```sql
LIMIT 20
```

---

## Agregacje — funkcje które liczą coś dla grupy

| Funkcja | Co robi |
|---|---|
| `COUNT(kolumna)` | liczy wiersze (nie liczy NULL) |
| `COUNT(*)` | liczy wszystkie wiersze łącznie z NULL |
| `COUNT(DISTINCT kolumna)` | liczy unikalne wartości |
| `SUM(kolumna)` | suma |
| `AVG(kolumna)` | średnia |
| `MIN(kolumna)` | najmniejsza wartość |
| `MAX(kolumna)` | największa wartość |
| `ROUND(wartość, miejsca)` | zaokrąglanie |

---

## Daty

```sql
-- zakres dat (bezpieczny sposób)
WHERE ordered_at >= '2024-01-01' AND ordered_at < '2025-01-01'

-- wyciąganie części daty
EXTRACT(YEAR FROM ordered_at)   -- rok
EXTRACT(MONTH FROM ordered_at)  -- miesiąc
EXTRACT(DAY FROM ordered_at)    -- dzień
```

**Uwaga:** `BETWEEN '2024-01-01' AND '2024-12-31'` ucina zamówienia z 31 grudnia po północy.
Bezpieczniej: `>= '2024-01-01' AND ordered_at < '2025-01-01'`

---

## WHERE vs HAVING — kiedy co

| Sytuacja | Użyj |
|---|---|
| Filtrujesz po konkretnej wartości kolumny | `WHERE` |
| Filtrujesz po wyniku COUNT, SUM, AVG... | `HAVING` |
| Chcesz tylko aktywnych klientów | `WHERE is_active = true` |
| Chcesz tylko kategorie z >10 produktami | `HAVING COUNT(...) > 10` |

---

## Sklejanie tekstu

```sql
first_name || ' ' || last_name AS imie_i_nazwisko
```

---

## Schemat myślenia przed każdym zapytaniem

1. **Co chcę zobaczyć?** → SELECT
2. **Która tabela główna?** → FROM
3. **Co dopinam?** → JOIN (po kluczach obcych)
4. **Co filtruję na surowych wierszach?** → WHERE
5. **Czy grupuję?** → GROUP BY
6. **Czy filtruję po grupowaniu?** → HAVING
7. **Jak sortuję?** → ORDER BY
