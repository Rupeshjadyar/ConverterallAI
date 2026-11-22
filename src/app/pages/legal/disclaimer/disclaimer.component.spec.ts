import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DisclaimerComponent } from './disclaimer.component';

describe('DisclaimerComponent', () => {
  let component: DisclaimerComponent;
  let fixture: ComponentFixture<DisclaimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisclaimerComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisclaimerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
