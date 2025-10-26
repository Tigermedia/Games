# Changelog

All notable changes to this project will be documented in this file.

## [1.3.3] - 2025-10-26

### Changed
- Kupa field logic simplified: "מאוחדת" = partial (link_partial), everything else = full (link_full)
- Removed requirement for explicit "מלא" or "full" keywords
- Any value that doesn't contain "מאוחדת" now defaults to full

### Improved
- More flexible kupa matching - works with any value for "full"
- Clearer logic that matches business requirements

## [1.3.2] - 2025-10-26

### Added
- "Use Default Path" buttons in Settings page for CSV paths
- Default path display showing correct server file paths
- Helper text clarifying that server paths (not URLs) are required

### Fixed
- CSV path configuration now clearly shows correct file system paths
- Prevents users from entering URLs instead of file paths

### Improved
- One-click button to populate correct CSV file paths
- Better UX for configuring CSV file locations

## [1.3.1] - 2025-10-26

### Added
- Enhanced debug output in testing tool showing detailed step-by-step diagnostics
- Debug info now includes: payment_match, csv_path, csv_exists, csv_rows, row_found, column, column_exists
- Specific error messages for each failure point in the redirect logic

### Improved
- Testing tool now provides clear, actionable error messages
- Easier troubleshooting with detailed debug information
- Better visibility into why redirects fail

## [1.3.0] - 2025-10-26

### Changed
- Date matching logic now finds the next upcoming lesson instead of requiring exact match
- If test date falls between two lessons, returns URL for the next upcoming lesson
- If test date matches a lesson exactly, returns that lesson's URL

### Improved
- More flexible date handling for real-world usage scenarios
- Better user experience when testing with dates that don't match lessons exactly

## [1.2.0] - 2025-10-26

### Added
- Top-level admin menu with proper submenu structure
- Auto-configuration of CSV paths on plugin activation

### Changed
- Admin menu moved from Settings submenu to standalone top-level menu
- CSV paths now automatically point to included CSV files on activation
- Menu now properly displays: Settings, CSV Manager, Testing Tool, and Help pages

### Fixed
- Admin submenu pages now visible and accessible
- Menu structure corrected to use `add_menu_page()` instead of `add_options_page()`

## [1.1.0] - 2025-10-26

### Added
- Form ID filtering: Option to restrict plugin to specific Elementor form IDs (comma-separated)
- Date-based testing: Testing tool now accepts custom date input to test URLs for any date
- Real production CSV files for Michal Stern classes (Sunday and Tuesday schedules)

### Changed
- CSV path fields in settings are now editable (removed readonly attribute)
- CSV files moved from `sample-data/` to `csv-data/` directory
- Removed sample CSV files, keeping only production data

### Fixed
- Settings page CSV path fields can now be manually edited
- Form handler now checks if form ID matches before processing

## [1.0.0] - 2025-10-26

### Added
- Initial release
- Conditional redirect based on payment method
- CSV-based URL management
- Dynamic placeholder replacement
- Admin settings page
- CSV upload manager
- Testing tool with 8 predefined scenarios
- Help documentation
- Debug logging
- Support for Sunday and Tuesday schedules
- Hebrew language support
- Secure file upload handling
- Transient caching for CSV data
- AJAX handlers for testing
- Sample CSV files included

### Features
- WordPress 5.8+ compatibility
- PHP 7.4+ compatibility
- Elementor Pro integration
- Object-oriented architecture
- Security best practices (nonces, sanitization, validation)
- User-friendly admin interface
- RTL language support
