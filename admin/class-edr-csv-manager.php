<?php
/**
 * CSV Manager
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * EDR_CSV_Manager Class
 */
class EDR_CSV_Manager {

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
        add_action('admin_post_edr_upload_csv', array($this, 'handle_upload'));
        add_action('admin_post_edr_delete_csv', array($this, 'handle_delete'));
    }

    /**
     * Handle CSV upload
     */
    public function handle_upload() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'elementor-dynamic-redirect'));
        }

        // Verify nonce
        check_admin_referer('edr_upload_csv', 'edr_csv_nonce');

        // Get upload type
        $upload_type = isset($_POST['upload_type']) ? sanitize_text_field($_POST['upload_type']) : '';

        if (!in_array($upload_type, array('sunday', 'tuesday'))) {
            wp_die(__('Invalid upload type', 'elementor-dynamic-redirect'));
        }

        // Check if file was uploaded
        if (empty($_FILES['csv_file'])) {
            $this->redirect_with_message('error', __('No file uploaded', 'elementor-dynamic-redirect'));
            return;
        }

        // Determine filename
        $filename = $upload_type . '-classes.csv';

        // Upload file
        $result = EDR_CSV_Handler::upload_csv($_FILES['csv_file'], $filename);

        if (is_wp_error($result)) {
            $this->redirect_with_message('error', $result->get_error_message());
            return;
        }

        // Update settings with new path
        $settings = EDR_Core::instance()->get_settings();
        $settings[$upload_type . '_csv_path'] = $result;
        EDR_Core::instance()->update_settings($settings);

        $this->redirect_with_message('success', __('CSV uploaded successfully', 'elementor-dynamic-redirect'));
    }

    /**
     * Handle CSV deletion
     */
    public function handle_delete() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'elementor-dynamic-redirect'));
        }

        // Verify nonce
        check_admin_referer('edr_delete_csv', 'edr_csv_nonce');

        // Get delete type
        $delete_type = isset($_POST['delete_type']) ? sanitize_text_field($_POST['delete_type']) : '';

        if (!in_array($delete_type, array('sunday', 'tuesday'))) {
            wp_die(__('Invalid delete type', 'elementor-dynamic-redirect'));
        }

        // Get file path from settings
        $settings = EDR_Core::instance()->get_settings();
        $file_path = $settings[$delete_type . '_csv_path'];

        if (empty($file_path) || !file_exists($file_path)) {
            $this->redirect_with_message('error', __('File not found', 'elementor-dynamic-redirect'));
            return;
        }

        // Delete file
        $result = EDR_CSV_Handler::delete_csv($file_path);

        if ($result) {
            // Update settings
            $settings[$delete_type . '_csv_path'] = '';
            EDR_Core::instance()->update_settings($settings);

            $this->redirect_with_message('success', __('CSV deleted successfully', 'elementor-dynamic-redirect'));
        } else {
            $this->redirect_with_message('error', __('Failed to delete CSV', 'elementor-dynamic-redirect'));
        }
    }

    /**
     * Redirect with message
     */
    private function redirect_with_message($type, $message) {
        $redirect_url = add_query_arg(
            array(
                'page' => 'elementor-dynamic-redirect-csv',
                'message_type' => $type,
                'message' => urlencode($message),
            ),
            admin_url('options-general.php')
        );

        wp_safe_redirect($redirect_url);
        exit;
    }

    /**
     * Get CSV info
     */
    public function get_csv_info($type) {
        $settings = EDR_Core::instance()->get_settings();
        $file_path = $settings[$type . '_csv_path'];

        return EDR_CSV_Handler::get_csv_info($file_path);
    }
}
