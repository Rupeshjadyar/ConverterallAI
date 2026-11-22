import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlDataTypesComponent } from './sql-data-types.component';

describe('SqlDataTypesComponent', () => {
  let component: SqlDataTypesComponent;
  let fixture: ComponentFixture<SqlDataTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlDataTypesComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlDataTypesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
