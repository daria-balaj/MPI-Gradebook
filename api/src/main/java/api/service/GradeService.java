package api.service;

import api.dto.GradeAverageDTO;
import api.model.Course;
import api.model.Grade;
import api.model.User;
import api.repository.CourseRepository;
import api.repository.GradeRepository;
import api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final GradeRepository gradeRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }

    public Grade getGradeById(Long id) {
        return gradeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Grade not found: " + id));
    }

    public Grade saveGrade(Grade grade) {
        if (grade.getDateGiven() == null) {
            grade.setDateGiven(LocalDateTime.now());
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
        existingGrade.setDateGiven(LocalDateTime.now());

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

    public void processCsvForCourse(MultipartFile file, Long courseId) throws IOException {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Cursul nu a fost găsit!"));

        List<Grade> grades = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            reader.readLine(); // Skip header
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length < 2) continue;

                String studentName = parts[0].trim();
                double value = Double.parseDouble(parts[1].trim());

                User student = userRepository.findByFullName(studentName)
                        .orElseThrow(() -> new RuntimeException("Student inexistent: " + studentName));

                Grade grade = Grade.builder()
                        .student(student)
                        .course(course)
                        .value(value)
                        .dateGiven(LocalDateTime.now())
                        .build();

                grades.add(grade);
            }
        }

        gradeRepository.saveAll(grades);
    }

}

