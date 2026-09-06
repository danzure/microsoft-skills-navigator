



/**
 * Checks if a certification is retiring in the future.
 * @param {Object} cert - The certification object.
 * @returns {boolean} True if the certification has a retirement date in the future.
 */
export const isRetiring = (cert) => {
  if (!cert.retirementDate) return false;
  return new Date(cert.retirementDate) > new Date();
};

/**
 * Checks if a certification has already retired.
 * @param {Object} cert - The certification object.
 * @returns {boolean} True if the certification has a retirement date in the past.
 */
export const isRetired = (cert) => {
  if (!cert.retirementDate) return false;
  return new Date(cert.retirementDate) <= new Date();
};

/**
 * Formats a date string into a localized, human-readable format.
 * @param {string} dateStr - The date string to format.
 * @returns {string} The formatted date (e.g., 'January 1, 2024').
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Gets the URL for the official Microsoft certification badge icon.
 * @param {string} level - The level of the certification (e.g., 'Fundamentals').
 * @param {string} certId - The unique ID of the certification.
 * @returns {string|null} The URL of the badge SVG, or null if not found.
 */
export const getBadgeUrl = (level, certId) => {
  if (certId === 'ab-730' || certId === 'ab-700') return 'https://learn.microsoft.com/en-us/media/learn/certification/badges/ai-business-professional.svg';
  if (certId === 'ab-731' || certId === 'ab-701') return 'https://learn.microsoft.com/en-us/media/learn/certification/badges/ai-transformation-leader.svg';

  const base = 'https://learn.microsoft.com/en-us/media/learn/certification/badges/microsoft-certified-';
  switch (level) {
    case 'Fundamentals': return base + 'fundamentals-badge.svg';
    case 'Associate': return base + 'associate-badge.svg';
    case 'Expert': return base + 'expert-badge.svg';
    case 'Specialty': return base + 'specialty-badge.svg';
    default: return null;
  }
};

/**
 * Gets the URL for the official Microsoft Applied Skills credential badge icon.
 * @returns {string} The URL of the official Applied Skills badge SVG.
 */
export const getAppliedSkillBadgeUrl = () => 'https://learn.microsoft.com/en-us/media/learn/credential/badges/applied-skill.svg';
