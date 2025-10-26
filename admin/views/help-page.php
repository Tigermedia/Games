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

<div class="wrap edr-admin-wrap">
    <h1><?php esc_html_e('Help & Documentation', 'elementor-dynamic-redirect'); ?></h1>

    <div class="edr-admin-content">
        <div class="edr-help-section">
            <h2><?php esc_html_e('Quick Start Guide', 'elementor-dynamic-redirect'); ?></h2>

            <ol>
                <li>
                    <strong><?php esc_html_e('Configure Field IDs', 'elementor-dynamic-redirect'); ?></strong>
                    <p><?php esc_html_e('Go to Settings and configure the Elementor form field IDs for team, kupa, and payment method.', 'elementor-dynamic-redirect'); ?></p>
                </li>
                <li>
                    <strong><?php esc_html_e('Upload CSV Files', 'elementor-dynamic-redirect'); ?></strong>
                    <p><?php esc_html_e('Go to CSV Manager and upload your Sunday and Tuesday class schedule CSV files.', 'elementor-dynamic-redirect'); ?></p>
                </li>
                <li>
                    <strong><?php esc_html_e('Test the Setup', 'elementor-dynamic-redirect'); ?></strong>
                    <p><?php esc_html_e('Use the Testing Tool to verify that redirects are generated correctly.', 'elementor-dynamic-redirect'); ?></p>
                </li>
                <li>
                    <strong><?php esc_html_e('Add to Your Forms', 'elementor-dynamic-redirect'); ?></strong>
                    <p><?php esc_html_e('The plugin will automatically hook into Elementor Pro forms. No additional configuration needed!', 'elementor-dynamic-redirect'); ?></p>
                </li>
            </ol>
        </div>

        <hr>

        <div class="edr-help-section">
            <h2><?php esc_html_e('CSV File Format', 'elementor-dynamic-redirect'); ?></h2>

            <p><?php esc_html_e('Your CSV files must have these columns:', 'elementor-dynamic-redirect'); ?></p>

            <table class="widefat">
                <thead>
                    <tr>
                        <th><?php esc_html_e('Column Name', 'elementor-dynamic-redirect'); ?></th>
                        <th><?php esc_html_e('Description', 'elementor-dynamic-redirect'); ?></th>
                        <th><?php esc_html_e('Example', 'elementor-dynamic-redirect'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>date</code></td>
                        <td><?php esc_html_e('Date in YYYY-MM-DD format', 'elementor-dynamic-redirect'); ?></td>
                        <td><code>2025-10-26</code></td>
                    </tr>
                    <tr>
                        <td><code>link_full</code></td>
                        <td><?php esc_html_e('URL for "מלא" option', 'elementor-dynamic-redirect'); ?></td>
                        <td><code>https://payment.com/charge?name=[field id="first_name"]</code></td>
                    </tr>
                    <tr>
                        <td><code>link_partial</code></td>
                        <td><?php esc_html_e('URL for "מאוחדת" option', 'elementor-dynamic-redirect'); ?></td>
                        <td><code>https://payment.com/charge?name=[field id="first_name"]</code></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <hr>

        <div class="edr-help-section">
            <h2><?php esc_html_e('URL Placeholders', 'elementor-dynamic-redirect'); ?></h2>

            <p><?php esc_html_e('You can use placeholders in your URLs that will be replaced with form data:', 'elementor-dynamic-redirect'); ?></p>

            <ul>
                <li><code>[field id="first_name"]</code> - <?php esc_html_e('Replaced with the first name field value', 'elementor-dynamic-redirect'); ?></li>
                <li><code>[field id="last_name"]</code> - <?php esc_html_e('Replaced with the last name field value', 'elementor-dynamic-redirect'); ?></li>
                <li><code>[field id="email"]</code> - <?php esc_html_e('Replaced with the email field value', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Any other field ID from your Elementor form', 'elementor-dynamic-redirect'); ?></li>
            </ul>

            <p><strong><?php esc_html_e('Example URL:', 'elementor-dynamic-redirect'); ?></strong></p>
            <pre>https://payment.com/charge?name=[field id="first_name"]&email=[field id="email"]&amount=100</pre>
        </div>

        <hr>

        <div class="edr-help-section">
            <h2><?php esc_html_e('How It Works', 'elementor-dynamic-redirect'); ?></h2>

            <ol>
                <li><?php esc_html_e('User submits an Elementor form', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Plugin checks if payment method equals the trigger value (e.g., "אשראי")', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('If yes, plugin determines which CSV to use based on team field', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Plugin finds today\'s date in the CSV', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Plugin selects URL column based on kupa field (link_full or link_partial)', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Plugin replaces placeholders with actual form data', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('User is redirected to the generated URL', 'elementor-dynamic-redirect'); ?></li>
            </ol>
        </div>

        <hr>

        <div class="edr-help-section">
            <h2><?php esc_html_e('Troubleshooting', 'elementor-dynamic-redirect'); ?></h2>

            <h3><?php esc_html_e('Redirect not working?', 'elementor-dynamic-redirect'); ?></h3>
            <ul>
                <li><?php esc_html_e('Check that CSV files are uploaded', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Verify that today\'s date exists in the CSV', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Ensure field IDs match your Elementor form', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Check payment method matches trigger value exactly', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Enable debug logging in Settings and check error_log', 'elementor-dynamic-redirect'); ?></li>
            </ul>

            <h3><?php esc_html_e('CSV upload fails?', 'elementor-dynamic-redirect'); ?></h3>
            <ul>
                <li><?php esc_html_e('Ensure file is in CSV format', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Check that uploads directory is writable', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Verify CSV has correct column headers', 'elementor-dynamic-redirect'); ?></li>
            </ul>
        </div>

        <hr>

        <div class="edr-info-box">
            <h3><?php esc_html_e('Plugin Information', 'elementor-dynamic-redirect'); ?></h3>
            <ul>
                <li><strong><?php esc_html_e('Version:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html(EDR_VERSION); ?></li>
                <li><strong><?php esc_html_e('Repository:', 'elementor-dynamic-redirect'); ?></strong> <a href="https://github.com/Tigermedia/elementor-form-dynamic-redirect" target="_blank">GitHub</a></li>
            </ul>
        </div>
    </div>
</div>
