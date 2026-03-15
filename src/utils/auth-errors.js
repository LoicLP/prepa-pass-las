/**
 * Messages d'erreur Supabase Auth en français.
 * Supabase renvoie les erreurs dans error.message (string).
 */
const AUTH_ERRORS = {
  'Invalid login credentials': 'Identifiants incorrects. Vérifiez votre e-mail et mot de passe.',
  'Email not confirmed': 'Veuillez confirmer votre e-mail avant de vous connecter.',
  'User already registered': 'Un compte existe déjà avec cet e-mail.',
  'Password should be at least 6 characters': 'Le mot de passe est trop faible. Minimum 6 caractères.',
  'Email rate limit exceeded': 'Trop de tentatives. Réessayez plus tard.',
  'For security purposes, you can only request this after': 'Trop de tentatives. Réessayez plus tard.',
  'Unable to validate email address: invalid format': 'Adresse e-mail invalide.',
  'Signups not allowed for this instance': 'Les inscriptions sont désactivées.',
  'User not found': 'Aucun compte ne correspond à cet e-mail.',
  'Network request failed': 'Erreur réseau. Vérifiez votre connexion internet.',
};

export function getAuthErrorMessage(error) {
  const message = error?.message || '';

  // Correspondance exacte
  if (AUTH_ERRORS[message]) return AUTH_ERRORS[message];

  // Correspondance partielle (certains messages Supabase incluent des détails supplémentaires)
  for (const [key, value] of Object.entries(AUTH_ERRORS)) {
    if (message.includes(key)) return value;
  }

  return 'Une erreur est survenue. Veuillez réessayer.';
}
