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
		if ($stmt = $db->prepare("SELECT per_id, per_nom, per_prenom, per_mdp, per_mail, per_admin FROM ccn_personne WHERE per_mail = ? and per_mdp = ?")) {
			$stmt->bind_param("ss", $login, $passwordCrypt);
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
        	$token = $per_nom . " | " . uniqid() . uniqid() . uniqid();
        	if ($stmtUp = $db->prepare("UPDATE ccn_personne SET per_token = ? WHERE per_mail = ? AND per_mdp = ?")) {
        		$stmtUp->bind_param('sss',$token, $login, $passwordCrypt);
	        	$stmtUp->execute();
	        	$_SESSION['user_token'] = $token;
	        	MySQLManager::close();
	        	
        	}
        	return true;
			}
		}
		MySQLManager::close();
		return false;
	}
	
	/**
	 * Checks if the current session contains valid login info.
	 *
	 * @access public
	 * @static
	 * @return boolean true if the user is considered logged in, false otherwise
	 */
	public static function checkLogin($user_id, $token) {
		// get a database handle-- 
		$db = MySQLManager::get(); 
		$query = "SELECT per_token FROM ccn_personne WHERE per_id = ?";
		if ($stmt = $db->prepare($query)) {
			$stmt->bind_param("i", $user_id);
			$stmt->execute();
			$stmt->store_result();
			if ($stmt->num_rows == 1) {
				$stmt->bind_result($per_token);
				$stmt->fetch();
				MySQLManager::close();
				return $per_token == $token;
			}
		}
		MySQLManager::close();
		return false;
	}

	/**
	 * Disconnect the user removing the token that was distributed
	 *
	 * @access public
	 * @static
	 * @return boolean true if the user is considered logged in, false otherwise
	 */
	public static function disconnect($user_id) {
		// get a database handle
		$db = MySQLManager::get();
		if ($stmt = $db->prepare("UPDATE ccn_personne SET per_token = NULL WHERE per_id = ?")) {
			$stmt->bind_param("i", $user_id);
			$stmt->execute();
			$stmt->store_result();
			if ($stmt->num_rows == 1) {
				MySQLManager::close();
				return true;
			}
		}
		MySQLManager::close();
		return false;
	}
}
?>