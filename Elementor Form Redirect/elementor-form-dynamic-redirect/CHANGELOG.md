# Changelog

## [1.8.6] - 2025-11-21
### Fixed
- Removed incorrect "Short/Long Series" logic for Girls01 (Course 1) form to ensure it correctly uses CSV-based redirects for Sunday/Tuesday classes.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.5] - 2025-01-20

### Fixed
- **Definitive Fix**: Sumit account selection now saves correctly
- Root cause identified: `sanitize_settings` callback in `admin/class-edr-admin.php` was stripping the `pilatis_sumit_account` key because it wasn't whitelisted
- Added `pilatis_sumit_account` to the sanitization whitelist
- Removed aggressive debug logging and option deletion code from v1.8.3/1.8.4 as it's no longer needed
- Kept the improved `array_merge` logic in `update_settings` for better reliability

## [1.8.4] - 2025-01-20

### Added
- **Visual Debugging**: Added on-screen debug log display after saving Sumit settings
- This allows verifying the database update process without server log access
- Shows detailed step-by-step execution of the settings update, including delete/update results and verification

## [1.8.3] - 2025-01-20

### Fixed
- **Aggressive Fix**: Implemented forced cache clearing for Sumit account settings
- Added explicit `delete_option()` and `wp_cache_delete()` before updating settings
- This forces WordPress to clear any persistent object cache that might be holding onto old values
- Added extensive debug logging to trace the save process

## [1.8.2] - 2025-01-20

### Fixed
- **Complete Fix**: Sumit account selection now saves correctly (fixed remaining issues from v1.8.1)
- Fixed `update_settings()` method to use `array_merge()` instead of `wp_parse_args()` (which had unexpected precedence behavior)
- Added `autoload` parameter to `update_option()` to prevent WordPress caching issues
- Added automatic settings reload after save to ensure consistency

### Technical Details
- Modified `includes/class-edr-core.php` (lines 108-119): Complete rewrite of `update_settings()` method
  - Changed from `wp_parse_args($new, $old)` to `array_merge($old, $new)` to ensure new settings override old ones
  - Added `true` parameter to `update_option()` for autoload
  - Added `$this->load_settings()` call to force reload from database after save
- Added clarifying comment in `load_settings()` method (line 62)

### Why v1.8.1 Didn't Work
- `wp_parse_args()` makes the second parameter take precedence, not the first
- Missing autoload parameter could cause WordPress to cache old values
- Settings weren't being reloaded from database after save

## [1.8.1] - 2025-01-20

### Fixed
- **Critical Bug Fix**: Sumit account selection now saves correctly
- Fixed issue where selecting a Sumit account in "Form Redirect → Sumit Accounts" would not persist after page reload
- Root cause: Settings were being saved to database but not updating the cached settings in memory
- Solution: Changed `save_sumit_account()` method to use `EDR_Core::instance()->update_settings()` instead of directly calling `update_option()`

### Technical Details
- Modified `admin/class-edr-sumit-accounts.php` (line 74): Now uses EDR_Core's update_settings method to ensure both database and memory cache are updated
- This ensures the selected Sumit account persists correctly across page reloads and plugin operations

## [1.8.0] - 2025-01-20

### Added
- **Sumit Account Selector** for pilatis01 form - new admin page to choose between two Sumit accounts
- New admin menu: "Form Redirect → Sumit Accounts" with account selection interface
- Support for two Sumit accounts:
  - **Account 1**: שטרן - חוגים לספורט (stern_sports) - Default
  - **Account 2**: שטרן - כושר לנשים ונערות (stern_fitness)
- New setting `pilatis_sumit_account` in plugin core with default value `stern_sports`
- Created new admin component: `class-edr-sumit-accounts.php`
- Created new admin view: `sumit-accounts-page.php` with radio button selection and condition reference table

### Changed
- **Pilatis01 redirect logic completely rewritten** with dynamic URL mapping based on selected account
- Redirect conditions reordered: "אחר" (Condition 00) now checked FIRST
- Added **Condition 04**: NOT מאוחדת + סדרה קצרה (was missing in previous version)
- All 5 pilatis01 conditions now use account-specific URLs:
  - **Condition 00** (אחר): juakea/juaky6 (Account 1) or k170s1/k175aq (Account 2)
  - **Condition 01** (מאוחדת + קצרה): jdnhkh/c (Account 1) or k0v3ws/c (Account 2)
  - **Condition 02** (מאוחדת + ארוכה): jdni0u/c (Account 1) or k0v1tn/c (Account 2)
  - **Condition 03** (NOT מאוחדת + ארוכה): jdnexa/c (Account 1) or k0urkd/c (Account 2)
  - **Condition 04** (NOT מאוחדת + קצרה): jdhga1/c (Account 1) or k0v3ld/c (Account 2)
- Updated PILATIS-FORM-CONFIG.md to version 1.7.0 with comprehensive Sumit account documentation

### Technical Details
- Modified `includes/class-edr-redirect.php` (lines 454-528): URL mapping arrays for both accounts with dynamic URL generation
- Modified `admin/class-edr-admin.php`: Registered new submenu and component initialization
- Modified `elementor-dynamic-redirect.php`: Required new admin class file
- Debug logging now includes selected Sumit account for troubleshooting

### Backward Compatibility
- Fully backward compatible - defaults to Account 1 (stern_sports)
- Existing installations maintain current behavior without any changes
- No database migration required

## [1.7.3] - 2025-01-12

### Added
- Support for Hebrew column names in CSV files
- Plugin now recognizes both English (date, link_partial, link_full) and Hebrew (תאריך, Link מאוחדת, Link מחיר מלא) column names

### Changed
- CSV column detection now tries Hebrew column names if English names are not found
- Improved column matching logic to support both naming conventions

## [1.7.2] - 2025-01-12

### Changed
- Removed redundant CSV path fields from Settings page (now managed exclusively in CSV Manager)
- Settings page now preserves CSV paths set in CSV Manager when saving other settings

## [1.7.1] - 2025-01-12

### Fixed
- Fixed girls01 (נערות) form CSV redirect detection to use form name instead of form ID
- Fixed CSV file existence check to support HTTP URLs in addition to local file paths

## [1.7.0] - 2025-01-12

### Added
- CSV files can now be loaded from HTTP URLs in addition to server file paths
- Added URL validation and fetching capability for CSV files
- CSV data from URLs is cached for 1 hour to improve performance

### Changed
- CSV Manager now accepts both HTTP URLs and server file paths
- Updated CSV Manager UI labels to indicate support for both URLs and paths
- Enhanced CSV validation to work with both local files and remote URLs

## [1.6.7] - 2025-01-12

### Added
- CSV Manager now supports manual file path entry in addition to file upload
- Added ability to set server file paths directly for CSV files already on the server

### Fixed
- Fixed CSV Manager redirect URL to use `admin.php` instead of `options-general.php`

## [1.6.6] - 2025-01-12

### Changed
- Updated settings page to show detailed redirect conditions for all forms with actual URLs and condition logic
- Form-Specific Redirects section now displays all 4 conditions for pilatis01, 4 series + CSV for girls01, and 4 conditions for hazaka

## [1.6.5] - 2025-01-12

### Added
- Added new redirect condition for pilatis01 form: team starts with "אחר" (any kupa) redirects to juakea/juaky6 payment page

## [1.6.4] - 2025-01-12

### Fixed
- Fixed hazaka form detection to match Hebrew form name "חזקה מבפנים"
- Hazaka form redirects now work correctly when form name contains Hebrew text

## [1.6.3] - 2025-01-12

### Fixed
- Fixed admin settings page redirect URL to use `admin.php` instead of `options-general.php` for proper navigation

### Changed
- Added form field placeholders to hazaka redirect URLs for passing user data to payment pages
- All hazaka redirect URLs now include: name, email, phone, and ID number parameters

## [1.6.2] - 2025-01-XX

### Added
- Form-specific redirect logic for hazaka form with 4 redirect conditions:
  - **Condition 01**: Team is "ערב" AND kupa is NOT "מאוחדת" → redirects to jd8qad/jd8qae
  - **Condition 02**: Team is "ערב" AND kupa is "מאוחדת" → redirects to jswwda/jswwdc
  - **Condition 03**: Team is "בוקר" AND kupa is NOT "מאוחדת" → redirects to jszwxe/jszyda
  - **Condition 04**: Team is "בוקר" AND kupa is "מאוחדת" → redirects to jszy01/jszzqt
- Enhanced form ID detection to support flexible matching (exact match or partial match)

## [1.6.1] - 2025-01-XX

### Changed
- Updated pilatis01 form redirect rules from 4 conditions to 3 conditions
  - **Removed**: Condition for מאוחדת + סדרה קצרה (redirected to jdnhkh)
  - **Condition 01**: Team contains "סדרה קצרה" (any kupa) → redirects to jdhga1
  - **Condition 02**: Kupa is NOT "מאוחדת" AND team contains "סדרה ארוכה" → redirects to jdnexa
  - **Condition 03**: Kupa is "מאוחדת" AND team contains "סדרה ארוכה" → redirects to jdni0u
- Updated PILATIS-FORM-CONFIG.md documentation to reflect new 3-condition structure

### Fixed
- Condition 01 now correctly triggers for any kupa value when team contains "סדרה קצרה" (previously required kupa to NOT be מאוחדת)

## [1.6.0] - Previous Release

### Changed
- Automated redirects now ONLY apply to pilatis01 and girls01 forms - all other forms will not redirect
- CSV redirects are now exclusive to girls01 form
- Series redirects are now form-specific (pilatis01 and girls01 only)

### Added
- Form-specific redirect logic for pilatis01 form
- Form-specific redirect logic for girls01 form (series + CSV redirects)

## [1.5.0] - Previous Release

### Added
- Form-specific redirect logic for Pilatis form
- Support for 4 redirect conditions based on kupa and team combinations

