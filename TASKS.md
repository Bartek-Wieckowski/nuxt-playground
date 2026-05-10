# Zadania SQL & Nuxt — Ecom Exercise

---

## Zadanie #1a [SQL] — Rozgrzewka

**Kontekst:** Chcesz zobaczyć listę produktów z jednego sklepu.

**Napisz zapytanie które zwraca:**
- `sku`, `name`, `base_price` ze wszystkich produktów
- tylko produkty ze sklepu o `store_id = 1`
- posortowane od najdroższego do najtańszego

**Żadnych JOINów — jedna tabela: `products`**

**Gdzie:** Supabase Studio → SQL Editor → `http://127.0.0.1:54323`


select sku, name, base_price from products where store_id = 1 order by base_price desc;

---

## Zadanie #1b [SQL] — Rozgrzewka

**Kontekst:** Dział obsługi klienta szuka klientów którzy mogą dostać newsletter.

**Napisz zapytanie które zwraca:**
- `first_name`, `last_name`, `email` z tabeli `customers`
- tylko klientów którzy mają `marketing_consent = true`
- tylko ze sklepu `store_id = 2`
- maksymalnie 20 wyników

**Żadnych JOINów — jedna tabela: `customers`**

select first_name, last_name, email from customers where marketing_consent = true and store_id = 2 limit 20;

---

## Zadanie #1 [SQL] — właściwe (po rozgrzewce)

**Kontekst:** Kierownik sprzedaży chce przegląd — ile mamy klientów i zamówień w każdym sklepie.

**Napisz zapytanie które zwraca:**
- nazwę sklepu (`stores.name`)
- liczbę klientów
- liczbę zamówień
- łączny przychód (suma kolumny `total` z tabeli `orders`)

**Warunki:** wszystkie sklepy, bez filtrowania po statusie.

**Potrzebujesz:** dwóch JOINów i GROUP BY — ale najpierw zrób 1a i 1b.

SELECT 
  stores.name,
  COUNT(DISTINCT customers.id) AS liczba_klientow,
  COUNT(DISTINCT orders.id)      AS liczba_zamowien,
  SUM(orders.total)               AS laczny_przychod
FROM stores
JOIN customers ON customers.store_id = stores.id
JOIN orders ON orders.store_id = stores.id
GROUP BY stores.id, stores.name;


---

## Zadanie #2 [SQL] — Średnie

**Kontekst:** Menedżer chce wiedzieć które kategorie sprzedają się najlepiej w TechMarcie.

**Napisz zapytanie które zwraca:**
- nazwę kategorii (`categories.name`)
- liczbę produktów w tej kategorii
- średnią cenę produktów (`base_price`) zaokrągloną do 2 miejsc po przecinku

**Warunki:**
- tylko sklep `store_id = 1`
- tylko kategorie które mają **więcej niż 10 produktów**
- posortowane od największej liczby produktów

**Tabele:** `categories`, `products`

**Nowe rzeczy do poznania:**
- `HAVING` — filtrowanie po agregacji (bo `WHERE` nie działa na `COUNT`)
- `ROUND(wartość, miejsca)` — zaokrąglanie
- `AVG()` — średnia

SELECT 
  categories.name,
  COUNT(products.id) as liczba_produktow,
  ROUND(AVG(products.base_price), 2) as srednia_cena
FROM categories
JOIN products ON products.category_id = categories.id WHERE categories.store_id = 1 GROUP BY categories.id, categories.name HAVING COUNT(products.id) > 10 ORDER BY   liczba_produktow DESC;



---

## Zadanie #3 [SQL] — Utrwalenie JOINów i GROUP BY

**Kontekst:** HR chce przegląd pracowników w każdym dziale — ilu ich jest i jakie mają role.

**Napisz zapytanie które zwraca:**
- nazwę sklepu (`stores.name`)
- nazwę działu (`departments.name`)
- liczbę pracowników w tym dziale
- najpopularniejszą rolę w tym dziale (możesz użyć `MODE() WITHIN GROUP (ORDER BY role)`)

**Warunki:**
- tylko aktywni pracownicy (`is_active = true`)
- tylko działy które mają **więcej niż 3 pracowników**
- posortowane po nazwie sklepu, potem liczbie pracowników malejąco

**Tabele:** `stores`, `departments`, `employees`

**Mechaniki:** te same co w #1 i #2 — JOIN, GROUP BY, HAVING, ORDER BY

SELECT 
  stores.name as nazwa_sklepu,
  departments.name as nazwa_dzialu,
  COUNT(employees.id)
  FROM departments
JOIN stores ON stores.id = departments.store_id
JOIN employees ON employees.department_id = departments.id WHERE employees.is_active = true GROUP BY stores.name, departments.name HAVING COUNT(employees.id) > 3 ORDER BY stores.name, COUNT(employees.id) DESC;


---

## Zadanie #4 [SQL] — Utrwalenie

**Kontekst:** Dział magazynowy chce wiedzieć które produkty są na wyczerpaniu stanów.

**Napisz zapytanie które zwraca:**
- nazwę magazynu (`warehouses.name`)
- nazwę produktu (`products.name`)
- SKU wariantu (`product_variants.sku`)
- aktualny stan (`inventory.quantity`)

**Warunki:**
- tylko produkty gdzie `quantity` jest mniejsze niż `reorder_point`
- tylko aktywne magazyny (`warehouses.is_active = true`)
- posortowane od najmniejszego stanu

**Tabele:** `warehouses`, `inventory`, `product_variants`, `products`

**Wskazówka:** łańcuch relacji to:
`warehouses` → `inventory` → `product_variants` → `products`

Każda tabela łączy się z następną przez klucz obcy — znajdź te kolumny w schemacie migracji.

---

## Zadanie #5 [SQL] — Filtrowanie po datach

**Kontekst:** Dział finansowy chce raport zamówień z konkretnego okresu.

**Napisz zapytanie które zwraca:**
- nazwę sklepu
- id zamówienia
- status zamówienia
- wartość zamówienia (`total`)
- datę zamówienia (`ordered_at`)

**Warunki:**
- tylko zamówienia złożone **między 2024-01-01 a 2024-12-31**
- tylko status `delivered` lub `shipped`
- posortowane od najnowszych

**Tabele:** `stores`, `orders`

**Nowa rzecz — filtrowanie po dacie, masz dwa sposoby:**
```sql
-- sposób 1: BETWEEN
WHERE ordered_at BETWEEN '2024-01-01' AND '2024-12-31'

-- sposób 2: >= i <=
WHERE ordered_at >= '2024-01-01' AND ordered_at <= '2024-12-31'
```

**Hint do statusów:** warunek "delivered LUB shipped" to `IN ('delivered', 'shipped')` albo dwa `OR`.

select 
  stores.name as nazwa_sklepu,
  orders.id as id_zamowienia,
  orders.status as status_zamowienia,
  orders.total as wartosc_zamowienia,
  orders.ordered_at as data_zamowienia 
from stores join orders on orders.store_id = stores.id WHERE ordered_at >= '2024-01-01' AND ordered_at < '2025-01-01' AND status IN ('delivered', 'shipped') ORDER BY data_zamowienia DESC

---

## Zadanie #6 [SQL] — Daty + 3 tabele

**Kontekst:** Menedżer ModaHouse chce zobaczyć którzy klienci złożyli zamówienia w pierwszym kwartale 2024.

**Napisz zapytanie które zwraca:**
- imię i nazwisko klienta (`first_name`, `last_name`)
- email klienta
- id zamówienia
- wartość zamówienia (`total`)
- datę zamówienia (`ordered_at`)

**Warunki:**
- tylko sklep ModaHouse (`store_id = 2`)
- tylko zamówienia z okresu 2024-01-01 do 2024-03-31
- posortowane od najwyższej wartości zamówienia

**Tabele:** `customers`, `orders`, `stores`



SELECT
  customers.first_name || ' ' || customers.last_name AS imie_i_nazwisko,
  customers.email,
  orders.id AS id_zamowienia,
  orders.total AS wartosc_zamowienia,
  orders.ordered_at AS data_zamowienia
FROM customers
JOIN orders ON orders.customer_id = customers.id
JOIN stores ON stores.id = customers.store_id
WHERE
stores.id = 2 and ordered_at >= '2024-01-01' AND ordered_at < '2024-04-01' ORDER BY wartosc_zamowienia DESC
---

## Zadanie #7 [SQL] — JOIN + GROUP BY + HAVING

**Kontekst:** Dział sprzedaży chce wiedzieć którzy klienci są VIP-ami — czyli złożyli dużo zamówień i wydali dużo pieniędzy.

**Napisz zapytanie które zwraca:**
- imię i nazwisko klienta (sklejone w jedną kolumnę)
- email klienta
- liczbę zamówień
- łączną kwotę którą wydał (`SUM(total)`)

**Warunki:**
- tylko sklep TechMart (`store_id = 1`)
- tylko zamówienia ze statusem `delivered`
- tylko klienci którzy złożyli **więcej niż 5 zamówień**
- posortowani od największej łącznej kwoty

**Tabele:** `customers`, `orders`

SELECTs
  customers.first_name || ' ' || customers.last_name as imie_nazwisko,
  customers.email as email,
  COUNT(orders.customer_id) as liczba_zamowien,
  SUM(orders.total) as laczna_kwota
FROM customers JOIN orders on orders.customer_id = customers.id WHERE orders.store_id = 1 AND orders.status = 'delivered' GROUP BY customers.id, customers.first_name, customers.last_name, customers.email HAVING COUNT(orders.customer_id) > 2 ORDER BY laczna_kwota DESC

---

## Zadanie #8 [SQL] — Agregacje na dostawcach

**Kontekst:** Dział zakupów chce wiedzieć którzy dostawcy są najaktywniej używani i ile kosztują ich zamówienia.

**Napisz zapytanie które zwraca:**
- nazwę dostawcy (`suppliers.name`)
- kraj dostawcy
- liczbę złożonych zamówień zakupowych (`purchase_orders`)
- łączną wartość tych zamówień (`SUM(total_cost)`)
- średnią wartość zamówienia (`AVG(total_cost)`) zaokrągloną do 2 miejsc

**Warunki:**
- tylko zamówienia ze statusem `confirmed` lub `received`
- tylko dostawcy z więcej niż 2 zamówieniami
- posortowani od największej łącznej wartości

**Tabele:** `suppliers`, `purchase_orders`


SELECT
  suppliers.name as nazwa_dostawcy,
  suppliers.country as kraj_dostawcy,
  COUNT(purchase_orders.supplier_id) as liczba_zlozonych_zamowien,
  SUM(purchase_orders.total_cost) as laczna_wartosc_zamowien,
  ROUND(AVG(purchase_orders.total_cost), 2) as srednia_wartosc_zamowien
FROM suppliers JOIN purchase_orders ON purchase_orders.supplier_id = suppliers.id WHERE purchase_orders.status IN ('confirmed', 'received') GROUP BY suppliers.id, suppliers.name, suppliers.country HAVING COUNT(purchase_orders.supplier_id) > 2 ORDER BY laczna_wartosc_zamowien DESC; 
---

## Zadanie #8b [NUXT] — Lista zamówień klienta z produktami

**Kontekst:** Strona "Moje zamówienia" — klient widzi swoje zamówienia wraz z tym co zamówił.

**Twoje zadanie — napisz tylko ten kod:**

Uzupełnij plik `app/pages/orders.vue` w miejscu oznaczonym `// TUTAJ TWÓJ KOD`.

Kod ma pobrać z Supabase:
- zamówienia (`orders`) — kolumny: `id`, `status`, `total`, `ordered_at`
- dla każdego zamówienia jego pozycje (`order_items`) — kolumny: `product_name`, `quantity`, `unit_price`

Pobierz zamówienia dla `customer_id = 1`, posortowane od najnowszych.

**Użyj zagnieżdżonego select:**
```js
await supabaseClient.from('orders').select(`
  id,
  status,
  total,
  ordered_at,
  order_items ( product_name, quantity, unit_price )
`)
```

---

<!-- Następne zadania pojawią się tutaj po code review poprzedniego -->
