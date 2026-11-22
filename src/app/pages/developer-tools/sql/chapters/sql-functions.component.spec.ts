import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlFunctionsComponent } from './sql-functions.component';

describe('SqlFunctionsComponent', () => {
  let component: SqlFunctionsComponent;
  let fixture: ComponentFixture<SqlFunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlFunctionsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlFunctionsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
