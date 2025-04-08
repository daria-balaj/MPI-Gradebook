package api.controller;

import api.dto.GradeAverageDTO;
import api.model.Grade;
import api.service.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;

    @GetMapping
    public ResponseEntity<List<Grade>> getAllGrades() {
        return ResponseEntity.ok(gradeService.getAllGrades());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Grade> getGradeById(@PathVariable Long id) {
        return ResponseEntity.ok(gradeService.getGradeById(id));
    }

    @PostMapping
    public ResponseEntity<Grade> createGrade(@RequestBody Grade grade) {
        return new ResponseEntity<>(gradeService.saveGrade(grade), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long id) {
        gradeService.deleteGrade(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Grade>> getGradesByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradeService.getGradesByStudentId(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Grade>> getGradesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(gradeService.getGradesByCourseId(courseId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Grade> updateGrade(@PathVariable Long id, @RequestBody Grade updatedGrade) {
        Grade updated = gradeService.updateGrade(id, updatedGrade);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/average")
    public ResponseEntity<Double> getAverageForStudentAndCourse(@RequestParam Long studentId, @RequestParam Long courseId) {
        Double average = gradeService.getAverageGradeForStudentAndCourse(studentId, courseId);
        return ResponseEntity.ok(average);
    }

    @GetMapping("/student/{studentId}/averages")
    public ResponseEntity<List<GradeAverageDTO>> getAllAveragesForStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradeService.getAllCourseAveragesForStudent(studentId));
    }
}

