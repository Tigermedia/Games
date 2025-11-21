<?php
/**
 * Sumit Accounts Page View
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

$settings = EDR_Core::instance()->get_settings();
$settings_updated = isset($_GET['settings-updated']) && $_GET['settings-updated'] === 'true';
$current_account = isset($settings['pilatis_sumit_account']) ? $settings['pilatis_sumit_account'] : 'stern_sports';
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <?php if ($settings_updated): ?>
        <div class="notice notice-success is-dismissible">
            <p><?php esc_html_e('Sumit account updated successfully!', 'elementor-dynamic-redirect'); ?></p>
        </div>
    <?php endif; ?>

    <div class="card" style="max-width: 800px;">
        <h2><?php esc_html_e('Pilatis Form - Sumit Account Selection', 'elementor-dynamic-redirect'); ?></h2>
        <p>
            <?php esc_html_e('Select which Sumit account to use for the Pilatis form (pilatis01 / פילאטיס) redirects. This determines which payment URLs will be used when users submit the form.', 'elementor-dynamic-redirect'); ?>
        </p>
        <p>
            <strong><?php esc_html_e('Form URL:', 'elementor-dynamic-redirect'); ?></strong>
            <a href="https://1.michal-stern.com/join/course3/" target="_blank">https://1.michal-stern.com/join/course3/</a>
        </p>
    </div>

    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="max-width: 800px; margin-top: 20px;">
        <?php wp_nonce_field('edr_save_sumit_account', 'edr_sumit_account_nonce'); ?>
        <input type="hidden" name="action" value="edr_save_sumit_account">

        <table class="form-table" role="presentation">
            <tbody>
                <tr>
                    <th scope="row">
                        <label><?php esc_html_e('Sumit Account', 'elementor-dynamic-redirect'); ?></label>
                    </th>
                    <td>
                        <fieldset>
                            <legend class="screen-reader-text">
                                <span><?php esc_html_e('Sumit Account Selection', 'elementor-dynamic-redirect'); ?></span>
                            </legend>

                            <label style="display: block; margin-bottom: 10px;">
                                <input type="radio" name="pilatis_sumit_account" value="stern_sports" <?php checked($current_account, 'stern_sports'); ?>>
                                <strong>שטרן - חוגים לספורט</strong>
                                <span style="color: #666; margin-right: 10px;">(stern_sports)</span>
                            </label>

                            <label style="display: block; margin-bottom: 10px;">
                                <input type="radio" name="pilatis_sumit_account" value="stern_fitness" <?php checked($current_account, 'stern_fitness'); ?>>
                                <strong>שטרן - כושר לנשים ונערות</strong>
                                <span style="color: #666; margin-right: 10px;">(stern_fitness)</span>
                            </label>

                            <p class="description" style="margin-top: 15px;">
                                <?php esc_html_e('This setting only affects the Pilatis form. All redirect conditions remain the same, but different payment URLs will be used based on your selection.', 'elementor-dynamic-redirect'); ?>
                            </p>
                        </fieldset>
                    </td>
                </tr>
            </tbody>
        </table>

        <hr style="margin: 30px 0;">

        <h3><?php esc_html_e('Redirect Conditions (Same for Both Accounts)', 'elementor-dynamic-redirect'); ?></h3>
        <table class="widefat" style="margin-top: 15px;">
            <thead>
                <tr>
                    <th style="padding: 10px;"><?php esc_html_e('Condition', 'elementor-dynamic-redirect'); ?></th>
                    <th style="padding: 10px;"><?php esc_html_e('Team Field', 'elementor-dynamic-redirect'); ?></th>
                    <th style="padding: 10px;"><?php esc_html_e('Kupa Field', 'elementor-dynamic-redirect'); ?></th>
                    <th style="padding: 10px;"><?php esc_html_e('Payment Method', 'elementor-dynamic-redirect'); ?></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 10px;"><strong>00</strong></td>
                    <td style="padding: 10px;">Starts with "אחר"</td>
                    <td style="padding: 10px;">Any</td>
                    <td style="padding: 10px;">אשראי</td>
                </tr>
                <tr style="background: #f9f9f9;">
                    <td style="padding: 10px;"><strong>01</strong></td>
                    <td style="padding: 10px;">Contains "סדרה קצרה"</td>
                    <td style="padding: 10px;">מאוחדת</td>
                    <td style="padding: 10px;">אשראי</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>02</strong></td>
                    <td style="padding: 10px;">Contains "סדרה ארוכה"</td>
                    <td style="padding: 10px;">מאוחדת</td>
                    <td style="padding: 10px;">אשראי</td>
                </tr>
                <tr style="background: #f9f9f9;">
                    <td style="padding: 10px;"><strong>03</strong></td>
                    <td style="padding: 10px;">Contains "סדרה ארוכה"</td>
                    <td style="padding: 10px;">NOT מאוחדת</td>
                    <td style="padding: 10px;">אשראי</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>04</strong></td>
                    <td style="padding: 10px;">Contains "סדרה קצרה"</td>
                    <td style="padding: 10px;">NOT מאוחדת</td>
                    <td style="padding: 10px;">אשראי</td>
                </tr>
            </tbody>
        </table>

        <p class="description" style="margin-top: 15px;">
            <?php esc_html_e('Note: Conditions are checked in order (00, 01, 02, 03, 04). The first matching condition determines the redirect URL.', 'elementor-dynamic-redirect'); ?>
        </p>

        <?php submit_button(__('Save Sumit Account', 'elementor-dynamic-redirect')); ?>
    </form>
</div>
