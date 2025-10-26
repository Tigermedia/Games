<?php
/**
 * CSV Manager Page View
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

$csv_manager = EDR_CSV_Manager::instance();
$sunday_info = $csv_manager->get_csv_info('sunday');
$tuesday_info = $csv_manager->get_csv_info('tuesday');
?>

<div class="wrap edr-admin-wrap">
    <h1><?php esc_html_e('CSV Manager', 'elementor-dynamic-redirect'); ?></h1>

    <?php if (isset($_GET['message_type']) && isset($_GET['message'])) : ?>
        <div class="notice notice-<?php echo esc_attr($_GET['message_type']); ?> is-dismissible">
            <p><?php echo esc_html(urldecode($_GET['message'])); ?></p>
        </div>
    <?php endif; ?>

    <div class="edr-admin-content">
        <div class="edr-csv-section">
            <h2><?php esc_html_e('Sunday Classes CSV', 'elementor-dynamic-redirect'); ?></h2>

            <?php if ($sunday_info['exists']) : ?>
                <div class="edr-file-info">
                    <p>
                        <span class="edr-status-badge edr-status-success"><?php esc_html_e('File Uploaded', 'elementor-dynamic-redirect'); ?></span>
                    </p>
                    <ul>
                        <li><strong><?php esc_html_e('Size:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html(size_format($sunday_info['size'])); ?></li>
                        <li><strong><?php esc_html_e('Last Modified:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html($sunday_info['modified']); ?></li>
                        <li><strong><?php esc_html_e('Rows:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html($sunday_info['rows']); ?></li>
                        <li><strong><?php esc_html_e('Path:', 'elementor-dynamic-redirect'); ?></strong> <code><?php echo esc_html($sunday_info['path']); ?></code></li>
                    </ul>

                    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="display: inline;">
                        <input type="hidden" name="action" value="edr_delete_csv">
                        <input type="hidden" name="delete_type" value="sunday">
                        <?php wp_nonce_field('edr_delete_csv', 'edr_csv_nonce'); ?>
                        <button type="submit" class="button button-secondary" onclick="return confirm('<?php esc_attr_e('Are you sure you want to delete this file?', 'elementor-dynamic-redirect'); ?>');">
                            <?php esc_html_e('Delete File', 'elementor-dynamic-redirect'); ?>
                        </button>
                    </form>
                </div>
            <?php else : ?>
                <p>
                    <span class="edr-status-badge edr-status-error"><?php esc_html_e('No File Uploaded', 'elementor-dynamic-redirect'); ?></span>
                </p>
            <?php endif; ?>

            <h3><?php esc_html_e('Upload New File', 'elementor-dynamic-redirect'); ?></h3>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" enctype="multipart/form-data">
                <input type="hidden" name="action" value="edr_upload_csv">
                <input type="hidden" name="upload_type" value="sunday">
                <?php wp_nonce_field('edr_upload_csv', 'edr_csv_nonce'); ?>

                <p>
                    <input type="file" name="csv_file" accept=".csv" required>
                </p>

                <?php submit_button(__('Upload Sunday CSV', 'elementor-dynamic-redirect'), 'primary', 'submit', false); ?>
            </form>
        </div>

        <hr>

        <div class="edr-csv-section">
            <h2><?php esc_html_e('Tuesday Classes CSV', 'elementor-dynamic-redirect'); ?></h2>

            <?php if ($tuesday_info['exists']) : ?>
                <div class="edr-file-info">
                    <p>
                        <span class="edr-status-badge edr-status-success"><?php esc_html_e('File Uploaded', 'elementor-dynamic-redirect'); ?></span>
                    </p>
                    <ul>
                        <li><strong><?php esc_html_e('Size:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html(size_format($tuesday_info['size'])); ?></li>
                        <li><strong><?php esc_html_e('Last Modified:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html($tuesday_info['modified']); ?></li>
                        <li><strong><?php esc_html_e('Rows:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html($tuesday_info['rows']); ?></li>
                        <li><strong><?php esc_html_e('Path:', 'elementor-dynamic-redirect'); ?></strong> <code><?php echo esc_html($tuesday_info['path']); ?></code></li>
                    </ul>

                    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="display: inline;">
                        <input type="hidden" name="action" value="edr_delete_csv">
                        <input type="hidden" name="delete_type" value="tuesday">
                        <?php wp_nonce_field('edr_delete_csv', 'edr_csv_nonce'); ?>
                        <button type="submit" class="button button-secondary" onclick="return confirm('<?php esc_attr_e('Are you sure you want to delete this file?', 'elementor-dynamic-redirect'); ?>');">
                            <?php esc_html_e('Delete File', 'elementor-dynamic-redirect'); ?>
                        </button>
                    </form>
                </div>
            <?php else : ?>
                <p>
                    <span class="edr-status-badge edr-status-error"><?php esc_html_e('No File Uploaded', 'elementor-dynamic-redirect'); ?></span>
                </p>
            <?php endif; ?>

            <h3><?php esc_html_e('Upload New File', 'elementor-dynamic-redirect'); ?></h3>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" enctype="multipart/form-data">
                <input type="hidden" name="action" value="edr_upload_csv">
                <input type="hidden" name="upload_type" value="tuesday">
                <?php wp_nonce_field('edr_upload_csv', 'edr_csv_nonce'); ?>

                <p>
                    <input type="file" name="csv_file" accept=".csv" required>
                </p>

                <?php submit_button(__('Upload Tuesday CSV', 'elementor-dynamic-redirect'), 'primary', 'submit', false); ?>
            </form>
        </div>

        <hr>

        <div class="edr-info-box">
            <h3><?php esc_html_e('CSV File Format', 'elementor-dynamic-redirect'); ?></h3>
            <p><?php esc_html_e('Your CSV files should have the following columns:', 'elementor-dynamic-redirect'); ?></p>
            <ul>
                <li><code>date</code> - <?php esc_html_e('The date (YYYY-MM-DD format)', 'elementor-dynamic-redirect'); ?></li>
                <li><code>link_full</code> - <?php esc_html_e('URL for "מלא" kupa option', 'elementor-dynamic-redirect'); ?></li>
                <li><code>link_partial</code> - <?php esc_html_e('URL for "מאוחדת" kupa option', 'elementor-dynamic-redirect'); ?></li>
            </ul>
            <p><?php esc_html_e('URLs can contain placeholders like [field id="first_name"] which will be replaced with form data.', 'elementor-dynamic-redirect'); ?></p>
        </div>
    </div>
</div>
