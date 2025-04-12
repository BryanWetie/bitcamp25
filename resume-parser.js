// Resume Parser Implementation
// This simulates parsing a resume and extracting information to fill out the form

function parseResume(file) {
    const parsingStatus = document.getElementById('parsing-status');
    
    // In a real implementation, you would send the file to a server for parsing
    // or use a library like pdf.js for PDFs or mammoth.js for Word documents
    
    // For demonstration purposes, we'll simulate parsing with a timeout
    setTimeout(() => {
      try {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        // Different handling based on file type
        if (fileExtension === 'pdf') {
          simulatePdfParsing(file);
        } else if (fileExtension === 'docx' || fileExtension === 'doc') {
          simulateWordParsing(file);
        } else if (fileExtension === 'txt') {
          simulateTextParsing(file);
        } else {
          throw new Error("Unsupported file format");
        }
        
        // Hide parsing status and show success message
        parsingStatus.innerHTML = '<span style="color: green;">Resume parsed successfully!</span>';
        setTimeout(() => {
          parsingStatus.style.display = 'none';
        }, 3000);
        
      } catch (error) {
        console.error("Error parsing resume:", error);
        parsingStatus.innerHTML = `<span style="color: red;">Error parsing resume: ${error.message}</span>`;
        setTimeout(() => {
          parsingStatus.style.display = 'none';
        }, 3000);
      }
    }, 1500); // Simulate processing time
  }
  
  function simulatePdfParsing(file) {
    // Mock data extraction from PDF
    const mockData = getMockResumeData();
    populateFormWithData(mockData);
  }
  
  function simulateWordParsing(file) {
    // Mock data extraction from Word document
    const mockData = getMockResumeData();
    populateFormWithData(mockData);
  }
  
  function simulateTextParsing(file) {
    // For text files, we could actually read the content in the browser
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const text = e.target.result;
      
      // Very simple parsing logic (would be more sophisticated in a real app)
      const lines = text.split('\n');
      const parsedData = {
        name: '',
        email: '',
        phone: '',
        skills: [],
        experience: '',
        bio: ''
      };
      
      // Extremely basic parsing - in reality, you'd use NLP or regex patterns
      for (let line of lines) {
        line = line.trim();
        
        // Try to identify what each line might be
        if (line.includes('@') && !parsedData.email) {
          parsedData.email = line;
        } else if (/^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/.test(line.replace(/\D/g, '')) && !parsedData.phone) {
          parsedData.phone = line;
        } else if (line.length > 0 && !parsedData.name) {
          parsedData.name = line; // Assume first non-empty line is name
        } else if (line.toLowerCase().includes('skills:')) {
          // Extract skills from a line like "Skills: JavaScript, HTML, CSS"
          const skillsText = line.split(':')[1];
          if (skillsText) {
            parsedData.skills = skillsText.split(',').map(skill => skill.trim());
          }
        } else if (line.toLowerCase().includes('experience:')) {
          parsedData.experience = lines.slice(lines.indexOf(line) + 1).join('\n');
        }
      }
      
      populateFormWithData(parsedData);
    };
    
    reader.readAsText(file);
  }
  
  function getMockResumeData() {
    // Mock data that would come from a resume parser
    return {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "(555) 123-4567",
      skills: ["JavaScript", "React", "HTML/CSS", "Node.js", "Python"],
      experience: "Senior Web Developer - TechCorp (2020-2024)\n- Led development of company's main product\n- Managed team of 5 junior developers\n\nFrontend Developer - WebSolutions (2018-2020)\n- Developed responsive web applications",
      bio: "Experienced web developer with a passion for creating user-friendly applications. Strong background in frontend technologies and team leadership."
    };
  }
  
  function populateFormWithData(data) {
    // Fill form fields with extracted data
    if (data.name) document.getElementById('name').value = data.name;
    if (data.email) document.getElementById('email').value = data.email;
    if (data.phone) document.getElementById('phone').value = data.phone;
    
    // Add skills as tags
    if (data.skills && data.skills.length > 0) {
      const skillsContainer = document.getElementById('skillsContainer');
      skillsContainer.innerHTML = ''; // Clear existing skills
      
      data.skills.forEach(skill => {
        if (skill.trim()) {
          const skillTag = document.createElement('span');
          skillTag.className = 'skill-tag';
          skillTag.textContent = skill.trim();
          
          // Add delete functionality
          skillTag.addEventListener('click', function() {
            this.remove();
          });
          
          skillsContainer.appendChild(skillTag);
        }
      });
    }
    
    // Fill experience and bio text areas
    if (data.experience) document.getElementById('experience').value = data.experience;
    if (data.bio) document.getElementById('bio').value = data.bio;
    
    // Update form progress
    updateFormAfterParsing();
  }