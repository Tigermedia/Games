<?php
/**
 * Core plugin functionality
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * EDR_Core Class
 */
class EDR_Core {

    /**
     * Single instance
     */
    private static $instance = null;

    /**
     * Settings
     */
    private $settings;

    /**
     * Get instance
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
        $this->load_settings();
        $this->init_hooks();
        $this->init_components();
    }

    /**
     * Load settings
     */
    private function load_settings() {
        $defaults = array(
            'team_field_id' => 'team',
            'kupa_field_id' => 'kupa',
            'payment_field_id' => 'payment_method',
            'payment_trigger_value' => 'אשראי',
            'sunday_csv_path' => '',
            'tuesday_csv_path' => '',
            'debug_enabled' => false,
        );

        $this->settings = wp_parse_args(get_option('edr_settings', array()), $defaults);
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Enqueue frontend scripts
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));

        // Admin scripts
        if (is_admin()) {
            add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        }
    }

    /**
     * Initialize components
     */
    private function init_components() {
        // Initialize form handler
        EDR_Form_Handler::instance();

        // Initialize AJAX handler
        EDR_AJAX::instance();

        // Initialize admin (if in admin)
        if (is_admin()) {
            EDR_Admin::instance();
        }
    }

    /**
     * Get setting
     */
    public function get_setting($key, $default = '') {
        return isset($this->settings[$key]) ? $this->settings[$key] : $default;
    }

    /**
     * Get all settings
     */
    public function get_settings() {
        return $this->settings;
    }

    /**
     * Update settings
     */
    public function update_settings($new_settings) {
        $this->settings = wp_parse_args($new_settings, $this->settings);
        update_option('edr_settings', $this->settings);
    }

    /**
     * Enqueue frontend scripts
     */
    public function enqueue_frontend_scripts() {
        // Only enqueue on pages with Elementor forms
        if (!$this->should_enqueue_frontend_scripts()) {
            return;
        }

        wp_enqueue_style(
            'edr-frontend',
            EDR_PLUGIN_URL . 'assets/css/frontend.css',
            array(),
            EDR_VERSION
        );

        wp_enqueue_script(
            'edr-frontend',
            EDR_PLUGIN_URL . 'assets/js/frontend.js',
            array('jquery'),
            EDR_VERSION,
            true
        );

        wp_localize_script('edr-frontend', 'edrData', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('edr_redirect_nonce'),
            'debug' => $this->get_setting('debug_enabled'),
        ));
    }

    /**
     * Enqueue admin scripts
     */
    public function enqueue_admin_scripts($hook) {
        // Only load on our plugin pages
        if (strpos($hook, 'elementor-dynamic-redirect') === false) {
            return;
        }

        wp_enqueue_style(
            'edr-admin',
            EDR_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            EDR_VERSION
        );

        wp_enqueue_script(
            'edr-admin',
            EDR_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            EDR_VERSION,
            true
        );

        wp_localize_script('edr-admin', 'edrAdmin', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('edr_admin_nonce'),
        ));
    }

    /**
     * Check if we should enqueue frontend scripts
     */
    private function should_enqueue_frontend_scripts() {
        // Always enqueue if Elementor is active on the page
        if (class_exists('\Elementor\Plugin')) {
            return true;
        }
        return false;
    }

    /**
     * Log debug message
     */
    public static function log($message, $data = null) {
        $instance = self::instance();

        if (!$instance->get_setting('debug_enabled')) {
            return;
        }

        $log_message = '[EDR] ' . $message;

        if ($data !== null) {
            $log_message .= ' | Data: ' . print_r($data, true);
        }

        error_log($log_message);
    }
}
