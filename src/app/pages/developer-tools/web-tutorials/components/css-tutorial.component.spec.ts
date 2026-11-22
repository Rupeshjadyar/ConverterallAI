import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CssTutorialComponent } from './css-tutorial.component';

describe('CssTutorialComponent', () => {
  let component: CssTutorialComponent;
  let fixture: ComponentFixture<CssTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CssTutorialComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CssTutorialComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
