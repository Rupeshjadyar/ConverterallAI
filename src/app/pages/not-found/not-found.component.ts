import { RESPONSE_INIT, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { SITE_DOMAIN } from '../../data/seo.config';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  private response = inject(RESPONSE_INIT, { optional: true });
  private seo = inject(SeoService);

  ngOnInit() {
    if (this.response) this.response.status = 404;
    this.seo.update({
      title: '404 Page Not Found - ConverterAllAI',
      description: 'The page you requested could not be found. Explore our free online PDF tools, image converters, audio editors, games, and calculators on the ConverterAllAI home.',
      robots: 'noindex, nofollow',
      canonical: `${SITE_DOMAIN}/404`
    });
  }
}
