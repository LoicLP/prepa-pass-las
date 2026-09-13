/* Format des épreuves par faculté, d'après les MCC / syllabus consultés (voir MCC dans facs.js
   pour les sources). Tout est indicatif : les universités changent leurs maquettes chaque année.
   - exams : épreuves rattachées à nos six UE (subject), avec nombre de QCM, durée en minutes,
     coefficient (coeff, ECTS ou coefficient officiel) et format ('qcm', 'qru', 'qcm+qr', 'qcm+qroc')
   - dates : partiels S1/S2 attendus pour 2026-2027, extrapolés du calendrier 2025-2026 (approx: true)
   - threshold : note éliminatoire sur 20 quand elle existe
   - formats : particularités des questions (propositions, item F, QCD vrai/faux, QRU par matière) */

const D = (min) => min; // lisibilité

export const FAC_EXAMS = {
  'paris-cite': {
    formats: { propositions: 5, qroc: ['ssh'] },
    exams: [
      { subject: 'chimie', label: 'Chimie · Biochimie', minutes: 90, format: 'qcm' },
      { subject: 'biocell', label: 'Biologie cellulaire · Embryologie', minutes: 90, format: 'qcm' },
      { subject: 'biophysique', label: 'Physique · Biophysique', minutes: 90, format: 'qcm' },
      { subject: 'biostats', label: 'Maths · Biostatistiques', minutes: 60, format: 'qcm' },
      { subject: 'anatomie', label: 'Anatomie', minutes: 45, format: 'qcm' },
      { subject: 'ssh', label: 'SHS (QROC)', minutes: 90, format: 'qroc' },
      { subject: 'histo', label: 'Embryologie · Histologie', minutes: 60, format: 'qcm' },
      { subject: 'medicament', label: 'Médicaments', minutes: 45, format: 'qcm' },
      { subject: 'physiologie', label: 'Physiologie', minutes: 60, format: 'qcm' },
    ],
  },
  sorbonne: {
    formats: { propositions: 5, toutOuRien: ['physiologie'] },
    exams: [
      { subject: 'chimie', label: 'UE1 Biochimie · Chimie', questions: 30, minutes: 60, coeff: 8, format: 'qcm' },
      { subject: 'biocell', label: 'UE2 La cellule et les tissus', minutes: 90, coeff: 9, format: 'qcm' },
      { subject: 'anatomie', label: 'UE5 Anatomie', minutes: 45, coeff: 6, format: 'qcm' },
      { subject: 'biophysique', label: 'UE3B Biophysique', questions: 20, minutes: 60, coeff: 4, format: 'qcm' },
      { subject: 'biostats', label: 'UE4 Biostatistiques', questions: 20, minutes: 60, coeff: 4, format: 'qcm' },
      { subject: 'ssh', label: 'UE7 Santé, Société, Humanité', questions: 60, minutes: 60, coeff: 6, format: 'qcm' },
      { subject: 'physiologie', label: 'UE3P Physiologie', minutes: 45, coeff: 3, format: 'qcm' },
      { subject: 'medicament', label: 'UE6 Pharmacologie', questions: 50, minutes: 60, coeff: 4, format: 'qcm' },
    ],
  },
  'paris-saclay': {
    formats: { propositions: 5, qru: ['biostats'] },
    exams: [
      { subject: 'biocell', label: 'Biologie', minutes: 90, format: 'qcm' },
      { subject: 'chimie', label: 'Chimie · Biochimie', minutes: 90, format: 'qcm+qr' },
      { subject: 'biophysique', label: 'Physique', minutes: 120, format: 'qcm+qr' },
      { subject: 'biostats', label: 'Statistiques (QCS)', minutes: 60, format: 'qru' },
      { subject: 'anatomie', label: 'Anatomie', minutes: 45, format: 'qcm' },
      { subject: 'ssh', label: 'SHS', minutes: 60, format: 'qcm' },
      { subject: 'medicament', label: 'Médicament', minutes: 60, format: 'qcm' },
    ],
  },
  'lyon-est': {
    formats: { propositions: 5 },
    exams: [
      { subject: 'ssh', label: 'UE1 SHS · Santé publique', minutes: 45, format: 'qcm+qr' },
      { subject: 'chimie', label: 'UE2 Biochimie · Biologie moléculaire', minutes: 90, format: 'qcm' },
      { subject: 'biostats', label: 'UE3 Biostatistiques', minutes: 45, format: 'qcm' },
      { subject: 'biocell', label: 'UE5 Cellules et tissus', minutes: 90, format: 'qcm' },
      { subject: 'biophysique', label: 'UE6 Biophysique', minutes: 60, format: 'qcm' },
      { subject: 'anatomie', label: 'UE7 Anatomie', minutes: 45, format: 'qcm' },
      { subject: 'medicament', label: 'UE4 Médicaments', minutes: 45, format: 'qcm' },
      { subject: 'physiologie', label: 'UE8 Physiologie', minutes: 45, format: 'qcm' },
    ],
  },
  'lyon-sud': {
    formats: { propositions: 5 },
    exams: [
      { subject: 'ssh', label: 'UE1 SHS · Santé publique', minutes: 90, format: 'qcm' },
      { subject: 'chimie', label: 'UE2 Biochimie', minutes: 75, format: 'qcm' },
      { subject: 'biostats', label: 'UE3 Biostatistiques', minutes: 45, format: 'qcm' },
      { subject: 'biocell', label: 'UE5 Cellules et tissus', minutes: 75, format: 'qcm' },
      { subject: 'biophysique', label: 'UE6 Biophysique', minutes: 45, format: 'qcm' },
      { subject: 'anatomie', label: 'UE7 Anatomie', minutes: 40, format: 'qcm' },
      { subject: 'medicament', label: 'UE4 Médicaments', minutes: 40, format: 'qcm' },
      { subject: 'physiologie', label: 'UE8 Physiologie', minutes: 40, format: 'qcm' },
    ],
  },
  marseille: {
    formats: { propositions: 5 },
    exams: [
      { subject: 'chimie', label: 'UE1 Atome · Biomolécules · Métabolisme', minutes: 45, format: 'qcm' },
      { subject: 'anatomie', label: 'UE2/UE5 Physiologie · Anatomie', minutes: 45, format: 'qcm' },
      { subject: 'biostats', label: 'UE4 Méthodes d’analyses', minutes: 30, format: 'qcm' },
      { subject: 'biocell', label: 'UE9 Cellule et tissus', minutes: 60, format: 'qcm' },
      { subject: 'ssh', label: 'UE10 SHS', minutes: 50, format: 'qcm' },
      { subject: 'physiologie', label: 'UE2 Physiologie', minutes: 45, format: 'qcm' },
      { subject: 'medicament', label: 'UE8 Médicaments et santé', minutes: 60, format: 'qcm' },
    ],
  },
  lille: {
    threshold: 8,
    formats: { propositions: 5, qru: ['biophysique', 'biostats'] },
    exams: [
      { subject: 'chimie', label: 'UE1.1 Chimie & biochimie médicale', questions: 40, minutes: 90, format: 'qcm' },
      { subject: 'biocell', label: 'UE1.2 Biologie cellulaire & histologie', questions: 30, minutes: 60, format: 'qcm' },
      { subject: 'biophysique', label: 'UE1.3 Biophysique', questions: 30, minutes: 90, format: 'qru' },
      { subject: 'anatomie', label: 'UE1.4 Anatomie (+ schéma)', questions: 20, minutes: 60, format: 'qcm+qr' },
      { subject: 'ssh', label: 'UE1.6 SSH · Communication (+ QR)', questions: 20, minutes: 90, format: 'qcm+qr' },
      { subject: 'biostats', label: 'UE2.3 Biostatistiques', questions: 20, minutes: 75, format: 'qru' },
      { subject: 'medicament', label: 'UE1.5 Pharmacologie', questions: 30, minutes: 60, format: 'qcm' },
      { subject: 'histo', label: 'UE1.2 Biologie cellulaire & histologie', questions: 30, minutes: 60, format: 'qcm' },
    ],
  },
  bordeaux: {
    formats: { propositions: 5 },
    exams: [
      { subject: 'anatomie', label: 'Anatomie', questions: 25, minutes: 30, coeff: 1, format: 'qcm' },
      { subject: 'biostats', label: 'Mathématiques · Biostatistiques', questions: 9, minutes: 30, coeff: 1, format: 'qcm' },
      { subject: 'chimie', label: 'Chimie · Biochimie', minutes: 30, coeff: 1, format: 'qcm' },
      { subject: 'biocell', label: 'Biologie cellulaire', minutes: 30, coeff: 1, format: 'qcm' },
      { subject: 'biophysique', label: 'Biophysique', minutes: 30, coeff: 1, format: 'qcm' },
      { subject: 'ssh', label: 'SHS', minutes: 30, coeff: 1, format: 'qcm' },
      { subject: 'physiologie', label: 'Physiologie', minutes: 30, coeff: 1, format: 'qcm' },
      { subject: 'medicament', label: 'Médicament', minutes: 30, coeff: 1, format: 'qcm' },
      { subject: 'histo', label: 'Histologie · Embryologie', minutes: 30, coeff: 1, format: 'qcm' },
    ],
  },
  toulouse: {
    threshold: 8,
    formats: { propositions: 5 },
    exams: [
      { subject: 'chimie', label: 'UE1 Chimie · Génome · Biochimie', questions: 38, minutes: 90, format: 'qcm' },
      { subject: 'biocell', label: 'UE2 La cellule et les tissus', questions: 35, minutes: 45, format: 'qcm' },
      { subject: 'biophysique', label: 'UE3 Physique · Physiologie', questions: 28, minutes: 90, format: 'qcm' },
      { subject: 'biostats', label: 'UE4 Biostatistiques', questions: 18, minutes: 60, format: 'qcm' },
      { subject: 'anatomie', label: 'UE5 Anatomie', questions: 18, minutes: 30, format: 'qcm' },
      { subject: 'ssh', label: 'UE7 Santé publique · Société · Humanité', questions: 38, minutes: 45, format: 'qcm' },
      { subject: 'physiologie', label: 'UE3 Physique · Physiologie', questions: 28, minutes: 90, format: 'qcm' },
      { subject: 'medicament', label: 'UE6 Initiation à la connaissance du médicament', questions: 22, minutes: 60, format: 'qcm' },
      { subject: 'histo', label: 'UE2 La cellule et les tissus', questions: 35, minutes: 45, format: 'qcm' },
    ],
  },
  montpellier: {
    formats: { propositions: 6, itemF: true },
    exams: [
      { subject: 'chimie', label: 'UE1 Chimie · Biochimie', minutes: 60, format: 'qcm' },
      { subject: 'biocell', label: 'UE3 Cellules et tissus', minutes: 60, format: 'qcm' },
      { subject: 'ssh', label: 'ECUE SHS', minutes: 60, format: 'qcm' },
      { subject: 'biostats', label: 'UE8 Biostatistiques · Épidémiologie', minutes: 60, format: 'qcm' },
      { subject: 'biophysique', label: 'UE7 Physique · Biophysique', minutes: 90, format: 'qcm' },
      { subject: 'anatomie', label: 'UE9 Massif cranio-facial', minutes: 60, format: 'qcm' },
      { subject: 'physiologie', label: 'ECUE Physiologie humaine générale', minutes: 60, format: 'qcm' },
      { subject: 'medicament', label: 'ECUE Médicaments (MAPS)', minutes: 60, format: 'qcm' },
      { subject: 'histo', label: 'UE3 Cellules et tissus', minutes: 60, format: 'qcm' },
    ],
  },
  strasbourg: {
    formats: { propositions: 5, qcd: true },
    exams: [
      { subject: 'chimie', label: 'UE1 Constitution et transformation de la matière', minutes: 40, coeff: 5, format: 'qcm' },
      { subject: 'biocell', label: 'UE5 Cellule et histologie', minutes: 40, coeff: 5, format: 'qcm' },
      { subject: 'biostats', label: 'UE3 Mathématiques', minutes: 45, coeff: 3, format: 'qcm' },
      { subject: 'anatomie', label: 'UE4 Corps humain', minutes: 40, coeff: 4, format: 'qcm' },
      { subject: 'biophysique', label: 'UE6 Physique · Biophysique', minutes: 40, coeff: 4, format: 'qcm' },
      { subject: 'ssh', label: 'UE SHS', minutes: 40, coeff: 3, format: 'qcm' },
      { subject: 'physiologie', label: 'UE4 Corps humain', minutes: 40, coeff: 4, format: 'qcm' },
      { subject: 'histo', label: 'UE5 Cellule et histologie', minutes: 40, coeff: 5, format: 'qcm' },
    ],
  },
  nantes: {
    formats: { propositions: 5, toutOuRien: ['biophysique', 'anatomie', 'biostats', 'ssh'] },
    dates: { s1: '2026-12-14', s2: '2027-04-26', approx: true },
    exams: [
      { subject: 'chimie', label: 'Chimie · Biochimie (QIM)', coeff: 4, format: 'qcm' },
      { subject: 'biocell', label: 'Biologie cellulaire (QIM)', coeff: 2, format: 'qcm' },
      { subject: 'biophysique', label: 'Biophysique', coeff: 1.5, format: 'qcm' },
      { subject: 'anatomie', label: 'Anatomie', coeff: 1.5, format: 'qcm' },
      { subject: 'biostats', label: 'Biostatistiques', coeff: 1, format: 'qcm' },
      { subject: 'ssh', label: 'SHS', coeff: 2, format: 'qcm' },
      { subject: 'histo', label: 'Histologie · Embryologie (QIM)', coeff: 2, format: 'qcm' },
      { subject: 'physiologie', label: 'Physiologie', coeff: 2, format: 'qcm' },
      { subject: 'medicament', label: 'Médicament', coeff: 1, format: 'qcm' },
    ],
  },
  rennes: {
    formats: { propositions: 5, qroc: ['biostats'] },
    exams: [
      { subject: 'biocell', label: 'Biologie cellulaire · Histologie · Embryologie', minutes: 90, coeff: 9, format: 'qcm' },
      { subject: 'biostats', label: 'Biostatistiques (QCM + QCROC)', minutes: 90, coeff: 5, format: 'qcm+qroc' },
      { subject: 'chimie', label: 'Chimie · Biochimie', minutes: 90, coeff: 8, format: 'qcm' },
      { subject: 'biophysique', label: 'Biophysique · Physiologie', minutes: 90, coeff: 5, format: 'qcm' },
      { subject: 'ssh', label: 'Santé, Société, Humanité', minutes: 60, coeff: 5, format: 'qcm' },
      { subject: 'anatomie', label: 'Anatomie générale', minutes: 30, coeff: 4, format: 'qcm' },
      { subject: 'physiologie', label: 'Biophysique · Physiologie', minutes: 90, coeff: 5, format: 'qcm' },
      { subject: 'medicament', label: 'Pharmacologie', minutes: 30, coeff: 3, format: 'qcm' },
      { subject: 'histo', label: 'Biologie cellulaire · Histologie · Embryologie', minutes: 90, coeff: 9, format: 'qcm' },
    ],
  },
  grenoble: {
    formats: { propositions: 5 },
    exams: [
      { subject: 'chimie', label: 'UE1 Biochimie', minutes: 60, coeff: 8, format: 'qcm' },
      { subject: 'biocell', label: 'UE2 Histologie · Biologie cellulaire', minutes: 60, coeff: 10, format: 'qcm' },
      { subject: 'biophysique', label: 'UE3.1 Biophysique', minutes: 60, coeff: 6, format: 'qcm' },
      { subject: 'biostats', label: 'UE4 Biostatistiques', minutes: 30, coeff: 1, format: 'qcm' },
      { subject: 'anatomie', label: 'UE5 Anatomie', minutes: 60, coeff: 4, format: 'qcm' },
      { subject: 'ssh', label: 'UE7 Santé, Société, Humanité', minutes: 60, coeff: 4, format: 'qcm' },
      { subject: 'physiologie', label: 'UE3.2 Physiologie', minutes: 60, coeff: 4, format: 'qcm' },
      { subject: 'medicament', label: 'UE6 Initiation à la connaissance du médicament', minutes: 60, coeff: 3, format: 'qcm' },
      { subject: 'histo', label: 'UE2 Histologie · Biologie du développement', minutes: 60, coeff: 10, format: 'qcm' },
    ],
  },
  nice: {
    formats: { propositions: 5 },
    exams: [
      { subject: 'biocell', label: 'ECUE1 Biologie moléculaire · Cellulaire', minutes: 60, coeff: 1, format: 'qcm' },
      { subject: 'chimie', label: 'ECUE2 Chimie · Biochimie', minutes: 45, coeff: 1, format: 'qcm' },
      { subject: 'biophysique', label: 'ECUE3 Biophysique', minutes: 45, coeff: 1, format: 'qcm' },
      { subject: 'biostats', label: 'ECUE5 Biostatistiques · Santé numérique', minutes: 55, coeff: 1, format: 'qcm' },
      { subject: 'ssh', label: 'ECUE6 Éthique · Santé publique', minutes: 50, coeff: 1, format: 'qcm' },
      { subject: 'anatomie', label: 'ECUE7 Anatomie · Microbiologie', minutes: 55, coeff: 1, format: 'qcm' },
      { subject: 'physiologie', label: 'ECUE4 Physiologie · Pharmacologie', minutes: 60, coeff: 1, format: 'qcm' },
      { subject: 'medicament', label: 'ECUE4 Physiologie · Pharmacologie', minutes: 60, coeff: 1, format: 'qcm' },
      { subject: 'histo', label: 'ECUE8 Histologie · Embryologie', minutes: 50, coeff: 1, format: 'qcm' },
    ],
  },
  nancy: {
    formats: { propositions: 5, qroc: [] },
    exams: [
      { subject: 'chimie', label: 'UE Chimie · Biochimie', minutes: 60, format: 'qcm' },
      { subject: 'biocell', label: 'UE Biologie cellulaire', minutes: 60, format: 'qcm' },
      { subject: 'biophysique', label: 'UE Biophysique', minutes: 60, format: 'qcm' },
      { subject: 'anatomie', label: 'UE Anatomie', minutes: 60, format: 'qcm' },
      { subject: 'ssh', label: 'UE SHS', minutes: 60, format: 'qcm' },
      { subject: 'biostats', label: 'UE5 Biostatistiques', minutes: 30, format: 'qcm' },
      { subject: 'physiologie', label: 'UE Physiologie', minutes: 60, format: 'qcm' },
      { subject: 'medicament', label: 'UE Médicament', minutes: 60, format: 'qcm' },
      { subject: 'histo', label: 'UE Histologie · Embryologie', minutes: 60, format: 'qcm' },
    ],
  },
  rouen: {
    formats: { propositions: 5, qroc: ['anatomie', 'biocell', 'chimie', 'biophysique', 'biostats', 'ssh'] },
    exams: [
      { subject: 'anatomie', label: 'UE1 Anatomie', minutes: 60, format: 'qcm+qroc' },
      { subject: 'chimie', label: 'UE2 Biochimie', minutes: 60, format: 'qcm+qroc' },
      { subject: 'biocell', label: 'UE3 Biologie cellulaire', minutes: 60, format: 'qcm+qroc' },
      { subject: 'biophysique', label: 'UE10 Physique · Biophysique', minutes: 60, format: 'qcm+qroc' },
      { subject: 'biostats', label: 'UE6 Biostatistiques', minutes: 60, format: 'qcm+qroc' },
      { subject: 'ssh', label: 'UE11 SHS', minutes: 60, format: 'qcm+qroc' },
      { subject: 'histo', label: 'UE8 Histologie', minutes: 60, format: 'qcm+qroc' },
      { subject: 'physiologie', label: 'UE9 Physiologie', minutes: 60, format: 'qcm+qroc' },
    ],
  },
  amiens: { formats: { propositions: 5 }, exams: [] },
  antilles: {
    formats: { propositions: 5 },
    exams: [...(['chimie', 'biocell', 'biophysique', 'biostats', 'anatomie', 'ssh'].map((s) => ({ subject: s, label: 'UE santé', questions: 25, minutes: 30, coeff: 1, format: 'qcm' }))), { subject: 'physiologie', label: 'UE santé', questions: 25, minutes: 30, coeff: 1, format: 'qcm' }, { subject: 'medicament', label: 'UE santé', questions: 25, minutes: 30, coeff: 1, format: 'qcm' }, { subject: 'histo', label: 'UE santé', questions: 25, minutes: 30, coeff: 1, format: 'qcm' }],
  },
  reunion: {
    formats: { propositions: 5 },
    exams: [...(['chimie', 'biocell', 'biophysique', 'biostats', 'anatomie', 'ssh'].map((s) => ({ subject: s, label: 'UE santé', minutes: 60, format: 'qcm' }))), { subject: 'physiologie', label: 'UE1F Processus physiopathologiques', minutes: 60, format: 'qcm' }, { subject: 'medicament', label: 'UE1B Santé, maladie, thérapeutique, handicap', minutes: 60, format: 'qcm' }],
  },
  caen: { formats: { propositions: 5 }, dates: { s1: '2026-12-04', s2: '2027-04-23', approx: true }, exams: [] },
  angers: {
    formats: { propositions: 5 },
    dates: { s1: '2026-12-10', s2: '2027-05-03', approx: true },
    exams: [...(['chimie', 'biocell', 'biophysique', 'biostats', 'anatomie', 'ssh'].map((s) => ({ subject: s, label: 'UE tronc commun PluriPASS', questions: 40, minutes: 60, format: 'qcm' }))), { subject: 'physiologie', label: 'UE tronc commun PluriPASS', questions: 40, minutes: 60, format: 'qcm' }, { subject: 'medicament', label: 'UE tronc commun PluriPASS', questions: 40, minutes: 60, format: 'qcm' }, { subject: 'histo', label: 'UE tronc commun PluriPASS', questions: 40, minutes: 60, format: 'qcm' }],
  },
  brest: {
    formats: { propositions: 5 },
    dates: { s1: '2026-12-08', s2: null, approx: true },
    exams: [
      { subject: 'anatomie', label: 'UE5 Anatomie', questions: 20, minutes: 60, format: 'qcm' },
      { subject: 'ssh', label: 'UE7 Santé publique (+ rédactionnel)', questions: 20, minutes: 60, format: 'qcm+qr' },
      { subject: 'chimie', label: 'Tronc commun', minutes: 60, format: 'qcm' },
      { subject: 'biocell', label: 'Tronc commun', minutes: 60, format: 'qcm' },
      { subject: 'biophysique', label: 'Tronc commun', minutes: 60, format: 'qcm' },
      { subject: 'biostats', label: 'Tronc commun', minutes: 60, format: 'qcm' },
      { subject: 'medicament', label: 'UE6 Initiation à la connaissance du médicament', questions: 30, minutes: 60, format: 'qcm' },
      { subject: 'physiologie', label: 'Tronc commun', minutes: 60, format: 'qcm' },
      { subject: 'histo', label: 'Tronc commun', minutes: 60, format: 'qcm' },
    ],
  },
  poitiers: {
    formats: { propositions: 5 },
    exams: [...(['chimie', 'biocell', 'biophysique', 'biostats', 'anatomie', 'ssh'].map((s) => ({ subject: s, label: 'UE santé (LAS)', questions: 40, minutes: 90, format: 'qcm' }))), { subject: 'physiologie', label: 'UE santé (LAS)', questions: 40, minutes: 90, format: 'qcm' }, { subject: 'medicament', label: 'UE santé (LAS)', questions: 40, minutes: 90, format: 'qcm' }, { subject: 'histo', label: 'UE santé (LAS)', questions: 40, minutes: 90, format: 'qcm' }],
  },
  limoges: {
    formats: { propositions: 5 },
    exams: [
      { subject: 'chimie', label: 'M1 Chimie · Biochimie', minutes: 45, format: 'qcm' },
      { subject: 'biocell', label: 'M2 La cellule et les tissus', minutes: 45, format: 'qcm' },
      { subject: 'biophysique', label: 'M3 Biophysique · Mathématiques', minutes: 90, format: 'qcm' },
      { subject: 'biostats', label: 'M3 Biophysique · Mathématiques', minutes: 90, format: 'qcm' },
      { subject: 'ssh', label: 'M4 SHS', minutes: 30, format: 'qcm' },
      { subject: 'anatomie', label: 'M5 Anatomie générale', minutes: 60, format: 'qcm' },
      { subject: 'medicament', label: 'M6 Le médicament', minutes: 60, format: 'qcm' },
      { subject: 'histo', label: 'M2 · M8 La cellule et les tissus', minutes: 60, format: 'qcm' },
    ],
  },
  clermont: {
    formats: { propositions: 5, qroc: ['anatomie', 'chimie', 'biostats'] },
    exams: [
      { subject: 'anatomie', label: 'UE1 Anatomie', minutes: 60, format: 'qcm+qroc' },
      { subject: 'biocell', label: 'UE3 Biologie cellulaire', minutes: 60, format: 'qcm' },
      { subject: 'chimie', label: 'UE4 Biochimie structurale', minutes: 60, format: 'qcm+qroc' },
      { subject: 'biostats', label: 'UE9 Outils méthodologiques de la santé', minutes: 60, format: 'qcm+qroc' },
      { subject: 'physiologie', label: 'UE2 Physiologie', minutes: 60, format: 'qcm+qroc' },
      { subject: 'histo', label: 'UE5 Embryologie · Histologie', minutes: 60, format: 'qcm+qroc' },
      { subject: 'medicament', label: 'UE7 Le médicament', minutes: 45, format: 'qcm+qroc' },
    ],
  },
  dijon: {
    formats: { propositions: 5 },
    exams: [
      { subject: 'anatomie', label: 'Morphologie · Physiologie I', coeff: 5, format: 'qcm' },
      { subject: 'chimie', label: 'Chimie · Biochimie', coeff: 7, format: 'qcm' },
      { subject: 'biophysique', label: 'Biophysique', coeff: 4, format: 'qcm' },
      { subject: 'biocell', label: 'Biologie cellulaire', coeff: 6, format: 'qcm' },
      { subject: 'biostats', label: 'Santé publique', coeff: 5, format: 'qcm' },
      { subject: 'ssh', label: 'Communication · Déontologie', coeff: 3, format: 'qcm' },
      { subject: 'physiologie', label: 'Morphologie · Physiologie II', coeff: 3, format: 'qcm' },
      { subject: 'medicament', label: 'Médicament', coeff: 2, format: 'qcm' },
    ],
  },
  besancon: {
    threshold: 8,
    formats: { propositions: 5 },
    exams: [
      { subject: 'chimie', label: 'UE1 Chimie · Biochimie · Génome', minutes: 90, coeff: 7, format: 'qcm' },
      { subject: 'biocell', label: 'UE2 La cellule et les tissus', minutes: 90, coeff: 7, format: 'qcm' },
      { subject: 'biophysique', label: 'UE3 Physique · Biophysique', minutes: 90, coeff: 6, format: 'qcm' },
      { subject: 'biostats', label: 'UE4 Biostatistiques', minutes: 90, coeff: 4, format: 'qcm' },
      { subject: 'anatomie', label: 'UE5 Anatomie · Physiologie', minutes: 90, coeff: 5, format: 'qcm' },
      { subject: 'ssh', label: 'UE7 Santé Société Humanité (+ QR)', minutes: 90, coeff: 7, format: 'qcm+qr' },
      { subject: 'physiologie', label: 'UE5 Anatomie · Physiologie', minutes: 90, coeff: 5, format: 'qcm' },
      { subject: 'medicament', label: 'UE6 Connaissance du médicament', minutes: 60, coeff: 4, format: 'qcm' },
      { subject: 'histo', label: 'UE2 La cellule et les tissus', minutes: 90, coeff: 7, format: 'qcm' },
    ],
  },
  reims: {
    formats: { propositions: 5 },
    exams: [
      { subject: 'anatomie', label: 'UE 1.3 Santé 1 : anatomie · histologie · physiologie', minutes: 150, format: 'qcm' },
      { subject: 'chimie', label: 'UE 1.4 Santé 2 : chimie · biochimie · biologie cellulaire', minutes: 150, format: 'qcm' },
      { subject: 'biocell', label: 'UE 1.4 Santé 2 : chimie · biochimie · biologie cellulaire', minutes: 150, format: 'qcm' },
      { subject: 'ssh', label: 'SHS', minutes: 90, format: 'qcm' },
      { subject: 'physiologie', label: 'UE 1.3 Santé 1 : anatomie · histologie · physiologie', minutes: 150, format: 'qcm' },
      { subject: 'histo', label: 'UE 1.3 Santé 1 : anatomie · histologie · physiologie', minutes: 150, format: 'qcm' },
    ],
  },
  tours: {
    formats: { propositions: 5 },
    exams: [
      { subject: 'chimie', label: 'Module Chimie · Biochimie', minutes: 90, format: 'qcm' },
      { subject: 'biocell', label: 'Module Biologie cellulaire', minutes: 90, format: 'qcm' },
      { subject: 'biophysique', label: 'Module Biophysique', minutes: 90, format: 'qcm' },
      { subject: 'anatomie', label: 'Module Anatomie', minutes: 90, format: 'qcm' },
      { subject: 'ssh', label: 'Module SHS', minutes: 90, format: 'qcm' },
      { subject: 'biostats', label: 'Module 8 Biostatistiques (+ QR)', minutes: 150, format: 'qcm+qr' },
      { subject: 'physiologie', label: 'Module Physiologie', minutes: 90, format: 'qcm' },
      { subject: 'medicament', label: 'Module Médicament', minutes: 90, format: 'qcm' },
      { subject: 'histo', label: 'Module Histologie · Embryologie', minutes: 90, format: 'qcm' },
    ],
  },
  'saint-etienne': { formats: { propositions: 5, qru: [] }, exams: [] },
  versailles: { formats: { propositions: 5 }, exams: [] },
  upec: { formats: { propositions: 5 }, exams: [] },
};

export const facExams = (facId) => (facId && FAC_EXAMS[facId]) || null;

/** UE du programme de la fac (nos identifiants), dans l'ordre des épreuves, avec le libellé local.
    null quand la fac est inconnue ou que ses épreuves ne sont pas renseignées : tout le programme s'applique. */
export function facProgram(facId) {
  const f = facExams(facId);
  if (!f?.exams?.length) return null;
  const order = []; const labels = {};
  for (const e of f.exams) { if (!order.includes(e.subject)) { order.push(e.subject); labels[e.subject] = e.label; } }
  return { order, labels };
}

/** Épreuve de la fac pour une de nos UE, ou null. */
export function examFor(facId, subject) {
  const f = facExams(facId);
  return f?.exams?.find((e) => e.subject === subject) || null;
}

/** Coefficients par UE (nos six) d'après la fac, sinon null. */
export function facCoeffs(facId) {
  const f = facExams(facId);
  if (!f?.exams?.some((e) => e.coeff)) return null;
  const out = {};
  for (const e of f.exams) if (e.coeff && !out[e.subject]) out[e.subject] = e.coeff;
  return out;
}

export const fmtMinutes = (m) => (!m ? '' : m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${String(m % 60).padStart(2, '0')}` : ''}` : `${m} min`);
