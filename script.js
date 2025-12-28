console.log('script.js dimuat!');

// DOM Elements dengan type casting yang tepat
const registerModal = document.getElementById('registerModal');
const successModal = document.getElementById('successModal');
const openRegisterBtn = document.getElementById('openRegisterModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const closeSuccessBtn = document.getElementById('closeSuccessModal');
const exploreBtn = document.getElementById('exploreBtn');
const registerForm = document.getElementById('registerForm'); // Tetap sebagai HTMLElement
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const progressFill = document.getElementById('progressFill');
const currentStep = document.getElementById('currentStep');

// Debug: Cek elemen yang ditemukan
console.log('🔍 Elemen yang ditemukan:');
console.log('- Tombol Register:', openRegisterBtn);
console.log('- Modal Register:', registerModal);
console.log('- Form Register:', registerForm);

// =============== EVENT LISTENER TOMBOL REGISTER ===============
if (openRegisterBtn && registerModal) {
  console.log('✅ Event listener akan ditambahkan ke tombol Register');
  
  openRegisterBtn.addEventListener('click', function(event) {
    console.log('🎯 Tombol Register diklik!');
    
    // Hentikan perilaku default jika itu link
    if (event.preventDefault) event.preventDefault();
    
    // Tampilkan modal
    registerModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Reset ke tab pertama
    if (typeof switchTab === 'function') {
      switchTab('personal');
    }
    
    console.log('✅ Modal seharusnya terbuka');
  });
} else {
  console.error('❌ ERROR: Tombol atau Modal tidak ditemukan!');
  console.error('- openRegisterBtn:', openRegisterBtn);
  console.error('- registerModal:', registerModal);
}

// =============== EVENT LISTENER UNTUK TUTUP MODAL ===============
// Pastikan tombol close berfungsi
if (closeModalBtns.length > 0) {
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('❌ Tombol close modal diklik');
      registerModal.style.display = 'none';
      successModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  });
}

// Form State
let currentTab = 'personal';
const formData = {
  personal: {},
  account: {},
  preferences: {}
};

// Open Register Modal
openRegisterBtn.addEventListener('click', () => {
  registerModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
});

// Close Modals
closeModalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    registerModal.style.display = 'none';
    successModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
});

closeSuccessBtn.addEventListener('click', () => {
  successModal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

// Explore Community Button
exploreBtn.addEventListener('click', () => {
  successModal.style.display = 'none';
  document.body.style.overflow = 'auto';
  alert('Welcome to the Huddle community! Explore features coming soon.');
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === registerModal || e.target === successModal) {
    registerModal.style.display = 'none';
    successModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Tab Navigation
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;
    switchTab(tabId);
  });
});

// Next/Previous Buttons
document.querySelectorAll('.btn-next').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const nextTab = btn.dataset.next;
    if (validateCurrentTab()) {
      switchTab(nextTab);
    }
  });
});

document.querySelectorAll('.btn-prev').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const prevTab = btn.dataset.prev;
    switchTab(prevTab);
  });
});

// Switch Tab Function
function switchTab(tabId) {
  // Update active tab button
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  
  // Update active tab content
  tabContents.forEach(content => {
    content.classList.toggle('active', content.id === `${tabId}-tab`);
  });
  
  // Update progress
  updateProgress(tabId);
  currentTab = tabId;
}

// Update Progress Bar - PERBAIKAN ERROR 1
function updateProgress(tabId) {
  const steps = ['personal', 'account', 'preferences'];
  const currentIndex = steps.indexOf(tabId);
  const progress = ((currentIndex + 1) / steps.length) * 100;
  
  // Solusi: Tambahkan 'px' atau '%' untuk membuat string
  if (progressFill) {
    progressFill.style.width = `${progress}%`; // Template literal menghasilkan string
  }
  
  // Solusi alternatif: progressFill.style.width = progress.toString() + '%';
  
  if (currentStep) {
    currentStep.textContent = (currentIndex + 1).toString(); // Konversi number ke string
  }
}

// Password Toggle Visibility
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.innerHTML = type === 'password' 
      ? '<i class="fas fa-eye"></i>' 
      : '<i class="fas fa-eye-slash"></i>';
  });
}

// Password Strength Checker
if (passwordInput) {
  passwordInput.addEventListener('input', function() {
    const password = this.value;
    const strengthText = document.getElementById('strengthText');
    
    let strength = 0;
    let color = '#ff4757';
    let text = 'Weak';
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    switch(strength) {
      case 0:
      case 1:
        color = '#ff4757';
        text = 'Weak';
        break;
      case 2:
        color = '#ffa502';
        text = 'Fair';
        break;
      case 3:
        color = '#2ed573';
        text = 'Good';
        break;
      case 4:
        color = '#1e90ff';
        text = 'Strong';
        break;
    }
    
    if (strengthText) {
      strengthText.textContent = text;
      strengthText.style.color = color;
    }
    
    // Update strength bar width
    const strengthBar = document.querySelector('.strength-bar');
    if (strengthBar) {
      const barFill = strengthBar.querySelector('.strength-bar::before') || 
                     document.createElement('div');
      
      // Atur width berdasarkan strength
      const widthPercent = strength * 25;
      strengthBar.style.setProperty('--strength-width', `${widthPercent}%`);
      strengthBar.style.setProperty('--strength-color', color);
    }
  });
}

// Form Validation
function validateCurrentTab() {
  let isValid = true;
  
  // Clear previous errors
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
  });
  document.querySelectorAll('.error').forEach(el => {
    el.classList.remove('error');
  });
  
  switch(currentTab) {
    case 'personal':
      const firstName = document.getElementById('firstName');
      const lastName = document.getElementById('lastName');
      const email = document.getElementById('email');
      
      if (!firstName || !firstName.value.trim()) {
        showError('firstNameError', 'First name is required');
        if (firstName) firstName.classList.add('error');
        isValid = false;
      }
      
      if (!lastName || !lastName.value.trim()) {
        showError('lastNameError', 'Last name is required');
        if (lastName) lastName.classList.add('error');
        isValid = false;
      }
      
      if (!email || !email.value.trim()) {
        showError('emailError', 'Email is required');
        if (email) email.classList.add('error');
        isValid = false;
      } else if (email && !isValidEmail(email.value)) {
        showError('emailError', 'Please enter a valid email address');
        email.classList.add('error');
        isValid = false;
      }
      
      // Save data
      formData.personal = {
        firstName: firstName ? firstName.value : '',
        lastName: lastName ? lastName.value : '',
        email: email ? email.value : '',
        phone: document.getElementById('phone') ? document.getElementById('phone').value : ''
      };
      break;
      
    case 'account':
      const username = document.getElementById('username');
      const password = document.getElementById('password');
      const confirmPassword = document.getElementById('confirmPassword');
      
      if (!username || !username.value.trim()) {
        showError('usernameError', 'Username is required');
        if (username) username.classList.add('error');
        isValid = false;
      } else if (username && username.value.length < 4) {
        showError('usernameError', 'Username must be at least 4 characters');
        username.classList.add('error');
        isValid = false;
      } else if (username && !/^[a-zA-Z0-9]+$/.test(username.value)) {
        showError('usernameError', 'Only letters and numbers allowed');
        username.classList.add('error');
        isValid = false;
      }
      
      if (!password || !password.value) {
        showError('passwordError', 'Password is required');
        if (password) password.classList.add('error');
        isValid = false;
      } else if (password && password.value.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        password.classList.add('error');
        isValid = false;
      }
      
      if (!confirmPassword || !confirmPassword.value) {
        showError('confirmPasswordError', 'Please confirm your password');
        if (confirmPassword) confirmPassword.classList.add('error');
        isValid = false;
      } else if (password && confirmPassword && password.value !== confirmPassword.value) {
        showError('confirmPasswordError', 'Passwords do not match');
        confirmPassword.classList.add('error');
        isValid = false;
      }
      
      // Save data
      formData.account = {
        username: username ? username.value : '',
        password: password ? password.value : ''
      };
      break;
      
    case 'preferences':
      const terms = document.getElementById('terms');
      
      if (terms && !terms.checked) {
        showError('termsError', 'You must accept the terms and conditions');
        isValid = false;
      }
      
      // Save data
      formData.preferences = {
        communityRole: document.getElementById('communityRole') ? document.getElementById('communityRole').value : '',
        newsletter: document.getElementById('newsletter') ? document.getElementById('newsletter').checked : false,
        terms: terms ? terms.checked : false
      };
      break;
  }
  
  return isValid;
}

// Helper Functions
function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Form Submission
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateCurrentTab()) {
      alert('Please fix the errors before submitting.');
      return;
    }
    
    // Combine all form data
    const submissionData = {
      ...formData.personal,
      ...formData.account,
      ...formData.preferences
    };
    
    // Remove password from console log for security
    const { password, ...safeData } = submissionData;
    
    console.log('Form submission data:', safeData);
    
    // Show loading state
    const submitBtn = registerForm.querySelector('.btn-submit');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      submitBtn.disabled = true;
    }
    
    // Simulate API call
    try {
      await simulateAPICall(submissionData);
      
      // Show success modal
      registerModal.style.display = 'none';
      successModal.style.display = 'block';
      
      // Fill welcome message
      const welcomeName = document.getElementById('welcomeName');
      const welcomeEmail = document.getElementById('welcomeEmail');
      
      if (welcomeName) {
        welcomeName.textContent = `${formData.personal.firstName} ${formData.personal.lastName}`;
      }
      
      if (welcomeEmail) {
        welcomeEmail.textContent = formData.personal.email;
      }
      
      // PERBAIKAN ERROR 2: Reset form dengan cara yang type-safe
      // Method 1: Gunakan type assertion
      const formElement = document.getElementById('registerForm');
      if (formElement && formElement instanceof HTMLFormElement) {
        formElement.reset();
      }
      
      // Method 2: Reset manual sebagai fallback
      // resetFormManually();
      
      // Reset form data
      switchTab('personal');
      formData.personal = {};
      formData.account = {};
      formData.preferences = {};
      
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      if (submitBtn) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    }
  });
}

// Alternative: Manual form reset function
function resetFormManually() {
  const form = document.getElementById('registerForm');
  if (!form) return;
  
  // Reset all inputs
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (input.type === 'text' || input.type === 'email' || input.type === 'tel' || input.type === 'password') {
      input.value = '';
    } else if (input.type === 'checkbox') {
      input.checked = false;
    } else if (input.type === 'select-one') {
      input.selectedIndex = 0;
    }
  });
  
  // Reset to first tab
  switchTab('personal');
}

// Simulate API call
function simulateAPICall(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 90% success rate
      Math.random() > 0.1 ? resolve(data) : reject(new Error('Server error'));
    }, 1500);
  });
}

// Initialize
if (typeof updateProgress === 'function') {
  updateProgress('personal');
}

// Tambahkan style untuk strength bar dinamis
const style = document.createElement('style');
style.textContent = `
  .strength-bar::before {
    content: '';
    display: block;
    height: 100%;
    width: var(--strength-width, 33%);
    background: var(--strength-color, #ff4757);
    transition: all 0.3s;
  }
`;
document.head.appendChild(style);