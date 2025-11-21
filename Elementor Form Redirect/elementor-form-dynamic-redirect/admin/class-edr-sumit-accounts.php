<?php
/**
 * Sumit Accounts Page Handler
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * EDR_Sumit_Accounts Class
 */
class EDR_Sumit_Accounts {

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
        add_action('admin_post_edr_save_sumit_account', array($this, 'save_sumit_account'));
    }

    /**
     * Save Sumit account selection
     */
    public function save_sumit_account() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'elementor-dynamic-redirect'));
        }

        // Verify nonce
        check_admin_referer('edr_save_sumit_account', 'edr_sumit_account_nonce');

        // Get current settings
        $current_settings = EDR_Core::instance()->get_settings();

        // Get and validate the account selection
        $selected_account = isset($_POST['pilatis_sumit_account']) ? sanitize_text_field($_POST['pilatis_sumit_account']) : 'stern_sports';
        
        error_log('[EDR Debug] Saving Sumit Account. POST value: ' . $selected_account);

        // Validate that it's one of the two allowed values
        $allowed_accounts = array('stern_sports', 'stern_fitness');
        if (!in_array($selected_account, $allowed_accounts)) {
            error_log('[EDR Debug] Invalid account selected, defaulting to stern_sports');
            $selected_account = 'stern_sports'; // Default to stern_sports if invalid
        }

        // Update only the pilatis_sumit_account setting
        $current_settings['pilatis_sumit_account'] = $selected_account;
        
        // Update settings using EDR_Core method to ensure cache is updated
        EDR_Core::instance()->update_settings($current_settings);

        // Redirect back with success message
        $redirect_url = add_query_arg(
            array(
                'page' => 'elementor-dynamic-redirect-sumit-accounts',
                'settings-updated' => 'true',
            ),
            admin_url('admin.php')
        );

        wp_safe_redirect($redirect_url);
        exit;
    }

    /**
     * Render the Sumit Accounts page
     */
    public function render_page() {
        include EDR_PLUGIN_DIR . 'admin/views/sumit-accounts-page.php';
    }

    /**
     * Get account name in Hebrew
     */
    public function get_account_name($account_key) {
        $account_names = array(
            'stern_sports' => 'שטרן - חוגים לספורט',
            'stern_fitness' => 'שטרן - כושר לנשים ונערות',
        );

        return isset($account_names[$account_key]) ? $account_names[$account_key] : $account_key;
    }
}
