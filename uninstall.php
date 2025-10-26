<?php
/**
 * Uninstall Script
 *
 * @package Elementor_Dynamic_Redirect
 */

// If uninstall not called from WordPress, exit
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// Delete plugin options
delete_option('edr_settings');
delete_option('edr_version');

// Delete all transients
global $wpdb;
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_edr_%'");
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_edr_%'");
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_elementor_redirect_%'");
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_elementor_redirect_%'");

// Optionally delete CSV files (uncomment if you want to remove uploaded files on uninstall)
// $upload_dir = wp_upload_dir();
// $edr_dir = $upload_dir['basedir'] . '/class-schedules';
// if (file_exists($edr_dir)) {
//     // Delete all files in directory
//     $files = glob($edr_dir . '/*');
//     foreach ($files as $file) {
//         if (is_file($file)) {
//             unlink($file);
//         }
//     }
//     // Remove directory
//     rmdir($edr_dir);
// }
