<?php
/**
 * Admin Interface
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * EDR_Admin Class
 */
class EDR_Admin {

    /**
     * Single instance
     */
    private static $instance = null;

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
        $this->init_hooks();
        $this->init_components();
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }

    /**
     * Initialize components
     */
    private function init_components() {
        EDR_Settings::instance();
        EDR_CSV_Manager::instance();
        EDR_Testing_Tool::instance();
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        // Main menu page
        add_options_page(
            __('Elementor Dynamic Redirect', 'elementor-dynamic-redirect'),
            __('Form Redirect', 'elementor-dynamic-redirect'),
            'manage_options',
            'elementor-dynamic-redirect',
            array($this, 'render_settings_page')
        );

        // CSV Manager submenu
        add_submenu_page(
            'elementor-dynamic-redirect',
            __('CSV Manager', 'elementor-dynamic-redirect'),
            __('CSV Manager', 'elementor-dynamic-redirect'),
            'manage_options',
            'elementor-dynamic-redirect-csv',
            array($this, 'render_csv_manager_page')
        );

        // Testing Tool submenu
        add_submenu_page(
            'elementor-dynamic-redirect',
            __('Testing Tool', 'elementor-dynamic-redirect'),
            __('Testing Tool', 'elementor-dynamic-redirect'),
            'manage_options',
            'elementor-dynamic-redirect-testing',
            array($this, 'render_testing_tool_page')
        );

        // Help submenu
        add_submenu_page(
            'elementor-dynamic-redirect',
            __('Help', 'elementor-dynamic-redirect'),
            __('Help', 'elementor-dynamic-redirect'),
            'manage_options',
            'elementor-dynamic-redirect-help',
            array($this, 'render_help_page')
        );
    }

    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('edr_settings_group', 'edr_settings', array(
            'sanitize_callback' => array($this, 'sanitize_settings'),
        ));
    }

    /**
     * Sanitize settings
     */
    public function sanitize_settings($input) {
        $sanitized = array();

        $sanitized['team_field_id'] = sanitize_text_field($input['team_field_id']);
        $sanitized['kupa_field_id'] = sanitize_text_field($input['kupa_field_id']);
        $sanitized['payment_field_id'] = sanitize_text_field($input['payment_field_id']);
        $sanitized['payment_trigger_value'] = sanitize_text_field($input['payment_trigger_value']);
        $sanitized['form_ids'] = sanitize_text_field($input['form_ids']);
        $sanitized['sunday_csv_path'] = sanitize_text_field($input['sunday_csv_path']);
        $sanitized['tuesday_csv_path'] = sanitize_text_field($input['tuesday_csv_path']);
        $sanitized['debug_enabled'] = isset($input['debug_enabled']) ? true : false;

        return $sanitized;
    }

    /**
     * Render settings page
     */
    public function render_settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        include EDR_PLUGIN_DIR . 'admin/views/settings-page.php';
    }

    /**
     * Render CSV manager page
     */
    public function render_csv_manager_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        include EDR_PLUGIN_DIR . 'admin/views/csv-manager-page.php';
    }

    /**
     * Render testing tool page
     */
    public function render_testing_tool_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        include EDR_PLUGIN_DIR . 'admin/views/testing-tool-page.php';
    }

    /**
     * Render help page
     */
    public function render_help_page() {
        if (!current_user_can('manage_options')) {
            return;
        }

        include EDR_PLUGIN_DIR . 'admin/views/help-page.php';
    }
}
