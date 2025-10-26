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
?>

<div class="wrap edr-admin-wrap">
    <h1><?php esc_html_e('Elementor Dynamic Redirect Settings', 'elementor-dynamic-redirect'); ?></h1>

    <?php if (isset($_GET['settings-updated']) && $_GET['settings-updated'] === 'true') : ?>
        <div class="notice notice-success is-dismissible">
            <p><?php esc_html_e('Settings saved successfully.', 'elementor-dynamic-redirect'); ?></p>
        </div>
    <?php endif; ?>

    <div class="edr-admin-content">
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <input type="hidden" name="action" value="edr_save_settings">
            <?php wp_nonce_field('edr_save_settings', 'edr_settings_nonce'); ?>

            <table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row">
                            <label for="team_field_id"><?php esc_html_e('Team Field ID', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <input type="text"
                                   name="team_field_id"
                                   id="team_field_id"
                                   value="<?php echo esc_attr($settings['team_field_id']); ?>"
                                   class="regular-text">
                            <p class="description">
                                <?php esc_html_e('The Elementor form field ID for the team selection (e.g., "team")', 'elementor-dynamic-redirect'); ?>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="kupa_field_id"><?php esc_html_e('Kupa Field ID', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <input type="text"
                                   name="kupa_field_id"
                                   id="kupa_field_id"
                                   value="<?php echo esc_attr($settings['kupa_field_id']); ?>"
                                   class="regular-text">
                            <p class="description">
                                <?php esc_html_e('The Elementor form field ID for the kupa selection (e.g., "kupa")', 'elementor-dynamic-redirect'); ?>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="payment_field_id"><?php esc_html_e('Payment Method Field ID', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <input type="text"
                                   name="payment_field_id"
                                   id="payment_field_id"
                                   value="<?php echo esc_attr($settings['payment_field_id']); ?>"
                                   class="regular-text">
                            <p class="description">
                                <?php esc_html_e('The Elementor form field ID for payment method (e.g., "payment_method")', 'elementor-dynamic-redirect'); ?>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="payment_trigger_value"><?php esc_html_e('Payment Trigger Value', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <input type="text"
                                   name="payment_trigger_value"
                                   id="payment_trigger_value"
                                   value="<?php echo esc_attr($settings['payment_trigger_value']); ?>"
                                   class="regular-text">
                            <p class="description">
                                <?php esc_html_e('The value that triggers redirect (e.g., "אשראי" for credit card)', 'elementor-dynamic-redirect'); ?>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="sunday_csv_path"><?php esc_html_e('Sunday CSV Path', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <input type="text"
                                   name="sunday_csv_path"
                                   id="sunday_csv_path"
                                   value="<?php echo esc_attr($settings['sunday_csv_path']); ?>"
                                   class="large-text"
                                   readonly>
                            <p class="description">
                                <?php esc_html_e('Path to Sunday classes CSV file. Upload via CSV Manager.', 'elementor-dynamic-redirect'); ?>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="tuesday_csv_path"><?php esc_html_e('Tuesday CSV Path', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <input type="text"
                                   name="tuesday_csv_path"
                                   id="tuesday_csv_path"
                                   value="<?php echo esc_attr($settings['tuesday_csv_path']); ?>"
                                   class="large-text"
                                   readonly>
                            <p class="description">
                                <?php esc_html_e('Path to Tuesday classes CSV file. Upload via CSV Manager.', 'elementor-dynamic-redirect'); ?>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="debug_enabled"><?php esc_html_e('Debug Logging', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <label>
                                <input type="checkbox"
                                       name="debug_enabled"
                                       id="debug_enabled"
                                       value="1"
                                       <?php checked($settings['debug_enabled'], true); ?>>
                                <?php esc_html_e('Enable debug logging to error_log', 'elementor-dynamic-redirect'); ?>
                            </label>
                            <p class="description">
                                <?php esc_html_e('Enable this to log redirect operations to the WordPress error log.', 'elementor-dynamic-redirect'); ?>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <?php submit_button(__('Save Settings', 'elementor-dynamic-redirect')); ?>
        </form>

        <hr>

        <div class="edr-info-box">
            <h2><?php esc_html_e('How It Works', 'elementor-dynamic-redirect'); ?></h2>
            <ol>
                <li><?php esc_html_e('User fills out an Elementor form', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Plugin checks if payment method matches the trigger value (e.g., "אשראי")', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('If it matches, the plugin determines which CSV to use based on the team field', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Plugin finds today\'s date in the CSV', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Plugin selects the appropriate URL column based on kupa field', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('Plugin replaces placeholders in the URL with form data', 'elementor-dynamic-redirect'); ?></li>
                <li><?php esc_html_e('User is redirected to the generated URL', 'elementor-dynamic-redirect'); ?></li>
            </ol>
        </div>
    </div>
</div>
