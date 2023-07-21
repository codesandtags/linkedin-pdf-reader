const fs = require('fs');

function removePageInfo(text) {
  return text.replace(/Page\s*\d+\s*of\s*\d+/g, '').trim();
}

function extractContact(content) {
  const phoneMatch = content.match(/Contact(ar)?\s*\n\s*(\+\d+\s+\d+\s+\d+)\s*\n/);
  const emailMatch = content.match(/(.*@.*\..*)\s*\n/);
  const linkedinMatch = content.match(/(www\.linkedin\.com\/in\/.*)\s*\n/);
  const blogMatch = content.match(/(www\..*\/blog)\s*\n/);
  const personalWebsiteMatch = content.match(/(www\..*\/)\s*\n/);

  return {
    phone: phoneMatch ? phoneMatch[2] : null,
    email: emailMatch ? emailMatch[1] : null,
    linkedin: linkedinMatch ? linkedinMatch[1] : null,
    blog: blogMatch ? blogMatch[1] : null,
    personalWebsite: personalWebsiteMatch ? personalWebsiteMatch[1] : null
  };
}

function extractSkills(content) {
  const skillsMatch = content.match(/(Aptitudes principales|Top Skills)\s*\n\s*([\s\S]*?)\s*\n(Languages|Certifications|Idiomas|Certificaciones)/);
  return skillsMatch ? removePageInfo(skillsMatch[2]).split('\n') : [];
}

function extractCertifications(content) {
  const certificationsMatch = content.match(/(Certifications|Certificaciones)\s*\n\s*([\s\S]*?)\s*\n(Honors-Awards|Experience|Honores y premios|Experiencia)/);
  return certificationsMatch ? removePageInfo(certificationsMatch[2]).split('\n') : [];
}

function extractSummary(content) {
  const summaryMatch = content.match(/(Summary|Extracto)\s*\n\s*([\s\S]*?)\s*\n(Technical Skills|Experiencia|Habilidades técnicas|Experience)/);
  return summaryMatch ? removePageInfo(summaryMatch[2]).replace(/\n/g, ' ') : null;
}

function extractExperience(content) {
  const experienceMatch = content.match(/(Experiencia|Experience)\s*\n\s*([\s\S]*?)\s*\n(Education|Educación)/);
  if (!experienceMatch) return [];

  const experiences = removePageInfo(experienceMatch[2]).split('\n\n').map((experience) => {
    const [company, role, duration] = experience.split('\n');
    return { company, role, duration };
  });

  return experiences;
}

function extractEducation(content) {
  const educationMatch = content.match(/(Education|Educación)\s*\n\s*([\s\S]*?)\s*\n$/);
  return educationMatch ? removePageInfo(educationMatch[2]).split('\n') : [];
}

function parsePdfContent(content) {
  return {
    contact: extractContact(content),
    mainSkills: extractSkills(content),
    certifications: extractCertifications(content),
    summary: extractSummary(content),
    experience: extractExperience(content),
    education: extractEducation(content)
  };
}

module.exports = {
  parsePdfContent,
};
