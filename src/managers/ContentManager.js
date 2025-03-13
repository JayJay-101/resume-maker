/**
 * ContentManager.js
 * Handles content editable behavior
 */
export class ContentManager {
  constructor() {}
  
  /**
   * Initialize the content manager
   */
  init() {
    this.setupContactLinkUpdates();
  }
  
  /**
   * Set up automatic link updates for contact information
   */
  setupContactLinkUpdates() {
    document.querySelectorAll('.contact-info a.contact-item').forEach(link => {
      link.addEventListener('input', function() {
        const text = this.textContent.trim();
        const icon = this.querySelector('i');
        
        if (icon.classList.contains('fa-envelope')) {
          this.setAttribute('href', `mailto:${text.replace(/ /g, '')}`);
        } else if (icon.classList.contains('fa-phone')) {
          const digits = text.replace(/\D/g, '');
          this.setAttribute('href', `tel:+1${digits}`);
        } else if (icon.classList.contains('fa-map-marker-alt')) {
          this.setAttribute('href', `https://maps.google.com/?q=${encodeURIComponent(text)}`);
        } else if (icon.classList.contains('fa-linkedin')) {
          const username = text.includes('/') ? text.split('/').pop() : text;
          this.setAttribute('href', `https://linkedin.com/in/${username.trim()}`);
        } else if (icon.classList.contains('fa-github')) {
          const username = text.includes('/') ? text.split('/').pop() : text;
          this.setAttribute('href', `https://github.com/${username.trim()}`);
        }
      });
    });
  }
}
