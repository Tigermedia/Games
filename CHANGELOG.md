# Changelog

All notable changes to this project will be documented in this file.

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
