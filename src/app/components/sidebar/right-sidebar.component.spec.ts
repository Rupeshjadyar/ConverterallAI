import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RightSidebarComponent } from './right-sidebar.component';

describe('RightSidebarComponent', () => {
  let component: RightSidebarComponent;
  let fixture: ComponentFixture<RightSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightSidebarComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightSidebarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
