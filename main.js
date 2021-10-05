window.addEventListener("load", loadPage);
copyEmailButton.addEventListener("click", copyEmail);
copyPhoneNumberButton.addEventListener("click", copyPhoneNumber);
copyLinkedInButton.addEventListener("click", copyLinkedIn);
contactForm.addEventListener("submit", submitContactForm);


function loadPage() {
  const PROFESSION_TEXT = profession.innerHTML;
  profession.style.height = getComputedStyle(profession).height;
  profession.innerHTML = "";
  myProjectsButton.style.visibility = "hidden";
  myProjectsButton.style.opacity = 0;

  document.body.style.visibility = "";
  document.body.style.opacity = "";

  setTimeout(() => typeOut(PROFESSION_TEXT, profession), 1000);
  setTimeout(function() {
    myProjectsButton.style.visibility = "";
    myProjectsButton.style.opacity = "";
  }, 3600);
}


function copyEmail() {
  email.disabled = false;
  email.select();
  document.execCommand("copy");
  email.disabled = true;
}

function copyPhoneNumber() {
  phoneNumber.disabled = false;
  const PHONE_TEXT = phoneNumber.value;
  phoneNumber.value = PHONE_TEXT.replaceAll(" ", "");
  phoneNumber.select();
  document.execCommand("copy");
  phoneNumber.value = PHONE_TEXT;
  phoneNumber.disabled = true;
}

function copyLinkedIn() {
  linkedin.disabled = false;
  linkedin.select();
  document.execCommand("copy");
  linkedin.disabled = true;
}


function typeOut(text, element) {
  let textEndIndex = 0;
  let typeCharacterInterval = setInterval(function() {
    element.innerHTML = text.substring(0, ++textEndIndex);
    if (textEndIndex === text.length) {
      clearInterval(typeCharacterInterval);
    }
  }, 80);
}


function submitContactForm(event) {
  contactFormSubmitButton.disabled = true;
  formFeedback.innerHTML = "";
  event.preventDefault();

  const contactFormData = {
    name: contactFormName.value,
    email: contactFormEmail.value,
    message: contactFormMessage.value
  };

  fetch("https://alexaraiza-contact-default-rtdb.firebaseio.com/contact.json",
  {
    method: "POST",
    body: JSON.stringify(contactFormData),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then((response) => {
    if (response.ok) {
      contactForm.reset();
      formFeedback.setAttribute("class", "success");
      formFeedback.innerHTML = "Thank you for your message!";
    }
    else {
      formFeedback.setAttribute("class", "error");
      formFeedback.innerHTML = "Something went wrong. Please try again.";
    }
  })
  .catch(() => {
    formFeedback.setAttribute("class", "error");
    formFeedback.innerHTML = "Something went wrong. Please check your network connection and try again.";
  })
  .finally(() => {
    contactFormSubmitButton.disabled = false;
  });
}