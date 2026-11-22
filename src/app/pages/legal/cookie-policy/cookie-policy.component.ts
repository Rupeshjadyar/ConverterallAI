import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrivacyPreferencesService } from '../../../services/privacy-preferences.service';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.css']
})
export class CookiePolicyComponent {
  readonly preferences = inject(PrivacyPreferencesService);
}
