// Sample storefront content (navigation, campaign copy, merchandising). Products and categories
// live in the database (see products.ts and categories.ts).

import { unsplash, type Img } from "@/lib/images";
import { categoryHref, collectionHref } from "@/lib/routes";

export type Collection = {
  slug: string;
  title: string;
  cta: string;
  image: Img;
};

export const navigation = [
  { label: "New In", href: "/new" },
  { label: "Women", href: collectionHref("women") },
  { label: "Men", href: collectionHref("men") },
  { label: "Bags", href: categoryHref("bags") },
  { label: "Shoes", href: categoryHref("shoes") },
  { label: "Jewelry", href: categoryHref("jewelry") },
  { label: "Gifts", href: collectionHref("gifts") },
];

export const hero = {
  eyebrow: "Autumn–Winter 2026",
  title: "The Quiet Season",
  body: "Considered tailoring, softened leathers and color drawn from late afternoon light.",
  image: {
    src: unsplash("1483985988355-763728e1935b", 2400),
    alt: "Woman in a burgundy wool coat and dark glasses carrying shopping bags",
  },
  actions: [
    { label: "Shop Women", href: collectionHref("women") },
    { label: "Shop Men", href: collectionHref("men") },
  ],
};

export const featuredCollections: Collection[] = [
  {
    slug: "women",
    title: "Women’s Collection",
    cta: "Discover",
    image: {
      src: unsplash("1485968579580-b6d095142e6e", 1400),
      alt: "Woman in a tartan coat carrying a burgundy handbag on a city street",
    },
  },
  {
    slug: "men",
    title: "Men’s Collection",
    cta: "Discover",
    image: {
      src: unsplash("1487222477894-8943e31ef7b2", 1400),
      alt: "Man in a tan leather biker jacket, blue shirt and round sunglasses",
    },
  },
];

export const editorial = {
  eyebrow: "The Atelier",
  title: "Made slowly, worn for years",
  body: "Every piece begins at the cutting table. We work with family-run workshops, natural fibers and vegetable-tanned leathers, finishing each seam by hand so it softens with you rather than wearing out.",
  cta: { label: "Explore Craftsmanship", href: "/atelier" },
  image: {
    src: unsplash("1558769132-cb1aea458c5e", 1600),
    alt: "Rail of knitwear and blouses in natural tones beside dried pampas grass",
  },
};

export const campaign = {
  eyebrow: "Men’s Tailoring",
  title: "Sharper by Design",
  cta: { label: "Shop Men", href: collectionHref("men") },
  images: [
    {
      src: unsplash("1617137968427-85924c800a22", 1400),
      alt: "Man in a navy suit walking past a glass façade",
    },
    {
      src: unsplash("1507679799987-c73779587ccf", 1400),
      alt: "Close-up of a man buttoning a navy suit jacket",
    },
  ] satisfies Img[],
};

export const services = [
  {
    title: "Complimentary Shipping",
    body: "Free express delivery on every order, packaged in our signature boxes.",
    href: "/services/shipping",
  },
  {
    title: "Returns Within 30 Days",
    body: "Changed your mind? Return or exchange online or in store.",
    href: "/services/returns",
  },
  {
    title: "Book an Appointment",
    body: "Shop with a client advisor in store or by video call.",
    href: "/services/appointments",
  },
  {
    title: "Personalization",
    body: "Add initials to selected leather goods, embossed by hand.",
    href: "/services/personalization",
  },
];

export const footerLinks = [
  {
    title: "Client Services",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping", href: "/services/shipping" },
      { label: "Returns", href: "/services/returns" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "The House",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Craftsmanship", href: "/atelier" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Sale", href: "/legal/terms" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Cookie Settings", href: "/legal/cookies" },
    ],
  },
];
