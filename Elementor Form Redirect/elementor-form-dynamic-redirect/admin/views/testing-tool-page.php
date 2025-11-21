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
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <div class="card" style="max-width: 1000px;">
        <h2><?php esc_html_e('Test Redirect Generation', 'elementor-dynamic-redirect'); ?></h2>
        
        <form id="edr-test-form">
            <table class="form-table" role="presentation">
                <tbody>
                    <tr>
                        <th scope="row">
                            <label for="test_form_id"><?php esc_html_e('Form ID', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <input type="text" id="test_form_id" name="test_data[_form_id]" value="" class="regular-text" placeholder="pilatis01, girls01, hazaka" />
                            <p class="description"><?php esc_html_e('The form ID to test (e.g., pilatis01, girls01, hazaka)', 'elementor-dynamic-redirect'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="test_form_name"><?php esc_html_e('Form Name', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <input type="text" id="test_form_name" name="test_data[_form_name]" value="" class="regular-text" />
                            <p class="description"><?php esc_html_e('Optional: Form name (alternative to Form ID)', 'elementor-dynamic-redirect'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="test_team"><?php esc_html_e('Team Field Value', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <input type="text" id="test_team" name="test_data[team]" value="" class="regular-text" placeholder="סדרה קצרה, סדרה ארוכה, ערב, בוקר" />
                            <p class="description"><?php esc_html_e('The team/group value (e.g., "סדרה קצרה", "ערב", "בוקר")', 'elementor-dynamic-redirect'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="test_kupa"><?php esc_html_e('Kupa Field Value', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <input type="text" id="test_kupa" name="test_data[kupa]" value="" class="regular-text" placeholder="מאוחדת, כללית, מכבי" />
                            <p class="description"><?php esc_html_e('The health fund value (e.g., "מאוחדת", "כללית")', 'elementor-dynamic-redirect'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="test_payment_method"><?php esc_html_e('Payment Method', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <input type="text" id="test_payment_method" name="test_data[payment_method]" value="אשראי" class="regular-text" />
                            <p class="description"><?php esc_html_e('Payment method (usually "אשראי" for redirects)', 'elementor-dynamic-redirect'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="test_date"><?php esc_html_e('Test Date (Optional)', 'elementor-dynamic-redirect'); ?></label>
                        </th>
                        <td>
                            <input type="date" id="test_date" name="test_date" value="" class="regular-text" />
                            <p class="description"><?php esc_html_e('Custom date for CSV testing (YYYY-MM-DD format)', 'elementor-dynamic-redirect'); ?></p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <p class="submit">
                <button type="submit" class="button button-primary"><?php esc_html_e('Test Redirect', 'elementor-dynamic-redirect'); ?></button>
            </p>
        </form>

        <div id="edr-test-result" style="margin-top: 20px; display: none;">
            <h3><?php esc_html_e('Test Result', 'elementor-dynamic-redirect'); ?></h3>
            <div id="edr-test-result-content"></div>
        </div>
    </div>

    <div class="card" style="max-width: 1000px; margin-top: 20px;">
        <h2><?php esc_html_e('Quick Test Scenarios', 'elementor-dynamic-redirect'); ?></h2>
        <p><?php esc_html_e('Click a scenario below to populate the form:', 'elementor-dynamic-redirect'); ?></p>
        <ul>
            <?php foreach ($scenarios as $scenario): ?>
                <li>
                    <a href="#" class="edr-load-scenario" data-scenario='<?php echo esc_attr(json_encode($scenario['data'])); ?>'>
                        <?php echo esc_html($scenario['name']); ?>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</div>

<script>
jQuery(document).ready(function($) {
    // Load scenario
    $('.edr-load-scenario').on('click', function(e) {
        e.preventDefault();
        var scenario = $(this).data('scenario');
        if (scenario) {
            if (scenario.team) $('#test_team').val(scenario.team);
            if (scenario.kupa) $('#test_kupa').val(scenario.kupa);
            if (scenario.payment_method) $('#test_payment_method').val(scenario.payment_method);
            if (scenario.first_name) $('#test_form_id').val(scenario.first_name);
        }
    });

    // Test form submission
    $('#edr-test-form').on('submit', function(e) {
        e.preventDefault();
        
        var formData = {};
        $(this).serializeArray().forEach(function(item) {
            var name = item.name.replace('test_data[', '').replace(']', '');
            if (name === 'test_date') {
                formData.test_date = item.value;
            } else {
                if (!formData.test_data) formData.test_data = {};
                formData.test_data[name] = item.value;
            }
        });

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'edr_test_redirect',
                nonce: edrAdmin.nonce,
                test_data: formData.test_data || {},
                test_date: formData.test_date || null
            },
            success: function(response) {
                var resultDiv = $('#edr-test-result');
                var contentDiv = $('#edr-test-result-content');
                
                if (response.success) {
                    contentDiv.html(
                        '<div class="notice notice-success"><p><strong>Success!</strong></p>' +
                        '<p><strong>URL:</strong> <a href="' + response.data.url + '" target="_blank">' + response.data.url + '</a></p>' +
                        '<p><strong>Message:</strong> ' + response.data.message + '</p>' +
                        '<details><summary>Debug Info</summary><pre>' + JSON.stringify(response.data.debug, null, 2) + '</pre></details>' +
                        '</div>'
                    );
                } else {
                    contentDiv.html(
                        '<div class="notice notice-error"><p><strong>Error!</strong></p>' +
                        '<p>' + (response.data.message || 'Unknown error') + '</p>' +
                        '<details><summary>Debug Info</summary><pre>' + JSON.stringify(response.data.debug || {}, null, 2) + '</pre></details>' +
                        '</div>'
                    );
                }
                
                resultDiv.show();
            },
            error: function() {
                $('#edr-test-result-content').html(
                    '<div class="notice notice-error"><p>AJAX request failed. Please check console for errors.</p></div>'
                );
                $('#edr-test-result').show();
            }
        });
    });
});
</script>




