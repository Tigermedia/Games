<?php
/**
 * Elementor Form Handler
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * EDR_Form_Handler Class
 */
class EDR_Form_Handler {

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
        // Hook into Elementor form submission
        add_action('elementor_pro/forms/new_record', array($this, 'handle_form_submission'), 10, 2);
    }

    /**
     * Handle form submission
     *
     * @param \ElementorPro\Modules\Forms\Classes\Form_Record $record Form record
     * @param \ElementorPro\Modules\Forms\Classes\Ajax_Handler $ajax_handler Ajax handler
     */
    public function handle_form_submission($record, $ajax_handler) {
        EDR_Core::log('Form submission detected');

        // Extract form data
        $form_data = $this->extract_form_data($record);

        if (empty($form_data)) {
            EDR_Core::log('No form data extracted');
            return;
        }

        EDR_Core::log('Form data extracted', $form_data);

        // Get redirect URL
        $redirect_url = EDR_Redirect::get_redirect_url($form_data);

        if ($redirect_url) {
            // Set redirect in response
            $ajax_handler->add_response_data('redirect_url', $redirect_url);

            // Also store in transient as backup
            $session_id = $this->get_session_id();
            set_transient('elementor_redirect_' . $session_id, $redirect_url, 60);

            EDR_Core::log('Redirect URL set', array(
                'url' => $redirect_url,
                'session_id' => $session_id,
            ));
        } else {
            EDR_Core::log('No redirect URL generated, form will submit normally');
        }
    }

    /**
     * Extract form data from record
     *
     * @param \ElementorPro\Modules\Forms\Classes\Form_Record $record Form record
     * @return array Form data
     */
    private function extract_form_data($record) {
        $form_data = array();

        // Get raw fields
        $raw_fields = $record->get('fields');

        if (empty($raw_fields)) {
            return $form_data;
        }

        // Extract field values
        foreach ($raw_fields as $field_id => $field) {
            if (isset($field['value'])) {
                $form_data[$field_id] = $field['value'];
            }
        }

        // Also add with 'field_' prefix for compatibility
        foreach ($form_data as $key => $value) {
            if (!isset($form_data['field_' . $key])) {
                $form_data['field_' . $key] = $value;
            }
        }

        return $form_data;
    }

    /**
     * Get unique session ID
     *
     * @return string Session ID
     */
    private function get_session_id() {
        if (!session_id()) {
            return md5(uniqid(rand(), true));
        }
        return session_id();
    }

    /**
     * Get redirect URL from transient
     *
     * @param string $session_id Session ID
     * @return string|false Redirect URL or false
     */
    public static function get_redirect_from_transient($session_id) {
        $url = get_transient('elementor_redirect_' . $session_id);

        if ($url) {
            // Delete transient after retrieving
            delete_transient('elementor_redirect_' . $session_id);
            return $url;
        }

        return false;
    }
}
