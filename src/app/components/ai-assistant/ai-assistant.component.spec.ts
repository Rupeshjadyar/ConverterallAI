import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AiAssistantComponent } from './ai-assistant.component';

describe('AiAssistantComponent', () => {
  let component: AiAssistantComponent;
  let fixture: ComponentFixture<AiAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiAssistantComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiAssistantComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
