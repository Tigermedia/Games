<?php
/**
 * Settings Page Handler
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * EDR_Settings Class
 */
class EDR_Settings {

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
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        add_action('admin_post_edr_save_settings', array($this, 'save_settings'));
    }

    /**
     * Save settings
     */
    public function save_settings() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'elementor-dynamic-redirect'));
        }

        // Verify nonce
        check_admin_referer('edr_save_settings', 'edr_settings_nonce');

        // Get current settings to preserve CSV paths (managed by CSV Manager)
        $current_settings = EDR_Core::instance()->get_settings();

        // Get settings from POST
        $settings = array(
            'team_field_id' => sanitize_text_field($_POST['team_field_id']),
            'kupa_field_id' => sanitize_text_field($_POST['kupa_field_id']),
            'payment_field_id' => sanitize_text_field($_POST['payment_field_id']),
            'payment_trigger_value' => sanitize_text_field($_POST['payment_trigger_value']),
            'form_ids' => sanitize_text_field($_POST['form_ids']),
            'sunday_csv_path' => $current_settings['sunday_csv_path'], // Preserve CSV path from CSV Manager
            'tuesday_csv_path' => $current_settings['tuesday_csv_path'], // Preserve CSV path from CSV Manager
            'debug_enabled' => isset($_POST['debug_enabled']) ? true : false,
        );

        // Update settings
        update_option('edr_settings', $settings);

        // Redirect back with success message
        $redirect_url = add_query_arg(
            array(
                'page' => 'elementor-dynamic-redirect',
                'settings-updated' => 'true',
            ),
            admin_url('admin.php')
        );

        wp_safe_redirect($redirect_url);
        exit;
    }

    /**
     * Get current settings
     */
    public function get_settings() {
        return EDR_Core::instance()->get_settings();
    }
}
