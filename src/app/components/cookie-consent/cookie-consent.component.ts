import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrivacyPreferencesService } from '../../services/privacy-preferences.service';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css']
})
export class CookieConsentComponent {
  readonly preferences = inject(PrivacyPreferencesService);
}
