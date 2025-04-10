package api.service;

import api.dto.GradeAverageDTO;
import api.model.Grade;
import api.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final GradeRepository gradeRepository;

    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }

    public Grade getGradeById(Long id) {
        return gradeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Grade not found: " + id));
    }

    public Grade saveGrade(Grade grade) {
        if (grade.getDateGiven() == null) {
            grade.setDateGiven(LocalDate.now());
        }
        return gradeRepository.save(grade);
    }


    public void deleteGrade(Long id) {
        gradeRepository.deleteById(id);
    }

    public List<Grade> getGradesByStudentId(Long studentId) {
        return gradeRepository.findByStudentId(studentId);
    }

    public List<Grade> getDetailedGradesByStudentId(Long studentId) { return gradeRepository.findByStudentIdWithCourseNames(studentId); }

    public List<Grade> getGradesByCourseId(Long courseId) {
        return gradeRepository.findByCourseId(courseId);
    }

    public Grade updateGrade(Long id, Double newValue) {
        Grade existingGrade = getGradeById(id);
        existingGrade.setValue(newValue);
        existingGrade.setDateGiven(LocalDate.now());

        return gradeRepository.save(existingGrade);
    }

    public Double getAverageGradeForStudentAndCourse(Long studentId, Long courseId) {
        return gradeRepository.findAverageGradeByStudentAndCourse(studentId, courseId).orElse(0.0);
    }

    public List<GradeAverageDTO> getAllCourseAveragesForStudent(Long studentId) {
        List<Grade> grades = gradeRepository.findByStudentId(studentId);

        return grades.stream()
                .collect(Collectors.groupingBy(g -> g.getCourse().getId()))
                .entrySet().stream()
                .map(entry -> {
                    Long courseId = entry.getKey();
                    List<Grade> courseGrades = entry.getValue();
                    Double avg = courseGrades.stream().mapToDouble(Grade::getValue).average().orElse(0.0);
                    String courseName = courseGrades.get(0).getCourse().getCourseName();
                    return new GradeAverageDTO(courseId, courseName, avg);
                })
                .toList();
    }
}

