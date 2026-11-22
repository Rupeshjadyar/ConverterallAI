import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlPlaygroundComponent } from './sql-playground.component';

describe('SqlPlaygroundComponent', () => {
  let component: SqlPlaygroundComponent;
  let fixture: ComponentFixture<SqlPlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlPlaygroundComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlPlaygroundComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
