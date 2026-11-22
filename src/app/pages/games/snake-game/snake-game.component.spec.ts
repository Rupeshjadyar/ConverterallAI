import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SnakeGameComponent } from './snake-game.component';

describe('SnakeGameComponent', () => {
  let component: SnakeGameComponent;
  let fixture: ComponentFixture<SnakeGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnakeGameComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnakeGameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
