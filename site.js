'use strict';

const WHATSAPP_NUMBER = '919836121220';
const BUSINESS_EMAIL = 'secureworldfire@gmail.com';

const menu = document.querySelector('#menu');
const navigation = document.querySelector('#navigation');
menu?.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
}));

const dialog = document.querySelector('#service-dialog');
let selected = 'fire-alarm';
let services = [];
fetch('assets/services.json')
  .then((response) => {
    if (!response.ok) throw new Error('Service details unavailable');
    return response.json();
  })
  .then((data) => { services = data; })
  .catch(() => { });

document.querySelectorAll('[data-service]').forEach((button) => button.addEventListener('click', () => {
  selected = button.dataset.service;
  const service = services.find((item) => item.id === selected);
  if (!service || !dialog?.showModal) {
    document.querySelector('#service').value = selected;
    document.querySelector('#quote').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  document.querySelector('#dialog-title').textContent = service.title;
  document.querySelector('#dialog-description').textContent = service.description;
  document.querySelector('#dialog-detail').textContent = service.detail;
  dialog.showModal();
}));
document.querySelector('#close-dialog')?.addEventListener('click', () => dialog.close());
document.querySelector('#discuss')?.addEventListener('click', () => {
  dialog.close();
  document.querySelector('#service').value = selected;
  document.querySelector('#quote').scrollIntoView({ behavior: 'smooth' });
});
dialog?.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

const serviceSelect = document.querySelector('#service');
const queryService = new URLSearchParams(location.search).get('service');
if (serviceSelect && [...serviceSelect.options].some((option) => option.value === queryService)) serviceSelect.value = queryService;

const form = document.querySelector('#quote-form');
function enquiryData() {
  const data = Object.fromEntries(new FormData(form));
  data.serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
  return data;
}
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = enquiryData();
  if (data.website) return;
  const message = [
    'Hello Secure World, I would like to request a quote.', '',
    `Name: ${data.name}`, `Phone: ${data.phone}`, `Email: ${data.email}`,
    `Company: ${data.company || 'Not provided'}`, `Service: ${data.serviceName}`,
    `Location: ${data.location}`, `Project details: ${data.details}`
  ].join('\n');
  document.querySelector('#form-message').textContent = 'Opening WhatsApp with your enquiry…';
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
document.querySelector('#email-enquiry')?.addEventListener('click', () => {
  if (!form.reportValidity()) return;
  const data = enquiryData();
  const body = `Name: ${data.name}\nPhone: ${data.phone}\nCompany: ${data.company || 'Not provided'}\nService: ${data.serviceName}\nLocation: ${data.location}\n\n${data.details}`;
  location.href = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent('Website enquiry – ' + data.serviceName)}&body=${encodeURIComponent(body)}`;
});
