window.addEventListener('load', () => (document.body.style.opacity = ''));
document.getElementById('copyEmailButton').addEventListener('click', copyEmail);
document.getElementById('copyLinkedinURLButton').addEventListener('click', copyLinkedIn);

const contactForm = document.getElementById('contactForm');
const contactFormSubmitButton = document.getElementById('contactFormSubmitButton');
contactForm.addEventListener('submit', submitContactForm);

const intersectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        document.querySelector(`a[href="#${entry.target.id}"]`).classList.add('active');
      } else {
        document.querySelector(`a[href="#${entry.target.id}"]`).classList.remove('active');
      }
    }
  },
  {
    root: document.querySelector('.projects'),
    threshold: 0.5,
  }
);

for (const project of document.querySelectorAll('.project')) {
  intersectionObserver.observe(project);
}

for (const paginationLink of document.querySelectorAll('.pagination > a')) {
  paginationLink.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector(paginationLink.getAttribute('href')).scrollIntoView({ block: 'nearest' });
  });
}

function copyEmail() {
  navigator.clipboard.writeText(document.getElementById('email').innerHTML);
}

function copyLinkedIn() {
  navigator.clipboard.writeText(document.getElementById('linkedinURL').innerHTML);
}

function submitContactForm(event) {
  contactFormSubmitButton.disabled = true;
  formFeedback.innerHTML = '';
  event.preventDefault();

  const datetime = new Date();
  const contactFormData = Object.fromEntries(new FormData(contactForm));
  contactFormData.isoTimestamp = datetime.toISOString();
  contactFormData.timestamp = datetime.toString();

  fetch('https://alexaraiza-contact-default-rtdb.firebaseio.com/contact.json', {
    method: 'POST',
    body: JSON.stringify(contactFormData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (response.ok) {
        contactForm.reset();
        formFeedback.setAttribute('class', 'success');
        formFeedback.innerHTML = 'Thank you for your message!';
      } else {
        formFeedback.setAttribute('class', 'error');
        formFeedback.innerHTML = 'Something went wrong. Please try again.';
      }
    })
    .catch(() => {
      formFeedback.setAttribute('class', 'error');
      formFeedback.innerHTML = 'Something went wrong. Please check your network connection and try again.';
    })
    .finally(() => {
      contactFormSubmitButton.disabled = false;
    });
}
