# Delta Collection website

A mobile-first product catalogue for **Delta Collection** (skincare, body care and perfumes, Tanzania).
Customers browse 180+ products by category, search by name or brand, and order in one tap on WhatsApp.
Built with React + Vite. Products and photos are managed from a phone through the admin panel (Supabase).

## What's inside

| Page | Address |
| --- | --- |
| Home | `/` |
| All products, with filters (category, price, brand, in stock) and sorting | `/shop` |
| A group, e.g. Face Care | `/shop/face-care` |
| A category, e.g. Serums | `/category/serums` |
| Search results | `/shop?q=vitamin c` |
| Product | `/product/<product-name>` |
| About, Contact | `/about`, `/contact` |
| Admin panel | `/admin` |

Ordering: product cards have an **Add to cart** button, and the cart sends the whole order in one WhatsApp message.
Each product page also has an **Order on WhatsApp** button for ordering that item straight away.

## Run it on your computer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production files in dist/
```

## Change business details

Edit `src/config.js`: WhatsApp number, Instagram, location, opening hours, delivery, payment and returns text.
Lines marked `TODO` are placeholders waiting for your details. Empty values (such as Instagram) are hidden on the site.

## Products

Until Supabase is connected, the site shows the products in `src/data/products.json`, built from the price list:

```bash
pip install openpyxl
npm run products   # data-source/*.xlsx -> src/data/products.json
npm run seed-sql   # src/data/products.json -> supabase/seed.sql
```

The build script cleans prices, fixes typos, maps the price list's categories onto 17 website categories in
5 groups, and guesses each product's brand from its name.

### Photos

Each product currently uses a free-licence photo from [Unsplash](https://unsplash.com/license) that matches its
type (perfume bottle, serum dropper, cream jar and so on). They are illustrations, not photos of the exact product;
the product page says so. Replace them with your own photos from the admin panel (tap **Edit → Change photo**).

## Admin panel setup (one time, about 15 minutes)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste and run `supabase/schema.sql`, then `supabase/seed.sql` (loads all 180 products).
3. Under **Authentication → Users**, click **Add user** and create your login (email + password).
   Then under **Authentication → Providers → Email**, turn off "Allow new users to sign up".
4. In the SQL editor run, with your email:
   `insert into public.admins (email) values ('you@example.com');`
5. In **Project Settings → API**, copy the Project URL and the `anon` public key.
6. In your hosting (Vercel or Netlify) add the environment variables `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` with those values, and redeploy. (Locally: copy `.env.example` to `.env`.)

Then open `/admin` on your phone and sign in. You can:

- add a product with a photo taken on your phone (photos are compressed automatically),
- edit name, brand, category, price, old price (shows a Sale tag), size and description,
- switch a product between **Available** and **Out of stock** with one tap,
- mark products as **New** (they show first in New arrivals),
- add, rename, reorder and delete categories.

Only emails in the `admins` table can change anything; everyone else can only view.

## Deploy

**Vercel:** import the GitHub repository, framework "Vite", then add the two environment variables. `vercel.json`
already handles page links.
**Netlify:** build command `npm run build`, publish directory `dist`. `public/_redirects` handles page links.

Connect your domain (for example deltacollection.co.tz) in the hosting dashboard, registered in your own name.
