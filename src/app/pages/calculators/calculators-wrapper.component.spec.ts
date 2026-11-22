import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CalculatorsWrapperComponent } from './calculators-wrapper.component';

describe('CalculatorsWrapperComponent', () => {
  let component: CalculatorsWrapperComponent;
  let fixture: ComponentFixture<CalculatorsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorsWrapperComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorsWrapperComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
