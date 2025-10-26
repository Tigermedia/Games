<?php
/**
 * Testing Tool Page View
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

$testing_tool = EDR_Testing_Tool::instance();
$scenarios = $testing_tool->get_test_scenarios();
$settings = EDR_Core::instance()->get_settings();
?>

<div class="wrap edr-admin-wrap">
    <h1><?php esc_html_e('Testing Tool', 'elementor-dynamic-redirect'); ?></h1>

    <div class="edr-admin-content">
        <div class="edr-testing-section">
            <h2><?php esc_html_e('Manual Test', 'elementor-dynamic-redirect'); ?></h2>

            <form id="edr-test-form">
                <table class="form-table">
                    <tbody>
                        <tr>
                            <th scope="row">
                                <label for="test_payment_method"><?php esc_html_e('Payment Method', 'elementor-dynamic-redirect'); ?></label>
                            </th>
                            <td>
                                <select name="payment_method" id="test_payment_method" class="regular-text">
                                    <option value="אשראי"><?php esc_html_e('אשראי (Credit Card)', 'elementor-dynamic-redirect'); ?></option>
                                    <option value="מזומן"><?php esc_html_e('מזומן (Cash)', 'elementor-dynamic-redirect'); ?></option>
                                    <option value="העברה בנקאית"><?php esc_html_e('העברה בנקאית (Bank Transfer)', 'elementor-dynamic-redirect'); ?></option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <label for="test_team"><?php esc_html_e('Team', 'elementor-dynamic-redirect'); ?></label>
                            </th>
                            <td>
                                <select name="team" id="test_team" class="regular-text">
                                    <option value="יום ראשון - 19:00"><?php esc_html_e('יום ראשון - 19:00 (Sunday)', 'elementor-dynamic-redirect'); ?></option>
                                    <option value="יום שלישי - 19:00"><?php esc_html_e('יום שלישי - 19:00 (Tuesday)', 'elementor-dynamic-redirect'); ?></option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <label for="test_kupa"><?php esc_html_e('Kupa', 'elementor-dynamic-redirect'); ?></label>
                            </th>
                            <td>
                                <select name="kupa" id="test_kupa" class="regular-text">
                                    <option value="מלא"><?php esc_html_e('מלא (Full)', 'elementor-dynamic-redirect'); ?></option>
                                    <option value="מאוחדת"><?php esc_html_e('מאוחדת (Partial)', 'elementor-dynamic-redirect'); ?></option>
                                </select>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <label for="test_first_name"><?php esc_html_e('First Name', 'elementor-dynamic-redirect'); ?></label>
                            </th>
                            <td>
                                <input type="text" name="first_name" id="test_first_name" value="John" class="regular-text">
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <label for="test_last_name"><?php esc_html_e('Last Name', 'elementor-dynamic-redirect'); ?></label>
                            </th>
                            <td>
                                <input type="text" name="last_name" id="test_last_name" value="Doe" class="regular-text">
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">
                                <label for="test_email"><?php esc_html_e('Email', 'elementor-dynamic-redirect'); ?></label>
                            </th>
                            <td>
                                <input type="email" name="email" id="test_email" value="john@example.com" class="regular-text">
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    <button type="button" id="edr-test-btn" class="button button-primary">
                        <?php esc_html_e('Generate Redirect URL', 'elementor-dynamic-redirect'); ?>
                    </button>
                </p>
            </form>

            <div id="edr-test-result" style="display: none; margin-top: 20px;">
                <h3><?php esc_html_e('Result', 'elementor-dynamic-redirect'); ?></h3>
                <div id="edr-test-result-content"></div>
            </div>
        </div>

        <hr>

        <div class="edr-quick-tests">
            <h2><?php esc_html_e('Quick Test Scenarios', 'elementor-dynamic-redirect'); ?></h2>
            <p><?php esc_html_e('Click any scenario to test it quickly:', 'elementor-dynamic-redirect'); ?></p>

            <div class="edr-scenarios-grid">
                <?php foreach ($scenarios as $index => $scenario) : ?>
                    <div class="edr-scenario-card">
                        <h4><?php echo esc_html($scenario['name']); ?></h4>
                        <button type="button" class="button edr-quick-test-btn" data-scenario='<?php echo esc_attr(json_encode($scenario['data'])); ?>'>
                            <?php esc_html_e('Test This Scenario', 'elementor-dynamic-redirect'); ?>
                        </button>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <hr>

        <div class="edr-info-box">
            <h3><?php esc_html_e('Testing Information', 'elementor-dynamic-redirect'); ?></h3>
            <ul>
                <li><strong><?php esc_html_e('Today\'s Date:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html(date('Y-m-d')); ?></li>
                <li><strong><?php esc_html_e('Payment Trigger Value:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html($settings['payment_trigger_value']); ?></li>
                <li><strong><?php esc_html_e('Debug Mode:', 'elementor-dynamic-redirect'); ?></strong> <?php echo $settings['debug_enabled'] ? esc_html__('Enabled', 'elementor-dynamic-redirect') : esc_html__('Disabled', 'elementor-dynamic-redirect'); ?></li>
            </ul>
            <p><?php esc_html_e('Make sure your CSV files contain an entry for today\'s date to see successful redirects.', 'elementor-dynamic-redirect'); ?></p>
        </div>
    </div>
</div>

<script>
jQuery(document).ready(function($) {
    // Manual test
    $('#edr-test-btn').on('click', function() {
        const testData = {
            payment_method: $('#test_payment_method').val(),
            team: $('#test_team').val(),
            kupa: $('#test_kupa').val(),
            first_name: $('#test_first_name').val(),
            last_name: $('#test_last_name').val(),
            email: $('#test_email').val(),
        };

        testRedirect(testData);
    });

    // Quick tests
    $('.edr-quick-test-btn').on('click', function() {
        const testData = $(this).data('scenario');
        testRedirect(testData);
    });

    function testRedirect(testData) {
        $('#edr-test-result').show();
        $('#edr-test-result-content').html('<p><?php esc_html_e('Testing...', 'elementor-dynamic-redirect'); ?></p>');

        $.ajax({
            url: edrAdmin.ajaxurl,
            type: 'POST',
            data: {
                action: 'edr_test_redirect',
                nonce: edrAdmin.nonce,
                test_data: testData,
            },
            success: function(response) {
                if (response.success) {
                    let html = '<div class="notice notice-success inline"><p><strong><?php esc_html_e('Success!', 'elementor-dynamic-redirect'); ?></strong></p></div>';
                    html += '<p><strong><?php esc_html_e('Redirect URL:', 'elementor-dynamic-redirect'); ?></strong></p>';
                    html += '<p><input type="text" value="' + response.data.url + '" class="large-text" readonly></p>';
                    html += '<p><button type="button" class="button" onclick="navigator.clipboard.writeText(\'' + response.data.url + '\'); alert(\'<?php esc_html_e('URL copied to clipboard!', 'elementor-dynamic-redirect'); ?>\');"><?php esc_html_e('Copy URL', 'elementor-dynamic-redirect'); ?></button></p>';

                    if (response.data.debug) {
                        html += '<details><summary><strong><?php esc_html_e('Debug Info', 'elementor-dynamic-redirect'); ?></strong></summary>';
                        html += '<pre>' + JSON.stringify(response.data.debug, null, 2) + '</pre>';
                        html += '</details>';
                    }

                    $('#edr-test-result-content').html(html);
                } else {
                    let html = '<div class="notice notice-error inline"><p><strong><?php esc_html_e('No Redirect Generated', 'elementor-dynamic-redirect'); ?></strong></p></div>';
                    html += '<p>' + response.data.message + '</p>';

                    if (response.data.debug) {
                        html += '<details><summary><strong><?php esc_html_e('Debug Info', 'elementor-dynamic-redirect'); ?></strong></summary>';
                        html += '<pre>' + JSON.stringify(response.data.debug, null, 2) + '</pre>';
                        html += '</details>';
                    }

                    $('#edr-test-result-content').html(html);
                }
            },
            error: function() {
                $('#edr-test-result-content').html('<div class="notice notice-error inline"><p><?php esc_html_e('AJAX error occurred', 'elementor-dynamic-redirect'); ?></p></div>');
            }
        });
    }
});
</script>
