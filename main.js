window.addEventListener("load", loadPage);
copyEmailButton.addEventListener("click", copyEmail);
copyPhoneNumberButton.addEventListener("click", copyPhoneNumber);
copyLinkedInButton.addEventListener("click", copyLinkedIn);


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


if (window.matchMedia("(hover: none)").matches && window.innerWidth < 736) {
  let options = {
    rootMargin: '-12% 0px',
    threshold: 1
  };

  let cardObserver = new IntersectionObserver(hoverCard, options);

  for (let card of document.getElementsByClassName("card")) {
    cardObserver.observe(card);
  }
}


function hoverCard(entries) {
  if (entries[0].isIntersecting) {
    entries[0].target.children[0].style.opacity = 0.05;
    entries[0].target.children[1].style.opacity = 1;
  }

  else {
    entries[0].target.children[0].style.opacity = "";
    entries[0].target.children[1].style.opacity = "";
  }
}