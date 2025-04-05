package api.repository;

import api.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByTeacherId(Long teacherId);

    List<Course> findByCourseNameContainingIgnoreCase(String courseName);

    Long countByTeacherId(Long teacherId);

    boolean existsByCourseNameIgnoreCase(String courseName);

}
