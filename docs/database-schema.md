# Database Schema Documentation

This document explains the columns and relationships for each table (module) in the project, based on the TypeORM entity definitions.

## 1. user

Represents a user in the system.

- **id**: Number (Primary Key, Auto-generated) - Unique identifier for the user.
- **email**: String (Unique, Nullable) - The user's email address, used for login and communication.
- **password**: String (Nullable) - Hashed password for email-based authentication.
- **provider**: String (Default: 'email') - The authentication provider used (e.g., email, google, facebook).
- **socialId**: String (Index, Nullable) - The unique identifier provided by the social authentication provider.
- **firstName**: String (Index, Nullable) - The user's first name.
- **lastName**: String (Index, Nullable) - The user's last name.
- **photo**: FileEntity (One-to-One relation) - Reference to the user's profile picture or avatar.
- **role**: RoleEntity (Many-to-One relation) - The user's access role (e.g., admin, customer) for authorization.
- **status**: StatusEntity (Many-to-One relation) - The current account status (e.g., active, suspended, unverified).
- **createdAt**: Timestamp (Auto-generated) - The exact date and time the user account was created.
- **updatedAt**: Timestamp (Auto-generated) - The exact date and time the user account was last modified.
- **isActive**: Boolean (Default: true) - Flag indicating whether the account is currently active or deactivated.

## 2. role

Defines user roles.

- **id**: Number (Primary Key) - Unique identifier for the role.
- **name**: String - The name of the role (e.g., 'Admin', 'User').

## 3. status

Defines user or entity statuses.

- **id**: Number (Primary Key) - Unique identifier for the status.
- **name**: String - The descriptive name of the status (e.g., 'Active', 'Inactive').

## 4. session

Stores user session data for authentication.

- **id**: Number (Primary Key, Auto-generated) - Unique identifier for the session.
- **user**: UserEntity (Many-to-One relation, Indexed) - The user to whom this session belongs.
- **hash**: String - The session token or hash used to validate active user sessions.
- **createdAt**: Timestamp (Auto-generated) - When the session was initiated.
- **updatedAt**: Timestamp (Auto-generated) - When the session was last refreshed or interacted with.
- **deletedAt**: Timestamp (Nullable) - Used for soft-deleting sessions when a user logs out.

## 5. product

Represents products in the shop.

- **id**: UUID (Primary Key) - Unique identifier for the product.
- **name**: String - The display name of the product.
- **description**: String (Nullable) - A detailed description of the product and its features.
- **shortDescription**: String (Nullable) - A brief summary or tagline for the product.
- **specifications**: String (Nullable) - Technical specifications or key details formatted for display.
- **slug**: String - A URL-friendly version of the product name for SEO and routing.
- **images**: ImageProductEntity[] (One-to-Many relation) - The collection of images associated with the product.
- **brand**: String - The brand or manufacturer of the product.
- **category**: String - The primary category identifier the product belongs to.
- **reviews**: String (Nullable) - Aggregated reviews or a reference to review data.
- **variants**: VariantEntity[] (One-to-Many relation) - Different versions of the product (e.g., sizes, colors).
- **isFeatured**: Boolean (Default: false) - Flag to determine if the product should be highlighted on the storefront.
- **isNew**: Boolean (Default: true) - Flag indicating if the product is a recent addition to the catalog.
- **averageRating**: Number (Nullable) - The calculated average customer rating out of 5.
- **totalReviews**: Number (Nullable) - The total count of reviews submitted for the product.
- **createdAt**: Timestamp (Auto-generated) - When the product was added to the database.
- **updatedAt**: Timestamp (Auto-generated) - When the product details were last modified.
- **isActive**: Boolean (Default: true) - Flag indicating if the product is available and visible to customers.

## 6. variant

Represents specific variations of a product (e.g., color, size).

- **id**: UUID (Primary Key) - Unique identifier for the product variant.
- **sku**: String - Stock Keeping Unit, a unique code used to identify and track this specific variant.
- **price**: Number - The selling price of the variant.
- **inventory**: InventoryEntity (One-to-One relation, Nullable) - Links to the stock tracking details for this variant.
- **compareAtPrice**: Number - The original or 'strikethrough' price used to show discounts.
- **product**: ProductEntity (Many-to-One relation) - The parent product this variant belongs to.
- **createdAt**: Timestamp (Auto-generated) - When the variant was created.
- **updatedAt**: Timestamp (Auto-generated) - When the variant was last modified.
- **isActive**: Boolean (Default: true) - Flag indicating if this specific variant is purchasable.

## 7. inventory

Tracks inventory details for a product variant.

- **id**: UUID (Primary Key) - Unique identifier for the inventory record.
- **variant**: VariantEntity (One-to-One relation) - The specific product variant this stock belongs to.
- **quantity**: Number - The actual physical quantity of items currently available in stock.
- **reserved**: Number - The quantity of items reserved for pending orders that haven't been fulfilled yet.
- **warehouse**: String - Identifier for the physical location or warehouse where this stock is kept.
- **createdAt**: Timestamp (Auto-generated) - When the inventory record was created.
- **updatedAt**: Timestamp (Auto-generated) - When the stock levels were last updated.
- **isActive**: Boolean (Default: true) - Flag indicating if this inventory location is currently active.

## 8. image_product

Links product images.

- **id**: UUID (Primary Key) - Unique identifier for the image-product link.
- **photo**: FileEntity (One-to-One relation, Nullable) - Reference to the actual uploaded file.
- **product**: ProductEntity (Many-to-One relation, Nullable) - The product this image belongs to.
- **order**: Integer (Default: 0) - Defines the display sequence of images (e.g., 0 is the main image).
- **createdAt**: Timestamp (Auto-generated) - When the image link was created.
- **updatedAt**: Timestamp (Auto-generated) - When the image link was last modified.
- **isActive**: Boolean (Default: false) - Flag indicating if the image should be displayed.

## 9. file

Stores details about uploaded files (e.g., images).

- **id**: UUID (Primary Key) - Unique identifier for the file record.
- **path**: String - The file path or URL where the asset can be accessed by the application.

## 10. category

Hierarchical product categories.

- **id**: Number / String (Primary Key, Auto-generated) - Unique identifier for the category.
- **name**: String - The display name of the category.
- **slug**: String (Unique) - A URL-friendly version of the category name.
- **description**: String (Nullable) - A detailed explanation of what the category contains.
- **image**: String (Nullable) - A reference to an image representing the category.
- **parent**: CategoryEntity (Many-to-One relation) - Reference to a parent category, allowing nested subcategories.
- **children**: CategoryEntity[] (One-to-Many relation) - The subcategories that fall under this category.
- **attribute**: AttributeEntity[] (Many-to-Many relation) - The specific attributes (e.g., 'Shoe Size') that apply to products in this category.
- **createdAt**: Timestamp (Auto-generated) - When the category was created.
- **updatedAt**: Timestamp (Auto-generated) - When the category was last modified.
- **isActive**: Boolean (Default: true) - Flag indicating if the category is visible to users.

## 11. attribute

Product attributes (e.g., Color, Size) used for filtering and variants.

- **id**: UUID (Primary Key) - Unique identifier for the attribute.
- **name**: String - The display name of the attribute (e.g., 'Color').
- **slug**: String - A URL-friendly identifier for the attribute.
- **type**: String (Nullable) - The data type or UI representation of the attribute (e.g., 'color-swatch', 'dropdown').
- **attributeValues**: AttributeValueEntity[] (One-to-Many relation) - The list of possible values for this attribute.
- **category**: CategoryEntity (Many-to-Many relation) - The categories this attribute is applicable to.
- **createdAt**: Timestamp (Auto-generated) - When the attribute was created.
- **updatedAt**: Timestamp (Auto-generated) - When the attribute was last modified.
- **isActive**: Boolean (Default: true) - Flag indicating if the attribute is currently in use.

## 12. attribute-value

Specific values for attributes (e.g., Red, Blue, XL).

- **id**: UUID (Primary Key) - Unique identifier for the attribute value.
- **value**: String (Max length: 255) - The actual value (e.g., 'Red' or '#FF0000').
- **attribute**: AttributeEntity (Many-to-One relation) - The parent attribute this value belongs to.
- **createdAt**: Timestamp (Auto-generated) - When the attribute value was created.
- **updatedAt**: Timestamp (Auto-generated) - When the attribute value was last modified.
- **isActive**: Boolean (Default: true) - Flag indicating if this value can be assigned to products.

## 13. cart

User shopping cart.

- **id**: UUID (Primary Key) - Unique identifier for the shopping cart.
- **createdAt**: Timestamp (Auto-generated) - When the cart was first created.
- **updatedAt**: Timestamp (Auto-generated) - When the cart was last modified (items added/removed).
- **isActive**: Boolean (Default: true) - Flag indicating if the cart is currently active or has been abandoned/converted to an order.

## 14. cart_item

Items added to the shopping cart.

- **id**: UUID (Primary Key) - Unique identifier for the cart item entry.
- **createdAt**: Timestamp (Auto-generated) - When the item was added to the cart.
- **updatedAt**: Timestamp (Auto-generated) - When the item quantity or details were last modified in the cart.
- **isActive**: Boolean (Default: true) - Flag indicating if the item is active within the cart.

