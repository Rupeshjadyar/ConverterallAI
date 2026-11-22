import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlDdlComponent } from './sql-ddl.component';

describe('SqlDdlComponent', () => {
  let component: SqlDdlComponent;
  let fixture: ComponentFixture<SqlDdlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlDdlComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlDdlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
