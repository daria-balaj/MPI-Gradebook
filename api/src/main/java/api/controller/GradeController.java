package api.controller;

import api.dto.GradeAverageDTO;
import api.model.Grade;
import api.service.GradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/detail/{studentId}")
    public ResponseEntity<List<Grade>> getGradesByStudentWithCourseName(@PathVariable Long studentId) {
        return ResponseEntity.ok(gradeService.getDetailedGradesByStudentId(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Grade>> getGradesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(gradeService.getGradesByCourseId(courseId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Grade> updateGrade(@PathVariable Long id, @RequestParam double newValue) {
        Grade updated = gradeService.updateGrade(id, newValue);
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

    @PostMapping("/bulk-upload/{courseId}")
    public ResponseEntity<Map<String, String>> uploadGradesToCourse(
            @PathVariable Long courseId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            gradeService.processCsvForCourse(file, courseId);
            return ResponseEntity.ok(Map.of("message", "Notele au fost încărcate cu succes!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Eroare la upload: " + e.getMessage()));
        }
    }


}

