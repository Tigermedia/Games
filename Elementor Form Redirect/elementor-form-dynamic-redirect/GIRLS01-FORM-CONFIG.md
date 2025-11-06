# Girls01 Form Configuration (v1.6.0)

## Form Details
- **Form URL**: https://1.michal-stern.com/join/course1/
- **Form ID**: `girls01`
- **Form Name**: `נערות`

## Overview
Version 1.6.0 makes the girls01 (נערות) form the ONLY form eligible for CSV-based redirects. This form supports both series redirects and CSV-based day redirects.

## Redirect Types

### 1. Series Redirects (סדרה קצרה / סדרה ארוכה)

The plugin checks for series classes first. If detected, it uses static URL templates.

#### Short Series (סדרה קצרה)

**When team field contains:** "סדרה קצרה"

**Partial Subsidy (מאוחדת):**
```
https://pay.sumit.co.il/e5bzq5/jdnhkh/jdnhki/payment/?name=[first_name] [last_name]&emailaddress=[email]&phone=[parents_phone]&companynumber=[id_number]
```

**Full Subsidy (all other kupot):**
```
https://pay.sumit.co.il/e5bzq5/jdhga1/jdhgct/payment/?name=[first_name] [last_name]&emailaddress=[email]&phone=[parents_phone]&companynumber=[id_number]
```

#### Long Series (סדרה ארוכה)

**When team field contains:** "סדרה ארוכה"

**Partial Subsidy (מאוחדת):**
```
https://pay.sumit.co.il/e5bzq5/jdni0u/jdni0v/payment/?name=[first_name] [last_name]&emailaddress=[email]&phone=[parents_phone]&companynumber=[id_number]
```

**Full Subsidy (all other kupot):**
```
https://pay.sumit.co.il/e5bzq5/jdnexa/jdnexb/payment/?name=[first_name] [last_name]&emailaddress=[email]&phone=[parents_phone]&companynumber=[id_number]
```

### 2. CSV-Based Day Redirects (יום ראשון / יום שלישי)

If NOT a series class, the plugin uses CSV files to generate dynamic redirect URLs based on:
- Day of the week (from team field)
- Health fund type (kupa field)
- Lesson date (finds next upcoming lesson)

#### How CSV Redirects Work

**1. Day Detection**

The plugin searches the team field for day indicators:
- **Sunday class**: If team contains "ראשון" or "sunday" → Uses Sunday CSV
- **Tuesday class**: If team contains "שלישי" or "tuesday" → Uses Tuesday CSV

**2. CSV File Structure**

CSV files must have these columns:
- `date`: Lesson date (Y-m-d format or d/m/Y)
- `link_partial`: Payment URL for מאוחדת kupa
- `link_full`: Payment URL for all other kupot

Example CSV:
```csv
date,link_partial,link_full
2025-11-10,https://pay.sumit.co.il/.../c/payment/?additems=1&couponcode=lesson3m&...,https://pay.sumit.co.il/.../c/payment/?additems=1&couponcode=lesson3f&...
2025-11-17,https://pay.sumit.co.il/.../c/payment/?additems=1&couponcode=lesson4m&...,https://pay.sumit.co.il/.../c/payment/?additems=1&couponcode=lesson4f&...
```

**3. Date Matching**

The plugin finds the **next upcoming lesson**:
- Gets today's date (or custom test date)
- Searches CSV for lessons on or after that date
- Returns the closest future lesson
- Skips past lessons

**4. Column Selection**

Based on kupa field value:
- If kupa contains "מאוחדת" → Uses `link_partial` column
- All other kupot → Uses `link_full` column

**5. Placeholder Replacement**

The URL from CSV contains placeholders like:
```
?name=[field id="first_name"]%20[field id="last_name"]&emailaddress=[field id="email"]
```

These get replaced with actual form values.

## Redirect Priority Order

For girls01 form, redirects are checked in this order:

1. ✅ **Payment method check** - Must be אשראי (credit card)
2. ✅ **Form-specific check** - Must be girls01 or נערות
3. ✅ **Series redirects** - Checked first (סדרה קצרה/ארוכה)
4. ✅ **CSV redirects** - Fallback for day-based classes

## CSV Configuration

### Plugin Settings

In WordPress admin → Dynamic Redirect → Settings:

**Sunday CSV Path:**
```
/path/to/sunday-classes.csv
```

**Tuesday CSV Path:**
```
/path/to/tuesday-classes.csv
```

### CSV Helper Buttons

The admin interface provides helper buttons to:
- Show absolute paths for CSV files
- Quickly copy paths to clipboard
- Verify CSV file locations

## Implementation Details

### Files Modified in v1.6.0

#### 1. `includes/class-edr-redirect.php`

**Removed (lines 63-106):**
- General series redirect logic (applied to all forms)

**Added (lines 63-75):**
```php
// CSV-based redirect logic (only for girls01 form)
$form_id = isset($form_data['_form_id']) ? $form_data['_form_id'] : '';
$form_name = isset($form_data['_form_name']) ? $form_data['_form_name'] : '';

// CSV redirects are only for girls01 form
if ($form_id !== 'girls01' && $form_name !== 'נערות') {
    EDR_Core::log('CSV redirects only available for girls01 form');
    return null;
}
```

**Added (lines 486-522):**
```php
// Girls01 form (נערות) - series redirects
if ($form_id === 'girls01' || $form_name === 'נערות') {
    // Series logic for short/long series
    // Same URLs as before, now form-specific
}
```

**Added (lines 311-321):**
```php
// In test_redirect() method
// CSV redirects only for girls01 form
if ($form_id !== 'girls01' && $form_name !== 'נערות') {
    $result['message'] = __('CSV redirects are only available for girls01 form');
    return $result;
}
```

## Breaking Changes in v1.6.0

⚠️ **IMPORTANT**: Other forms will NO LONGER redirect automatically

**Before v1.6.0:**
- Series redirects applied to ALL forms
- CSV redirects applied to ALL forms

**After v1.6.0:**
- pilatis01: Form-specific series redirects only
- girls01: Series redirects + CSV redirects
- All other forms: No automatic redirects (return null)

This is intentional to provide precise control over which forms use automated redirects.

## Testing

### Testing Series Redirects

1. Navigate to: https://1.michal-stern.com/join/course1/
2. Fill in form with:
   - Team: Contains "סדרה קצרה" or "סדרה ארוכה"
   - Kupa: "מאוחדת" or other
   - Payment: אשראי
3. Verify redirect URL matches expected series template

### Testing CSV Redirects

1. Navigate to: https://1.michal-stern.com/join/course1/
2. Fill in form with:
   - Team: Contains "ראשון" or "שלישי" (but NOT series keywords)
   - Kupa: "מאוחדת" or other
   - Payment: אשראי
3. Verify redirect URL comes from CSV with correct date/coupon

### Using Testing Tool

In WordPress admin → Dynamic Redirect → Testing Tool:

1. Add form identification:
   ```
   _form_id: girls01
   _form_name: נערות
   ```
2. Set team, kupa, payment values
3. Click "Test Redirect"
4. Review debug output showing:
   - Form identification
   - Series detection
   - CSV path and row matching
   - Final URL

## Debug Logging

Enable debug mode to see:

**For series redirects:**
- "Girls01 form detected"
- "Girls01: Detected short/long series"
- Generated URL template and final URL

**For CSV redirects:**
- "CSV redirects only available for girls01 form" (if wrong form)
- CSV file selection (Sunday or Tuesday)
- Date matching and row found
- Column selection (partial vs full)
- Final URL with replaced placeholders

## Future Additions

To add redirects for another form while keeping girls01 logic:

1. Add new block in `get_form_specific_redirect()`:
```php
// Another form
if ($form_id === 'another_id' || $form_name === 'Another Name') {
    // Add redirect logic here
}
```

2. Optionally allow CSV redirects for multiple forms:
```php
// CSV redirects for girls01 and another form
if (($form_id !== 'girls01' && $form_name !== 'נערות') &&
    ($form_id !== 'another_id' && $form_name !== 'Another Name')) {
    return null;
}
```

## Summary

**girls01 (נערות) form supports:**
- ✅ Series redirects (סדרה קצרה/ארוכה) - 4 URL templates
- ✅ CSV-based day redirects (יום ראשון/יום שלישי) - Dynamic lookup
- ✅ Health fund-based URL selection (מאוחדת vs others)
- ✅ Form identification via ID or name
- ✅ Comprehensive debug logging

**All other forms (except pilatis01):**
- ❌ No automatic redirects
- Form submits without redirect
