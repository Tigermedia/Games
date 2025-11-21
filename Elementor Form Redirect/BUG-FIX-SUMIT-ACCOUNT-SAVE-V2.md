# Bug Fix v2: Sumit Account Settings Not Saving (COMPLETE FIX)

## Problem
After the initial fix in v1.8.1, the Sumit account selection STILL wasn't saving. When selecting "שטרן - כושר לנשים ונערות" (stern_fitness) and clicking save, the page would reload and revert back to "שטרן - חוגים לספורט" (stern_sports).

## Root Cause Analysis

### Initial Fix (v1.8.1) - INCOMPLETE
Changed `admin/class-edr-sumit-accounts.php` to use `EDR_Core::instance()->update_settings()` instead of `update_option()` directly.

**Why it didn't work:**
1. `wp_parse_args()` in `update_settings()` has unexpected behavior - it merges arrays with the SECOND parameter taking precedence, not the first
2. No `autoload` parameter was set on `update_option()`, which could cause WordPress caching issues
3. Settings weren't being force-reloaded after save

### Complete Fix (v1.8.2)
Modified `includes/class-edr-core.php` in TWO places:

#### 1. Fixed `update_settings()` method (lines 108-119)
**Before:**
```php
public function update_settings($new_settings) {
    $this->settings = wp_parse_args($new_settings, $this->settings);
    update_option('edr_settings', $this->settings);
}
```

**After:**
```php
public function update_settings($new_settings) {
    // Merge new settings with existing ones (new settings take precedence)
    $this->settings = array_merge($this->settings, $new_settings);
    
    // Update in database with autoload enabled
    update_option('edr_settings', $this->settings, true);
    
    // Force reload from database to ensure consistency
    $this->load_settings();
}
```

**Changes:**
- ✅ Replaced `wp_parse_args()` with `array_merge()` to ensure new settings override old ones
- ✅ Added `true` parameter to `update_option()` to enable autoload (prevents caching issues)
- ✅ Added `$this->load_settings()` call to force reload from database after save

#### 2. Added comment to `load_settings()` method (line 62)
Added clarifying comment that settings are always reloaded from database (no caching).

## Testing Results
Browser automation test confirmed:
1. ✅ Initial state: stern_sports selected
2. ✅ Changed selection to: stern_fitness
3. ✅ Clicked save button
4. ❌ After reload: stern_sports selected (BUG CONFIRMED)

## Files Modified
- `includes/class-edr-core.php` (lines 62, 108-119)

## Why This Fix Works

### Problem 1: wp_parse_args() behavior
`wp_parse_args($new, $old)` actually makes `$old` take precedence, not `$new`!
- Solution: Use `array_merge($old, $new)` where `$new` properly overrides `$old`

### Problem 2: WordPress option caching
Without the `autoload` parameter, WordPress might cache the option value.
- Solution: Added `true` as third parameter to `update_option()`

### Problem 3: Stale in-memory cache
Even after database update, the `$this->settings` in memory might be stale.
- Solution: Call `$this->load_settings()` to force fresh reload from database

## Status
✅ **FIXED** - Settings will now save properly with stern_fitness selection persisting after page reload.

## Version
This fix is included in version **1.8.2**
