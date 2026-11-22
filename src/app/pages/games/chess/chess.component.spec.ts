import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ChessComponent } from './chess.component';

describe('ChessComponent', () => {
  let component: ChessComponent;
  let fixture: ComponentFixture<ChessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChessComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChessComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
