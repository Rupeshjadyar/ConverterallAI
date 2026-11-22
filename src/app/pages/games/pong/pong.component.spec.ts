import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PongComponent } from './pong.component';

describe('PongComponent', () => {
  let component: PongComponent;
  let fixture: ComponentFixture<PongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PongComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PongComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
