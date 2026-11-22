import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BrickBreakerComponent } from './brick-breaker.component';

describe('BrickBreakerComponent', () => {
  let component: BrickBreakerComponent;
  let fixture: ComponentFixture<BrickBreakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrickBreakerComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrickBreakerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
