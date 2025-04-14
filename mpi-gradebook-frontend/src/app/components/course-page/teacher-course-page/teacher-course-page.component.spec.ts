import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCoursePageComponent } from './teacher-course-page.component';

describe('CoursePageComponent', () => {
  let component: TeacherCoursePageComponent;
  let fixture: ComponentFixture<TeacherCoursePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherCoursePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCoursePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
