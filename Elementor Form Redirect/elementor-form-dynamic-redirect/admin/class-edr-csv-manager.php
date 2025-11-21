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
        add_action('admin_post_edr_set_csv_path', array($this, 'handle_set_path'));
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
     * Handle setting CSV path manually
     */
    public function handle_set_path() {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'elementor-dynamic-redirect'));
        }

        // Verify nonce
        check_admin_referer('edr_set_csv_path', 'edr_csv_path_nonce');

        // Get path type
        $path_type = isset($_POST['path_type']) ? sanitize_text_field($_POST['path_type']) : '';

        if (!in_array($path_type, array('sunday', 'tuesday'))) {
            wp_die(__('Invalid path type', 'elementor-dynamic-redirect'));
        }

        // Get and validate path
        $csv_path = isset($_POST['csv_path']) ? sanitize_text_field($_POST['csv_path']) : '';

        if (empty($csv_path)) {
            $this->redirect_with_message('error', __('CSV path cannot be empty', 'elementor-dynamic-redirect'));
            return;
        }

        // Check if it's a URL or file path
        $is_url = (strpos($csv_path, 'http://') === 0 || strpos($csv_path, 'https://') === 0);

        if ($is_url) {
            // Validate URL format
            if (!filter_var($csv_path, FILTER_VALIDATE_URL)) {
                $this->redirect_with_message('error', __('Invalid URL format', 'elementor-dynamic-redirect'));
                return;
            }

            // Check if URL ends with .csv
            if (!preg_match('/\.csv$/i', parse_url($csv_path, PHP_URL_PATH))) {
                $this->redirect_with_message('error', __('URL must point to a CSV file', 'elementor-dynamic-redirect'));
                return;
            }

            // Try to validate CSV structure by fetching it
            $validation = EDR_CSV_Handler::validate_csv_structure($csv_path);
            if (is_wp_error($validation)) {
                $this->redirect_with_message('error', sprintf(
                    __('Failed to validate CSV from URL: %s', 'elementor-dynamic-redirect'),
                    $validation->get_error_message()
                ));
                return;
            }
        } else {
            // Validate file path
            if (!file_exists($csv_path)) {
                $this->redirect_with_message('error', __('File does not exist at the specified path', 'elementor-dynamic-redirect'));
                return;
            }

            // Check if it's a CSV file
            $file_ext = pathinfo($csv_path, PATHINFO_EXTENSION);
            if (strtolower($file_ext) !== 'csv') {
                $this->redirect_with_message('error', __('File must be a CSV file', 'elementor-dynamic-redirect'));
                return;
            }
        }

        // Update settings with new path
        $settings = EDR_Core::instance()->get_settings();
        $settings[$path_type . '_csv_path'] = $csv_path;
        EDR_Core::instance()->update_settings($settings);

        $this->redirect_with_message('success', __('CSV path updated successfully', 'elementor-dynamic-redirect'));
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
            admin_url('admin.php')
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
