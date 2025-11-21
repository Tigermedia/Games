<?php
/**
 * Settings Page View
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

$settings = EDR_Core::instance()->get_settings();
$settings_updated = isset($_GET['settings-updated']) && $_GET['settings-updated'] === 'true';
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <?php if ($settings_updated): ?>
        <div class="notice notice-success is-dismissible">
            <p><?php esc_html_e('Settings saved successfully!', 'elementor-dynamic-redirect'); ?></p>
        </div>
    <?php endif; ?>

    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
        <?php wp_nonce_field('edr_save_settings', 'edr_settings_nonce'); ?>
        <input type="hidden" name="action" value="edr_save_settings">

        <table class="form-table" role="presentation">
            <tbody>
                <tr>
                    <th scope="row">
                        <label for="team_field_id"><?php esc_html_e('Team Field ID', 'elementor-dynamic-redirect'); ?></label>
                    </th>
                    <td>
                        <input type="text" name="team_field_id" id="team_field_id" value="<?php echo esc_attr($settings['team_field_id']); ?>" class="regular-text" />
                        <p class="description"><?php esc_html_e('The field ID for the team/group selection (e.g., "team")', 'elementor-dynamic-redirect'); ?></p>
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label for="kupa_field_id"><?php esc_html_e('Kupa Field ID', 'elementor-dynamic-redirect'); ?></label>
                    </th>
                    <td>
                        <input type="text" name="kupa_field_id" id="kupa_field_id" value="<?php echo esc_attr($settings['kupa_field_id']); ?>" class="regular-text" />
                        <p class="description"><?php esc_html_e('The field ID for the health fund selection (e.g., "kupa")', 'elementor-dynamic-redirect'); ?></p>
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label for="payment_field_id"><?php esc_html_e('Payment Method Field ID', 'elementor-dynamic-redirect'); ?></label>
                    </th>
                    <td>
                        <input type="text" name="payment_field_id" id="payment_field_id" value="<?php echo esc_attr($settings['payment_field_id']); ?>" class="regular-text" />
                        <p class="description"><?php esc_html_e('The field ID for the payment method selection (e.g., "payment_method")', 'elementor-dynamic-redirect'); ?></p>
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label for="payment_trigger_value"><?php esc_html_e('Payment Trigger Value', 'elementor-dynamic-redirect'); ?></label>
                    </th>
                    <td>
                        <input type="text" name="payment_trigger_value" id="payment_trigger_value" value="<?php echo esc_attr($settings['payment_trigger_value']); ?>" class="regular-text" />
                        <p class="description"><?php esc_html_e('The payment method value that triggers redirects (e.g., "אשראי")', 'elementor-dynamic-redirect'); ?></p>
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label for="form_ids"><?php esc_html_e('Form IDs', 'elementor-dynamic-redirect'); ?></label>
                    </th>
                    <td>
                        <input type="text" name="form_ids" id="form_ids" value="<?php echo esc_attr($settings['form_ids']); ?>" class="regular-text" />
                        <p class="description"><?php esc_html_e('Comma-separated list of form IDs to process (leave empty to process all forms). Example: pilatis01,girls01,hazaka', 'elementor-dynamic-redirect'); ?></p>
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label for="debug_enabled"><?php esc_html_e('Debug Mode', 'elementor-dynamic-redirect'); ?></label>
                    </th>
                    <td>
                        <label>
                            <input type="checkbox" name="debug_enabled" id="debug_enabled" value="1" <?php checked($settings['debug_enabled'], true); ?> />
                            <?php esc_html_e('Enable debug logging', 'elementor-dynamic-redirect'); ?>
                        </label>
                        <p class="description"><?php esc_html_e('When enabled, redirect logic will be logged to PHP error log', 'elementor-dynamic-redirect'); ?></p>
                    </td>
                </tr>
            </tbody>
        </table>

        <?php submit_button(); ?>
    </form>

    <div class="card" style="max-width: 1000px; margin-top: 20px;">
        <h2><?php esc_html_e('Form-Specific Redirects', 'elementor-dynamic-redirect'); ?></h2>
        <p><?php esc_html_e('The following forms have specific redirect rules configured:', 'elementor-dynamic-redirect'); ?></p>

        <h3 style="margin-top: 20px;">pilatis01 (פילאטיס) - 5 Conditions</h3>
        <p><strong>Current Account:</strong> <?php echo esc_html(isset($settings['pilatis_sumit_account']) ? $settings['pilatis_sumit_account'] : 'stern_sports'); ?></p>
        
        <h4 style="margin-left: 20px;">Stern Sports (e5bzq5):</h4>
        <ol>
            <li><strong>Team starts with "אחר"</strong> (any kupa) → <code>juakea/juaky6</code></li>
            <li><strong>Team = "סדרה קצרה" + Kupa = "מאוחדת"</strong> → <code>jdnhkh/c</code></li>
            <li><strong>Team = "סדרה ארוכה" + Kupa = "מאוחדת"</strong> → <code>jdni0u/c</code></li>
            <li><strong>Team = "סדרה ארוכה" + Kupa ≠ "מאוחדת"</strong> → <code>jdnexa/c</code></li>
            <li><strong>Team = "סדרה קצרה" + Kupa ≠ "מאוחדת"</strong> → <code>jdhga1/c</code></li>
        </ol>

        <h4 style="margin-left: 20px;">Stern Fitness (4kpof9):</h4>
        <ol>
            <li><strong>Team starts with "אחר"</strong> (any kupa) → <code>k170s1/k175aq</code></li>
            <li><strong>Team = "סדרה קצרה" + Kupa = "מאוחדת"</strong> → <code>k0v3ws/c</code></li>
            <li><strong>Team = "סדרה ארוכה" + Kupa = "מאוחדת"</strong> → <code>k0v1tn/c</code></li>
            <li><strong>Team = "סדרה ארוכה" + Kupa ≠ "מאוחדת"</strong> → <code>k0urkd/c</code></li>
            <li><strong>Team = "סדרה קצרה" + Kupa ≠ "מאוחדת"</strong> → <code>k0v3ld/c</code></li>
        </ol>

        <h3 style="margin-top: 20px;">girls01 (נערות) - CSV-Based Redirects</h3>
        <ol>
            <li><strong>Team starts with "יום ראשון"</strong> (Sunday) → Uses Sunday CSV</li>
            <li><strong>Team starts with "יום שלישי"</strong> (Tuesday) → Uses Tuesday CSV</li>
        </ol>
        <p style="padding-left: 20px;"><em>The CSV file determines the redirect URL based on the current date and Kupa selection (Partial/Full price).</em></p>

        <h3 style="margin-top: 20px;">hazaka (חזקה מבפנים) - 4 Conditions</h3>
        <ol>
            <li><strong>Team = "ערב" + Kupa ≠ "מאוחדת"</strong> → <code>jd8qad/jd8qae</code></li>
            <li><strong>Team = "ערב" + Kupa = "מאוחדת"</strong> → <code>jswwda/jswwdc</code></li>
            <li><strong>Team = "בוקר" + Kupa ≠ "מאוחדת"</strong> → <code>jszwxe/jszyda</code></li>
            <li><strong>Team = "בוקר" + Kupa = "מאוחדת"</strong> → <code>jszy01/jszzqt</code></li>
        </ol>

        <p style="margin-top: 20px; padding: 10px; background: #f0f0f1; border-left: 4px solid #2271b1;">
            <strong>Note:</strong> All redirects require payment method = "<?php echo esc_html($settings['payment_trigger_value']); ?>".
            All redirect URLs include user data parameters: name, email, phone, and ID number.
        </p>
    </div>
</div>




