import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CookieConsentComponent } from './cookie-consent.component';

describe('CookieConsentComponent', () => {
  let component: CookieConsentComponent;
  let fixture: ComponentFixture<CookieConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieConsentComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookieConsentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
