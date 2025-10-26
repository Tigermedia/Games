<?php
/**
 * Plugin Name: Elementor Dynamic Redirect
 * Plugin URI: https://github.com/Tigermedia/elementor-form-dynamic-redirect
 * Description: Conditional form redirects for Elementor based on payment method with dynamic CSV-based URL generation
 * Version: 1.1.0
 * Author: Tigermedia
 * Author URI: https://github.com/Tigermedia
 * Text Domain: elementor-dynamic-redirect
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('EDR_VERSION', '1.1.0');
define('EDR_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('EDR_PLUGIN_URL', plugin_dir_url(__FILE__));
define('EDR_PLUGIN_FILE', __FILE__);
define('EDR_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Main plugin class
 */
class Elementor_Dynamic_Redirect {

    /**
     * Single instance of the class
     */
    private static $instance = null;

    /**
     * Get single instance
     */
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->init_hooks();
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Load plugin text domain
        add_action('plugins_loaded', array($this, 'load_textdomain'));

        // Initialize plugin
        add_action('plugins_loaded', array($this, 'init'), 20);

        // Add admin notices
        add_action('admin_notices', array($this, 'check_requirements'));
    }

    /**
     * Load plugin text domain
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'elementor-dynamic-redirect',
            false,
            dirname(EDR_PLUGIN_BASENAME) . '/languages'
        );
    }

    /**
     * Initialize plugin
     */
    public function init() {
        // Check if Elementor Pro is active
        if (!$this->is_elementor_pro_active()) {
            return;
        }

        // Load dependencies
        $this->load_dependencies();

        // Initialize core
        if (class_exists('EDR_Core')) {
            EDR_Core::instance();
        }
    }

    /**
     * Load plugin dependencies
     */
    private function load_dependencies() {
        // Core classes
        require_once EDR_PLUGIN_DIR . 'includes/class-edr-core.php';
        require_once EDR_PLUGIN_DIR . 'includes/class-edr-csv-handler.php';
        require_once EDR_PLUGIN_DIR . 'includes/class-edr-redirect.php';
        require_once EDR_PLUGIN_DIR . 'includes/class-edr-form-handler.php';
        require_once EDR_PLUGIN_DIR . 'includes/class-edr-ajax.php';

        // Admin classes (only in admin)
        if (is_admin()) {
            require_once EDR_PLUGIN_DIR . 'admin/class-edr-admin.php';
            require_once EDR_PLUGIN_DIR . 'admin/class-edr-settings.php';
            require_once EDR_PLUGIN_DIR . 'admin/class-edr-csv-manager.php';
            require_once EDR_PLUGIN_DIR . 'admin/class-edr-testing-tool.php';
        }
    }

    /**
     * Check if Elementor Pro is active
     */
    private function is_elementor_pro_active() {
        return defined('ELEMENTOR_PRO_VERSION');
    }

    /**
     * Check requirements and display admin notices
     */
    public function check_requirements() {
        if (!$this->is_elementor_pro_active()) {
            $message = sprintf(
                __('Elementor Dynamic Redirect requires %s to be installed and activated.', 'elementor-dynamic-redirect'),
                '<strong>' . __('Elementor Pro', 'elementor-dynamic-redirect') . '</strong>'
            );
            printf('<div class="notice notice-error"><p>%s</p></div>', $message);
        }
    }
}

/**
 * Plugin activation hook
 */
function edr_activate_plugin() {
    // Create upload directory
    $upload_dir = wp_upload_dir();
    $edr_dir = $upload_dir['basedir'] . '/class-schedules';

    if (!file_exists($edr_dir)) {
        wp_mkdir_p($edr_dir);

        // Add .htaccess for security
        $htaccess_content = 'Options -Indexes' . PHP_EOL . 'deny from all';
        file_put_contents($edr_dir . '/.htaccess', $htaccess_content);
    }

    // Set default options
    $default_settings = array(
        'team_field_id' => 'team',
        'kupa_field_id' => 'kupa',
        'payment_field_id' => 'payment_method',
        'payment_trigger_value' => 'אשראי',
        'form_ids' => '',
        'sunday_csv_path' => '',
        'tuesday_csv_path' => '',
        'debug_enabled' => false,
    );

    add_option('edr_settings', $default_settings);
    add_option('edr_version', EDR_VERSION);

    // Clear any existing transients
    delete_transient('edr_sunday_csv_cache');
    delete_transient('edr_tuesday_csv_cache');
}
register_activation_hook(__FILE__, 'edr_activate_plugin');

/**
 * Plugin deactivation hook
 */
function edr_deactivate_plugin() {
    // Clean up transients
    delete_transient('edr_sunday_csv_cache');
    delete_transient('edr_tuesday_csv_cache');

    // Clear any redirect transients (they start with elementor_redirect_)
    global $wpdb;
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_elementor_redirect_%'");
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_elementor_redirect_%'");
}
register_deactivation_hook(__FILE__, 'edr_deactivate_plugin');

/**
 * Initialize the plugin
 */
function edr_init_plugin() {
    return Elementor_Dynamic_Redirect::instance();
}

// Start the plugin
edr_init_plugin();
