# Pilatis Form Configuration (v1.7.0)

## Form Details
- **Form URL**: https://1.michal-stern.com/join/course3/
- **Form ID**: `pilatis01`
- **Form Name**: `פילאטיס`

## Overview
Version 1.7.0 introduces **Sumit Account Selection** for the Pilatis form. You can now choose between two Sumit accounts in the plugin admin, and the redirect URLs will automatically adjust based on your selection.

The pilatis01 form uses **series-based redirects only** (no CSV redirects). For details on the girls01 form which uses both series and CSV redirects, see [GIRLS01-FORM-CONFIG.md](GIRLS01-FORM-CONFIG.md).

## Sumit Account Selection

Navigate to **Form Redirect → Sumit Accounts** in WordPress admin to select which account to use:

### Account 1: שטרן - חוגים לספורט (stern_sports)
- **Base ID**: `e5bzq5`
- **Default account** (maintains backward compatibility)

### Account 2: שטרן - כושר לנשים ונערות (stern_fitness)
- **Base ID**: `4kpof9`
- **Alternative account** with different payment URLs

## Redirect Conditions

The plugin checks for **5 conditions** based on the combination of:
- **Kupa field**: מאוחדת (partial subsidy) vs. other (full subsidy)
- **Team field**: סדרה קצרה (short series), סדרה ארוכה (long series), or אחר (other)
- **Payment method**: Must be אשראי (credit card)

**Note**: Conditions are checked in order (00, 01, 02, 03, 04). The first matching condition determines the redirect URL.

### Condition 00: אחר (Other) - CHECKED FIRST
**When:**
- Team starts with "אחר"
- Payment method is "אשראי"
- (Kupa field is not checked for this condition)

**Redirect URLs:**
- **Account 1 (stern_sports)**: `https://pay.sumit.co.il/e5bzq5/juakea/juaky6/payment/?name=...`
- **Account 2 (stern_fitness)**: `https://pay.sumit.co.il/4kpof9/k170s1/k175aq/payment/?name=...`

### Condition 01: מאוחדת + סדרה קצרה
**When:**
- Kupa contains "מאוחדת"
- Team contains "סדרה קצרה"
- Payment method is "אשראי"

**Redirect URLs:**
- **Account 1 (stern_sports)**: `https://pay.sumit.co.il/e5bzq5/jdnhkh/c/payment/?additems=1&name=...`
- **Account 2 (stern_fitness)**: `https://pay.sumit.co.il/4kpof9/k0v3ws/c/payment/?additems=1&name=...`

### Condition 02: מאוחדת + סדרה ארוכה
**When:**
- Kupa contains "מאוחדת"
- Team contains "סדרה ארוכה"
- Payment method is "אשראי"

**Redirect URLs:**
- **Account 1 (stern_sports)**: `https://pay.sumit.co.il/e5bzq5/jdni0u/c/payment/?additems=1&name=...`
- **Account 2 (stern_fitness)**: `https://pay.sumit.co.il/4kpof9/k0v1tn/c/payment/?additems=1&name=...`

### Condition 03: NOT מאוחדת + סדרה ארוכה
**When:**
- Kupa does NOT contain "מאוחדת"
- Team contains "סדרה ארוכה"
- Payment method is "אשראי"

**Redirect URLs:**
- **Account 1 (stern_sports)**: `https://pay.sumit.co.il/e5bzq5/jdnexa/c/payment/?additems=1&name=...`
- **Account 2 (stern_fitness)**: `https://pay.sumit.co.il/4kpof9/k0urkd/c/payment/?additems=1&name=...`

### Condition 04: NOT מאוחדת + סדרה קצרה
**When:**
- Kupa does NOT contain "מאוחדת"
- Team contains "סדרה קצרה"
- Payment method is "אשראי"

**Redirect URLs:**
- **Account 1 (stern_sports)**: `https://pay.sumit.co.il/e5bzq5/jdhga1/c/payment/?additems=1&name=...`
- **Account 2 (stern_fitness)**: `https://pay.sumit.co.il/4kpof9/k0v3ld/c/payment/?additems=1&name=...`

## URL Parameters

All redirect URLs include these placeholders (automatically replaced with form data):
```
?name=[field id="first_name"]%20[field id="last_name"]
&emailaddress=[field id="email"]
&phone=[field id="parents_phone"]
&companynumber=[field id="id_number"]
```

Series conditions (01-04) also include: `?additems=1`

## Key Features

1. **Sumit Account Selector**: Choose between two accounts in admin
2. **Backward Compatible**: Defaults to Account 1 (stern_sports)
3. **Same Logic, Different URLs**: All conditions remain the same; only URLs change
4. **Form-Specific**: Only applies to pilatis01 form
5. **Priority Order**: Checks "אחר" first, then kupa/series combinations

## Implementation Details

### Files Created in v1.7.0

#### 1. `admin/class-edr-sumit-accounts.php`
New admin component for managing Sumit account selection:
- Handles form submission
- Validates account selection (only allows 'stern_sports' or 'stern_fitness')
- Saves setting to WordPress options

#### 2. `admin/views/sumit-accounts-page.php`
Admin page UI with:
- Radio buttons for account selection
- Condition reference table
- Help text and descriptions

### Files Modified in v1.7.0

#### 1. `includes/class-edr-core.php`
Added new setting default:
```php
'pilatis_sumit_account' => 'stern_sports', // Default: שטרן - חוגים לספורט
```

#### 2. `admin/class-edr-admin.php`
- Registered new submenu: "Sumit Accounts"
- Initialized EDR_Sumit_Accounts component
- Added render method for Sumit Accounts page

#### 3. `elementor-dynamic-redirect.php`
Required new admin class file:
```php
require_once EDR_PLUGIN_DIR . 'admin/class-edr-sumit-accounts.php';
```

#### 4. `includes/class-edr-redirect.php` (lines 454-528)
Completely rewrote Pilatis redirect logic:
- Retrieves selected account from settings
- Defines URL mapping arrays for both accounts
- Dynamically builds URLs based on selected account
- Reordered conditions: "אחר" checked first (condition 00)
- Added condition 04 (NOT מאוחדת + סדרה קצרה)

## Redirect Priority Order

1. ✅ **Payment method check** - Must match trigger value (אשראי)
2. ✅ **Form-specific redirects** - Pilatis01 only
3. ✅ **Account-based URLs** - Dynamic based on admin selection
4. ✅ **Condition priority** - 00 → 01 → 02 → 03 → 04

## Backward Compatibility

✅ **Fully backward compatible**
- Default setting is 'stern_sports' (Account 1)
- Existing URLs unchanged when using default account
- No database migration required
- Falls back to stern_sports if setting not found

## Testing

### Setting Up
1. Navigate to **Form Redirect → Sumit Accounts** in WordPress admin
2. Select desired Sumit account
3. Click "Save Sumit Account"

### Testing Redirects
1. Navigate to form: https://1.michal-stern.com/join/course3/
2. Fill in required fields
3. Test each condition with **both accounts**:
   - **Condition 00**: Team = "אחר..." → jua kea/juaky6 (Account 1) or k170s1/k175aq (Account 2)
   - **Condition 01**: Kupa = "מאוחדת" AND Team = "סדרה קצרה" → jdnhkh (Account 1) or k0v3ws (Account 2)
   - **Condition 02**: Kupa = "מאוחדת" AND Team = "סדרה ארוכה" → jdni0u (Account 1) or k0v1tn (Account 2)
   - **Condition 03**: Kupa ≠ "מאוחדת" AND Team = "סדרה ארוכה" → jdnexa (Account 1) or k0urkd (Account 2)
   - **Condition 04**: Kupa ≠ "מאוחדת" AND Team = "סדרה קצרה" → jdhga1 (Account 1) or k0v3ld (Account 2)
4. Payment method must be "אשראי" for all conditions
5. Switch account in admin and verify URLs change accordingly

### Using Testing Tool
In WordPress admin → Dynamic Redirect → Testing Tool:

1. Add form identification:
   ```
   _form_id: pilatis01
   _form_name: פילאטיס
   ```
2. Set team, kupa, payment values
3. Click "Test Redirect"
4. Review debug output showing:
   - Selected Sumit account
   - Condition detection (is_partial, is_short, is_long, is_other)
   - Which condition matched
   - Final URL with correct account base

## Debug Logging

Enable debug mode in plugin settings to see detailed logs:
- Form identification (ID and name)
- Selected Sumit account (stern_sports or stern_fitness)
- Condition checks (is_partial, is_short, is_long, is_other)
- Which condition matched
- Generated URL template
- Final URL after placeholder replacement

Look for log entries:
- "Checking form-specific redirects"
- "Pilatis form detected" (includes sumit_account value)
- "Pilatis: Condition 00 matched" (for אחר)
- "Pilatis: Condition 01 matched" (for מאוחדת + סדרה קצרה)
- "Pilatis: Condition 02 matched" (for מאוחדת + סדרה ארוכה)
- "Pilatis: Condition 03 matched" (for NOT מאוחדת + סדרה ארוכה)
- "Pilatis: Condition 04 matched" (for NOT מאוחדת + סדרה קצרה)
- "Generated form-specific redirect URL"

## Summary

**v1.7.0 Changes:**
- ✅ Added Sumit Account selector in admin
- ✅ Support for 2 accounts with different payment URLs
- ✅ Same redirect logic for both accounts
- ✅ Reordered conditions: "אחר" checked first
- ✅ Added condition 04 for completeness
- ✅ Fully backward compatible (defaults to Account 1)
- ✅ Comprehensive admin UI and documentation
