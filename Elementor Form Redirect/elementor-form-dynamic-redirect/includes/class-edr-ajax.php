<?php
/**
 * AJAX Handler
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * EDR_AJAX Class
 */
class EDR_AJAX {

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
        // AJAX handlers
        add_action('wp_ajax_edr_get_redirect', array($this, 'ajax_get_redirect'));
        add_action('wp_ajax_nopriv_edr_get_redirect', array($this, 'ajax_get_redirect'));

        add_action('wp_ajax_edr_test_redirect', array($this, 'ajax_test_redirect'));
        add_action('wp_ajax_edr_upload_csv', array($this, 'ajax_upload_csv'));
        add_action('wp_ajax_edr_delete_csv', array($this, 'ajax_delete_csv'));
        add_action('wp_ajax_edr_clear_cache', array($this, 'ajax_clear_cache'));
    }

    /**
     * AJAX: Get redirect URL
     */
    public function ajax_get_redirect() {
        // Verify nonce
        check_ajax_referer('edr_redirect_nonce', 'nonce');

        // Get form data from POST
        $form_data = isset($_POST['form_data']) ? $_POST['form_data'] : array();

        // Sanitize form data
        $form_data = $this->sanitize_form_data($form_data);

        // Get redirect URL
        $redirect_url = EDR_Redirect::get_redirect_url($form_data);

        if ($redirect_url) {
            wp_send_json_success(array(
                'redirect_url' => $redirect_url,
            ));
        } else {
            wp_send_json_error(array(
                'message' => __('No redirect URL generated', 'elementor-dynamic-redirect'),
            ));
        }
    }

    /**
     * AJAX: Test redirect (admin only)
     */
    public function ajax_test_redirect() {
        // Verify nonce
        check_ajax_referer('edr_admin_nonce', 'nonce');

        // Check capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array(
                'message' => __('Insufficient permissions', 'elementor-dynamic-redirect'),
            ));
        }

        // Get test data
        $test_data = isset($_POST['test_data']) ? $_POST['test_data'] : array();

        // Get custom date if provided
        $custom_date = isset($_POST['test_date']) ? sanitize_text_field($_POST['test_date']) : null;

        // Sanitize
        $test_data = $this->sanitize_form_data($test_data);

        // Validate date format if provided
        if ($custom_date && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $custom_date)) {
            wp_send_json_error(array(
                'message' => __('Invalid date format. Use YYYY-MM-DD', 'elementor-dynamic-redirect'),
            ));
        }

        // Test redirect with optional custom date
        $result = EDR_Redirect::test_redirect($test_data, $custom_date);

        if ($result['success']) {
            wp_send_json_success($result);
        } else {
            wp_send_json_error($result);
        }
    }

    /**
     * AJAX: Upload CSV (admin only)
     */
    public function ajax_upload_csv() {
        // Verify nonce
        check_ajax_referer('edr_admin_nonce', 'nonce');

        // Check capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array(
                'message' => __('Insufficient permissions', 'elementor-dynamic-redirect'),
            ));
        }

        // Check if file was uploaded
        if (empty($_FILES['csv_file'])) {
            wp_send_json_error(array(
                'message' => __('No file uploaded', 'elementor-dynamic-redirect'),
            ));
        }

        // Get target filename
        $filename = isset($_POST['filename']) ? sanitize_file_name($_POST['filename']) : 'schedule.csv';

        // Upload file
        $result = EDR_CSV_Handler::upload_csv($_FILES['csv_file'], $filename);

        if (is_wp_error($result)) {
            wp_send_json_error(array(
                'message' => $result->get_error_message(),
            ));
        }

        wp_send_json_success(array(
            'message' => __('CSV uploaded successfully', 'elementor-dynamic-redirect'),
            'path' => $result,
        ));
    }

    /**
     * AJAX: Delete CSV (admin only)
     */
    public function ajax_delete_csv() {
        // Verify nonce
        check_ajax_referer('edr_admin_nonce', 'nonce');

        // Check capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array(
                'message' => __('Insufficient permissions', 'elementor-dynamic-redirect'),
            ));
        }

        // Get file path
        $file_path = isset($_POST['file_path']) ? sanitize_text_field($_POST['file_path']) : '';

        if (empty($file_path) || !file_exists($file_path)) {
            wp_send_json_error(array(
                'message' => __('File not found', 'elementor-dynamic-redirect'),
            ));
        }

        // Delete file
        $result = EDR_CSV_Handler::delete_csv($file_path);

        if ($result) {
            wp_send_json_success(array(
                'message' => __('CSV deleted successfully', 'elementor-dynamic-redirect'),
            ));
        } else {
            wp_send_json_error(array(
                'message' => __('Failed to delete CSV', 'elementor-dynamic-redirect'),
            ));
        }
    }

    /**
     * AJAX: Clear cache (admin only)
     */
    public function ajax_clear_cache() {
        // Verify nonce
        check_ajax_referer('edr_admin_nonce', 'nonce');

        // Check capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array(
                'message' => __('Insufficient permissions', 'elementor-dynamic-redirect'),
            ));
        }

        // Clear all caches
        EDR_CSV_Handler::clear_all_caches();

        wp_send_json_success(array(
            'message' => __('Cache cleared successfully', 'elementor-dynamic-redirect'),
        ));
    }

    /**
     * Sanitize form data
     *
     * @param array $data Form data
     * @return array Sanitized data
     */
    private function sanitize_form_data($data) {
        $sanitized = array();

        foreach ($data as $key => $value) {
            $sanitized[sanitize_key($key)] = sanitize_text_field($value);
        }

        return $sanitized;
    }
}
