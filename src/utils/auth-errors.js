const AUTH_ERRORS = {
  'auth/user-not-found': 'Aucun compte ne correspond à cet e-mail.',
  'auth/wrong-password': 'Mot de passe incorrect.',
  'auth/invalid-email': 'Adresse e-mail invalide.',
  'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
  'auth/invalid-credential': 'Identifiants incorrects. Vérifiez votre e-mail et mot de passe.',
  'auth/email-already-in-use': 'Un compte existe déjà avec cet e-mail.',
  'auth/weak-password': 'Le mot de passe est trop faible. Minimum 6 caractères.',
  'auth/network-request-failed': 'Erreur réseau. Vérifiez votre connexion internet.',
  'auth/user-disabled': 'Ce compte a été désactivé.',
  'auth/operation-not-allowed': 'Cette méthode de connexion n\'est pas activée.',
};

export function getAuthErrorMessage(error) {
  const code = error?.code || '';
  return AUTH_ERRORS[code] || 'Une erreur est survenue. Veuillez réessayer.';
}
