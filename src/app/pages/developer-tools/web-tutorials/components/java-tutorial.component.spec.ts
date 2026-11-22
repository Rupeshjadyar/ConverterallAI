import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { JavaTutorialComponent } from './java-tutorial.component';

describe('JavaTutorialComponent', () => {
  let component: JavaTutorialComponent;
  let fixture: ComponentFixture<JavaTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JavaTutorialComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JavaTutorialComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
