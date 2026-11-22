import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HtmlTutorialComponent } from './html-tutorial.component';

describe('HtmlTutorialComponent', () => {
  let component: HtmlTutorialComponent;
  let fixture: ComponentFixture<HtmlTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlTutorialComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtmlTutorialComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
