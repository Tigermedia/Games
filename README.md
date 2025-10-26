# Elementor Dynamic Redirect

A WordPress plugin that enables conditional form redirects for Elementor Pro based on payment method with dynamic CSV-based URL generation.

## Features

- **Conditional Redirects**: Redirect users only when they select specific payment methods (e.g., credit card)
- **CSV-Based URLs**: Manage redirect URLs via CSV files for easy updates
- **Dynamic URL Generation**: Replace placeholders with form data automatically
- **Multiple Schedule Support**: Different CSV files for different teams/schedules
- **User-Friendly Admin**: Upload CSV files without FTP access
- **Testing Tool**: Test redirects before going live
- **Debug Logging**: Track redirect operations for troubleshooting
- **Secure**: Built with WordPress security best practices

## Requirements

- WordPress 5.8 or higher
- PHP 7.4 or higher
- Elementor Pro (for form functionality)

## Installation

1. Download the plugin ZIP file
2. Go to WordPress Admin → Plugins → Add New
3. Click "Upload Plugin" and select the ZIP file
4. Activate the plugin

## Quick Start

### 1. Configure Settings

1. Go to **Settings → Form Redirect**
2. Set your Elementor form field IDs:
   - Team Field ID (e.g., `team`)
   - Kupa Field ID (e.g., `kupa`)
   - Payment Method Field ID (e.g., `payment_method`)
3. Set the payment trigger value (e.g., `אשראי` for credit card)
4. Save settings

### 2. Upload CSV Files

1. Go to **Settings → Form Redirect → CSV Manager**
2. Upload your Sunday and Tuesday class schedule CSV files
3. Verify the files are uploaded successfully

### 3. Test the Setup

1. Go to **Settings → Form Redirect → Testing Tool**
2. Try different scenarios to verify redirects work correctly
3. Check the generated URLs

### 4. Add to Your Forms

The plugin automatically hooks into Elementor Pro forms. No additional configuration needed!

## CSV File Format

Your CSV files must have these columns:

| Column | Description | Example |
|--------|-------------|---------|
| `date` | Date in YYYY-MM-DD format | `2025-10-26` |
| `link_full` | URL for "מלא" (full) option | `https://payment.com/charge?name=[field id="first_name"]` |
| `link_partial` | URL for "מאוחדת" (partial) option | `https://payment.com/charge?name=[field id="first_name"]` |

### Example CSV

```csv
date,link_full,link_partial
2025-10-26,https://payment.com/charge?name=[field id="first_name"]&email=[field id="email"]&amount=150,https://payment.com/charge?name=[field id="first_name"]&email=[field id="email"]&amount=100
2025-11-02,https://payment.com/charge?name=[field id="first_name"]&email=[field id="email"]&amount=150,https://payment.com/charge?name=[field id="first_name"]&email=[field id="email"]&amount=100
```

## URL Placeholders

Use placeholders in your URLs that will be replaced with form data:

- `[field id="first_name"]` - First name from form
- `[field id="last_name"]` - Last name from form
- `[field id="email"]` - Email from form
- `[field id="ANY_FIELD_ID"]` - Any field from your Elementor form

### Example URL

```
https://payment.com/charge?name=[field id="first_name"] [field id="last_name"]&email=[field id="email"]&amount=100
```

Will be converted to:

```
https://payment.com/charge?name=John%20Doe&email=john@example.com&amount=100
```

## How It Works

1. User submits an Elementor form
2. Plugin checks if payment method matches trigger value (e.g., "אשראי")
3. If yes, plugin determines which CSV to use based on team field
4. Plugin finds today's date in the CSV
5. Plugin selects URL column based on kupa field (link_full or link_partial)
6. Plugin replaces placeholders with actual form data
7. User is redirected to the generated URL

## Admin Pages

### Settings

Configure field IDs, payment trigger value, and debug mode.

### CSV Manager

Upload, view, and manage your Sunday and Tuesday CSV files.

### Testing Tool

Test redirect generation with different scenarios before going live.

### Help

View documentation and troubleshooting tips.

## Troubleshooting

### Redirect not working?

- Check that CSV files are uploaded
- Verify that today's date exists in the CSV
- Ensure field IDs match your Elementor form exactly
- Check payment method matches trigger value exactly
- Enable debug logging and check WordPress error_log

### CSV upload fails?

- Ensure file is in CSV format (not Excel)
- Check that uploads directory is writable
- Verify CSV has correct column headers (date, link_full, link_partial)

## Development

### File Structure

```
elementor-dynamic-redirect/
├── elementor-dynamic-redirect.php  # Main plugin file
├── includes/                        # Core classes
│   ├── class-edr-core.php
│   ├── class-edr-csv-handler.php
│   ├── class-edr-redirect.php
│   ├── class-edr-form-handler.php
│   └── class-edr-ajax.php
├── admin/                           # Admin interface
│   ├── class-edr-admin.php
│   ├── class-edr-settings.php
│   ├── class-edr-csv-manager.php
│   ├── class-edr-testing-tool.php
│   └── views/                       # Admin page templates
├── assets/                          # CSS & JS
│   ├── css/
│   └── js/
├── sample-data/                     # Sample CSV files
└── docs/                            # Documentation
```

## Security

This plugin follows WordPress security best practices:

- Nonce verification for all forms
- Input sanitization
- Output escaping
- Capability checks
- Secure file uploads
- SQL injection prevention

## License

GPL v2 or later

## Credits

Developed by [Tigermedia](https://github.com/Tigermedia)

## Support

For issues and questions, please visit the [GitHub repository](https://github.com/Tigermedia/elementor-form-dynamic-redirect).
