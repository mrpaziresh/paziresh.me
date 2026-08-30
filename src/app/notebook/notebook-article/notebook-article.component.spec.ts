import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookArticleComponent } from './notebook-article.component';

describe('NotebookArticleComponent', () => {
  let component: NotebookArticleComponent;
  let fixture: ComponentFixture<NotebookArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotebookArticleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotebookArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
