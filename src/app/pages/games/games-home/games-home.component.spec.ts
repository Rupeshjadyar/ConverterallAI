import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GamesHomeComponent } from './games-home.component';

describe('GamesHomeComponent', () => {
  let component: GamesHomeComponent;
  let fixture: ComponentFixture<GamesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesHomeComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesHomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
