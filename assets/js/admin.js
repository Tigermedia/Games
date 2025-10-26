/**
 * Admin JavaScript
 *
 * @package Elementor_Dynamic_Redirect
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Add copy to clipboard functionality
        $('.edr-copy-btn').on('click', function() {
            const text = $(this).data('text');
            copyToClipboard(text);
            alert('Copied to clipboard!');
        });
    });

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }

})(jQuery);
