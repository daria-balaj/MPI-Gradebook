package api.controller;

import api.model.Course;
import api.model.CourseParticipant;
import api.model.User;
import api.service.CourseParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/course-participants")
public class CourseParticipantController {

    private final CourseParticipantService courseParticipantService;

    @Autowired
    public CourseParticipantController(CourseParticipantService courseParticipantService) {
        this.courseParticipantService = courseParticipantService;
    }

    
    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseParticipant addStudentToCourse(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {
        try {
            return courseParticipantService.enrollStudentInCourse(studentId, courseId);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
    }

    
    @DeleteMapping("/remove/{studentId}/{courseId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeStudentFromCourse(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {
        try {
            courseParticipantService.removeStudentFromCourse(studentId, courseId);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    
    @GetMapping("/course/{courseId}/students")
    public List<User> getStudentsInCourse(@PathVariable Long courseId) {
        return courseParticipantService.getStudentsInCourse(courseId);
    }

    
    @GetMapping("/student/{studentId}/courses")
    public List<Course> getCoursesForStudent(@PathVariable Long studentId) {
        return courseParticipantService.getCoursesForStudent(studentId);
    }

    
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkEnrollment(
            @RequestParam Long studentId,
            @RequestParam Long courseId) {
        boolean isEnrolled = courseParticipantService.isStudentEnrolledInCourse(studentId, courseId);
        return ResponseEntity.ok(Map.of("enrolled", isEnrolled));
    }


    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<Map<String, Long>> getParticipantCount(@PathVariable Long courseId) {
        long count = courseParticipantService.getEnrollmentCountForCourse(courseId);
        return ResponseEntity.ok(Map.of("enrollmentCount", count));
    }

    
    @PostMapping("/bulk-add")
    public List<CourseParticipant> bulkAddStudents(
            @RequestParam Long courseId,
            @RequestBody List<Long> studentIds) {
        try {
            return courseParticipantService.bulkAddStudents(courseId, studentIds);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}
