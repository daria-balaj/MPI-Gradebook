package api.repository;

import api.model.CourseParticipant;
import api.model.CourseParticipantId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseParticipantRepository extends JpaRepository<CourseParticipant, CourseParticipantId> {

    List<CourseParticipant> findByCourseId(Long courseId);

    List<CourseParticipant> findByStudentId(Long studentId);

    boolean existsById(CourseParticipantId id);

    long countByCourseId(Long courseId);

    long countByStudentId(Long studentId);

    void deleteByCourseId(Long courseId);
}