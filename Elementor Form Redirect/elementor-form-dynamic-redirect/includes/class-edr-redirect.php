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
     * @param string $custom_date Optional custom date (Y-m-d format) for testing
     * @return string|null Redirect URL or null if no redirect needed
     */
    public static function get_redirect_url($form_data, $custom_date = null) {
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

        // Check for form-specific redirects first (highest priority)
        $form_redirect = self::get_form_specific_redirect($form_data, $team, $kupa);
        if ($form_redirect) {
            $final_url = self::replace_placeholders($form_redirect, $form_data);
            EDR_Core::log('Generated form-specific redirect URL', array(
                'form_id' => isset($form_data['_form_id']) ? $form_data['_form_id'] : 'unknown',
                'form_name' => isset($form_data['_form_name']) ? $form_data['_form_name'] : 'unknown',
                'template' => $form_redirect,
                'final' => $final_url,
            ));
            return $final_url;
        }

        // CSV-based redirect logic (only for girls01 form)
        // Get form identification
        $form_id = isset($form_data['_form_id']) ? $form_data['_form_id'] : '';
        $form_name = isset($form_data['_form_name']) ? $form_data['_form_name'] : '';

        // CSV redirects are only for girls01 form (check by name since ID may vary)
        if ($form_name !== 'נערות') {
            EDR_Core::log('CSV redirects only available for girls01 (נערות) form', array(
                'form_id' => $form_id,
                'form_name' => $form_name,
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

        // Use custom date if provided, otherwise use today's date
        $target_date = $custom_date ? $custom_date : date('Y-m-d');

        // Find matching row by date (try both 'date' and 'תאריך' columns)
        $row = EDR_CSV_Handler::find_row_by_date($csv_data, $target_date, 'date');
        if (!$row) {
            // Try Hebrew column name
            $row = EDR_CSV_Handler::find_row_by_date($csv_data, $target_date, 'תאריך ');
        }

        if (!$row) {
            EDR_Core::log('No matching row found for date', $target_date);
            return null;
        }

        // Determine which column to use based on kupa
        $column = self::get_column_for_kupa($kupa, $row);
        if (!$column || !isset($row[$column])) {
            EDR_Core::log('Invalid kupa or missing column', array(
                'kupa' => $kupa,
                'column' => $column,
                'available_columns' => array_keys($row),
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
     * Logic: If kupa contains "מאוחדת" → partial, otherwise → full
     * Supports both English and Hebrew column names
     *
     * @param string $kupa Kupa value
     * @param array $row CSV row to check available columns
     * @return string Column name
     */
    private static function get_column_for_kupa($kupa, $row = array()) {
        $kupa = trim($kupa);

        // Check for "מאוחדת" (united/partial) - if found, use partial
        if (stripos($kupa, 'מאוחדת') !== false || stripos($kupa, 'united') !== false || stripos($kupa, 'partial') !== false) {
            EDR_Core::log('Kupa matched to partial', $kupa);

            // Try Hebrew column name first, then English
            if (!empty($row) && isset($row['Link מאוחדת '])) {
                return 'Link מאוחדת ';
            }
            return 'link_partial';
        }

        // Everything else (including "מלא", "full", or any other value) → full
        EDR_Core::log('Kupa matched to full (default)', $kupa);

        // Try Hebrew column name first, then English
        if (!empty($row) && isset($row['Link מחיר מלא '])) {
            return 'Link מחיר מלא ';
        }
        return 'link_full';
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
     * @param string $custom_date Optional custom date for testing
     * @return array Result with URL and debug info
     */
    public static function test_redirect($test_data, $custom_date = null) {
        $result = array(
            'success' => false,
            'url' => '',
            'message' => '',
            'debug' => array(),
        );

        // Get settings
        $settings = EDR_Core::instance()->get_settings();
        $target_date = $custom_date ? $custom_date : date('Y-m-d');

        // Extract field values
        $payment_method = self::get_field_value($test_data, $settings['payment_field_id']);
        $team = self::get_field_value($test_data, $settings['team_field_id']);
        $kupa = self::get_field_value($test_data, $settings['kupa_field_id']);

        // Detailed debug info
        $debug = array(
            'payment_method' => $payment_method,
            'team' => $team,
            'kupa' => $kupa,
            'trigger_value' => $settings['payment_trigger_value'],
            'test_date' => $target_date,
            'payment_match' => ($payment_method === $settings['payment_trigger_value']),
        );

        // Check payment method
        if ($payment_method !== $settings['payment_trigger_value']) {
            $result['message'] = sprintf(
                __('Payment method "%s" does not match trigger value "%s"', 'elementor-dynamic-redirect'),
                $payment_method,
                $settings['payment_trigger_value']
            );
            $result['debug'] = $debug;
            return $result;
        }

        // Check for series classes (static redirects that don't need CSV)
        $is_partial_kupa = (stripos($kupa, 'מאוחדת') !== false);
        $is_short_series = (stripos($team, 'סדרה קצרה') !== false);
        $is_long_series = (stripos($team, 'סדרה ארוכה') !== false);

        $debug['is_partial_kupa'] = $is_partial_kupa;
        $debug['is_short_series'] = $is_short_series;
        $debug['is_long_series'] = $is_long_series;

        if ($is_short_series || $is_long_series) {
            $series_type = $is_short_series ? 'short' : 'long';
            $kupa_type = $is_partial_kupa ? 'partial (מאוחדת)' : 'full';

            $debug['redirect_type'] = 'series';
            $debug['series_type'] = $series_type;
            $debug['kupa_type'] = $kupa_type;

            // Get redirect URL (will use series logic)
            $url = self::get_redirect_url($test_data, $custom_date);

            if ($url) {
                $result['success'] = true;
                $result['url'] = $url;
                $result['message'] = sprintf(
                    __('Series redirect generated successfully (%s series, %s)', 'elementor-dynamic-redirect'),
                    $series_type,
                    $kupa_type
                );
            } else {
                $result['message'] = __('No redirect URL generated for series. Unknown error.', 'elementor-dynamic-redirect');
            }

            $result['debug'] = $debug;
            return $result;
        }

        // Not a series, so continue with CSV-based redirect logic
        $debug['redirect_type'] = 'csv';

        // CSV redirects only for girls01 form (check by name since ID may vary)
        $form_id = isset($test_data['_form_id']) ? $test_data['_form_id'] : '';
        $form_name = isset($test_data['_form_name']) ? $test_data['_form_name'] : '';
        $debug['form_id'] = $form_id;
        $debug['form_name'] = $form_name;

        if ($form_name !== 'נערות') {
            $result['message'] = __('CSV redirects are only available for girls01 (נערות) form', 'elementor-dynamic-redirect');
            $result['debug'] = $debug;
            return $result;
        }

        // Get CSV path
        $csv_path = self::get_csv_path_for_team($team, $settings);
        $debug['csv_path'] = $csv_path;

        // Check if path is URL or file
        $is_url = (strpos($csv_path, 'http://') === 0 || strpos($csv_path, 'https://') === 0);
        $debug['csv_is_url'] = $is_url;
        $debug['csv_exists'] = $csv_path ? ($is_url ? true : file_exists($csv_path)) : false;

        if (!$csv_path) {
            $result['message'] = sprintf(
                __('Could not determine CSV file for team "%s". Expected "ראשון"/"sunday" or "שלישי"/"tuesday"', 'elementor-dynamic-redirect'),
                $team
            );
            $debug['sunday_csv'] = $settings['sunday_csv_path'];
            $debug['tuesday_csv'] = $settings['tuesday_csv_path'];
            $result['debug'] = $debug;
            return $result;
        }

        // Only check file_exists for local paths, not URLs
        if (!$is_url && !file_exists($csv_path)) {
            $result['message'] = sprintf(
                __('CSV file not found: %s', 'elementor-dynamic-redirect'),
                $csv_path
            );
            $result['debug'] = $debug;
            return $result;
        }

        // Parse CSV
        $csv_data = EDR_CSV_Handler::parse_csv($csv_path);
        if (is_wp_error($csv_data)) {
            $result['message'] = sprintf(
                __('Error parsing CSV: %s', 'elementor-dynamic-redirect'),
                $csv_data->get_error_message()
            );
            $result['debug'] = $debug;
            return $result;
        }

        $debug['csv_rows'] = count($csv_data);
        $debug['csv_first_row'] = !empty($csv_data) ? $csv_data[0] : null;

        // Find row by date (try both 'date' and 'תאריך' columns)
        $row = EDR_CSV_Handler::find_row_by_date($csv_data, $target_date, 'date');
        if (!$row) {
            // Try Hebrew column name
            $row = EDR_CSV_Handler::find_row_by_date($csv_data, $target_date, 'תאריך ');
        }
        $debug['row_found'] = !empty($row);

        if (!$row) {
            $result['message'] = sprintf(
                __('No lesson found on or after date %s in CSV', 'elementor-dynamic-redirect'),
                $target_date
            );
            $result['debug'] = $debug;
            return $result;
        }

        $debug['matched_row'] = $row;

        // Get column for kupa
        $column = self::get_column_for_kupa($kupa, $row);
        $debug['column'] = $column;
        $debug['column_exists'] = $column && isset($row[$column]);

        if (!$column || !isset($row[$column])) {
            $result['message'] = sprintf(
                __('Invalid kupa "%s" or missing column "%s" in CSV', 'elementor-dynamic-redirect'),
                $kupa,
                $column
            );
            $result['debug'] = $debug;
            return $result;
        }

        // Get redirect URL
        $url = self::get_redirect_url($test_data, $custom_date);

        if ($url) {
            $result['success'] = true;
            $result['url'] = $url;
            $result['message'] = __('Redirect URL generated successfully', 'elementor-dynamic-redirect');
        } else {
            $result['message'] = __('No redirect URL generated. Unknown error.', 'elementor-dynamic-redirect');
        }

        $result['debug'] = $debug;
        return $result;
    }

    /**
     * Get form-specific redirect URL template
     *
     * @param array $form_data Form submission data including form metadata
     * @param string $team Team field value
     * @param string $kupa Kupa field value
     * @return string|null URL template or null if no form-specific redirect
     */
    private static function get_form_specific_redirect($form_data, $team, $kupa) {
        // Get form identification
        $form_id = isset($form_data['_form_id']) ? $form_data['_form_id'] : '';
        $form_name = isset($form_data['_form_name']) ? $form_data['_form_name'] : '';

        EDR_Core::log('Checking form-specific redirects', array(
            'form_id' => $form_id,
            'form_name' => $form_name,
            'team' => $team,
            'kupa' => $kupa,
        ));

        // Pilatis form (pilatis01 / פילאטיס) - specific redirects
        if ($form_id === 'pilatis01' || $form_name === 'פילאטיס') {
            $is_partial = (stripos($kupa, 'מאוחדת') !== false);
            $is_short = (stripos($team, 'סדרה קצרה') !== false);
            $is_long = (stripos($team, 'סדרה ארוכה') !== false);
            $is_other = (stripos($team, 'אחר') === 0); // Starts with "אחר"

            // Get selected Sumit account from settings
            $settings = EDR_Core::instance()->get_settings();
            $sumit_account = isset($settings['pilatis_sumit_account']) ? $settings['pilatis_sumit_account'] : 'stern_sports';

            EDR_Core::log('Pilatis form detected', array(
                'is_partial' => $is_partial,
                'is_short' => $is_short,
                'is_long' => $is_long,
                'is_other' => $is_other,
                'sumit_account' => $sumit_account,
            ));

            // Define URL mappings for each account
            $url_maps = array(
                'stern_sports' => array(
                    'base' => 'e5bzq5',
                    'other_any' => 'juakea/juaky6',
                    'short_partial' => 'jdnhkh/c',
                    'long_partial' => 'jdni0u/c',
                    'long_full' => 'jdnexa/c',
                    'short_full' => 'jdhga1/c',
                ),
                'stern_fitness' => array(
                    'base' => '4kpof9',
                    'other_any' => 'k170s1/k175aq',
                    'short_partial' => 'k0v3ws/c',
                    'long_partial' => 'k0v1tn/c',
                    'long_full' => 'k0urkd/c',
                    'short_full' => 'k0v3ld/c',
                ),
            );

            // Get URLs for selected account
            $urls = $url_maps[$sumit_account];
            $base = $urls['base'];

            // Condition 00: team starts with "אחר" (any kupa) - CHECKED FIRST
            if ($is_other) {
                EDR_Core::log('Pilatis: Condition 00 matched (אחר)');
                return 'https://pay.sumit.co.il/' . $base . '/' . $urls['other_any'] . '/payment/?name=[field id="first_name"]%20[field id="last_name"]&emailaddress=[field id="email"]&phone=[field id="parents_phone"]&companynumber=[field id="id_number"]';
            }

            // Condition 01: kupa is "מאוחדת" AND team contains "סדרה קצרה"
            if ($is_partial && $is_short) {
                EDR_Core::log('Pilatis: Condition 01 matched (מאוחדת + סדרה קצרה)');
                return 'https://pay.sumit.co.il/' . $base . '/' . $urls['short_partial'] . '/payment/?additems=1&name=[field id="first_name"]%20[field id="last_name"]&emailaddress=[field id="email"]&phone=[field id="parents_phone"]&companynumber=[field id="id_number"]';
            }

            // Condition 02: kupa is "מאוחדת" AND team contains "סדרה ארוכה"
            if ($is_partial && $is_long) {
                EDR_Core::log('Pilatis: Condition 02 matched (מאוחדת + סדרה ארוכה)');
                return 'https://pay.sumit.co.il/' . $base . '/' . $urls['long_partial'] . '/payment/?additems=1&name=[field id="first_name"]%20[field id="last_name"]&emailaddress=[field id="email"]&phone=[field id="parents_phone"]&companynumber=[field id="id_number"]';
            }

            // Condition 03: kupa is NOT "מאוחדת" AND team contains "סדרה ארוכה"
            if (!$is_partial && $is_long) {
                EDR_Core::log('Pilatis: Condition 03 matched (NOT מאוחדת + סדרה ארוכה)');
                return 'https://pay.sumit.co.il/' . $base . '/' . $urls['long_full'] . '/payment/?additems=1&name=[field id="first_name"]%20[field id="last_name"]&emailaddress=[field id="email"]&phone=[field id="parents_phone"]&companynumber=[field id="id_number"]';
            }

            // Condition 04: kupa is NOT "מאוחדת" AND team contains "סדרה קצרה"
            if (!$is_partial && $is_short) {
                EDR_Core::log('Pilatis: Condition 04 matched (NOT מאוחדת + סדרה קצרה)');
                return 'https://pay.sumit.co.il/' . $base . '/' . $urls['short_full'] . '/payment/?additems=1&name=[field id="first_name"]%20[field id="last_name"]&emailaddress=[field id="email"]&phone=[field id="parents_phone"]&companynumber=[field id="id_number"]';
            }

            EDR_Core::log('Pilatis form detected but no conditions matched');
        }

        // Girls01 form (נערות) - CSV redirects
        if ($form_id === 'girls01' || $form_name === 'נערות') {
            EDR_Core::log('Girls01 form detected - proceeding to CSV redirect logic');
            // No specific series logic here anymore, falls through to CSV logic below
        }

        // Hazaka form (hazaka) - specific redirects
        // Check both form_id and form_name to be more flexible (including Hebrew "חזקה")
        if ($form_id === 'hazaka' || $form_name === 'hazaka' ||
            stripos($form_id, 'hazaka') !== false || stripos($form_name, 'hazaka') !== false ||
            stripos($form_name, 'חזקה') !== false) {
            $is_partial = (stripos($kupa, 'מאוחדת') !== false);
            $is_evening = (stripos($team, 'ערב') !== false);
            $is_morning = (stripos($team, 'בוקר') !== false);

            EDR_Core::log('Hazaka form detected', array(
                'form_id' => $form_id,
                'form_name' => $form_name,
                'is_partial' => $is_partial,
                'is_evening' => $is_evening,
                'is_morning' => $is_morning,
                'team' => $team,
                'kupa' => $kupa,
            ));

            // Condition 01: team is "ערב" AND kupa is NOT "מאוחדת"
            if ($is_evening && !$is_partial) {
                EDR_Core::log('Hazaka: Condition 01 matched (ערב + NOT מאוחדת)');
                return 'https://pay.sumit.co.il/e5bzq5/jd8qad/jd8qae/payment/?name=[field id="first_name"]%20[field id="last_name"]&emailaddress=[field id="email"]&phone=[field id="parents_phone"]&companynumber=[field id="id_number"]';
            }

            // Condition 02: team is "ערב" AND kupa is "מאוחדת"
            if ($is_evening && $is_partial) {
                EDR_Core::log('Hazaka: Condition 02 matched (ערב + מאוחדת)');
                return 'https://pay.sumit.co.il/e5bzq5/jswwda/jswwdc/payment/?name=[field id="first_name"]%20[field id="last_name"]&emailaddress=[field id="email"]&phone=[field id="parents_phone"]&companynumber=[field id="id_number"]';
            }

            // Condition 03: team is "בוקר" AND kupa is NOT "מאוחדת"
            if ($is_morning && !$is_partial) {
                EDR_Core::log('Hazaka: Condition 03 matched (בוקר + NOT מאוחדת)');
                return 'https://pay.sumit.co.il/e5bzq5/jszwxe/jszyda/payment/?name=[field id="first_name"]%20[field id="last_name"]&emailaddress=[field id="email"]&phone=[field id="parents_phone"]&companynumber=[field id="id_number"]';
            }

            // Condition 04: team is "בוקר" AND kupa is "מאוחדת"
            if ($is_morning && $is_partial) {
                EDR_Core::log('Hazaka: Condition 04 matched (בוקר + מאוחדת)');
                return 'https://pay.sumit.co.il/e5bzq5/jszy01/jszzqt/payment/?name=[field id="first_name"]%20[field id="last_name"]&emailaddress=[field id="email"]&phone=[field id="parents_phone"]&companynumber=[field id="id_number"]';
            }

            EDR_Core::log('Hazaka form detected but no conditions matched');
        }

        // No form-specific redirect found
        return null;
    }
}
