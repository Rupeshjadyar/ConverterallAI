import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FrontlineSurvivorComponent } from './frontline-survivor.component';

describe('FrontlineSurvivorComponent', () => {
  let component: FrontlineSurvivorComponent;
  let fixture: ComponentFixture<FrontlineSurvivorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontlineSurvivorComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontlineSurvivorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
