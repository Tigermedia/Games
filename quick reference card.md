# Plugin Development Quick Reference Card

## ⚡ Essential Information At A Glance

---

## 📦 Plugin Details

**Name:** Elementor Dynamic Redirect  
**Slug:** `elementor-dynamic-redirect`  
**Text Domain:** `elementor-dynamic-redirect`  
**Version:** 1.0.0  
**Requires WP:** 5.8+  
**Requires PHP:** 7.4+  
**License:** GPL v2 or later  

---

## 🗂️ Directory Structure (Quick View)

```
elementor-dynamic-redirect/
├── elementor-dynamic-redirect.php     [Main]
├── uninstall.php                      [Cleanup]
├── includes/          [5 classes]
├── admin/             [4 classes + views]
├── assets/            [CSS + JS]
├── docs/              [Documentation]
└── sample-data/       [Sample CSVs]
```

---

## 🎯 Core Constants

```php
define('EDR_VERSION', '1.0.0');
define('EDR_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('EDR_PLUGIN_URL', plugin_dir_url(__FILE__));
define('EDR_PLUGIN_BASENAME', plugin_basename(__FILE__));
```

---

## 📋 5 Core Classes (includes/)

| Class | File | Purpose |
|-------|------|---------|
| `EDR_Core` | `class-edr-core.php` | Main initialization |
| `EDR_CSV_Handler` | `class-edr-csv-handler.php` | CSV operations |
| `EDR_Redirect` | `class-edr-redirect.php` | Redirect logic |
| `EDR_Form_Handler` | `class-edr-form-handler.php` | Elementor hook |
| `EDR_AJAX` | `class-edr-ajax.php` | AJAX handlers |

---

## 🎨 4 Admin Classes (admin/)

| Class | File | Purpose |
|-------|------|---------|
| `EDR_Admin` | `class-edr-admin.php` | Main admin |
| `EDR_Settings` | `class-edr-settings.php` | Settings page |
| `EDR_CSV_Manager` | `class-edr-csv-manager.php` | CSV upload UI |
| `EDR_Testing_Tool` | `class-edr-testing-tool.php` | Testing interface |

---

## 🔧 Plugin Settings (Stored in wp_options)

```php
$settings = [
    'team_field_id' => 'team',
    'kupa_field_id' => 'kupa',
    'payment_field_id' => 'payment_method',
    'payment_trigger_value' => 'אשראי',
    'sunday_csv_path' => WP_CONTENT_DIR . '/uploads/class-schedules/sunday-classes.csv',
    'tuesday_csv_path' => WP_CONTENT_DIR . '/uploads/class-schedules/tuesday-classes.csv',
    'debug_enabled' => false
];

// Save
update_option('edr_settings', $settings);

// Get
$settings = get_option('edr_settings', []);
```

---

## 🔌 Key WordPress Hooks

### Plugin Lifecycle
```php
register_activation_hook(__FILE__, 'edr_activate');
register_deactivation_hook(__FILE__, 'edr_deactivate');
// uninstall.php for uninstall
```

### Admin
```php
add_action('admin_menu', 'edr_add_admin_menu');
add_action('admin_enqueue_scripts', 'edr_enqueue_admin_assets');
add_action('admin_init', 'edr_register_settings');
```

### Frontend
```php
add_action('wp_enqueue_scripts', 'edr_enqueue_frontend_assets');
```

### Elementor
```php
add_action('elementor_pro/forms/new_record', 'edr_handle_form', 10, 2);
```

### AJAX
```php
add_action('wp_ajax_edr_get_redirect', 'edr_ajax_redirect');
add_action('wp_ajax_nopriv_edr_get_redirect', 'edr_ajax_redirect');
```

---

## 🎯 Main Logic Flow

```php
// 1. Check payment method
if ($payment_method !== 'אשראי') {
    return null; // No redirect
}

// 2. Determine CSV based on team
$csv = (starts_with($team, 'יום ראשון')) ? SUNDAY_CSV : TUESDAY_CSV;

// 3. Parse CSV and find today's date
$schedule = parse_csv($csv);
$class = find_by_date($schedule, today());

// 4. Select column based on kupa
$url = ($kupa === 'מאוחדת') ? $class['link_unified'] : $class['link_full'];

// 5. Replace placeholders
$url = replace_placeholders($url, $form_data);

return $url;
```

---

## 📊 CSV Structure (Columns)

```
Column A: Date (dd.mm.yyyy)
Column L: Full price link (link_full)
Column M: Unified price link (link_unified)
```

---

## 🔒 Security Checklist

```php
// Nonces
check_admin_referer('edr-settings-nonce');
check_ajax_referer('edr-ajax-nonce', 'nonce');

// Capabilities
current_user_can('manage_options')

// Sanitization
sanitize_text_field($_POST['field'])
sanitize_file_name($_FILES['file']['name'])
esc_url_raw($url)

// Escaping
esc_html($text)
esc_url($url)
esc_attr($attr)

// Validation
if (!file_exists($path)) { /* error */ }
if (!preg_match('/\.csv$/i', $file)) { /* error */ }
```

---

## 💾 Transient Cache

```php
// Set cache (1 hour)
set_transient('edr_sunday_csv', $parsed_data, HOUR_IN_SECONDS);

// Get cache
$data = get_transient('edr_sunday_csv');
if (false === $data) {
    // Cache miss - parse CSV
}

// Delete cache
delete_transient('edr_sunday_csv');
```

---

## 📝 Debug Logging

```php
if (get_option('edr_debug_enabled', false)) {
    error_log('EDR: ' . $message);
}

// Enable debug in wp-config.php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);

// View logs
// /wp-content/debug.log
```

---

## 🧪 Testing Scenarios

### With Redirect (אשראי)
1. Sunday + Full
2. Sunday + Unified
3. Tuesday + Full
4. Tuesday + Unified

### Without Redirect (other)
5. Cash (מזומן)
6. Transfer (העברה)
7. Empty payment
8. Invalid payment

---

## 🎨 Admin Pages

### Settings Page
**Menu:** Settings → Dynamic Redirect  
**File:** `admin/views/settings-page.php`  
**Function:** Configure field IDs and paths  

### CSV Manager
**Menu:** Settings → CSV Manager  
**File:** `admin/views/csv-manager-page.php`  
**Function:** Upload/manage CSV files  

### Testing Tool
**Menu:** Settings → Testing Tool  
**File:** `admin/views/testing-tool-page.php`  
**Function:** Test redirect scenarios  

### Help
**Menu:** Settings → Help  
**File:** `admin/views/help-page.php`  
**Function:** Documentation viewer  

---

## 📱 Assets Organization

### Admin CSS
```
assets/css/admin.css
├── Settings page styling
├── CSV manager interface
├── Testing tool design
└── Status indicators
```

### Admin JS
```
assets/js/admin.js
├── File upload handler
├── Settings validation
├── Test scenario runner
└── Copy to clipboard
```

### Frontend JS
```
assets/js/frontend.js
├── Form submission intercept
├── AJAX redirect request
└── Console logging
```

---

## 🚀 Quick Start Template

### Main Plugin File Structure
```php
<?php
/**
 * Plugin Name: Elementor Dynamic Redirect
 * [... other headers ...]
 */

// Prevent direct access
if (!defined('ABSPATH')) exit;

// Constants
define('EDR_VERSION', '1.0.0');
define('EDR_PLUGIN_DIR', plugin_dir_path(__FILE__));

// Activation
register_activation_hook(__FILE__, 'edr_activate');

// Load core
require_once EDR_PLUGIN_DIR . 'includes/class-edr-core.php';

// Initialize
function edr_init() {
    $plugin = new EDR_Core();
    $plugin->run();
}
add_action('plugins_loaded', 'edr_init');
```

### Core Class Template
```php
<?php
class EDR_Core {
    private $csv_handler;
    private $redirect;
    private $form_handler;
    
    public function __construct() {
        $this->load_dependencies();
    }
    
    private function load_dependencies() {
        require_once EDR_PLUGIN_DIR . 'includes/class-edr-csv-handler.php';
        require_once EDR_PLUGIN_DIR . 'includes/class-edr-redirect.php';
        require_once EDR_PLUGIN_DIR . 'includes/class-edr-form-handler.php';
        
        $this->csv_handler = new EDR_CSV_Handler();
        $this->redirect = new EDR_Redirect($this->csv_handler);
        $this->form_handler = new EDR_Form_Handler($this->redirect);
    }
    
    public function run() {
        // Register hooks
        if (is_admin()) {
            $this->load_admin();
        }
    }
}
```

---

## 📖 Function Naming Convention

```
Prefix: edr_

Public functions:  edr_function_name()
Private functions: edr_private_function()
AJAX handlers:     edr_ajax_action_name()
Admin pages:       edr_admin_page_name()
Callbacks:         edr_callback_name()
```

---

## 🎛️ Filter & Action Hooks (Custom)

### Actions
```php
do_action('edr_before_redirect', $url, $form_data);
do_action('edr_after_csv_upload', $file_path);
do_action('edr_settings_saved', $settings);
```

### Filters
```php
$url = apply_filters('edr_redirect_url', $url, $form_data);
$csv_path = apply_filters('edr_csv_path', $path, $team);
$settings = apply_filters('edr_default_settings', $defaults);
```

---

## 📋 Admin Page Template

```php
<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    
    <form method="post" action="options.php">
        <?php
        settings_fields('edr_settings_group');
        do_settings_sections('edr-settings');
        submit_button();
        ?>
    </form>
</div>
```

---

## 🔍 Error Handling Pattern

```php
try {
    // Attempt operation
    $result = risky_operation();
    
    if (!$result) {
        throw new Exception('Operation failed');
    }
    
    return $result;
    
} catch (Exception $e) {
    // Log error
    error_log('EDR Error: ' . $e->getMessage());
    
    // User-friendly message
    if (is_admin()) {
        add_settings_error(
            'edr_messages',
            'edr_error',
            __('An error occurred', 'elementor-dynamic-redirect'),
            'error'
        );
    }
    
    return false;
}
```

---

## 🧰 Useful WordPress Functions

### Options
```php
add_option($name, $value)
get_option($name, $default)
update_option($name, $value)
delete_option($name)
```

### Transients
```php
set_transient($name, $value, $expiration)
get_transient($name)
delete_transient($name)
```

### Files
```php
WP_Filesystem()
$wp_filesystem->get_contents($file)
$wp_filesystem->put_contents($file, $content)
```

### Uploads
```php
wp_upload_dir() // Get upload directory info
wp_handle_upload($file, $overrides) // Handle file upload
```

---

## 🎯 Performance Tips

1. **Cache CSV parsing** - Use transients (1 hour)
2. **Lazy load classes** - Only load what's needed
3. **Conditional asset loading** - Only admin pages
4. **Minimize DB queries** - Batch operations
5. **Optimize CSV reading** - Stop at found row

---

## 📱 AJAX Template

```php
// PHP Handler
function edr_ajax_handler() {
    check_ajax_referer('edr-nonce', 'nonce');
    
    $data = isset($_POST['data']) ? sanitize_text_field($_POST['data']) : '';
    
    $result = process_data($data);
    
    if ($result) {
        wp_send_json_success([
            'message' => 'Success',
            'data' => $result
        ]);
    } else {
        wp_send_json_error([
            'message' => 'Error occurred'
        ]);
    }
}
add_action('wp_ajax_edr_handler', 'edr_ajax_handler');

// JavaScript Call
jQuery.post(ajaxurl, {
    action: 'edr_handler',
    nonce: edr_ajax.nonce,
    data: formData
}, function(response) {
    if (response.success) {
        console.log(response.data);
    }
});
```

---

## 📝 Translation Ready

```php
// Wrap strings
__('Text', 'elementor-dynamic-redirect')
_e('Text', 'elementor-dynamic-redirect')
esc_html__('Text', 'elementor-dynamic-redirect')

// Load text domain
load_plugin_textdomain(
    'elementor-dynamic-redirect',
    false,
    dirname(plugin_basename(__FILE__)) . '/languages'
);

// Generate POT file
wp i18n make-pot . languages/elementor-dynamic-redirect.pot
```

---

## ✅ Pre-Launch Checklist

- [ ] All constants defined
- [ ] All classes loaded correctly
- [ ] Settings save/load works
- [ ] CSV upload works
- [ ] All 8 test scenarios pass
- [ ] No PHP errors (debug.log clean)
- [ ] No JS errors (console clean)
- [ ] Security implemented (nonces, sanitization, escaping)
- [ ] Documentation complete
- [ ] Activation/deactivation works
- [ ] Uninstall cleans up properly

---

## 🐛 Common Issues & Fixes

### Issue: CSV not found
```php
// Fix: Check file path and permissions
if (!file_exists($csv_path)) {
    error_log('EDR: CSV not found at ' . $csv_path);
    // Return helpful error
}
```

### Issue: Redirect not working
```php
// Fix: Check payment method value
error_log('Payment method: "' . $payment . '" (expected: "אשראי")');
// Check for extra spaces or encoding
```

### Issue: Settings not saving
```php
// Fix: Check settings registration
register_setting('edr_settings_group', 'edr_settings', 'edr_sanitize_settings');
```

---

## 📞 Quick Links

- [WordPress Plugin Handbook](https://developer.wordpress.org/plugins/)
- [Elementor Dev Docs](https://developers.elementor.com/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)

---

## 🎉 You're Ready!

Keep this card handy while developing. Good luck! 🚀

---

**Plugin Development Time:** ~7-12 hours  
**Complexity Level:** Intermediate  
**WordPress Version:** 5.8+  
**PHP Version:** 7.4+
