package api.repository;

import api.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findByCourseId(Long courseId);

    @Query("SELECT AVG(g.value) FROM Grade g WHERE g.student.id = :studentId AND g.course.id = :courseId")
    Optional<Double> findAverageGradeByStudentAndCourse(Long studentId, Long courseId);

    @Query("SELECT g FROM Grade g JOIN Course c ON g.course.id = c.id WHERE g.student.id = :studentId")
    List<Grade> findByStudentIdWithCourseNames(Long studentId);
}
