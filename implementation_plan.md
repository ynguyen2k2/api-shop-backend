# Comprehensive Database Architecture (Apple-like Store)

## User Review Required

> [!IMPORTANT]
> Please review the detailed structure of all 20 tables below. They are designed strictly as requested to support highly customizable premium electronics configurations (like Color, RAM, Storage) via the `product_variants` structure, separated from base `products`.

---

# Table: roles

## Purpose
This table defines the authorization levels within the system (e.g., Admin, Customer, Staff). It exists to allow dynamic permission assignments rather than hard-coding roles into the user table.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier for the role |
| name | VARCHAR | Yes | None | The official name of the role (e.g., ADMIN) |
| description | VARCHAR | No | Null | What permissions this role entails |

## Primary Key
* **id:** Standard UUID acts as the primary key.
* **Why:** Guarantees absolute uniqueness across distributed systems and makes relationships safer than string-based IDs.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| None | N/A | N/A | Highest level dictionary table. |

## Constraints
* **Unique fields:** `name` must be unique.
* **Nullable fields:** `description` can be null.
* **Validation rules:** `name` should be uppercase alphanumerics.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_roles_name | name | Rapid lookup during user permission checks. |

## Example Record
| id | name | description |
| :--- | :--- | :--- |
| `a1b2-c3d4...` | `ADMIN` | `Full system and user access` |

---

# Table: users

## Purpose
This is the core table representing individuals acting within the application. It stores authentication credentials and basic profile data necessary to associate orders and carts correctly.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| email | VARCHAR | Yes | None | User's primary email address |
| password_hash | VARCHAR | Yes | None | Bcrypt hashed password |
| first_name | VARCHAR | No | Null | Real first name |
| last_name | VARCHAR | No | Null | Real last name |
| created_at | TIMESTAMP | Yes | Current Time| Time of account registration |
| updated_at | TIMESTAMP | Yes | Current Time| Time profile last changed |

## Primary Key
* **id:** Standard UUID.
* **Why:** Standardized security and obfuscation; we never want to expose sequential user counts to competitors.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| None | N/A | N/A | Base identity table. |

## Constraints
* **Unique fields:** `email` must be unique.
* **Nullable fields:** `first_name`, `last_name`.
* **Allowed values:** Only valid email formats for `email`.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_users_email | email | Speeds up the login lookup process. |

## Example Record
| id | email | password_hash | first_name | last_name | created_at | updated_at |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `f9e8...` | `steve@example.com` | `$2b$10$xyz...` | `Steve` | `Smith` | `2026-04-19` | `2026-04-19` |

---

# Table: user_roles

## Purpose
A junction table designed to map a many-to-many relationship. It exists to allow one user to possess multiple roles (e.g., a "Store Manager" who is also a "Customer").

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| user_id | UUID | Yes | None | The user being assigned |
| role_id | UUID | Yes | None | The role assigned |

## Primary Key
* **(user_id, role_id)** composite key.
* **Why:** A user-role assignment is uniquely identified by the combination of both IDs.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| user_id | users | id | Identifies the user |
| role_id | roles | id | Identifies the assigned role |

## Constraints
* **Unique fields:** Composite unique constraint on `(user_id, role_id)`.
* **Validation rules:** Prevents assigning the identical role to a user twice.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_userroles_user | user_id | Quickly find all roles for a logging-in user. |

## Example Record
| user_id | role_id |
| :--- | :--- |
| `f9e8...` | `a1b2...` |

---

# Table: categories

## Purpose
Properly organizes products into scalable hierarchies (e.g., Mac -> MacBook Pro). It powers the main navigation menus.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| slug | VARCHAR | Yes | None | URL-friendly name |
| name | VARCHAR | Yes | None | Display title |
| parent_id | UUID | No | Null | Identifies if it is a sub-category |
| created_at | TIMESTAMP | Yes | Current Time| Categorization date |

## Primary Key
* **id:** UUID.
* **Why:** Consistent standard tracking for catalog routing.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| parent_id | categories | id | Self-referencing table allowing infinite nesting of categories. |

## Constraints
* **Unique fields:** `slug` must be globally unique.
* **Nullable fields:** `parent_id` is null for top-level categories.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_categories_slug | slug | Used constantly by the frontend to load category pages. |

## Example Record
| id | slug | name | parent_id | created_at |
| :--- | :--- | :--- | :--- | :--- |
| `c6d3...` | `laptops` | `Laptops` | `null` | `2026-04-19` |

---

# Table: products

## Purpose
Stores the abstract base definition of an item. An "iPhone 16" is a product concept, not a purchasable SKU. It exists to provide generalized marketing copy, SEO data, and group all physical configurations together.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| category_id| UUID | Yes | None | Primary category of the product |
| slug | VARCHAR | Yes | None | URL-friendly product name |
| name | VARCHAR | Yes | None | Display name (e.g., iPhone 16) |
| description| TEXT | Yes | None | Marketing copy / tech overview |
| is_active | BOOLEAN | Yes | True | Show on storefront or hide |

## Primary Key
* **id:** UUID.
* **Why:** Consistent foreign key anchoring for variants and reviews.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| category_id | categories | id | Many products belong to one category. |

## Constraints
* **Unique fields:** `slug` must be unique.
* **Nullable fields:** None.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_products_slug | slug | Critical for fetching the product detail page rapidly. |
| idx_products_cat | category_id | Fast aggregation for category listing pages. |

## Example Record
| id | category_id | slug | name | description | is_active |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `p1x2...` | `c6d3...` | `iphone-16-pro` | `iPhone 16 Pro` | `Titanium exterior...` | `True` |

---

# Table: product_variants

## Purpose
This table holds the specific, purchasable SKUs. Because electronics customize heavily (Color, Storage, RAM), storing them here rather than mutating the `products` table allows for distinct pricing, images, and inventory per exact configuration.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| product_id | UUID | Yes | None | The parent product definition |
| sku | VARCHAR | Yes | None | Specific Stock Keeping Unit code |
| price | DECIMAL | Yes | None | Exact price for this spec |
| attributes | JSONB | Yes | '{}' | Exact specifications config |
| is_active | BOOLEAN | Yes | True | Disables purchase of this spec |

## Primary Key
* **id:** UUID.
* **Why:** Uniquely targets the exact configuration a user puts in their cart..

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| product_id | products | id | Links variants to the base marketing entity. |

## Constraints
* **Unique fields:** `sku` must be unique globally.
* **Check constraints:** `price` must be >= 0.
* **Format:** `attributes` accepts unstructured flat JSON like `{"Color": "Black", "Storage": "128GB", "RAM": "8GB"}`.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_variants_sku| sku | Needed for backoffice operations. |
| idx_variants_prod| product_id | Instantly loads all available configs for the product page. |

## Example Record
| id | product_id | sku | price | attributes | is_active |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `v8z9...` | `p1x2...` | `APP-IP16P-BLK-128` | `999.00` | `{"color": "Black", "storage": "128GB"}` | `True` |

---

# Table: product_images

## Purpose
To connect photographs specifically to a variant rather than the base product. When a user selects "Starlight" instead of "Midnight", the system needs to only retrieve Starlight images.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| variant_id | UUID | Yes | None | The configured variation to picture |
| image_url | VARCHAR | Yes | None | Cloud/CDN link to the asset |
| is_primary | BOOLEAN | Yes | False | Determines if it is the thumbnail |
| display_order| INT | Yes | 0 | Positional sorting on gallery |

## Primary Key
* **id:** UUID.
* **Why:** Standardized tracking for image deletion.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| variant_id | product_variants | id | An image strictly belongs to a specific configuration. |

## Constraints
* **Validation rules:** `display_order` must be >= 0.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_images_v | variant_id | Quick gallery loading when switching product colors. |

## Example Record
| id | variant_id | image_url | is_primary | display_order |
| :--- | :--- | :--- | :--- | :--- |
| `i4j5...` | `v8z9...` | `https://cdn.../black-front.jpg` | `True` | `0` |

---

# Table: inventory

## Purpose
Maintains stock levels. Keeping this in a separate table from `product_variants` allows row-level database locking during checkout without blocking catalog reads, massively improving concurrency and scaling.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| variant_id | UUID | Yes | None | The SKU being tracked |
| qty_available| INT | Yes | 0 | Items sitting in the warehouse |
| qty_reserved | INT | Yes | 0 | Items sitting in active checkouts |

## Primary Key
* **id:** UUID.
* **Why:** Standard practice.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| variant_id | product_variants | id | 1-to-1 relationship with the purchasable unit. |

## Constraints
* **Unique fields:** `variant_id` must be unique (only one inventory tracker per item).
* **Check constraints:** `qty_available` and `qty_reserved` >= 0.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_inv_v_id | variant_id | Instant lookup to verify stock before cart additions. |

## Example Record
| id | variant_id | qty_available | qty_reserved |
| :--- | :--- | :--- | :--- |
| `inv12...` | `v8z9...` | `500` | `15` |

---

# Table: carts

## Purpose
Holds a persistent reference pointing to the items a specific user wants to buy. It enables abandoned cart functionality and cross-device sync.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| user_id | UUID | Yes | None | The owner of the cart |
| updated_at | TIMESTAMP | Yes | Current Time| Timestamp of last modification |

## Primary Key
* **id:** UUID.
* **Why:** Target for the cart items table.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| user_id | users | id | Specifically links the cart session to the account. |

## Constraints
* **Unique fields:** `user_id` must be unique (one active cart per person).

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_carts_u | user_id | Instant lookup on site load. |

## Example Record
| id | user_id | updated_at |
| :--- | :--- | :--- |
| `cart8...` | `f9e8...` | `2026-04-19 14:00:00` |

---

# Table: cart_items

## Purpose
Stores the specific products inside a cart and their requested amounts.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| cart_id | UUID | Yes | None | Parent cart |
| variant_id | UUID | Yes | None | Which exact SKU |
| quantity | INT | Yes | 1 | How many requested |

## Primary Key
* **id:** UUID.
* **Why:** Easier API update targeting (e.g. `PATCH /cart-item/:id`).

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| cart_id | carts | id | The shopping session |
| variant_id | product_variants | id | The specific model selected |

## Constraints
* **Unique fields:** `(cart_id, variant_id)` must be unique so a user cannot have two lines for the exact same configuration; they should just increase the quantity instead.
* **Check constraints:** `quantity` >= 1.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_ci_cart | cart_id | Load all items when showing the cart page. |

## Example Record
| id | cart_id | variant_id | quantity |
| :--- | :--- | :--- | :--- |
| `item4...` | `cart8...` | `v8z9...` | `2` |

---

# Table: wishlists

## Purpose
A simplified holding area where users can flag items they are interested in but not ready to buy. Separate from carts to avoid inflating checkout intent metrics.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| user_id | UUID | Yes | None | The owner |
| created_at | TIMESTAMP | Yes | Current Time| List creation date |

## Primary Key
* **id:** UUID.
* **Why:** Link target.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| user_id | users | id | Wishlist owner. |

## Constraints
* **Unique fields:** `user_id` (one wishlist per user).

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_wish_u | user_id | Fast retrieval. |

## Example Record
| id | user_id | created_at |
| :--- | :--- | :--- |
| `wish1...` | `f9e8...` | `2026-04-19` |

---

# Table: wishlist_items

## Purpose
The specific items residing in a user's wishlist.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| wishlist_id| UUID | Yes | None | The parent list |
| variant_id | UUID | Yes | None | The configured variation |
| added_at | TIMESTAMP | Yes | Current Time| Timestamp for chronological display |

## Primary Key
* **(wishlist_id, variant_id)** composite key.
* **Why:** You cannot add the exact same variant to your wishlist twice.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| wishlist_id| wishlists | id | Link to list |
| variant_id | product_variants | id | Link to SKU |

## Constraints
* **Unique fields:** Composite key handles uniqueness naturally.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_wi_wish | wishlist_id | Load saved items rapidly. |

## Example Record
| wishlist_id | variant_id | added_at |
| :--- | :--- | :--- |
| `wish1...` | `v8z9...` | `2026-04-19` |

---

# Table: addresses

## Purpose
Saves addresses so returning loyal customers do not have to retype complex shipping information during every expensive purchase.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| user_id | UUID | Yes | None | Who owns this address |
| address_type| VARCHAR | Yes | 'SHIPPING' | Either SHIPPING or BILLING |
| street | VARCHAR | Yes | None | First line of address |
| city | VARCHAR | Yes | None | City name |
| state | VARCHAR | Yes | None | Province or state |
| zip_code | VARCHAR | Yes | None | Postal code string |
| country | VARCHAR | Yes | None | ISO country code |
| is_default | BOOLEAN | Yes | False | Primary address |

## Primary Key
* **id:** UUID.
* **Why:** So specific orders can point to an exact address snapshot.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| user_id | users | id | Associates address book to account. |

## Constraints
* **Allowed values:** `address_type` must be exactly 'SHIPPING' or 'BILLING'.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_addr_u | user_id | Pulls up the user's address book instantly. |

## Example Record
| id | user_id | address_type | street | city | state | zip_code | country | is_default |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `a2b1...` | `f9e8...` | `SHIPPING` | `1 Apple Park Way` | `Cupertino` | `CA` | `95014` | `US` | `True` |

---

# Table: orders

## Purpose
The definitive financial record of a completed checkout. Represents the finalized intent to buy.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| user_id | UUID | Yes | None | The buyer |
| address_id | UUID | Yes | None | The destination |
| status | VARCHAR | Yes | 'PENDING' | Status (SHIPPED, DELIVERED) |
| total_amount| DECIMAL | Yes | None | Final calculation of money owed |
| coupon_id | UUID | No | Null | Discount used |
| created_at | TIMESTAMP | Yes | Current Time| Timestamp of transaction |

## Primary Key
* **id:** UUID.
* **Why:** Order number lookup and core financial anchor.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| user_id | users | id | The customer attached to order. |
| address_id | addresses | id | Where items get deployed. |
| coupon_id | coupons | id | Optional discount applied. |

## Constraints
* **Check constraints:** `total_amount` >= 0.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_ord_user | user_id | Critical for pulling "My Orders" history. |
| idx_ord_stat | status | Dashboards heavily rely on counting specific statuses. |

## Example Record
| id | user_id | address_id | status | total_amount | coupon_id | created_at |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ord9...` | `f9e8...` | `a2b1...` | `PAID` | `1998.00` | `null` | `2026-04-19` |

---

# Table: order_items

## Purpose
Snapshots exactly what the user bought at the explicit moment of purchase. Because live variants can be deleted or prices changed, an `order_item` never updates, maintaining historical/legal invoice validity.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| order_id | UUID | Yes | None | Parent invoice |
| variant_id | UUID | No | Null | The SKU that was purchased |
| quantity | INT | Yes | None | Amount purchased |
| unit_price | DECIMAL | Yes | None | The exact price AT THAT TIME |

## Primary Key
* **id:** UUID.
* **Why:** Standardized tracking.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| order_id | orders | id | The parent wrapper |
| variant_id | product_variants | id | Link to the catalog item (Nullable, keeping order history alive forever, even if product is deleted). |

## Constraints
* **Nullable fields:** `variant_id` must be allowed to be null in case the variant is discontinued and deleted from DB, but the financial data is kept.
* **Check constraints:** `quantity` >= 1. `unit_price` >= 0.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_oi_ord | order_id | Loading details of an invoice. |

## Example Record
| id | order_id | variant_id | quantity | unit_price |
| :--- | :--- | :--- | :--- | :--- |
| `item9...` | `ord9...` | `v8z9...` | `2` | `999.00` |

---

# Table: payments

## Purpose
Logs financial confirmations and connects external gateways (Stripe, PayPal) to internal orders. It exists to handle failures gracefully without deleting the order.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| order_id | UUID | Yes | None | The bill being paid |
| provider | VARCHAR | Yes | None | E.g. 'STRIPE', 'COD' |
| trans_id | VARCHAR | No | Null | Third-party bank ID |
| status | VARCHAR | Yes | 'PENDING' | Status (SUCCESS, FAILED) |
| amount | DECIMAL | Yes | None | Actual money pulled |
| created_at | TIMESTAMP | Yes | Current Time| Timestamp |

## Primary Key
* **id:** UUID.
* **Why:** Standard table structure.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| order_id | orders | id | Strictly a 1:1 mapping typically. |

## Constraints
* **Unique fields:** `order_id` should ideally be unique unless partial payments are allowed.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_pay_ord | order_id | Used after webhook callbacks. |

## Example Record
| id | order_id | provider | trans_id | status | amount | created_at |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `pay4...` | `ord9...` | `STRIPE` | `pi_123xyz` | `SUCCESS` | `1998.00` | `2026-04-19` |

---

# Table: reviews

## Purpose
Permits purchasers to leave public feedback and ratings, which is a major driver of premium electronics sales through social proof.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| user_id | UUID | Yes | None | The author |
| product_id | UUID | Yes | None | The base product, not the variant |
| rating | INT | Yes | None | Number of stars |
| comment | TEXT | No | Null | Paragraph review |
| created_at | TIMESTAMP | Yes | Current Time| Posted date |

## Primary Key
* **id:** UUID.
* **Why:** Standardized tracking.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| user_id | users | id | The reviewer. |
| product_id | products | id | Tied to base marketing product so all color variants share the same star rating pool. |

## Constraints
* **Unique fields:** `(user_id, product_id)` ensures you can only review an item once.
* **Check constraints:** `rating` between 1 and 5.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_rev_prod | product_id | Instantly calculate average star rating for detail page. |

## Example Record
| id | user_id | product_id | rating | comment | created_at |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `rev5...` | `f9e8...` | `p1x2...` | `5` | `Fastest laptop I've ever used.` | `2026-04-19` |

---

# Table: coupons

## Purpose
Defines discount logic rules. Needed so marketing teams can generate promotional codes like "HOLIDAY20" to drive revenue.

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| code | VARCHAR | Yes | None | The exact text string |
| type | VARCHAR | Yes | None | PERCENTAGE or FIXED |
| value | DECIMAL | Yes | None | How much money/percent off |
| min_order | DECIMAL | Yes | 0 | Cart minimum requirement |
| expires_at | TIMESTAMP | No | Null | Deadlines for sales |
| is_active | BOOLEAN | Yes | True | Flip switch tracking |

## Primary Key
* **id:** UUID.
* **Why:** Safest method when linking to Order history, in case the code name gets reused years later.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| None | N/A | N/A | Root table. |

## Constraints
* **Unique fields:** `code` must be entirely unique across the system.
* **Allowed values:** `type` must be exact (PERCENTAGE, FIXED).

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_coup_code| code | Fast lookup during checkout validation. |

## Example Record
| id | code | type | value | min_order | expires_at | is_active |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `coup8...` | `WINTER10` | `PERCENTAGE` | `10.00` | `100.00` | `2026-12-31` | `True` |

---

# Table: coupon_products

## Purpose
Restricts promotional codes so they only apply to specific items (e.g. "Get 20% off exclusively on Smartwatches").

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| coupon_id | UUID | Yes | None | Parent coupon |
| product_id | UUID | Yes | None | Applicable item |

## Primary Key
* **(coupon_id, product_id)** composite key.
* **Why:** Uniqueness defined by relationship.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| coupon_id | coupons | id | Which promotion |
| product_id | products | id | Which catalog item |

## Constraints
* **Unique fields:** The composite PK handles this constraint natively.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_cp_coup | coupon_id | Validate if the coupon works on the current cart items. |

## Example Record
| coupon_id | product_id |
| :--- | :--- |
| `coup8...` | `p1x2...` |

---

# Table: recently_viewed_products

## Purpose
Generates high-conversion UX by reminding returning users what they recently browsed. Storing this in DB syncs the history across devices (laptop vs phone UX).

## Fields
| Field Name | Data Type | Required | Default | Description |
| ---------- | --------- | -------- | ------- | ----------- |
| id | UUID | Yes | Generated | Unique identifier |
| user_id | UUID | Yes | None | Who viewed it |
| product_id | UUID | Yes | None | What was viewed |
| viewed_at | TIMESTAMP | Yes | Current Time| Determines sort order |

## Primary Key
* **id:** UUID.
* **Why:** Basic database operation safety.

## Foreign Keys
| Field | References Table | References Field | Relationship |
| ----- | ---------------- | ---------------- | ------------ |
| user_id | users | id | The browser |
| product_id | products | id | The catalog item |

## Constraints
* **Unique fields:** Composite unique constraint on `(user_id, product_id)` to ensure if a user views an item twice, it does NOT create a new row, but instead updates `viewed_at`.

## Suggested Indexes
| Index Name | Fields | Reason |
| ---------- | ------ | ------ |
| idx_recent_u | user_id | Pulls data down for horizontal carousel sections on the Homepage. |

## Example Record
| id | user_id | product_id | viewed_at |
| :--- | :--- | :--- | :--- |
| `rcnt5...` | `f9e8...` | `p1x2...` | `2026-04-19 14:05:00` |
