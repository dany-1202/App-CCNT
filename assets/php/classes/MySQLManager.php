<?php
/**
 * mysqlmanager.inc.php contains the class handling the
 * mysql database connections.
 */

require_once("InfoDatabase.php");
/**
 * MySQLManager is a wrapper class for database handling
 *
 * @access public
 */
class MySQLManager {
	/**
	 * Once connection is established it will contain a handle object
	 *
	 * @access private
	 * @static
	 * @var mysqli
	 */
	private static $dbhandle = NULL;
	/**
	 * Provides a handle on the database connection
	 *
	 * @access public
	 * @static
	 * @return mysqli Handle on database or NULL
	 */
	public static function get() {
		if (self::$dbhandle == NULL) {
			self::$dbhandle = new mysqli(SERVER, USER, PASS, DATABASE);
			if (self::$dbhandle->connect_error) {
				die("Impossible de se connecter à la base");
				self::$dbhandle = NULL;
			}
		}
		return self::$dbhandle;
	}
	
	/**
	 * Closes the database connection
	 *
	 * @access public
	 * @static
	 */
	public static function close() {
		if (self::$dbhandle != NULL) {
			self::$dbhandle->close();
			self::$dbhandle = NULL;
		}
	}
}
?>
