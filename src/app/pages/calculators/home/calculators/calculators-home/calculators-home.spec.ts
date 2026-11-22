import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CalculatorsHome } from './calculators-home';

describe('CalculatorsHome', () => {
  let component: CalculatorsHome;
  let fixture: ComponentFixture<CalculatorsHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorsHome],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorsHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
