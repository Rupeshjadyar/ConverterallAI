import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { JavascriptTutorialComponent } from './javascript-tutorial.component';

describe('JavascriptTutorialComponent', () => {
  let component: JavascriptTutorialComponent;
  let fixture: ComponentFixture<JavascriptTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JavascriptTutorialComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JavascriptTutorialComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
