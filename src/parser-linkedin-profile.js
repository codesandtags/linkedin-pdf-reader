const resumeSchema = {
  contact: {
    phone: "",
    email: "",
    linkedin: "",
    blog: "",
    personalWebsite: "",
    name: "",
    title: "",
    location: "",
  },
  languages: [],
  honorsAwards: [],
  publications: [],
  mainSkills: [],
  certifications: [],
  summary: "",
  experience: [
    {
      company: "",
      role: "",
      duration: "",
    },
  ],
  education: [
    {
      school: "",
      degree: "",
      duration: "",
    },
  ],
};

function removePageInfo(text) {
  return text.replace(/Page\s*\d+\s*of\s*\d+/g, "").trim();
}

function extractContact(content) {
  // This regular expression matches the word "Contact" or "Contactar" followed by a newline,
  // any amount of whitespace, and then a phone number in the format "+X Y Z" (where X, Y, and Z are sequences of digits),
  // followed by a newline. If a match is found, it's stored in `phoneMatch`.
  const phoneMatch = content.match(/(?<=Contact\n)(\d+)(?=\n\(Mobile\))/);
  // This regular expression matches any text that includes an "@" symbol and a period (which are common in email addresses),
  // followed by a newline. If a match is found, it's stored in `emailMatch`.
  const emailMatch = content.match(/(.*@.*\..*)\s*\n/);

  // This regular expression matches a LinkedIn URL, followed by a newline. If a match is found, it's stored in `linkedinMatch`.
  const linkedinMatch = content.match(/(www\.linkedin\.com\/in\/.*)\s*\n/);

  // This regular expression matches a URL that includes "/blog", followed by a newline. If a match is found, it's stored in `blogMatch`.
  const blogMatch = content.match(/(www\..*\/blog)\s*\n/);

  // This regular expression matches a URL, followed by a newline. If a match is found, it's stored in `personalWebsiteMatch`.
  const personalWebsiteMatch = content.match(/(www\..*\/)\s*\n/);

  // The function then returns an object with the extracted contact information.
  // For each piece of contact information, it checks if a match was found (i.e., if the match variable is not `null`).
  // If a match was found, it includes the matched text in the returned object; if not, it includes `null`.

  let lines = content.split('\n');
  let summaryIndex = lines.indexOf('Summary');
  let location = lines[summaryIndex - 1].trim();
  let title = lines[summaryIndex - 2].trim();
  let name = lines[summaryIndex - 3].trim();

  return {
    phone: phoneMatch ? phoneMatch[1] : null,
    email: emailMatch ? emailMatch[1] : null,
    linkedin: linkedinMatch ? linkedinMatch[1] : null,
    blog: blogMatch ? blogMatch[1] : null,
    personalWebsite: personalWebsiteMatch ? personalWebsiteMatch[1] : null,
    location,
    title,
    name
  };
}

function extractSkills(content) {
  // This regular expression matches the phrases "Aptitudes principales" or "Top Skills" followed by a newline,
  // any amount of whitespace, and then any sequence of characters (including newlines),
  // up until it encounters a newline followed by "Languages", "Certifications", "Idiomas", or "Certificaciones".
  // This is designed to capture a list of skills that are listed after "Aptitudes principales" or "Top Skills" and before
  // the next section of the resume, which could be "Languages", "Certifications", "Idiomas", or "Certificaciones".
  // If a match is found, it's stored in `skillsMatch`.
  const skillsMatch = content.match(
    /(Aptitudes principales|Top Skills)\s*\n\s*([\s\S]*?)\s*\n(Languages|Certifications|Idiomas|Certificaciones)/
  );

  // The function then checks if a match was found (i.e., if `skillsMatch` is not `null`).
  // If a match was found, it removes the page information from the matched text, splits the text into lines (using the newline character as the separator),
  // and returns the resulting array of lines. If no match was found, it returns an empty array.
  return skillsMatch ? removePageInfo(skillsMatch[2]).split("\n") : [];
}

function extractCertifications(content) {
  // This regular expression matches the phrases "Certifications" or "Certificaciones" followed by a newline,
  // any amount of whitespace, and then any sequence of characters (including newlines),
  // up until it encounters a newline followed by "Honors-Awards", "Experience", "Honores y premios", or "Experiencia".
  // This is designed to capture a list of certifications that are listed after "Certifications" or "Certificaciones" and before
  // the next section of the resume. If a match is found, it's stored in `certificationsMatch`.
  const certificationsMatch = content.match(
    /(Certifications|Certificaciones)\s*\n\s*([\s\S]*?)\s*\n(Honors-Awards|Experience|Honores y premios|Experiencia)/
  );

  // If a match was found, it removes the page information from the matched text, splits the text into lines (using the newline character as the separator),
  // and returns the resulting array of lines. If no match was found, it returns an empty array.
  return certificationsMatch
    ? removePageInfo(certificationsMatch[2]).split("\n").join(' ')
    : '';
}

function extractSummary(content) {
  // This regular expression matches the phrases "Summary" or "Extracto" followed by a newline,
  // any amount of whitespace, and then any sequence of characters (including newlines),
  // up until it encounters a newline followed by "Technical Skills", "Experiencia", "Habilidades técnicas", or "Experience".
  // This is designed to capture the summary that is listed after "Summary" or "Extracto" and before
  // the next section of the resume. If a match is found, it's stored in `summaryMatch`.
  const summaryMatch = content.match(
    /(Summary|Extracto)\s*\n\s*([\s\S]*?)\s*\n(Technical Skills|Experiencia|Habilidades técnicas|Experience)/
  );

  // If a match was found, it removes the page information from the matched text, replaces newline characters with spaces (to form a single string),
  // and returns the resulting string. If no match was found, it returns null.
  return summaryMatch
    ? removePageInfo(summaryMatch[2]).replace(/\n/g, " ")
    : null;
}

function extractExperience(content) {
  // This regular expression matches the phrases "Experiencia" or "Experience" followed by a newline,
  // any amount of whitespace, and then any sequence of characters (including newlines),
  // up until it encounters a newline followed by "Education" or "Educación".
  // This is designed to capture the experience section that is listed after "Experiencia" or "Experience" and before
  // the next section of the resume. If a match is found, it's stored in `experienceMatch`.
  const experienceMatch = content.match(
    /(Experiencia|Experience)\s*\n\s*([\s\S]*?)\s*\n(Education|Educación)/
  );

  // If no match was found, it returns an empty array.
  if (!experienceMatch) return [];

  // If a match was found, it removes the page information from the matched text, splits the text into separate experiences (using two newline characters as the separator),
  // and maps each experience to an object with `company`, `role`, and `duration` properties.
  // Each experience is assumed to be formatted as three lines: the first line is the company, the second line is the role, and the third line is the duration.
  const experiences = removePageInfo(experienceMatch[2])
    .split("\n\n")
    .map((experience) => {
      const [company, role, duration] = experience.split("\n");
      return { company, role, duration };
    });

  // It returns the resulting array of experience objects.
  return experiences;
}

function extractEducation(content) {
  // This regular expression matches the phrases "Education" or "Educación" followed by a newline,
  // any amount of whitespace, and then any sequence of characters (including newlines),
  // up until it encounters a newline followed by the end of the string.
  // This is designed to capture the education section that is listed after "Education" or "Educación" and before
  // the end of the resume. If a match is found, it's stored in `educationMatch`.
  const educationMatch = content.match(
    /(Education|Educación)\s*\n\s*([\s\S]*?)\s*\n$/
  );

  // If a match was found, it removes the page information from the matched text, splits the text into lines (using the newline character as the separator),
  // and returns the resulting array of lines. If no match was found, it returns an empty array.
  const educationStr = educationMatch ? removePageInfo(educationMatch[2]) : '';
  let educationRegex = /(.+?)\n((?:.+\n)*?)· \((.+?)\)/g;
  let educationObjArray = [];
  let match;
  
  while ((match = educationRegex.exec(educationStr)) !== null) {
      educationObjArray.push({
          institution: match[1].trim(),
          degree: match[2].replace(/\n/g, ' ').trim(),
          duration: match[3].trim(),
      });
  }

  return educationObjArray;
}

function extractLanguages(content) {
  // This regular expression matches the phrase "Languages" followed by a newline,
  // any amount of whitespace, and then any sequence of characters (including newlines),
  // up until it encounters a newline followed by "Certifications".
  // This is designed to capture the languages section that is listed after "Languages" and before "Certifications".
  // If a match is found, it's stored in `languagesMatch`.
  const languagesMatch = content.match(/(?<=Languages\n)([\s\S]*?)(?=\nCertifications)/);

  // If a match was found, it removes the page information from the matched text, splits the text into lines (using the newline character as the separator),
  // and returns the resulting array of lines. If no match was found, it returns an empty array.
  const languagesArray = languagesMatch ? removePageInfo(languagesMatch[1]).split("\n") : [];
  const languagesObjArray = [];

    for (let i = 0; i < languagesArray.length; i += 2) {
      languagesObjArray.push({
          language: languagesArray[i],
          level: languagesArray[i + 1]
      });
  }

  return languagesObjArray;
}

function extractHonorsAwards(content) {
  // This regular expression matches the phrase "Honors-Awards" followed by a newline,
  // any amount of whitespace, and then any sequence of characters (including newlines),
  // up until it encounters a newline followed by "Publications".
  // This is designed to capture the honors and awards section that is listed after "Honors-Awards" and before "Publications".
  // If a match is found, it's stored in `honorsAwardsMatch`.
  const honorsAwardsMatch = content.match(
    /Honors-Awards\s*\n\s*([\s\S]*?)\s*\n(Publications)/
  );

  // If a match was found, it removes the page information from the matched text, splits the text into lines (using the newline character as the separator),
  // and returns the resulting array of lines. If no match was found, it returns an empty array.
  return honorsAwardsMatch
    ? removePageInfo(honorsAwardsMatch[1]).split("\n")
    : [];
}

function extractPublications(content) {
  // This regular expression matches the phrase "Publications" followed by a newline,
  // any amount of whitespace, and then any sequence of characters (including newlines),
  // up until it encounters a newline followed by the end of the string.
  // This is designed to capture the publications section that is listed after "Publications" and before the end of the resume.
  // If a match is found, it's stored in `publicationsMatch`.
  const publicationsMatch = content.match(
    /Publications\s*\n\s*([\s\S]*?)\s*\n$/
  );

  // If a match was found, it removes the page information from the matched text, splits the text into lines (using the newline character as the separator),
  // and returns the resulting array of lines. If no match was found, it returns an empty array.
  return publicationsMatch
    ? removePageInfo(publicationsMatch[1]).split("\n")
    : [];
}

function parsePdfContent(content) {
  return {
    ...resumeSchema,
    contact: {
      ...resumeSchema.contact,
      ...extractContact(content),
    },
    languages: extractLanguages(content),
    honorsAwards: extractHonorsAwards(content),
    publications: extractPublications(content),
    mainSkills: extractSkills(content),
    certifications: extractCertifications(content),
    summary: extractSummary(content),
    experience: extractExperience(content),
    education: extractEducation(content),
  };
}

module.exports = {
  parsePdfContent,
};
