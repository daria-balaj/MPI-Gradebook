package api.service;


import api.model.Course;
import api.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseParticipantService courseParticipantService;

    @Autowired
    public CourseService(CourseRepository courseRepository, CourseParticipantService courseParticipantService) {
        this.courseRepository = courseRepository;
        this.courseParticipantService = courseParticipantService;
    }


    public List<Course> findAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> findById(Long id) {
        return courseRepository.findById(id);
    }

    public List<Course> findCoursesByTeacherId(Long teacherId) {
        return courseRepository.findByTeacherId(teacherId);
    }

    public List<Course> findCoursesByName(String courseName) {
        return courseRepository.findByCourseNameContainingIgnoreCase(courseName);
    }

    @Transactional
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    @Transactional
    public Course updateCourse(Course course) {
        if (!courseRepository.existsById(course.getId())) {
            throw new IllegalArgumentException("Course ID must exist to update");
        }
        return courseRepository.save(course);
    }

    @Transactional
    public void deleteCourse(Long id) {
        courseParticipantService.removeAllStudentsFromCourse(id);
        courseRepository.deleteById(id);
    }

    public boolean isCourseNameTaken(String courseName) {
        return courseRepository.existsByCourseNameIgnoreCase(courseName);
    }

    public Long countCoursesByTeacher(Long teacherId) {
        return courseRepository.countByTeacherId(teacherId);
    }

}
