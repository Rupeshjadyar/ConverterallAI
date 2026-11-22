import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Warfare3000Component } from './warfare-3000.component';

describe('Warfare3000Component', () => {
  let component: Warfare3000Component;
  let fixture: ComponentFixture<Warfare3000Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Warfare3000Component],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Warfare3000Component);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
