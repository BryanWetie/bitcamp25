document.addEventListener("DOMContentLoaded", () => {
    // Handle file upload visual feedback
    const fileInput = document.getElementById('resume');
    const fileLabel = document.querySelector('.file-label');
    const profileForm = document.getElementById('profileForm');
    const skillsInput = document.getElementById('skills');
    const skillsContainer = document.getElementById('skillsContainer');
    const parsingStatus = document.getElementById('parsing-status');
    
    // Check if there's data in localStorage from signup
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    const storedRole = localStorage.getItem('userRole');
    
    // Pre-populate form with data from signup if available
    if (storedName) {
      document.getElementById('name').value = storedName;
    }
    
    if (storedEmail) {
      document.getElementById('email').value = storedEmail;
    }
    
    if (storedRole && document.getElementById('bio')) {
      document.getElementById('bio').value = `Former role: ${storedRole}`;
    }
    
    // Update completion progress based on filled fields
    function updateProgress() {
      const formInputs = profileForm.querySelectorAll('input[type="text"], input[type="email"], textarea');
      let filledCount = 0;
      
      formInputs.forEach(input => {
        if (input.value.trim() !== '') {
          filledCount++;
        }
      });
      
      const skillTags = skillsContainer.querySelectorAll('.skill-tag');
      if (skillTags.length > 0) {
        filledCount++; // Count skills as one field
      }
      
      const progressPercent = Math.min(Math.round((filledCount / formInputs.length) * 100), 100);
      
      const progressBar = document.querySelector('.progress');
      const progressText = document.querySelector('.progress-text');
      
      progressBar.style.width = `${progressPercent}%`;
      progressText.textContent = `Profile completion: ${progressPercent}%`;
    }
    
    // Initial progress calculation
    updateProgress();
    
    // Handle file upload visual feedback
    if (fileInput && fileLabel) {
      fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          const fileName = this.files[0].name;
          fileLabel.textContent = `Selected: ${fileName}`;
          
          // Show parsing status
          if (parsingStatus) {
            parsingStatus.style.display = 'block';
            
            // Call the resume parser function (defined in resume-parser.js)
            setTimeout(() => {
              parseResume(this.files[0]);
            }, 500);
          }
        }
      });
    }
    
    // Handle skills tags
    if (skillsInput && skillsContainer) {
      // Function to add a skill tag
      function addSkillTag(skillText) {
        if (skillText.trim()) {
          const skillTag = document.createElement('span');
          skillTag.className = 'skill-tag';
          skillTag.textContent = skillText.trim();
          
          // Add delete functionality
          skillTag.addEventListener('click', function() {
            this.remove();
            updateProgress();
          });
          
          skillsContainer.appendChild(skillTag);
          updateProgress();
        }
      }
      
      // Add skill on Enter or comma
      skillsInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const skillText = this.value.trim().replace(',', '');
          
          if (skillText) {
            addSkillTag(skillText);
            this.value = '';
          }
        }
      });
    }
    
    // Handle form submission
    if (profileForm) {
      profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get all form data
        const formData = new FormData(profileForm);
        const formValues = Object.fromEntries(formData.entries());
        
        // Get skills (they're not directly in the form)
        const skills = [];
        const skillTags = skillsContainer.querySelectorAll('.skill-tag');
        skillTags.forEach(tag => {
          skills.push(tag.textContent);
        });
        
        formValues.skills = skills;
        
        // In a real application, you would send this data to a server
        console.log('Profile data:', formValues);
        
        // For demo purposes, show success message
        alert('Profile saved successfully!');
        
        // Clear localStorage after saving
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
      });
    }
    
    // Listen for form changes to update progress
    const formElements = profileForm.querySelectorAll('input, textarea');
    formElements.forEach(element => {
      element.addEventListener('input', updateProgress);
    });
  });
  
  // Function to be called after fields are populated by the resume parser
  function updateFormAfterParsing() {
    // Trigger the input event on all form elements to update progress
    const formElements = document.querySelectorAll('#profileForm input, #profileForm textarea');
    formElements.forEach(element => {
      const event = new Event('input', { bubbles: true });
      element.dispatchEvent(event);
    });
  }