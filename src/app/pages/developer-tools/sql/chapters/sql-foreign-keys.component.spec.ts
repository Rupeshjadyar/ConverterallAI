import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlForeignKeysComponent } from './sql-foreign-keys.component';

describe('SqlForeignKeysComponent', () => {
  let component: SqlForeignKeysComponent;
  let fixture: ComponentFixture<SqlForeignKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlForeignKeysComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlForeignKeysComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
