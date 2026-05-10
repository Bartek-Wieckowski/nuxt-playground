<script setup lang="ts">
import type { Database } from "~/types/database.types";

const supabaseClient = useSupabaseClient<Database>();

type OrderType = Pick<
    Database["public"]["Tables"]["orders"]["Row"],
    "id" | "status" | "total" | "ordered_at"
> & {
    order_items: Pick<
        Database["public"]["Tables"]["order_items"]["Row"],
        "product_name" | "quantity" | "unit_price"
    >[];
};

const orders = ref<OrderType[] | null>(null);
const error = ref<string | null>(null);

// TUTAJ TWÓJ KOD
// Napisz zapytanie do Supabase które pobiera zamówienia customer_id = 1
// wraz z pozycjami zamówień (order_items)
// Wynik przypisz do orders.value, błąd do error.value
onMounted(async () => {
    const { data, error: fetchError } = await supabaseClient
        .from("orders")
        .select(
            `
      id,
      status,
      total,
      ordered_at,
      order_items ( product_name, quantity, unit_price )
    `,
        )
        .eq("customer_id", 1)
        .order("ordered_at", { ascending: false });

    if (fetchError) {
        error.value = fetchError.message;
    } else {
        orders.value = data;
    }
});
</script>

<template>
    <div style="padding: 2rem; font-family: monospace">
        <h1>Moje zamówienia</h1>

        <div v-if="error" style="color: red">Błąd: {{ error }}</div>
        <div v-if="!orders">Ładowanie...</div>

        <div
            v-for="order in orders"
            :key="order.id"
            style="border: 1px solid #ccc; margin: 1rem 0; padding: 1rem"
        >
            <div>
                <strong>Zamówienie #{{ order.id }}</strong>
            </div>
            <div>Status: {{ order.status }}</div>
            <div>Wartość: {{ order.total }} PLN</div>
            <div>
                Data:
                {{ new Date(order.ordered_at).toLocaleDateString("pl-PL") }}
            </div>

            <table
                style="
                    margin-top: 0.5rem;
                    width: 100%;
                    border-collapse: collapse;
                "
            >
                <thead>
                    <tr style="background: #f0f0f0">
                        <th style="text-align: left; padding: 4px">Produkt</th>
                        <th style="text-align: right; padding: 4px">Ilość</th>
                        <th style="text-align: right; padding: 4px">Cena</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="item in order.order_items"
                        :key="item.product_name"
                    >
                        <td style="padding: 4px">{{ item.product_name }}</td>
                        <td style="text-align: right; padding: 4px">
                            {{ item.quantity }}
                        </td>
                        <td style="text-align: right; padding: 4px">
                            {{ item.unit_price }} PLN
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
