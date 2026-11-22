import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToolSeoContentComponent } from './tool-seo-content.component';

describe('ToolSeoContentComponent', () => {
  let component: ToolSeoContentComponent;
  let fixture: ComponentFixture<ToolSeoContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolSeoContentComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolSeoContentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
