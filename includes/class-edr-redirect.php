<?php
/**
 * Redirect Logic Handler
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * EDR_Redirect Class
 */
class EDR_Redirect {

    /**
     * Generate redirect URL based on form data
     *
     * @param array $form_data Form submission data
     * @return string|null Redirect URL or null if no redirect needed
     */
    public static function get_redirect_url($form_data) {
        EDR_Core::log('Starting redirect URL generation', $form_data);

        // Get settings
        $settings = EDR_Core::instance()->get_settings();

        // Extract field values
        $payment_method = self::get_field_value($form_data, $settings['payment_field_id']);
        $team = self::get_field_value($form_data, $settings['team_field_id']);
        $kupa = self::get_field_value($form_data, $settings['kupa_field_id']);

        EDR_Core::log('Extracted field values', array(
            'payment_method' => $payment_method,
            'team' => $team,
            'kupa' => $kupa,
        ));

        // Check if payment method matches trigger value
        if ($payment_method !== $settings['payment_trigger_value']) {
            EDR_Core::log('Payment method does not match trigger value. No redirect needed.', array(
                'expected' => $settings['payment_trigger_value'],
                'got' => $payment_method,
            ));
            return null;
        }

        // Determine which CSV to use based on team
        $csv_path = self::get_csv_path_for_team($team, $settings);
        if (!$csv_path) {
            EDR_Core::log('Could not determine CSV path for team', $team);
            return null;
        }

        // Parse CSV
        $csv_data = EDR_CSV_Handler::parse_csv($csv_path);
        if (is_wp_error($csv_data)) {
            EDR_Core::log('Error parsing CSV', $csv_data->get_error_message());
            return null;
        }

        // Get today's date
        $today = date('Y-m-d');

        // Find matching row by date
        $row = EDR_CSV_Handler::find_row_by_date($csv_data, $today, 'date');
        if (!$row) {
            EDR_Core::log('No matching row found for today\'s date', $today);
            return null;
        }

        // Determine which column to use based on kupa
        $column = self::get_column_for_kupa($kupa);
        if (!$column || !isset($row[$column])) {
            EDR_Core::log('Invalid kupa or missing column', array(
                'kupa' => $kupa,
                'column' => $column,
            ));
            return null;
        }

        // Get the URL template
        $url_template = $row[$column];

        // Replace placeholders
        $final_url = self::replace_placeholders($url_template, $form_data);

        EDR_Core::log('Generated redirect URL', array(
            'template' => $url_template,
            'final' => $final_url,
        ));

        return $final_url;
    }

    /**
     * Get field value from form data
     *
     * @param array $form_data Form data
     * @param string $field_id Field ID
     * @return string Field value
     */
    private static function get_field_value($form_data, $field_id) {
        if (isset($form_data[$field_id])) {
            return $form_data[$field_id];
        }

        // Try with 'field_' prefix
        if (isset($form_data['field_' . $field_id])) {
            return $form_data['field_' . $field_id];
        }

        return '';
    }

    /**
     * Get CSV path based on team value
     *
     * @param string $team Team value
     * @param array $settings Plugin settings
     * @return string|null CSV file path
     */
    private static function get_csv_path_for_team($team, $settings) {
        // Normalize team value
        $team = trim($team);

        // Check for Sunday indicators
        if (stripos($team, 'ראשון') !== false || stripos($team, 'sunday') !== false) {
            return $settings['sunday_csv_path'];
        }

        // Check for Tuesday indicators
        if (stripos($team, 'שלישי') !== false || stripos($team, 'tuesday') !== false) {
            return $settings['tuesday_csv_path'];
        }

        EDR_Core::log('Could not match team to a known day', $team);
        return null;
    }

    /**
     * Get column name based on kupa value
     *
     * @param string $kupa Kupa value
     * @return string|null Column name
     */
    private static function get_column_for_kupa($kupa) {
        $kupa = trim($kupa);

        // Check for "מלא" (full)
        if (stripos($kupa, 'מלא') !== false || stripos($kupa, 'full') !== false) {
            return 'link_full';
        }

        // Check for "מאוחדת" (united/partial)
        if (stripos($kupa, 'מאוחדת') !== false || stripos($kupa, 'united') !== false || stripos($kupa, 'partial') !== false) {
            return 'link_partial';
        }

        EDR_Core::log('Could not match kupa to a known column', $kupa);
        return null;
    }

    /**
     * Replace placeholders in URL with form data
     *
     * @param string $url_template URL template with placeholders
     * @param array $form_data Form data
     * @return string URL with replaced placeholders
     */
    private static function replace_placeholders($url_template, $form_data) {
        $url = $url_template;

        // Find all placeholders [field id="xxx"]
        preg_match_all('/\[field id="([^"]+)"\]/', $url, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $index => $field_id) {
                $field_value = self::get_field_value($form_data, $field_id);
                $field_value = urlencode($field_value);
                $url = str_replace($matches[0][$index], $field_value, $url);
            }
        }

        // Also handle {field_id} format
        preg_match_all('/\{([^}]+)\}/', $url, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $index => $field_id) {
                $field_value = self::get_field_value($form_data, $field_id);
                $field_value = urlencode($field_value);
                $url = str_replace($matches[0][$index], $field_value, $url);
            }
        }

        return $url;
    }

    /**
     * Test redirect generation (for testing tool)
     *
     * @param array $test_data Test data
     * @return array Result with URL and debug info
     */
    public static function test_redirect($test_data) {
        $result = array(
            'success' => false,
            'url' => '',
            'message' => '',
            'debug' => array(),
        );

        // Get redirect URL
        $url = self::get_redirect_url($test_data);

        if ($url) {
            $result['success'] = true;
            $result['url'] = $url;
            $result['message'] = __('Redirect URL generated successfully', 'elementor-dynamic-redirect');
        } else {
            $result['message'] = __('No redirect URL generated. Check debug log.', 'elementor-dynamic-redirect');
        }

        // Add debug info
        $settings = EDR_Core::instance()->get_settings();
        $result['debug'] = array(
            'payment_method' => self::get_field_value($test_data, $settings['payment_field_id']),
            'team' => self::get_field_value($test_data, $settings['team_field_id']),
            'kupa' => self::get_field_value($test_data, $settings['kupa_field_id']),
            'trigger_value' => $settings['payment_trigger_value'],
            'today' => date('Y-m-d'),
        );

        return $result;
    }
}
