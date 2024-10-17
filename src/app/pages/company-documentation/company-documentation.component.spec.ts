import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDocumentationComponent } from './company-documentation.component';

describe('CompanyDocumentationComponent', () => {
  let component: CompanyDocumentationComponent;
  let fixture: ComponentFixture<CompanyDocumentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyDocumentationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
