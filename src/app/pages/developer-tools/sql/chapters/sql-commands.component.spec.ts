import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlCommandsComponent } from './sql-commands.component';

describe('SqlCommandsComponent', () => {
  let component: SqlCommandsComponent;
  let fixture: ComponentFixture<SqlCommandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlCommandsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlCommandsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
