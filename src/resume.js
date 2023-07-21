const fs = require('fs');

function exportResume(resumeJSON) {
  fs.writeFile('output/resume.json', JSON.stringify(resumeJSON, null, 2), (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File written successfully.');
    }
  });
}

module.exports = {
  exportResume
};