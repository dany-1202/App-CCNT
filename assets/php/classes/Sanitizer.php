<?php
/**
 * Sanitizer.php
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
}
?>