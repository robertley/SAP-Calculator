import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTeamwoodDataComponent } from './import-teamwood-data.component';

describe('ImportTeamwoodDataComponent', () => {
  let component: ImportTeamwoodDataComponent;
  let fixture: ComponentFixture<ImportTeamwoodDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportTeamwoodDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTeamwoodDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
