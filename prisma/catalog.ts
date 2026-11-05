const shot = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`;

export type CatalogSeed = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  includes: string;
  coverImage: string;
  gallery: string[];
  priceNgn: number;
  timeline: string;
  featured: boolean;
};

export const catalog: CatalogSeed[] = [
  {
    title: "Lumen Market",
    slug: "lumen-market",
    category: "Ecommerce",
    summary: "An online shop for a fashion, beauty, or home label that has outgrown selling in direct messages.",
    description: `Lumen Market is a shop format for a product brand with a short, considered range.

The site opens on the collection. A visitor can see the products, open one, understand the price, and move toward payment without a tour of the company first. The structure suits photography, a small set of variants, a delivery note, and a checkout path that feels as finished as the product.

It fits a label that already has goods and pictures of them. It is the wrong format for a business that sells appointments. That is a service website.

The photograph shows the kind of trade this format is built for. Your version uses your products, your name, and the words you send after payment.`,
    includes: `Homepage led by the collection
Catalog grid and product page
Cart path written into the page structure
Mobile layout
Delivery and returns notes from your brief
Launch checklist`,
    coverImage: shot("photo-1441986300917-64674bd600d8"),
    gallery: [shot("photo-1483985988355-763728e1935b"), shot("photo-1441984904996-e0b6ba687e04")],
    priceNgn: 980000,
    timeline: "14 days after the brief",
    featured: true,
  },
  {
    title: "Parcel & Co",
    slug: "parcel-and-co",
    category: "Ecommerce",
    summary: "A smaller shop for a maker with a handful of products and a need to take payment without a custom build.",
    description: `Parcel & Co is the shorter ecommerce format. It is for a baker, a printer, a skincare maker, or any business with a few products that need a proper home.

The pages stay few: a front page, the product list, a product detail, and a clear way to pay. There is room for pickup or delivery, and for the short story of who makes the goods. It does not try to behave like a department store.

Use it when the range is small and the photographs are honest. If you need collections, filters, and a large catalog, Lumen Market is the closer format.

The photograph is the kind of counter this format is written for. Your products replace it.`,
    includes: `Front page and short product list
Product detail
Cart path
Pickup or delivery note
Mobile layout
Launch checklist`,
    coverImage: shot("photo-1556742049-0cfed4f6a45d"),
    gallery: [shot("photo-1556740738-b6a63e27c4df"), shot("photo-1472851294608-062f824d29cc")],
    priceNgn: 760000,
    timeline: "12 days after the brief",
    featured: false,
  },
  {
    title: "Northline Freight",
    slug: "northline-freight",
    category: "Service website",
    summary: "A service website for haulage, courier, or warehouse work, built so a shipper can trust you with the goods.",
    description: `Northline Freight is a service website for a logistics company. Routes, fleet, coverage, and a way to request a quote sit where a nervous shipper expects them.

The front page leads with what you move and where. Inner pages cover the fleet, the lanes you actually run, and how a job starts. The contact path asks for origin, destination, and the kind of load, so the first email is useful.

It is for operators who already have trucks, riders, or a warehouse. It is not a tracking app. It is the public site that makes the operation look as serious as the work.

The photograph is the trade. Your lanes, your fleet, and your phone number go on the pages.`,
    includes: `Homepage with coverage and proof
Service and fleet pages
Quote request structure
Mobile layout
Contact details from your brief
Launch checklist`,
    coverImage: shot("photo-1586528116311-ad8dd3c8310d"),
    gallery: [shot("photo-1601584115197-04ecc0da31d7"), shot("photo-1497366216548-37526070297c")],
    priceNgn: 720000,
    timeline: "12 days after the brief",
    featured: true,
  },
  {
    title: "Blade Room",
    slug: "blade-room",
    category: "Service website",
    summary: "A barbershop website with services, prices, and a shop that looks as sharp as the cut.",
    description: `Blade Room is a service website for a barbershop or grooming studio. People decide with their eyes, then look for the price and a way to book or call.

The front page is the room and the work. Services and prices sit on their own page so nobody has to hunt. There is a place for each barber, the address, the hours, and the booking link or phone number you already use.

It fits a single shop or a small group of chairs. It is not a membership platform. If you also sell products in volume, pair it with a shop format.

The photograph is a barbershop, not your barbershop. Your chairs, your prices, and your booking link replace it.`,
    includes: `Homepage
Services and price list
Barber or chair profiles
Hours, map address, and booking link
Mobile layout
Launch checklist`,
    coverImage: shot("photo-1503951914875-452162b0f3f1"),
    gallery: [shot("photo-1585747860715-2ba37e788b70"), shot("photo-1621605815971-fbc98d665033")],
    priceNgn: 380000,
    timeline: "8 days after the brief",
    featured: true,
  },
  {
    title: "FreshFold",
    slug: "freshfold",
    category: "Service website",
    summary: "A laundry website that explains pickup, prices, and service areas without a phone call.",
    description: `FreshFold is a service website for a laundry or dry-cleaning business. The job of the site is simple: show what you wash, what it costs, where you collect, and how to ask for a pickup.

The front page states the service area and the turnaround. A price page keeps garments and household items readable. The request path asks for address, bag size, and a phone number.

It fits a neighbourhood laundry that wants to look established. It does not include a rider-dispatch system. The site sends the request. Your team still runs the route.

The photograph shows the work. Your prices and your streets go on the pages.`,
    includes: `Homepage with service area
Price list page
Pickup request structure
Hours and contact
Mobile layout
Launch checklist`,
    coverImage: shot("photo-1545173168-9f1947eebb7f"),
    gallery: [shot("photo-1517677208171-0bc6725a3e60"), shot("photo-1556742111-a301076d9d18")],
    priceNgn: 420000,
    timeline: "8 days after the brief",
    featured: false,
  },
  {
    title: "Saffron Table",
    slug: "saffron-table",
    category: "Service website",
    summary: "A restaurant website led by the room and the menu, with hours and a reservation path.",
    description: `Saffron Table is a service website for a restaurant, cafe, or catering kitchen. Guests want the menu, the hours, the address, and a reason to come this week.

The front page is the room and a few dishes. The menu is its own page so it can be updated from the brief you send. Hours, location, and a reservation link or phone number stay visible.

It fits one room, or a kitchen with a clear offer. It is not an online ordering platform with courier logic. If you sell packaged goods as well, a shop format can sit beside it.

The photograph is a dining room. Your menu and your address replace it.`,
    includes: `Homepage
Menu page
Hours and location
Reservation or phone path
Mobile layout
Launch checklist`,
    coverImage: shot("photo-1517248135467-4c7edcad34c4"),
    gallery: [shot("photo-1414235077428-338989a2e8c0"), shot("photo-1556740738-b6a63e27c4df")],
    priceNgn: 460000,
    timeline: "9 days after the brief",
    featured: false,
  },
  {
    title: "Harbor Clinic",
    slug: "harbor-clinic",
    category: "Service website",
    summary: "A calm clinic website for services, practitioners, and how a patient books.",
    description: `Harbor Clinic is a service website for a clinic, dental room, or specialist practice. It is written to be quiet, readable, and specific.

The front page names the care you provide and who it is for. Inner pages list services, the people who provide them, and how booking works. There is no stock urgency and no clutter around the phone number.

It fits a practice that wants a public site patients can trust before they call. It is not a patient-record system and it does not process medical data. Booking stays on the link or number you already use.

The photograph is a clinic corridor. Your services and your clinicians replace it.`,
    includes: `Homepage
Services page
Practitioner profiles
Booking path and contact
Mobile layout
Launch checklist`,
    coverImage: shot("photo-1519494026892-80bbd2d6fd0d"),
    gallery: [shot("photo-1576091160399-112ba8d25d1d"), shot("photo-1497366754035-f200968a6e72")],
    priceNgn: 540000,
    timeline: "11 days after the brief",
    featured: false,
  },
  {
    title: "Northstar Launch",
    slug: "northstar-launch",
    category: "Landing page",
    summary: "One page, one offer, one action. For a launch that needs to convert before a full site exists.",
    description: `Northstar Launch is a single landing page for a product, a cohort, a course, or a campaign with one thing to do.

The page has a promise, proof, the offer, and a single action: join, book, or buy. It does not grow extra sections for their own sake. The words come from your brief, and the structure keeps a visitor moving toward that action.

Use it when the business is not ready for a full website, or when a campaign needs its own address. If you need a menu, a team, and a catalog of services, choose a service website instead.

The photograph is a working desk. Your offer replaces the generic chart.`,
    includes: `One long-form page
Offer, proof, and a single call to action
Mobile layout
Form or payment link from your brief
Launch checklist`,
    coverImage: shot("photo-1460925895917-afdab827c52f"),
    gallery: [shot("photo-1498050108023-c5249f4df085"), shot("photo-1486312338219-ce68d2c6f44d")],
    priceNgn: 260000,
    timeline: "5 days after the brief",
    featured: true,
  },
  {
    title: "Hale & Partners",
    slug: "hale-and-partners",
    category: "Company portfolio",
    summary: "A firm website for practices, studios, and consultancies that sell judgment and selected work.",
    description: `Hale & Partners is a company portfolio for a professional firm. Law, architecture, advisory, engineering, or a studio that sells the quality of its judgment.

The site introduces the practice, shows selected work, names the people a client will meet, and gives a serious way to start a conversation. It is paced like a firm, not like a shop. There is no cart.

It fits a company with finished projects it can talk about. If you are a product brand, an ecommerce format will serve you better. If you are one person with one offer, a landing page may be enough.

The photograph is a studio office. Your projects and your partners replace it.`,
    includes: `Homepage
Practice or service areas
Selected work
People page
Contact path
Mobile layout`,
    coverImage: shot("photo-1497366216548-37526070297c"),
    gallery: [shot("photo-1497366811353-6870744d04b2"), shot("photo-1524758631624-e2822e304c36")],
    priceNgn: 640000,
    timeline: "12 days after the brief",
    featured: true,
  },
  {
    title: "Fieldnote",
    slug: "fieldnote",
    category: "Company portfolio",
    summary: "An editorial portfolio for a studio or consultancy whose work should read like a journal, not a brochure.",
    description: `Fieldnote is a company portfolio with an editorial pace. It is for a design studio, a research practice, or a consultancy that wants the work to be read, not skimmed as icons.

Projects are presented as entries. The studio introduces itself in one clear page. Writing from your brief becomes the voice of the site. A journal structure is included so later notes have a home.

It fits a practice that has opinions and finished work. It is a poor fit for a price-list business. A barbershop or a laundry should use a service website.

The photograph is a desk where the work is written. Your projects replace it.`,
    includes: `Editorial homepage
Project entries
Studio page
Journal structure
Contact path
Mobile layout`,
    coverImage: shot("photo-1455390582262-044cdead277a"),
    gallery: [shot("photo-1486312338219-ce68d2c6f44d"), shot("photo-1529333166437-7750a6dd5a70")],
    priceNgn: 510000,
    timeline: "10 days after the brief",
    featured: false,
  },
  {
    title: "Kindred Mark",
    slug: "kindred-mark",
    category: "Logo",
    summary: "A primary logo, a simplified mark, and a short guide for how to use them.",
    description: `Kindred Mark is a logo format for a business that is still introducing itself with a typed name.

You receive a primary logo, a simpler mark for small spaces, and a short page of rules: clear space, the colours we set, and what not to do with the files. The work starts from the business name and the description in your brief. We are not guessing a personality you have not described.

It fits a new shop, a clinic, a studio, or a firm that needs a mark before the website. It is not a full brand system with packaging, signage, and a campaign. If you need the website as well, add a format from the catalog.

The photograph is a design desk. Your name becomes the mark.`,
    includes: `Primary logo
Simplified mark
Colour and clear-space notes
Files you can hand to a printer
One round of corrections on the agreed direction`,
    coverImage: shot("photo-1626785774573-4b799315345d"),
    gallery: [shot("photo-1634942537034-2531766767d1"), shot("photo-1561070791-2526d30994b5")],
    priceNgn: 150000,
    timeline: "6 days after the brief",
    featured: true,
  },
  {
    title: "Market Day",
    slug: "market-day",
    category: "Flyer",
    summary: "One flyer for an opening, an offer, or an event, prepared for print and for a square post.",
    description: `Market Day is a single flyer. It is for an opening, a sale, a service offer, or an event that needs to be understood in a second.

You get one strong layout, set with the words, date, place, and contact from your brief. It is delivered for print and as a square for social posts. The hierarchy is the work: what is happening, when, and how to act.

It is one piece, not a campaign. If you need a logo first, buy Kindred Mark and the flyer can use it. If the business still has no public site, a landing page will outlive the flyer.

The photograph is print on a table. Your offer replaces the sample layout.`,
    includes: `One flyer layout
Print size and square social size
Your words, date, and contact
Files ready for a printer and for posting
One round of corrections`,
    coverImage: shot("photo-1611532736597-de2d4265fba3"),
    gallery: [shot("photo-1561070791-2526d30994b5"), shot("photo-1626785774573-4b799315345d")],
    priceNgn: 45000,
    timeline: "3 days after the brief",
    featured: false,
  },
];

export const journal: {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string;
  content: string;
}[] = [
  {
    title: "A landing page or a full website",
    slug: "landing-page-or-full-website",
    category: "Landing pages",
    excerpt: "Choose a landing page when you have one offer. Choose a full site when people need to look around before they trust you.",
    coverImage: shot("photo-1460925895917-afdab827c52f"),
    content: `A landing page and a website solve different moments.

## When one page is enough

Buy a landing page when the business has one thing to say. A cohort is opening. A product is launching. A campaign has a single action: book, join, or pay. [Northstar Launch](/work/northstar-launch) is built for that. Extra pages would only slow the visitor down.

The test is simple. If a stranger can decide from one screen, do not make them walk through five.

## When they need to look around

A clinic, a haulage company, a restaurant, and a firm fail that test. People want the menu, the lanes, the services, the people, and the address. That is a service website or a company portfolio. [Harbor Clinic](/work/harbor-clinic), [Northline Freight](/work/northline-freight), and [Hale & Partners](/work/hale-and-partners) are three different versions of the same need: proof before contact.

## A practical order

If the name still looks temporary, start with [Kindred Mark](/work/kindred-mark). If the offer is a one-week event, start with [Market Day](/work/market-day). If the business needs a public home that will still make sense in a year, start in the [catalog](/work) and pick the format that matches how you charge: products, appointments, or judgment.

The price is on the piece. The brief after payment is what turns the format into yours.`,
  },
  {
    title: "What to send after you pay",
    slug: "what-to-send-after-you-pay",
    category: "How to buy",
    excerpt: "The build starts when we can see the business. These are the materials that keep a fixed-price format moving.",
    coverImage: shot("photo-1455390582262-044cdead277a"),
    content: `Payment reserves the format. The brief starts the work.

## The list we ask for

On the success page, and again inside the purchase in your account, we ask for a short set of materials:

- The business name, written the way it should appear
- What the business does, who it is for, and what a visitor must be able to do
- A logo, sent as an image, if you have one
- The email and phone number that should be public
- Social profiles that should be linked
- Anything we should not invent: hours, address, prices, colours, offers

Send the real details. "A modern look" is not a brief. "We collect laundry inside Lekki, turn it around in 48 hours, and the phone on the site is this one" is a brief.

## Why we ask before we design

A fixed price only stays fixed if the scope stays fixed. The catalog page already says what the format includes. Your materials decide the words and the pictures inside that scope. If the logo is missing, say so. We can set the name in type, or you can buy a logo format and send it later.

## Where it lives

You do not email a folder into the void. The form is tied to the order. The studio can open that purchase and see the same note you sent, including the logo image stored with the order.

If the catalog format is wrong for the business, do not force the brief. Use the [contact page](/contact) first.`,
  },
  {
    title: "What a fixed catalog price does and does not include",
    slug: "what-a-fixed-price-includes",
    category: "How to buy",
    excerpt: "The number on the piece is the scope. Here is how to read it before you add anything to the cart.",
    coverImage: shot("photo-1497366811353-6870744d04b2"),
    content: `A catalog price is a promise about scope. It is worth reading the promise before you pay.

## What the number covers

Each piece lists its pages, its timeline, and the materials it expects. A logo is not a website. A flyer is not a brand system. An ecommerce format includes the shop structure described on the page, not a warehouse, not photography of your products, and not a year of changes.

The timeline starts when the brief is in, not when the payment lands. If the brief arrives a week later, the clock starts then.

## What you see at checkout

The catalog price is set in naira. The site shows that price in your currency. The card is charged in the studio's Stripe currency, and checkout shows that card amount before you leave for Stripe. You approve a number. You do not discover it afterwards.

## When to write to us instead

Write to us when the business needs something the list does not mention: a booking system of your own, a multi-warehouse shop, a campaign of twenty flyers, or a name you have not chosen yet. We will point you at a format when one fits, and we will say so when none do.

Browse the [catalog](/work) with the include-list open. That list is the contract, written before the cart.`,
  },
  {
    title: "A shop, or a service site, for a local business",
    slug: "shop-or-service-site",
    category: "Service websites",
    excerpt: "Sell goods and you need a shop. Sell time, routes, or a table, and you need a service website.",
    coverImage: shot("photo-1556742502-ec7c0e9f34b1"),
    content: `Local businesses often buy the wrong shape of website because the words "online presence" hide the offer.

## If people take something home

A bakery with boxes, a label with garments, a maker with a short line of goods: that is a shop. [Parcel & Co](/work/parcel-and-co) is the smaller one. [Lumen Market](/work/lumen-market) is the one for a range that needs room. The visitor should be able to see the thing and pay for it.

## If people book, call, or request

A barbershop, a laundry, a clinic, a restaurant, a freight company: the visitor is not checking out a product. They are deciding whether to trust you with their hair, their clothes, their health, their evening, or their cargo.

[Blade Room](/work/blade-room), [FreshFold](/work/freshfold), [Saffron Table](/work/saffron-table), [Harbor Clinic](/work/harbor-clinic), and [Northline Freight](/work/northline-freight) are service websites for those trades. The photograph on each card is the trade, not a claim that the picture is your finished site.

## A firm is a third shape

If the business sells judgment and selected projects, use a company portfolio. [Hale & Partners](/work/hale-and-partners) and [Fieldnote](/work/fieldnote) are that shape.

Pick the shape that matches how money changes hands. The [catalog](/work) is arranged that way on purpose.`,
  },
];
