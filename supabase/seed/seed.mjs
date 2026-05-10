import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker/locale/pl";

const supabase = createClient(
  "http://127.0.0.1:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
);

// -- helpers --

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany(arr, min, max) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, faker.number.int({ min, max }));
}

async function insert(table, rows) {
  const { data, error } = await supabase.from(table).insert(rows).select("id");
  if (error) {
    console.error(`Error inserting into ${table}:`, error.message);
    process.exit(1);
  }
  return data.map((r) => r.id);
}

// -- seed --

async function main() {
  console.log("🌱 Seeding...");

  // STORES
  const storeIds = await insert("stores", [
    {
      name: "TechMart Polska",
      slug: "techmart",
      description: "Sklep z elektroniką i gadżetami",
      country: "PL",
      currency: "PLN",
      timezone: "Europe/Warsaw",
    },
    {
      name: "ModaHouse",
      slug: "modahouse",
      description: "Sklep z odzieżą i akcesoriami",
      country: "PL",
      currency: "PLN",
      timezone: "Europe/Warsaw",
    },
  ]);
  console.log("✓ stores:", storeIds);

  // DEPARTMENTS
  const deptNames = ["Sprzedaż", "Magazyn", "Obsługa klienta", "IT", "Logistyka", "Marketing"];
  const deptRows = storeIds.flatMap((sid) =>
    deptNames.map((name) => ({ store_id: sid, name, description: faker.lorem.sentence() }))
  );
  const deptIds = await insert("departments", deptRows);
  console.log("✓ departments:", deptIds.length);

  // EMPLOYEES (30 per store)
  const roles = ["manager", "warehouse", "sales", "support"];
  const empRows = storeIds.flatMap((sid, si) =>
    Array.from({ length: 30 }, (_, i) => ({
      store_id: sid,
      department_id: deptIds[si * deptNames.length + (i % deptNames.length)],
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      role: pick(roles),
      hired_at: faker.date.past({ years: 8 }).toISOString().slice(0, 10),
    }))
  );
  const empIds = await insert("employees", empRows);
  console.log("✓ employees:", empIds.length);

  // SUPPLIERS
  const supplierRows = Array.from({ length: 20 }, () => ({
    name: faker.company.name(),
    country: pick(["PL", "DE", "CN", "IT", "FR", "TR"]),
    contact_email: faker.internet.email(),
    contact_phone: faker.phone.number(),
    lead_time_days: faker.number.int({ min: 3, max: 60 }),
  }));
  const supplierIds = await insert("suppliers", supplierRows);
  console.log("✓ suppliers:", supplierIds.length);

  // CATEGORIES
  const techCategories = [
    { name: "Smartfony", slug: "smartfony" },
    { name: "Laptopy", slug: "laptopy" },
    { name: "Tablety", slug: "tablety" },
    { name: "Audio", slug: "audio" },
    { name: "TV i Monitory", slug: "tv-monitory" },
    { name: "Akcesoria", slug: "akcesoria" },
    { name: "Gaming", slug: "gaming" },
    { name: "Fotografia", slug: "fotografia" },
  ];
  const fashionCategories = [
    { name: "Kurtki i Płaszcze", slug: "kurtki-plaszcze" },
    { name: "Spodnie", slug: "spodnie" },
    { name: "Koszule", slug: "koszule" },
    { name: "Sukienki", slug: "sukienki" },
    { name: "Buty", slug: "buty" },
    { name: "Torebki", slug: "torebki" },
    { name: "Biżuteria", slug: "bizuteria" },
    { name: "Sportowe", slug: "sportowe" },
  ];

  const catRows = [
    ...techCategories.map((c, i) => ({ ...c, store_id: storeIds[0], sort_order: i })),
    ...fashionCategories.map((c, i) => ({ ...c, store_id: storeIds[1], sort_order: i })),
  ];
  const catIds = await insert("categories", catRows);
  const techCatIds = catIds.slice(0, techCategories.length);
  const fashionCatIds = catIds.slice(techCategories.length);
  console.log("✓ categories:", catIds.length);

  // PRODUCTS (150 per store)
  const techProductNames = [
    "iPhone 15 Pro", "Samsung Galaxy S24", "MacBook Pro M3", "Dell XPS 15", "iPad Pro",
    "Sony WH-1000XM5", "LG OLED C3", "Canon EOS R6", "PlayStation 5", "Xbox Series X",
    "AirPods Pro", "Apple Watch Ultra", "Garmin Forerunner", "GoPro Hero 12", "Kindle Paperwhite",
  ];
  const fashionProductNames = [
    "Kurtka puchowa", "Płaszcz wełniany", "Jeansy slim fit", "Sukienka wieczorowa",
    "Sneakersy klasyczne", "Torebka skórzana", "Zegarek elegancki", "Bluza sportowa",
    "Koszula Oxford", "Garnitur slim", "Sandały letnie", "Botki skórzane",
  ];

  const productRows = [
    ...Array.from({ length: 150 }, (_, i) => {
      const baseName = pick(techProductNames);
      return {
        store_id: storeIds[0],
        category_id: pick(techCatIds),
        supplier_id: pick(supplierIds),
        sku: `TECH-${String(i + 1).padStart(4, "0")}`,
        name: `${baseName} ${faker.commerce.productAdjective()}`,
        description: faker.commerce.productDescription(),
        base_price: parseFloat(faker.commerce.price({ min: 99, max: 9999 })),
        cost_price: parseFloat(faker.commerce.price({ min: 50, max: 5000 })),
        tax_rate: 23,
        weight_kg: parseFloat((Math.random() * 3).toFixed(3)),
      };
    }),
    ...Array.from({ length: 150 }, (_, i) => {
      const baseName = pick(fashionProductNames);
      return {
        store_id: storeIds[1],
        category_id: pick(fashionCatIds),
        supplier_id: pick(supplierIds),
        sku: `MODA-${String(i + 1).padStart(4, "0")}`,
        name: `${baseName} ${faker.commerce.productAdjective()}`,
        description: faker.commerce.productDescription(),
        base_price: parseFloat(faker.commerce.price({ min: 39, max: 2999 })),
        cost_price: parseFloat(faker.commerce.price({ min: 20, max: 1500 })),
        tax_rate: 23,
        weight_kg: parseFloat((Math.random() * 2).toFixed(3)),
      };
    }),
  ];
  const productIds = await insert("products", productRows);
  console.log("✓ products:", productIds.length);

  // PRODUCT VARIANTS (2-4 per product)
  const techSizes = ["64GB", "128GB", "256GB", "512GB", "1TB"];
  const techColors = ["Czarny", "Biały", "Srebrny", "Złoty", "Granatowy"];
  const fashionSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const fashionColors = ["Czarny", "Biały", "Czerwony", "Niebieski", "Zielony", "Beżowy", "Szary"];

  const variantRows = [];
  productIds.forEach((pid, idx) => {
    const isTech = idx < 150;
    const sizes = isTech ? techSizes : fashionSizes;
    const colors = isTech ? techColors : fashionColors;
    const count = faker.number.int({ min: 2, max: 4 });
    for (let v = 0; v < count; v++) {
      variantRows.push({
        product_id: pid,
        sku: `${isTech ? "TECH" : "MODA"}-${String(idx + 1).padStart(4, "0")}-V${v + 1}`,
        size: pick(sizes),
        color: pick(colors),
        price_modifier: pick([0, 0, 0, 50, 100, 200, -50]),
      });
    }
  });
  const variantIds = await insert("product_variants", variantRows);
  console.log("✓ variants:", variantIds.length);

  // WAREHOUSES
  const warehouseRows = [
    { store_id: storeIds[0], name: "Magazyn Warszawa", city: "Warszawa", address: "ul. Magazynowa 1, 02-100 Warszawa" },
    { store_id: storeIds[0], name: "Magazyn Kraków", city: "Kraków", address: "ul. Przemysłowa 15, 30-500 Kraków" },
    { store_id: storeIds[1], name: "Magazyn Łódź", city: "Łódź", address: "ul. Fabryczna 7, 90-100 Łódź" },
    { store_id: storeIds[1], name: "Magazyn Wrocław", city: "Wrocław", address: "ul. Logistyczna 22, 50-100 Wrocław" },
  ];
  const warehouseIds = await insert("warehouses", warehouseRows);
  console.log("✓ warehouses:", warehouseIds.length);

  // INVENTORY (każdy wariant w odpowiednim magazynie)
  const inventoryRows = variantIds.flatMap((vid, i) => {
    const isTech = i < variantRows.filter((_, j) => j < 150 * 3).length; // approx
    const wids = isTech ? warehouseIds.slice(0, 2) : warehouseIds.slice(2);
    return wids.map((wid) => ({
      warehouse_id: wid,
      variant_id: vid,
      quantity: faker.number.int({ min: 0, max: 200 }),
      reserved_quantity: faker.number.int({ min: 0, max: 20 }),
      reorder_point: faker.number.int({ min: 5, max: 30 }),
    }));
  });
  // deduplicate warehouse+variant combos
  const seen = new Set();
  const dedupedInventory = inventoryRows.filter((r) => {
    const key = `${r.warehouse_id}-${r.variant_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  await insert("inventory", dedupedInventory);
  console.log("✓ inventory:", dedupedInventory.length);

  // CUSTOMERS (500 per store)
  const customerRows = storeIds.flatMap((sid, si) =>
    Array.from({ length: 500 }, (_, i) => ({
      store_id: sid,
      email: `customer_${si}_${i}_${faker.string.alphanumeric(4)}@${faker.internet.domainName()}`,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      phone: faker.phone.number(),
      date_of_birth: faker.date.birthdate({ min: 18, max: 70, mode: "age" }).toISOString().slice(0, 10),
      gender: pick(["male", "female", "other"]),
      marketing_consent: faker.datatype.boolean(),
      created_at: faker.date.past({ years: 5 }).toISOString(),
    }))
  );
  const customerIds = await insert("customers", customerRows);
  console.log("✓ customers:", customerIds.length);

  // ADDRESSES (1-2 per customer)
  const addressRows = customerIds.flatMap((cid) => {
    const count = faker.number.int({ min: 1, max: 2 });
    return Array.from({ length: count }, (_, i) => ({
      customer_id: cid,
      type: i === 0 ? "shipping" : pick(["shipping", "billing"]),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      company: faker.datatype.boolean(0.2) ? faker.company.name() : null,
      street: faker.location.streetAddress(),
      city: pick(["Warszawa", "Kraków", "Wrocław", "Łódź", "Poznań", "Gdańsk", "Katowice", "Lublin"]),
      postal_code: faker.location.zipCode("##-###"),
      country: "PL",
      is_default: i === 0,
    }));
  });
  const addressIds = await insert("addresses", addressRows);
  console.log("✓ addresses:", addressIds.length);

  // Mapa customer_id → lista jego address_id (żeby orders mogły losować właściwy adres)
  const customerAddressMap = new Map();
  addressRows.forEach((row, i) => {
    const cid = row.customer_id;
    if (!customerAddressMap.has(cid)) customerAddressMap.set(cid, []);
    customerAddressMap.get(cid).push(addressIds[i]);
  });

  // PROMOTIONS
  const promoRows = storeIds.flatMap((sid) => [
    {
      store_id: sid,
      name: "Black Friday",
      type: "percentage",
      value: 20,
      min_order_amount: 200,
      applies_to: "all",
      starts_at: "2025-11-28T00:00:00Z",
      ends_at: "2025-11-30T23:59:59Z",
    },
    {
      store_id: sid,
      name: "Darmowa dostawa od 199 PLN",
      type: "free_shipping",
      value: null,
      min_order_amount: 199,
      applies_to: "all",
      starts_at: "2025-01-01T00:00:00Z",
      ends_at: null,
    },
    {
      store_id: sid,
      name: "Rabat 50 PLN na pierwsze zamówienie",
      type: "fixed",
      value: 50,
      min_order_amount: 150,
      applies_to: "all",
      starts_at: "2025-01-01T00:00:00Z",
      ends_at: "2025-12-31T23:59:59Z",
    },
  ]);
  const promoIds = await insert("promotions", promoRows);
  console.log("✓ promotions:", promoIds.length);

  // DISCOUNT CODES
  const codeRows = promoIds.flatMap((pid, i) => {
    const sid = storeIds[Math.floor(i / 3)];
    return Array.from({ length: 5 }, (_, k) => ({
      store_id: sid,
      promotion_id: pid,
      code: `${faker.string.alphanumeric(6).toUpperCase()}-${i}${k}`,
      usage_limit: faker.number.int({ min: 10, max: 500 }),
      usage_count: faker.number.int({ min: 0, max: 50 }),
      expires_at: faker.date.future({ years: 1 }).toISOString(),
    }));
  });
  const discountCodeIds = await insert("discount_codes", codeRows);
  console.log("✓ discount_codes:", discountCodeIds.length);

  // SHIPPING METHODS
  const shippingRows = storeIds.flatMap((sid) => [
    { store_id: sid, name: "InPost Paczkomat", carrier: "InPost", estimated_days_min: 1, estimated_days_max: 2, price: 12.99, free_above: 199 },
    { store_id: sid, name: "Kurier DPD", carrier: "DPD", estimated_days_min: 1, estimated_days_max: 3, price: 18.99, free_above: 299 },
    { store_id: sid, name: "Odbiór osobisty", carrier: null, estimated_days_min: 0, estimated_days_max: 0, price: 0, free_above: null },
    { store_id: sid, name: "Kurier ekspresowy", carrier: "DHL", estimated_days_min: 1, estimated_days_max: 1, price: 34.99, free_above: null },
  ]);
  const shippingMethodIds = await insert("shipping_methods", shippingRows);
  console.log("✓ shipping_methods:", shippingMethodIds.length);

  // ORDERS (2000 per store)
  const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "returned", "cancelled"];
  const paymentMethods = ["card", "blik", "transfer", "cod"];
  const paymentStatuses = ["pending", "paid", "refunded", "failed"];

  const techCustomerIds = customerIds.slice(0, 500);
  const fashionCustomerIds = customerIds.slice(500);
  const allOrders = [];

  for (let si = 0; si < 2; si++) {
    const sid = storeIds[si];
    const custIds = si === 0 ? techCustomerIds : fashionCustomerIds;

    for (let o = 0; o < 2000; o++) {
      const customerId = pick(custIds);
      const custAddresses = customerAddressMap.get(customerId) ?? [];
      const shippingAddressId = custAddresses.length > 0 ? pick(custAddresses) : null;
      const billingAddressId = custAddresses.length > 1 ? pick(custAddresses) : shippingAddressId;

      const subtotal = parseFloat(faker.commerce.price({ min: 50, max: 5000 }));
      const shipping = pick([0, 12.99, 18.99, 34.99]);
      const discount = faker.datatype.boolean(0.2) ? parseFloat((subtotal * 0.1).toFixed(2)) : 0;
      const tax = parseFloat(((subtotal - discount) * 0.23).toFixed(2));
      const total = parseFloat((subtotal + shipping - discount + tax).toFixed(2));
      const orderedAt = faker.date.past({ years: 3 }).toISOString();
      const status = pick(statuses);

      allOrders.push({
        store_id: sid,
        customer_id: customerId,
        status,
        shipping_address_id: shippingAddressId,
        billing_address_id: billingAddressId,
        subtotal,
        shipping_cost: shipping,
        discount_amount: discount,
        tax_amount: tax,
        total,
        currency: "PLN",
        payment_method: pick(paymentMethods),
        payment_status: status === "delivered" ? "paid" : pick(paymentStatuses),
        ordered_at: orderedAt,
        shipped_at: ["shipped", "delivered"].includes(status) ? faker.date.recent({ days: 30 }).toISOString() : null,
        delivered_at: status === "delivered" ? faker.date.recent({ days: 20 }).toISOString() : null,
      });
    }
  }

  // Insert orders in batches of 200
  const orderIds = [];
  for (let i = 0; i < allOrders.length; i += 200) {
    const batch = allOrders.slice(i, i + 200);
    const ids = await insert("orders", batch);
    orderIds.push(...ids);
  }
  console.log("✓ orders:", orderIds.length);

  const techVariantIds = variantIds.slice(0, Math.floor(variantIds.length / 2));
  const fashionVariantIds = variantIds.slice(Math.floor(variantIds.length / 2));

  const orderItemRows = [];
  orderIds.forEach((oid, i) => {
    const isTech = i < 2000;
    const vids = isTech ? techVariantIds : fashionVariantIds;
    const count = faker.number.int({ min: 1, max: 5 });
    for (let k = 0; k < count; k++) {
      const qty = faker.number.int({ min: 1, max: 3 });
      const price = parseFloat(faker.commerce.price({ min: 20, max: 2000 }));
      orderItemRows.push({
        order_id: oid,
        variant_id: pick(vids.length > 0 ? vids : variantIds),
        product_name: faker.commerce.productName(),
        variant_info: { size: pick(["S", "M", "L"]), color: pick(["Czarny", "Biały"]) },
        quantity: qty,
        unit_price: price,
        discount_amount: 0,
        total: parseFloat((price * qty).toFixed(2)),
      });
    }
  });

  for (let i = 0; i < orderItemRows.length; i += 500) {
    await insert("order_items", orderItemRows.slice(i, i + 500));
  }
  console.log("✓ order_items:", orderItemRows.length);

  // ORDER STATUS HISTORY
  const historyRows = orderIds.slice(0, 1000).map((oid) => ({
    order_id: oid,
    status: pick(statuses),
    note: faker.datatype.boolean(0.4) ? faker.lorem.sentence() : null,
    changed_by: pick(empIds),
    changed_at: faker.date.past({ years: 1 }).toISOString(),
  }));
  for (let i = 0; i < historyRows.length; i += 500) {
    await insert("order_status_history", historyRows.slice(i, i + 500));
  }
  console.log("✓ order_status_history:", historyRows.length);

  // REVIEWS
  const reviewRows = Array.from({ length: 2000 }, () => ({
    product_id: pick(productIds),
    customer_id: pick(customerIds),
    rating: faker.number.int({ min: 1, max: 5 }),
    title: faker.datatype.boolean(0.7) ? faker.lorem.words(5) : null,
    body: faker.datatype.boolean(0.8) ? faker.lorem.paragraph() : null,
    is_verified_purchase: faker.datatype.boolean(0.6),
    is_approved: faker.datatype.boolean(0.85),
    created_at: faker.date.past({ years: 3 }).toISOString(),
  }));
  for (let i = 0; i < reviewRows.length; i += 500) {
    await insert("reviews", reviewRows.slice(i, i + 500));
  }
  console.log("✓ reviews:", reviewRows.length);

  // WISHLISTS
  const wishlistRows = [];
  const wishlistSeen = new Set();
  for (let i = 0; i < 1500; i++) {
    const cid = pick(customerIds);
    const pid = pick(productIds);
    // variant_id is null — DB unique(customer_id, product_id, variant_id) treats NULLs as distinct,
    // so we enforce uniqueness here in JS to avoid duplicates
    const key = `${cid}-${pid}`;
    if (!wishlistSeen.has(key)) {
      wishlistSeen.add(key);
      wishlistRows.push({
        customer_id: cid,
        product_id: pid,
        variant_id: null,
        added_at: faker.date.past({ years: 2 }).toISOString(),
      });
    }
  }
  for (let i = 0; i < wishlistRows.length; i += 500) {
    await insert("wishlists", wishlistRows.slice(i, i + 500));
  }
  console.log("✓ wishlists:", wishlistRows.length);

  // PURCHASE ORDERS
  const poStatuses = ["draft", "sent", "confirmed", "received", "cancelled"];
  const poRows = Array.from({ length: 100 }, (_, i) => {
    const sid = storeIds[i % 2];
    return {
      store_id: sid,
      supplier_id: pick(supplierIds),
      warehouse_id: pick(warehouseIds.slice(i % 2 === 0 ? 0 : 2, i % 2 === 0 ? 2 : 4)),
      status: pick(poStatuses),
      ordered_at: faker.date.past({ years: 2 }).toISOString(),
      expected_at: faker.date.future({ years: 1 }).toISOString().slice(0, 10),
      total_cost: parseFloat(faker.commerce.price({ min: 1000, max: 50000 })),
    };
  });
  const poIds = await insert("purchase_orders", poRows);

  const poItemRows = poIds.flatMap((poid) =>
    Array.from({ length: faker.number.int({ min: 2, max: 8 }) }, () => ({
      purchase_order_id: poid,
      variant_id: pick(variantIds),
      quantity_ordered: faker.number.int({ min: 10, max: 200 }),
      quantity_received: faker.number.int({ min: 0, max: 200 }),
      unit_cost: parseFloat(faker.commerce.price({ min: 10, max: 2000 })),
    }))
  );
  for (let i = 0; i < poItemRows.length; i += 200) {
    await insert("purchase_order_items", poItemRows.slice(i, i + 200));
  }
  console.log("✓ purchase_orders:", poIds.length, "| items:", poItemRows.length);

  // SHIPMENTS
  const shipmentStatuses = ["pending", "in_transit", "delivered", "returned"];
  const shipmentRows = orderIds.slice(0, 3000).map((oid, i) => ({
    order_id: oid,
    shipping_method_id: pick(shippingMethodIds),
    tracking_number: faker.string.alphanumeric(14).toUpperCase(),
    carrier: pick(["InPost", "DPD", "DHL", "GLS"]),
    shipped_at: faker.date.past({ years: 1 }).toISOString(),
    estimated_delivery: faker.date.soon({ days: 7 }).toISOString().slice(0, 10),
    status: pick(shipmentStatuses),
  }));
  for (let i = 0; i < shipmentRows.length; i += 500) {
    await insert("shipments", shipmentRows.slice(i, i + 500));
  }
  console.log("✓ shipments:", shipmentRows.length);

  console.log("\n🎉 Seed completed!");
}

main().catch(console.error);
