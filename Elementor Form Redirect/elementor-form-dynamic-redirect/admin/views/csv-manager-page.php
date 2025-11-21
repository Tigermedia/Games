<?php
/**
 * CSV Manager Page View
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

$settings = EDR_Core::instance()->get_settings();
$csv_manager = EDR_CSV_Manager::instance();

// Get CSV info
$sunday_info = $csv_manager->get_csv_info('sunday');
$tuesday_info = $csv_manager->get_csv_info('tuesday');

// Check for messages
$message_type = isset($_GET['message_type']) ? sanitize_text_field($_GET['message_type']) : '';
$message = isset($_GET['message']) ? urldecode($_GET['message']) : '';
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <?php if ($message): ?>
        <div class="notice notice-<?php echo esc_attr($message_type === 'success' ? 'success' : 'error'); ?> is-dismissible">
            <p><?php echo esc_html($message); ?></p>
        </div>
    <?php endif; ?>

    <div class="card" style="max-width: 800px;">
        <h2><?php esc_html_e('Sunday Classes CSV', 'elementor-dynamic-redirect'); ?></h2>
        
        <?php if ($sunday_info && isset($sunday_info['exists']) && $sunday_info['exists']): ?>
            <p><strong><?php esc_html_e('File:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html($sunday_info['path']); ?></p>
            <p><strong><?php esc_html_e('Size:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html(size_format($sunday_info['size'])); ?></p>
            <p><strong><?php esc_html_e('Last Modified:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html($sunday_info['modified']); ?></p>
            
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="margin-top: 15px;">
                <?php wp_nonce_field('edr_delete_csv', 'edr_csv_nonce'); ?>
                <input type="hidden" name="action" value="edr_delete_csv">
                <input type="hidden" name="delete_type" value="sunday">
                <?php submit_button(__('Delete CSV', 'elementor-dynamic-redirect'), 'delete', 'submit', false); ?>
            </form>
        <?php else: ?>
            <p><?php esc_html_e('No CSV file uploaded.', 'elementor-dynamic-redirect'); ?></p>
        <?php endif; ?>

        <h3><?php esc_html_e('Upload New CSV', 'elementor-dynamic-redirect'); ?></h3>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" enctype="multipart/form-data">
            <?php wp_nonce_field('edr_upload_csv', 'edr_csv_nonce'); ?>
            <input type="hidden" name="action" value="edr_upload_csv">
            <input type="hidden" name="upload_type" value="sunday">
            <input type="file" name="csv_file" accept=".csv" required />
            <?php submit_button(__('Upload CSV', 'elementor-dynamic-redirect')); ?>
        </form>

        <h3 style="margin-top: 20px;"><?php esc_html_e('Or Set File Path/URL', 'elementor-dynamic-redirect'); ?></h3>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <?php wp_nonce_field('edr_set_csv_path', 'edr_csv_path_nonce'); ?>
            <input type="hidden" name="action" value="edr_set_csv_path">
            <input type="hidden" name="path_type" value="sunday">
            <table class="form-table">
                <tr>
                    <th><label for="sunday_csv_path"><?php esc_html_e('File Path or URL', 'elementor-dynamic-redirect'); ?></label></th>
                    <td>
                        <input type="text" name="csv_path" id="sunday_csv_path" value="<?php echo esc_attr($settings['sunday_csv_path']); ?>" class="regular-text" style="width: 100%;" />
                        <p class="description">
                            <?php esc_html_e('Enter either:', 'elementor-dynamic-redirect'); ?><br>
                            - <?php esc_html_e('HTTP URL (e.g., http://example.com/wp-content/uploads/file.csv)', 'elementor-dynamic-redirect'); ?><br>
                            - <?php esc_html_e('Server file path (e.g., /home/user/public_html/wp-content/uploads/file.csv)', 'elementor-dynamic-redirect'); ?>
                        </p>
                    </td>
                </tr>
            </table>
            <?php submit_button(__('Set Path', 'elementor-dynamic-redirect')); ?>
        </form>
    </div>

    <div class="card" style="max-width: 800px; margin-top: 20px;">
        <h2><?php esc_html_e('Tuesday Classes CSV', 'elementor-dynamic-redirect'); ?></h2>
        
        <?php if ($tuesday_info && isset($tuesday_info['exists']) && $tuesday_info['exists']): ?>
            <p><strong><?php esc_html_e('File:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html($tuesday_info['path']); ?></p>
            <p><strong><?php esc_html_e('Size:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html(size_format($tuesday_info['size'])); ?></p>
            <p><strong><?php esc_html_e('Last Modified:', 'elementor-dynamic-redirect'); ?></strong> <?php echo esc_html($tuesday_info['modified']); ?></p>
            
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="margin-top: 15px;">
                <?php wp_nonce_field('edr_delete_csv', 'edr_csv_nonce'); ?>
                <input type="hidden" name="action" value="edr_delete_csv">
                <input type="hidden" name="delete_type" value="tuesday">
                <?php submit_button(__('Delete CSV', 'elementor-dynamic-redirect'), 'delete', 'submit', false); ?>
            </form>
        <?php else: ?>
            <p><?php esc_html_e('No CSV file uploaded.', 'elementor-dynamic-redirect'); ?></p>
        <?php endif; ?>

        <h3><?php esc_html_e('Upload New CSV', 'elementor-dynamic-redirect'); ?></h3>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" enctype="multipart/form-data">
            <?php wp_nonce_field('edr_upload_csv', 'edr_csv_nonce'); ?>
            <input type="hidden" name="action" value="edr_upload_csv">
            <input type="hidden" name="upload_type" value="tuesday">
            <input type="file" name="csv_file" accept=".csv" required />
            <?php submit_button(__('Upload CSV', 'elementor-dynamic-redirect')); ?>
        </form>

        <h3 style="margin-top: 20px;"><?php esc_html_e('Or Set File Path/URL', 'elementor-dynamic-redirect'); ?></h3>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <?php wp_nonce_field('edr_set_csv_path', 'edr_csv_path_nonce'); ?>
            <input type="hidden" name="action" value="edr_set_csv_path">
            <input type="hidden" name="path_type" value="tuesday">
            <table class="form-table">
                <tr>
                    <th><label for="tuesday_csv_path"><?php esc_html_e('File Path or URL', 'elementor-dynamic-redirect'); ?></label></th>
                    <td>
                        <input type="text" name="csv_path" id="tuesday_csv_path" value="<?php echo esc_attr($settings['tuesday_csv_path']); ?>" class="regular-text" style="width: 100%;" />
                        <p class="description">
                            <?php esc_html_e('Enter either:', 'elementor-dynamic-redirect'); ?><br>
                            - <?php esc_html_e('HTTP URL (e.g., http://example.com/wp-content/uploads/file.csv)', 'elementor-dynamic-redirect'); ?><br>
                            - <?php esc_html_e('Server file path (e.g., /home/user/public_html/wp-content/uploads/file.csv)', 'elementor-dynamic-redirect'); ?>
                        </p>
                    </td>
                </tr>
            </table>
            <?php submit_button(__('Set Path', 'elementor-dynamic-redirect')); ?>
        </form>
    </div>

    <div class="card" style="max-width: 800px; margin-top: 20px;">
        <h2><?php esc_html_e('CSV Format', 'elementor-dynamic-redirect'); ?></h2>
        <p><?php esc_html_e('CSV files should have the following columns:', 'elementor-dynamic-redirect'); ?></p>
        <ul>
            <li><code>date</code> - <?php esc_html_e('Lesson date (Y-m-d format or d/m/Y)', 'elementor-dynamic-redirect'); ?></li>
            <li><code>link_partial</code> - <?php esc_html_e('Payment URL for מאוחדת kupa', 'elementor-dynamic-redirect'); ?></li>
            <li><code>link_full</code> - <?php esc_html_e('Payment URL for all other kupot', 'elementor-dynamic-redirect'); ?></li>
        </ul>
    </div>
</div>

