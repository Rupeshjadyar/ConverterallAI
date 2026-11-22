import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CookiePolicyComponent } from './cookie-policy.component';

describe('CookiePolicyComponent', () => {
  let component: CookiePolicyComponent;
  let fixture: ComponentFixture<CookiePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookiePolicyComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookiePolicyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
