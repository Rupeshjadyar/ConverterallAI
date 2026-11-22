import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdBannerComponent } from './ad-banner.component';

describe('AdBannerComponent', () => {
  let component: AdBannerComponent;
  let fixture: ComponentFixture<AdBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdBannerComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdBannerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
