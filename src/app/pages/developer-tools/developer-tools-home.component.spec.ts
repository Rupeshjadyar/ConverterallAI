import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DeveloperToolsHomeComponent } from './developer-tools-home.component';

describe('DeveloperToolsHomeComponent', () => {
  let component: DeveloperToolsHomeComponent;
  let fixture: ComponentFixture<DeveloperToolsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeveloperToolsHomeComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeveloperToolsHomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
