<?php
/**
 * Help Page View
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <div class="card" style="max-width: 1000px;">
        <h2><?php esc_html_e('Plugin Overview', 'elementor-dynamic-redirect'); ?></h2>
        <p><?php esc_html_e('Elementor Dynamic Redirect allows you to configure conditional redirects for Elementor forms based on form field values.', 'elementor-dynamic-redirect'); ?></p>
    </div>

    <div class="card" style="max-width: 1000px; margin-top: 20px;">
        <h2><?php esc_html_e('Form-Specific Redirects', 'elementor-dynamic-redirect'); ?></h2>
        <p><?php esc_html_e('The following forms have specific redirect rules:', 'elementor-dynamic-redirect'); ?></p>
        
        <h3>pilatis01</h3>
        <ul>
            <li><?php esc_html_e('Condition 01: Team contains "סדרה קצרה" (any kupa) → jdhga1', 'elementor-dynamic-redirect'); ?></li>
            <li><?php esc_html_e('Condition 02: Kupa is NOT "מאוחדת" AND team contains "סדרה ארוכה" → jdnexa', 'elementor-dynamic-redirect'); ?></li>
            <li><?php esc_html_e('Condition 03: Kupa is "מאוחדת" AND team contains "סדרה ארוכה" → jdni0u', 'elementor-dynamic-redirect'); ?></li>
        </ul>

        <h3>girls01</h3>
        <ul>
            <li><?php esc_html_e('Series redirects: סדרה קצרה/ארוכה with kupa-based URL selection', 'elementor-dynamic-redirect'); ?></li>
            <li><?php esc_html_e('CSV-based redirects: Day-based redirects (יום ראשון/יום שלישי)', 'elementor-dynamic-redirect'); ?></li>
        </ul>

        <h3>hazaka</h3>
        <ul>
            <li><?php esc_html_e('Condition 01: Team is "ערב" AND kupa is NOT "מאוחדת" → jd8qad/jd8qae', 'elementor-dynamic-redirect'); ?></li>
            <li><?php esc_html_e('Condition 02: Team is "ערב" AND kupa is "מאוחדת" → jswwda/jswwdc', 'elementor-dynamic-redirect'); ?></li>
            <li><?php esc_html_e('Condition 03: Team is "בוקר" AND kupa is NOT "מאוחדת" → jszwxe/jszyda', 'elementor-dynamic-redirect'); ?></li>
            <li><?php esc_html_e('Condition 04: Team is "בוקר" AND kupa is "מאוחדת" → jszy01/jszzqt', 'elementor-dynamic-redirect'); ?></li>
        </ul>
    </div>

    <div class="card" style="max-width: 1000px; margin-top: 20px;">
        <h2><?php esc_html_e('Settings', 'elementor-dynamic-redirect'); ?></h2>
        <ul>
            <li><strong><?php esc_html_e('Form IDs:', 'elementor-dynamic-redirect'); ?></strong> <?php esc_html_e('Leave empty to process all forms, or specify comma-separated form IDs (e.g., pilatis01,girls01,hazaka)', 'elementor-dynamic-redirect'); ?></li>
            <li><strong><?php esc_html_e('Debug Mode:', 'elementor-dynamic-redirect'); ?></strong> <?php esc_html_e('Enable to log redirect logic to PHP error log for troubleshooting', 'elementor-dynamic-redirect'); ?></li>
        </ul>
    </div>

    <div class="card" style="max-width: 1000px; margin-top: 20px;">
        <h2><?php esc_html_e('Troubleshooting', 'elementor-dynamic-redirect'); ?></h2>
        <ul>
            <li><?php esc_html_e('If redirects are not working, check that the form ID matches exactly (case-sensitive)', 'elementor-dynamic-redirect'); ?></li>
            <li><?php esc_html_e('Enable Debug Mode to see detailed logs in PHP error log', 'elementor-dynamic-redirect'); ?></li>
            <li><?php esc_html_e('Use the Testing Tool to verify redirect logic without submitting actual forms', 'elementor-dynamic-redirect'); ?></li>
            <li><?php esc_html_e('Ensure payment method matches the trigger value exactly (usually "אשראי")', 'elementor-dynamic-redirect'); ?></li>
        </ul>
    </div>
</div>




