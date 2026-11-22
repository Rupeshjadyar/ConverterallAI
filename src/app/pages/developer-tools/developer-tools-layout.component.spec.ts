import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DeveloperToolsLayoutComponent } from './developer-tools-layout.component';

describe('DeveloperToolsLayoutComponent', () => {
  let component: DeveloperToolsLayoutComponent;
  let fixture: ComponentFixture<DeveloperToolsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperToolsLayoutComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeveloperToolsLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
