import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicCalculator } from './basic-calculator';

describe('BasicCalculator', () => {
  let component: BasicCalculator;
  let fixture: ComponentFixture<BasicCalculator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicCalculator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicCalculator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
