<?php
/**
 * Testing Tool
 *
 * @package Elementor_Dynamic_Redirect
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * EDR_Testing_Tool Class
 */
class EDR_Testing_Tool {

    /**
     * Single instance
     */
    private static $instance = null;

    /**
     * Get instance
     */
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        // Nothing to initialize here for now
    }

    /**
     * Get test scenarios
     */
    public function get_test_scenarios() {
        return array(
            array(
                'name' => __('Sunday - Full - Credit', 'elementor-dynamic-redirect'),
                'data' => array(
                    'payment_method' => 'אשראי',
                    'team' => 'יום ראשון - 19:00',
                    'kupa' => 'מלא',
                    'first_name' => 'John',
                    'last_name' => 'Doe',
                    'email' => 'john@example.com',
                ),
            ),
            array(
                'name' => __('Sunday - Partial - Credit', 'elementor-dynamic-redirect'),
                'data' => array(
                    'payment_method' => 'אשראי',
                    'team' => 'יום ראשון - 19:00',
                    'kupa' => 'מאוחדת',
                    'first_name' => 'Jane',
                    'last_name' => 'Doe',
                    'email' => 'jane@example.com',
                ),
            ),
            array(
                'name' => __('Tuesday - Full - Credit', 'elementor-dynamic-redirect'),
                'data' => array(
                    'payment_method' => 'אשראי',
                    'team' => 'יום שלישי - 19:00',
                    'kupa' => 'מלא',
                    'first_name' => 'Bob',
                    'last_name' => 'Smith',
                    'email' => 'bob@example.com',
                ),
            ),
            array(
                'name' => __('Tuesday - Partial - Credit', 'elementor-dynamic-redirect'),
                'data' => array(
                    'payment_method' => 'אשראי',
                    'team' => 'יום שלישי - 19:00',
                    'kupa' => 'מאוחדת',
                    'first_name' => 'Alice',
                    'last_name' => 'Johnson',
                    'email' => 'alice@example.com',
                ),
            ),
            array(
                'name' => __('Sunday - Full - Cash (No Redirect)', 'elementor-dynamic-redirect'),
                'data' => array(
                    'payment_method' => 'מזומן',
                    'team' => 'יום ראשון - 19:00',
                    'kupa' => 'מלא',
                    'first_name' => 'Test',
                    'last_name' => 'User',
                    'email' => 'test@example.com',
                ),
            ),
            array(
                'name' => __('Sunday - Partial - Cash (No Redirect)', 'elementor-dynamic-redirect'),
                'data' => array(
                    'payment_method' => 'מזומן',
                    'team' => 'יום ראשון - 19:00',
                    'kupa' => 'מאוחדת',
                    'first_name' => 'Test',
                    'last_name' => 'User',
                    'email' => 'test@example.com',
                ),
            ),
            array(
                'name' => __('Tuesday - Full - Transfer (No Redirect)', 'elementor-dynamic-redirect'),
                'data' => array(
                    'payment_method' => 'העברה בנקאית',
                    'team' => 'יום שלישי - 19:00',
                    'kupa' => 'מלא',
                    'first_name' => 'Test',
                    'last_name' => 'User',
                    'email' => 'test@example.com',
                ),
            ),
            array(
                'name' => __('Tuesday - Partial - Transfer (No Redirect)', 'elementor-dynamic-redirect'),
                'data' => array(
                    'payment_method' => 'העברה בנקאית',
                    'team' => 'יום שלישי - 19:00',
                    'kupa' => 'מאוחדת',
                    'first_name' => 'Test',
                    'last_name' => 'User',
                    'email' => 'test@example.com',
                ),
            ),
        );
    }
}
