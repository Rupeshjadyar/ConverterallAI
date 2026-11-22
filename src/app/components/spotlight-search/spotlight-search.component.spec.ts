import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SpotlightSearchComponent } from './spotlight-search.component';

describe('SpotlightSearchComponent', () => {
  let component: SpotlightSearchComponent;
  let fixture: ComponentFixture<SpotlightSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotlightSearchComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotlightSearchComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
