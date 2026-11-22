import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PythonTutorialComponent } from './python-tutorial.component';

describe('PythonTutorialComponent', () => {
  let component: PythonTutorialComponent;
  let fixture: ComponentFixture<PythonTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PythonTutorialComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PythonTutorialComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
