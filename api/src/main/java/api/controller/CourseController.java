package api.controller;

import api.model.Course;
import api.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.findAllCourses();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
    }


    @GetMapping("/teacher/{teacherId}")
    public List<Course> getCoursesByTeacher(@PathVariable Long teacherId) {
        return courseService.findCoursesByTeacherId(teacherId);
    }


    @GetMapping("/search")
    public List<Course> searchCourses(@RequestParam String name) {
        return courseService.findCoursesByName(name);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Course createCourse(@Valid @RequestBody Course course) {
        return courseService.createCourse(course);
    }


    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable Long id, @Valid @RequestBody Course course) {
        if (!id.equals(course.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID in path must match ID in body");
        }

        if (courseService.findById(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }

        return courseService.updateCourse(course);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable Long id) {
        if (courseService.findById(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }
        courseService.deleteCourse(id);
    }


    @GetMapping("/check-name")
    public ResponseEntity<Boolean> checkCourseName(@RequestParam String name) {
        boolean exists = courseService.isCourseNameTaken(name);
        return ResponseEntity.ok(exists);
    }


    @GetMapping("/count/teacher/{teacherId}")
    public ResponseEntity<Long> countCoursesByTeacher(@PathVariable Long teacherId) {
        Long count = courseService.countCoursesByTeacher(teacherId);
        return ResponseEntity.ok(count);
    }

}
