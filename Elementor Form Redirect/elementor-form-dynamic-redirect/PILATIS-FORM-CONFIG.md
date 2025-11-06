# Pilatis Form Configuration (v1.5.0)

## Form Details
- **Form URL**: https://1.michal-stern.com/join/course3/
- **Form ID**: `pilatis01`
- **Form Name**: `פילאטיס`

## Overview
Version 1.5.0 introduces form-specific redirect logic that applies exclusively to the Pilatis form. This allows different forms to have customized redirect URLs without affecting the existing redirect logic for other forms.

## Redirect Conditions

The plugin checks for 4 conditions based on the combination of:
- **Kupa field**: מאוחדת (partial subsidy) vs. other (full subsidy)
- **Team field**: סדרה קצרה (short series) vs. סדרה ארוכה (long series)
- **Payment method**: Must be אשראי (credit card)

### Condition 1: מאוחדת + סדרה קצרה
**When:**
- Kupa contains "מאוחדת"
- Team contains "סדרה קצרה"
- Payment method is "אשראי"

**Redirect URL:**
```
https://pay.sumit.co.il/e5bzq5/jdnhkh/c/payment/?additems=1&name=[first_name] [last_name]&emailaddress=[email]&phone=[parents_phone]&companynumber=[id_number]
```

### Condition 2: מאוחדת + סדרה ארוכה
**When:**
- Kupa contains "מאוחדת"
- Team contains "סדרה ארוכה"
- Payment method is "אשראי"

**Redirect URL:**
```
https://pay.sumit.co.il/e5bzq5/jdni0u/c/payment/?additems=1&name=[first_name] [last_name]&emailaddress=[email]&phone=[parents_phone]&companynumber=[id_number]
```

### Condition 3: NOT מאוחדת + סדרה ארוכה
**When:**
- Kupa does NOT contain "מאוחדת"
- Team contains "סדרה ארוכה"
- Payment method is "אשראי"

**Redirect URL:**
```
https://pay.sumit.co.il/e5bzq5/jdnexa/c/payment/?additems=1&name=[first_name] [last_name]&emailaddress=[email]&phone=[parents_phone]&companynumber=[id_number]
```

### Condition 4: NOT מאוחדת + סדרה קצרה
**When:**
- Kupa does NOT contain "מאוחדת"
- Team contains "סדרה קצרה"
- Payment method is "אשראי"

**Redirect URL:**
```
https://pay.sumit.co.il/e5bzq5/jdhga1/c/payment/?additems=1&name=[first_name] [last_name]&emailaddress=[email]&phone=[parents_phone]&companynumber=[id_number]
```

## Key Differences from Default Series Redirects

1. **Path Structure**: Uses `/c/payment/` instead of `/xxx/payment/`
2. **Additional Parameter**: Includes `additems=1` parameter
3. **Form-Specific**: Only applies to pilatis01 form
4. **Priority**: Form-specific redirects are checked BEFORE general series redirects

## Implementation Details

### Files Modified

#### 1. `includes/class-edr-form-handler.php` (lines 142-144)
Added form identification to form data:
```php
// Add form identification metadata
$form_data['_form_id'] = $record->get_form_settings('id');
$form_data['_form_name'] = $record->get_form_settings('form_name');
```

#### 2. `includes/class-edr-redirect.php` (lines 50-61)
Added form-specific redirect check before general series logic:
```php
// Check for form-specific redirects first (highest priority)
$form_redirect = self::get_form_specific_redirect($form_data, $team, $kupa);
if ($form_redirect) {
    $final_url = self::replace_placeholders($form_redirect, $form_data);
    EDR_Core::log('Generated form-specific redirect URL', ...);
    return $final_url;
}
```

#### 3. `includes/class-edr-redirect.php` (lines 427-488)
Added new method `get_form_specific_redirect()` that:
- Identifies the form by ID or name
- Checks all 4 conditions
- Returns appropriate redirect URL template
- Logs detailed information for debugging

## Redirect Priority Order

1. ✅ **Payment method check** - Must match trigger value (אשראי)
2. ✅ **Form-specific redirects** - NEW in v1.5.0 (pilatis01 only)
3. ✅ **General series redirects** - Existing logic (סדרה קצרה/ארוכה)
4. ✅ **CSV-based redirects** - Default fallback

## Backward Compatibility

✅ **Fully backward compatible**
- Existing forms continue to use general series/CSV redirects
- Form-specific logic only runs for matching form ID/name
- Falls through to existing logic if no form-specific match

## Adding More Form-Specific Redirects

To add redirects for another form, modify `get_form_specific_redirect()` method in `class-edr-redirect.php`:

```php
// Add after the pilatis01 block, before "return null;"

// Example: Another form
if ($form_id === 'another_form_id' || $form_name === 'Another Form Name') {
    // Add your conditions here
    if ($condition1) {
        return 'your_url_template_here';
    }
    // ... more conditions
}
```

## Testing

To test the pilatis01 form redirects:

1. Navigate to form: https://1.michal-stern.com/join/course3/
2. Fill in required fields
3. Select different combinations of:
   - Kupa: מאוחדת or other
   - Team: סדרה קצרה or סדרה ארוכה
   - Payment: אשראי
4. Verify redirect URL matches expected condition

## Debug Logging

Enable debug mode in plugin settings to see detailed logs:
- Form identification (ID and name)
- Condition checks (is_partial, is_short, is_long)
- Which condition matched
- Generated URL template
- Final URL after placeholder replacement

Look for log entries:
- "Checking form-specific redirects"
- "Pilatis form detected"
- "Pilatis: Condition X matched"
- "Generated form-specific redirect URL"
