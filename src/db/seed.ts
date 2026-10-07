// Seeds the catalog with the sample categories and products. Idempotent: categories and
// products are upserted by slug, images are replaced, and stock is reset to these values.
// Run with `npm run db:seed` after `npm run db:migrate`.

import { getTableColumns, inArray, sql, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { categories, productImages, products, productStock } from "@/db/schema";
import { unsplash, type Img } from "@/lib/images";

type SeedCategory = { slug: string; title: string; image: Img };

type SeedProduct = {
  sku: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  color: string;
  colors: number;
  stock: number;
  isNew?: boolean;
  description: string;
  details: string[];
  care: string;
  madeIn: string;
  images: Img[];
};

const seedCategories: SeedCategory[] = [
  {
    slug: "bags",
    title: "Bags",
    image: {
      src: unsplash("1594223274512-ad4803739b7c", 900),
      alt: "Teal grained leather top-handle bag",
    },
  },
  {
    slug: "shoes",
    title: "Shoes",
    image: {
      src: unsplash("1520639888713-7851133b1ed0", 900),
      alt: "Hands lacing brown leather boots",
    },
  },
  {
    slug: "ready-to-wear",
    title: "Ready-to-Wear",
    image: {
      src: unsplash("1539533018447-63fcce2678e3", 900),
      alt: "Woman in a belted camel wool coat sitting on stone steps",
    },
  },
  {
    slug: "jewelry",
    title: "Jewelry",
    image: {
      src: unsplash("1515562141207-7a88fb7ce338", 900),
      alt: "Pearl necklace in an open jewelry box",
    },
  },
  {
    slug: "eyewear",
    title: "Eyewear",
    image: {
      src: unsplash("1511499767150-a48a237f0083", 900),
      alt: "Round metal-frame sunglasses on a white surface",
    },
  },
  {
    slug: "watches",
    title: "Watches",
    image: {
      src: unsplash("1524592094714-0f0654e20314", 900),
      alt: "Hand holding a minimalist watch with a brown leather strap",
    },
  },
];

function gallery(id: string, alt: string, details: [string, number, number, number][]): Img[] {
  return [
    { src: unsplash(id, 1600), alt },
    ...details.map(([detailAlt, x, y, zoom]) => ({
      src: unsplash(id, 1200, { x, y, zoom }),
      alt: detailAlt,
    })),
  ];
}

const seedProducts: SeedProduct[] = [
  {
    sku: "AT-B-0001",
    slug: "grained-leather-top-handle-bag",
    name: "Grained Leather Top-Handle Bag",
    category: "bags",
    price: 245000,
    color: "Teal",
    colors: 3,
    stock: 12,
    isNew: true,
    description:
      "A compact top-handle bag cut from full-grain calfskin with a softly pebbled finish. The flap closes with a polished push-lock, and a slim rolled handle keeps the silhouette light.",
    details: [
      "Full-grain pebbled calfskin",
      "Light gold-toned hardware",
      "Push-lock flap closure",
      "Interior slip pocket, suede lining",
      "W 24 × H 18 × D 9 cm",
    ],
    care: "Keep away from direct sunlight and moisture. Store stuffed in the dust bag provided.",
    madeIn: "Italy",
    images: gallery("1594223274512-ad4803739b7c", "Teal grained leather top-handle bag with a gold push-lock", [
      ["Detail of the gold push-lock clasp on teal pebbled leather", 0.6, 0.72, 2.4],
      ["Detail of the rolled leather handle and gold rings", 0.62, 0.38, 2.2],
    ]),
  },
  {
    sku: "AT-B-0002",
    slug: "waxed-leather-tote",
    name: "Waxed Leather Tote",
    category: "bags",
    price: 189000,
    color: "Cognac",
    colors: 2,
    stock: 2,
    isNew: true,
    description:
      "An unlined tote in waxed vegetable-tanned leather that darkens and burnishes with wear. Long handles sit comfortably on the shoulder; the open top makes it an easy everyday carry.",
    details: [
      "Waxed vegetable-tanned leather",
      "Hand-stitched handle tabs with brass rivets",
      "Unlined, raw-edge finish",
      "W 36 × H 38 × D 10 cm",
    ],
    care: "Natural variations in tone are part of the leather’s character. Condition twice a year with a neutral balm.",
    madeIn: "Portugal",
    images: gallery("1624687943971-e86af76d57de", "Cognac waxed leather tote hanging on a white door", [
      ["Detail of stitched handle tabs and brass rivets", 0.5, 0.38, 2.4],
      ["Close-up of the burnished waxed leather surface", 0.5, 0.72, 2],
    ]),
  },
  {
    sku: "AT-B-0003",
    slug: "chevron-chain-shoulder-bag",
    name: "Chevron Chain Shoulder Bag",
    category: "bags",
    price: 165000,
    color: "Blush",
    colors: 4,
    stock: 7,
    description:
      "A structured shoulder bag in smooth calfskin, finished with painted chevron inlays. The sliding chain strap can be doubled for a shorter carry.",
    details: [
      "Smooth calfskin with painted inlays",
      "Palladium-finish sliding chain strap",
      "Magnetic flap closure",
      "Two interior compartments",
      "W 22 × H 14 × D 7 cm",
    ],
    care: "Wipe with a soft dry cloth. Avoid contact with oils, perfume and abrasive surfaces.",
    madeIn: "Italy",
    images: gallery("1566150905458-1bf1fc113f0d", "Blush pink shoulder bag with a chevron panel and chain strap", [
      ["Detail of the painted chevron inlay", 0.45, 0.38, 2.2],
      ["Detail of the palladium chain strap", 0.78, 0.72, 2.6],
    ]),
  },
  {
    sku: "AT-R-0004",
    slug: "lambskin-biker-jacket",
    name: "Lambskin Biker Jacket",
    category: "ready-to-wear",
    price: 320000,
    color: "Black",
    colors: 1,
    stock: 4,
    description:
      "Our classic biker cut in supple lambskin, with an asymmetric zip, snap-down lapels and a close, slightly cropped fit through the body.",
    details: [
      "Lambskin leather, viscose lining",
      "Asymmetric front zip",
      "Zipped cuffs and chest pocket",
      "Regular fit, cropped at the hip",
    ],
    care: "Specialist leather clean only. Hang on a broad-shouldered hanger.",
    madeIn: "Italy",
    images: gallery("1521223890158-f9f7c3d5d504", "Close view of a black lambskin biker jacket worn over a black T-shirt", [
      ["Detail of the snap-down lapel and silver zip", 0.35, 0.35, 2.2],
      ["Detail of the front zip and pocket", 0.65, 0.7, 2.2],
    ]),
  },
  {
    sku: "AT-R-0005",
    slug: "washed-silk-bomber",
    name: "Washed Silk Bomber",
    category: "ready-to-wear",
    price: 198000,
    color: "Copper",
    colors: 2,
    stock: 9,
    isNew: true,
    description:
      "A lightweight bomber in sand-washed silk with a soft, matte hand. Ribbed collar, cuffs and hem keep the shape relaxed; a utility pocket sits on the sleeve.",
    details: [
      "100% silk, cupro lining",
      "Two-way front zip",
      "Sleeve utility pocket",
      "Relaxed fit",
    ],
    care: "Dry clean only. Steam lightly on the reverse.",
    madeIn: "Italy",
    images: gallery("1591047139829-d91aecb6caea", "Copper washed silk bomber jacket on a hanger", [
      ["Detail of the welt pocket and ribbed hem", 0.5, 0.75, 2.4],
      ["Detail of the zipped sleeve utility pocket", 0.78, 0.5, 2.6],
    ]),
  },
  {
    sku: "AT-S-0006",
    slug: "suede-wingtip-brogue",
    name: "Suede Wingtip Brogue",
    category: "shoes",
    price: 89000,
    color: "Sage",
    colors: 3,
    stock: 1,
    description:
      "A full wingtip brogue in brushed calf suede, built on a slim last with a stacked leather heel. Goodyear-welted so it can be resoled for years.",
    details: [
      "Calf suede upper, leather lining",
      "Goodyear-welted leather sole",
      "Stacked leather heel, 2.5 cm",
      "Hand-punched broguing",
    ],
    care: "Brush after each wear and treat with a suede protector. Use cedar shoe trees.",
    madeIn: "Spain",
    images: gallery("1560343090-f0409e92791a", "Sage green suede wingtip brogue on a pastel plinth", [
      ["Detail of the brogued toe in sage suede", 0.5, 0.62, 2.4],
      ["Detail of the stacked leather heel", 0.32, 0.62, 3],
    ]),
  },
  {
    sku: "AT-S-0007",
    slug: "pebbled-leather-pump",
    name: "Pebbled Leather Pump",
    category: "shoes",
    price: 95000,
    color: "Ivory",
    colors: 2,
    stock: 0,
    description:
      "A pointed pump in pebble-embossed calfskin on a slim 8.5 cm heel. Cut low at the sides and fully leather-lined, with a lightly cushioned footbed for long evenings.",
    details: [
      "Pebble-embossed calfskin, leather lining",
      "Leather sole",
      "Stiletto heel, 8.5 cm",
      "Pointed toe",
    ],
    care: "Store in the dust bag provided. Wipe with a soft dry cloth; avoid wet surfaces.",
    madeIn: "Italy",
    images: gallery("1535043934128-cf0b28d52f95", "Pair of ivory pebbled leather pumps on a dark wooden surface", [
      ["Close-up of the pebble-embossed leather at the toe", 0.42, 0.68, 2.2],
      ["Detail of the slim stiletto heel", 0.88, 0.55, 2.4],
    ]),
  },
  {
    sku: "AT-J-0008",
    slug: "sculpted-gold-hoops",
    name: "Sculpted Gold Hoops",
    category: "jewelry",
    price: 62000,
    color: "Gold",
    colors: 1,
    stock: 15,
    isNew: true,
    description:
      "Chunky twisted hoops cast in recycled sterling silver and finished in a thick layer of 18-karat gold. Hollow-formed, so they wear lighter than they look.",
    details: [
      "18k gold vermeil on recycled sterling silver",
      "Hinged snap closure",
      "Diameter 2.4 cm",
      "Sold as a pair",
    ],
    care: "Remove before swimming or bathing. Polish with a soft cloth.",
    madeIn: "Italy",
    images: gallery("1617038260897-41a1f14a8ca0", "Pair of twisted gold hoop earrings resting on a stone", [
      ["Close-up of the twisted gold texture", 0.52, 0.62, 2.4],
      ["Single hoop resting on white stone", 0.62, 0.42, 2.6],
    ]),
  },
];

/** `SET` clause that overwrites every column except the given keys with the incoming row */
function excludedExcept<T extends PgTable>(table: T, keep: string[]) {
  const set: Record<string, SQL> = {};
  for (const [key, column] of Object.entries(getTableColumns(table))) {
    if (!keep.includes(key)) set[key] = sql.raw(`excluded."${column.name}"`);
  }
  return set;
}

async function main() {
  const categoryRows = await db
    .insert(categories)
    .values(
      seedCategories.map((category, i) => ({
        slug: category.slug,
        title: category.title,
        imageUrl: category.image.src,
        imageAlt: category.image.alt,
        sortOrder: i,
      })),
    )
    .onConflictDoUpdate({
      target: categories.slug,
      set: { ...excludedExcept(categories, ["id", "slug", "createdAt"]), updatedAt: sql`now()` },
    })
    .returning({ id: categories.id, slug: categories.slug });

  const categoryIds = new Map(categoryRows.map((row) => [row.slug, row.id]));

  const productRows = await db
    .insert(products)
    .values(
      seedProducts.map((product) => {
        const categoryId = categoryIds.get(product.category);
        if (!categoryId) throw new Error(`Unknown category "${product.category}" for ${product.slug}`);
        return {
          categoryId,
          sku: product.sku,
          slug: product.slug,
          name: product.name,
          price: product.price,
          color: product.color,
          colorCount: product.colors,
          isNew: product.isNew ?? false,
          description: product.description,
          details: product.details,
          care: product.care,
          madeIn: product.madeIn,
        };
      }),
    )
    .onConflictDoUpdate({
      target: products.slug,
      set: { ...excludedExcept(products, ["id", "slug", "createdAt"]), updatedAt: sql`now()` },
    })
    .returning({ id: products.id, slug: products.slug });

  const productIds = new Map(productRows.map((row) => [row.slug, row.id]));
  const idFor = (slug: string) => productIds.get(slug)!;

  // neon-http has no interactive transactions; a batch runs as one transaction
  await db.batch([
    db.delete(productImages).where(inArray(productImages.productId, [...productIds.values()])),
    db.insert(productImages).values(
      seedProducts.flatMap((product) =>
        product.images.map((image, position) => ({
          productId: idFor(product.slug),
          position,
          url: image.src,
          alt: image.alt,
        })),
      ),
    ),
    db
      .insert(productStock)
      .values(
        seedProducts.map((product) => ({ productId: idFor(product.slug), quantity: product.stock })),
      )
      .onConflictDoUpdate({
        target: productStock.productId,
        set: { quantity: sql`excluded.quantity`, updatedAt: sql`now()` },
      }),
  ]);

  console.log(`Seeded ${categoryRows.length} categories and ${productRows.length} products.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
