export const coursLoaders = {
  anatomie: () => import('./anatomie').then(m => m.COURS_ANATOMIE),
  chimie: () => import('./chimie').then(m => m.COURS_CHIMIE),
  biocell: () => import('./biocell').then(m => m.COURS_BIOCELL),
  biostats: () => import('./biostats').then(m => m.COURS_BIOSTATS),
  biophysique: () => import('./biophysique').then(m => m.COURS_BIOPHYSIQUE),
  ssh: () => import('./ssh').then(m => m.COURS_SSH),
};

export async function loadCoursForFiche(ficheId) {
  const subject = ficheId.split('-')[0];
  const loader = coursLoaders[subject];
  if (!loader) return null;
  const data = await loader();
  return data[ficheId] || null;
}
