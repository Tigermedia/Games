/**
 * Frontend JavaScript
 *
 * @package Elementor_Dynamic_Redirect
 */

(function($) {
    'use strict';

    // Log debug messages if debug mode is enabled
    function log(message, data) {
        if (edrData && edrData.debug) {
            console.log('[EDR]', message, data || '');
        }
    }

    // Elementor forms already handle redirects via the AJAX response
    // This file is here for any additional frontend functionality if needed

    log('Frontend script loaded');

})(jQuery);
