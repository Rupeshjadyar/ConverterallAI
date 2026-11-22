import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TypingTestComponent } from './typing-test.component';

describe('TypingTestComponent', () => {
  let component: TypingTestComponent;
  let fixture: ComponentFixture<TypingTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingTestComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypingTestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
