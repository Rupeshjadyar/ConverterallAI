import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlConstraintsComponent } from './sql-constraints.component';

describe('SqlConstraintsComponent', () => {
  let component: SqlConstraintsComponent;
  let fixture: ComponentFixture<SqlConstraintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlConstraintsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlConstraintsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
