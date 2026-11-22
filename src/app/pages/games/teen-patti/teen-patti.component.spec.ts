import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TeenPattiComponent } from './teen-patti.component';

describe('TeenPattiComponent', () => {
  let component: TeenPattiComponent;
  let fixture: ComponentFixture<TeenPattiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeenPattiComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeenPattiComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
