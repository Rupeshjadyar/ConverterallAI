import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WebTutorialsComponent } from './web-tutorials.component';

describe('WebTutorialsComponent', () => {
  let component: WebTutorialsComponent;
  let fixture: ComponentFixture<WebTutorialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebTutorialsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebTutorialsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
