import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  readonly supportEmail = 'rupeshjadyar21@gmail.com';
  copied = signal(false);
  draftRequested = signal(false);

  formModel = {
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  };

  faqList = [
    {
      q: 'How fast will I receive a response?',
      a: 'Our engineering & support desk typically replies within 24 hours during standard business days.',
      open: true
    },
    {
      q: 'Can I request a new tool or calculator?',
      a: 'Absolutely! Select "New Tool Request" in the form above and describe the tool. We frequently add community-requested tools.',
      open: false
    },
    {
      q: 'Do you offer an API for ConverterAll AI tools?',
      a: 'We are currently developing our developer API. Select "Business & API Partnership" to join our early developer preview.',
      open: false
    },
    {
      q: 'Where do I report security vulnerabilities?',
      a: 'Please email rupeshjadyar21@gmail.com or select "Bug Report" above with details on reproducing the issue.',
      open: false
    }
  ];

  async copyEmail() {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(this.supportEmail);
    } catch {
      return;
    }
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 3000);
  }

  toggleFaq(index: number) {
    this.faqList[index].open = !this.faqList[index].open;
  }

  openEmailDraft(valid: boolean) {
    const { name, email, category, subject, message } = this.formModel;
    if (!valid || !name.trim() || !subject.trim() || !message.trim()) return;

    const draftSubject = encodeURIComponent(`[${category}] ${subject.trim()}`);
    const body = encodeURIComponent(`${message.trim()}\r\n\r\nFrom: ${name.trim()} (${email.trim()})`);
    this.draftRequested.set(true);
    window.location.href = `mailto:${this.supportEmail}?subject=${draftSubject}&body=${body}`;
  }
}
