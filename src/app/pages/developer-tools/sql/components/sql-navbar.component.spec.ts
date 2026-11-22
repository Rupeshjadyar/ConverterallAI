import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlNavbarComponent } from './sql-navbar.component';

describe('SqlNavbarComponent', () => {
  let component: SqlNavbarComponent;
  let fixture: ComponentFixture<SqlNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlNavbarComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlNavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
