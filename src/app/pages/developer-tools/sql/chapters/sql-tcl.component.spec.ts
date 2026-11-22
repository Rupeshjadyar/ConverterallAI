import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlTclComponent } from './sql-tcl.component';

describe('SqlTclComponent', () => {
  let component: SqlTclComponent;
  let fixture: ComponentFixture<SqlTclComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlTclComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlTclComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
