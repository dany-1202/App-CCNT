<?php
/**
 * sanitizer.inc.php
 */

class Sanitizer {
    /**
     * Sanitizes the get and post input arrays.
     *
     * @access public
     * @static
     * @return Sanitized array of inputs
     */
    public static function getSanitizedJSInput() {
        // data has to be fetched from raw input
        $post = file_get_contents("php://input");
        $data = json_decode($post, true);

        // remove all sorts of special characters
        $data = filter_var_array($data, FILTER_SANITIZE_STRING);

        return $data;
    }

    /**
	 * Checks if an input string represents a valid email address.
	 *
	 * @access public
	 * @static
	 * @param $input String The input string that will be checked
	 * @return True if $input is a valid e-mail address, false otherwise
	 */
    public static function checkValidEmail($input) {
        if (!filter_var($input, FILTER_VALIDATE_EMAIL) === false) {
            return true;
        } 
        return false;
    }
}
?>