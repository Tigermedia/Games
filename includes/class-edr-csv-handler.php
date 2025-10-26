<?php
/**
 * CSV File Handler
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * EDR_CSV_Handler Class
 */
class EDR_CSV_Handler {

    /**
     * Parse CSV file
     *
     * @param string $file_path Path to CSV file
     * @return array|WP_Error Parsed CSV data or error
     */
    public static function parse_csv($file_path) {
        // Check if file exists
        if (!file_exists($file_path)) {
            return new WP_Error('file_not_found', __('CSV file not found', 'elementor-dynamic-redirect'));
        }

        // Try to get from cache first
        $cache_key = 'edr_csv_' . md5($file_path);
        $cached = get_transient($cache_key);

        if ($cached !== false) {
            EDR_Core::log('CSV loaded from cache', $file_path);
            return $cached;
        }

        // Parse CSV
        $csv_data = array();
        $headers = array();

        if (($handle = fopen($file_path, 'r')) !== false) {
            // Get headers from first row
            $headers = fgetcsv($handle, 0, ',');

            // Get data rows
            while (($row = fgetcsv($handle, 0, ',')) !== false) {
                if (count($row) === count($headers)) {
                    $csv_data[] = array_combine($headers, $row);
                }
            }

            fclose($handle);
        } else {
            return new WP_Error('cannot_read', __('Cannot read CSV file', 'elementor-dynamic-redirect'));
        }

        // Cache for 1 hour
        set_transient($cache_key, $csv_data, HOUR_IN_SECONDS);

        EDR_Core::log('CSV parsed and cached', array(
            'file' => $file_path,
            'rows' => count($csv_data)
        ));

        return $csv_data;
    }

    /**
     * Find row by date
     *
     * @param array $csv_data Parsed CSV data
     * @param string $date Date to find (Y-m-d format)
     * @param string $date_column Column name containing dates
     * @return array|null Matching row or null
     */
    public static function find_row_by_date($csv_data, $date, $date_column = 'date') {
        if (empty($csv_data)) {
            return null;
        }

        foreach ($csv_data as $row) {
            if (!isset($row[$date_column])) {
                continue;
            }

            // Parse the date from the CSV
            $row_date = self::parse_date($row[$date_column]);

            if ($row_date && $row_date === $date) {
                EDR_Core::log('Found matching row for date', array(
                    'date' => $date,
                    'row' => $row
                ));
                return $row;
            }
        }

        EDR_Core::log('No matching row found for date', $date);
        return null;
    }

    /**
     * Parse date from various formats
     *
     * @param string $date_string Date string
     * @return string|false Formatted date (Y-m-d) or false
     */
    private static function parse_date($date_string) {
        // Try common date formats
        $formats = array(
            'Y-m-d',
            'd/m/Y',
            'm/d/Y',
            'd-m-Y',
            'Y/m/d',
        );

        foreach ($formats as $format) {
            $date = DateTime::createFromFormat($format, trim($date_string));
            if ($date !== false) {
                return $date->format('Y-m-d');
            }
        }

        // Try strtotime as fallback
        $timestamp = strtotime($date_string);
        if ($timestamp !== false) {
            return date('Y-m-d', $timestamp);
        }

        return false;
    }

    /**
     * Validate CSV structure
     *
     * @param string $file_path Path to CSV file
     * @param array $required_columns Required column names
     * @return true|WP_Error True if valid, error otherwise
     */
    public static function validate_csv_structure($file_path, $required_columns = array()) {
        if (!file_exists($file_path)) {
            return new WP_Error('file_not_found', __('CSV file not found', 'elementor-dynamic-redirect'));
        }

        $handle = fopen($file_path, 'r');
        if ($handle === false) {
            return new WP_Error('cannot_read', __('Cannot read CSV file', 'elementor-dynamic-redirect'));
        }

        // Get headers
        $headers = fgetcsv($handle, 0, ',');
        fclose($handle);

        if (empty($headers)) {
            return new WP_Error('empty_file', __('CSV file is empty', 'elementor-dynamic-redirect'));
        }

        // Check required columns
        if (!empty($required_columns)) {
            $missing = array_diff($required_columns, $headers);
            if (!empty($missing)) {
                return new WP_Error(
                    'missing_columns',
                    sprintf(
                        __('Missing required columns: %s', 'elementor-dynamic-redirect'),
                        implode(', ', $missing)
                    )
                );
            }
        }

        return true;
    }

    /**
     * Upload CSV file
     *
     * @param array $file $_FILES array element
     * @param string $filename Target filename
     * @return string|WP_Error File path on success, error on failure
     */
    public static function upload_csv($file, $filename) {
        // Validate file type
        $allowed_types = array('text/csv', 'text/plain', 'application/csv');
        $file_type = wp_check_filetype($file['name']);

        if (!in_array($file['type'], $allowed_types) && $file_type['ext'] !== 'csv') {
            return new WP_Error('invalid_type', __('Only CSV files are allowed', 'elementor-dynamic-redirect'));
        }

        // Get upload directory
        $upload_dir = wp_upload_dir();
        $edr_dir = $upload_dir['basedir'] . '/class-schedules';

        // Create directory if it doesn't exist
        if (!file_exists($edr_dir)) {
            wp_mkdir_p($edr_dir);

            // Add .htaccess for security
            $htaccess_content = 'Options -Indexes' . PHP_EOL . 'deny from all';
            file_put_contents($edr_dir . '/.htaccess', $htaccess_content);
        }

        // Sanitize filename
        $filename = sanitize_file_name($filename);
        if (!str_ends_with($filename, '.csv')) {
            $filename .= '.csv';
        }

        $target_path = $edr_dir . '/' . $filename;

        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $target_path)) {
            // Clear cache for this file
            $cache_key = 'edr_csv_' . md5($target_path);
            delete_transient($cache_key);

            EDR_Core::log('CSV uploaded successfully', $target_path);
            return $target_path;
        }

        return new WP_Error('upload_failed', __('Failed to upload CSV file', 'elementor-dynamic-redirect'));
    }

    /**
     * Delete CSV file
     *
     * @param string $file_path Path to file
     * @return bool True on success, false on failure
     */
    public static function delete_csv($file_path) {
        if (!file_exists($file_path)) {
            return false;
        }

        // Clear cache
        $cache_key = 'edr_csv_' . md5($file_path);
        delete_transient($cache_key);

        return unlink($file_path);
    }

    /**
     * Get CSV info
     *
     * @param string $file_path Path to file
     * @return array File information
     */
    public static function get_csv_info($file_path) {
        if (!file_exists($file_path)) {
            return array(
                'exists' => false,
                'size' => 0,
                'modified' => '',
                'rows' => 0,
            );
        }

        $csv_data = self::parse_csv($file_path);
        $row_count = is_array($csv_data) ? count($csv_data) : 0;

        return array(
            'exists' => true,
            'size' => filesize($file_path),
            'modified' => date('Y-m-d H:i:s', filemtime($file_path)),
            'rows' => $row_count,
            'path' => $file_path,
        );
    }

    /**
     * Clear all CSV caches
     */
    public static function clear_all_caches() {
        global $wpdb;
        $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_edr_csv_%'");
        $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_edr_csv_%'");

        EDR_Core::log('All CSV caches cleared');
    }
}
