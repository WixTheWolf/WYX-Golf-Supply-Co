# WYX10 Discount — Manual Setup (5 minutes)

The Wyx Seed Script app does not have `read_discounts` / `write_discounts` scopes, so create **WYX10** in Shopify Admin:

1. **Shopify Admin** → **Discounts** → **Create discount** → **Discount code**
2. **Method:** Code  
3. **Code:** `WYX10`  
4. **Value:** 10% off  
5. **Applies to:** Entire order  
6. **Customer eligibility:** All customers  
7. **Usage:** One use per customer (recommended)  
8. **Combinations:** Allow shipping discounts only  
9. **Save**

**Verify:** Add any product to cart on wyxgolfsupply.com → checkout URL should accept `WYX10` (cart also auto-applies via Storefront API).

**If code already exists:** Confirm status is **Active** and not expired.