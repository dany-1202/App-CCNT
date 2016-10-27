<?php
/**
 * userauth.inc.php contains static functions allowing for secure authentication
 * of users.
 *
 */

require_once("MySQLManager.php");

/**
 * UserAuthentication allows for secure session handling and user
 * authentication
 *
 * @access public
 */
class UserAuthentication {
	/**
	 * Validates the login attempt of an employee.
	 *
	 * @access public
	 * @static
	 * @param string $logon The employees personal username
	 * @param string $password The employees personal login password
	 * @return boolean true if the employee's authentification is successful, false otherwise
	 */
	public static function validateUserLogin($logon, $password) {
		$db = MySQLManager::get();

		if ($stmt = $db->prepare("SELECT per_id, per_nom, per_prenom, per_mdp, per_mail, per_admin "
			."FROM ccn_personne WHERE per_mail = ? LIMIT 1")) {
			$stmt->bind_param('s', $logon);
			$stmt->execute();
			$stmt->store_result();
			
			$stmt->bind_result($per_id, $per_nom, $per_prenom, $per_mdp, $per_logon, $per_admin);
			$stmt->fetch();
			
			if ($stmt->num_rows == 1) {
				if ($per_mdp == $password) {
					$user_browser = $_SERVER['HTTP_USER_AGENT'];
					
					$_SESSION['user_id'] = $per_id;
					$_SESSION['user_nom'] = $per_nom;
					$_SESSION['user_prenom'] = $per_prenom;
          $_SESSION['login_string'] = hash('sha512', $per_mdp . $user_browser);

          if ($per_admin == 1) {
          	$_SESSION['user_type'] = 'admin'; 
        	} else {
        		$_SESSION['user_type'] = 'noadmin'; 
        	}
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	 * Logout the user and destroy the session
	 *
	 * @access public
	 * @static
	 */
	public static function logout() {
		session_unset();
		$params = session_get_cookie_params();
		setcookie(
			session_name(),
			'', time()-42000,
			$params['path'],
			$params['domain'],
			$params['secure'],
			$params['httponly']);
		session_destroy();
	}
	
	/**
	 * Checks if the current session contains valid login info.
	 *
	 * @access public
	 * @static
	 * @return boolean true if the user is considered logged in, false otherwise
	 */
	public static function checkLogin() {
		if (isset($_SESSION['login_string'])) {
			$user_id = $_SESSION['user_id'];
			$user_type = $_SESSION['user_type'];
			$login_string = $_SESSION['login_string'];
			
			$user_browser = $_SERVER['HTTP_USER_AGENT'];
			
			// get a database handle
			$db = MySQLManager::get();
			
			$query = "";
			if ($user_type == 'employee') {
				$query = "SELECT emp_password FROM employee WHERE emp_id = ? LIMIT 1";
			} else {
				$query = "SELECT cus_password FROM customer WHERE cus_id = ? LIMIT 1";
			}
			
			if ($stmt = $db->prepare($query)) {
				$stmt->bind_param('i', $user_id);
				$stmt->execute();
				$stmt->store_result();
				
				if ($stmt->num_rows == 1) {
					$stmt->bind_result($user_password);
					$stmt->fetch();
					$login_check = hash('sha512', $user_password . $user_browser);
					
					return $login_check == $login_string;
				}
			}
		}
		return false;
	}
}
?>