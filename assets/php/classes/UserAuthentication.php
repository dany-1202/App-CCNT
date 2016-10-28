<?php
/**
 * UserAuthentication.php contains static functions allowing for secure authentication
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
	 * Start a secured session
	 *
	 * @access public
	 * @static
	 */
	public static function secureSessionStart() {
		$sessionName = 'ctrlCCNT';
		$secure = false;
		$httponly = true;
		
		ini_set('session.use_only_cookies', 1);
		
		$cookieParams = session_get_cookie_params();
		session_set_cookie_params(
			$cookieParams["lifetime"],
			$cookieParams["path"],
			$cookieParams["domain"],
			$secure,
			$httponly);
		session_name($sessionName);
		session_start();
		//session_regenerate_id(true);
	}

	/**
	 * Validates the login attempt of an employee.
	 *
	 * @access public
	 * @static
	 * @param string $login The employees personal username
	 * @param string $password The employees personal login password
	 * @return boolean true if the employee's authentification is successful, false otherwise
	 */
	public static function validateUserLogin($login, $password) {
		$db = MySQLManager::get();

		$passwordCrypt = hash('sha512', $password);
		$_SESSION['password'] = $passwordCrypt;
		$query -> "SELECT per_id, per_nom, per_prenom, per_mdp, per_mail, per_admin FROM ccn_personne WHERE per_mail = $login and per_mdp = $passwordCrypt LIMIT 1";
		$_SESSION['query'] = $query;
		return true;

		
		if ($stmt = $db->prepare($query)) {
			$stmt->execute();
			$stmt->store_result();
			
			
			$stmt->bind_result($per_id, $per_nom, $per_prenom, $per_mdp, $per_logon, $per_admin);
			$stmt->fetch();
			if ($stmt->num_rows == 1) {
					$_SESSION['user_id'] = $per_id;
					$_SESSION['user_nom'] = $per_nom;
					$_SESSION['user_prenom'] = $per_prenom;

          if ($per_admin == 1) {
          	$_SESSION['user_type'] = 'admin'; 
        	} else {
        		$_SESSION['user_type'] = 'noadmin'; 
        	}
					return true;
			}
		}
		return false;
	}
	
	/**
	 * Checks if the current session contains valid login info.
	 *
	 * @access public
	 * @static
	 * @return boolean true if the user is considered logged in, false otherwise
	 */
	public static function checkLogin($user_id, $key_encrypted) {
		// get a database handle
		$db = MySQLManager::get();
		
		$query = "SELECT per_mdp FROM ccn_personne WHERE per_id = 1 LIMIT 1";
		if ($stmt = $db->prepare($query)) {
			$stmt->execute();
			$stmt->store_result();
			if ($stmt->num_rows == 1) {
				$stmt->bind_result($per_mdp);
				$stmt->fetch();
				return $per_mdp == $key_encrypted;
			}
		}
		return false;
	}
}
?>