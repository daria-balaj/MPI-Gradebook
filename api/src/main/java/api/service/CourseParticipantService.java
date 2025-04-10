package api.service;
import api.model.Course;
import api.model.CourseParticipant;
import api.model.CourseParticipantId;
import api.model.User;
import api.repository.CourseParticipantRepository;
import api.repository.CourseRepository;
import api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseParticipantService {

    private final CourseParticipantRepository courseParticipantRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Autowired
    public CourseParticipantService(
            CourseParticipantRepository courseParticipantRepository,
            CourseRepository courseRepository,
            UserRepository userRepository) {
        this.courseParticipantRepository = courseParticipantRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }


    @Transactional
    public CourseParticipant enrollStudentInCourse(Long studentId, Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + courseId));


        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));


        CourseParticipantId id = new CourseParticipantId(studentId, courseId);


        if (courseParticipantRepository.existsById(id)) {
            throw new IllegalStateException("Student is already enrolled in this course");
        }


        CourseParticipant enrollment = new CourseParticipant();
        enrollment.setId(id);
        enrollment.setStudent(student);
        enrollment.setCourse(course);

        return courseParticipantRepository.save(enrollment);
    }


    @Transactional
    public void removeStudentFromCourse(Long studentId, Long courseId) {
        CourseParticipantId id = new CourseParticipantId(studentId, courseId);

        if (!courseParticipantRepository.existsById(id)) {
            throw new IllegalStateException("Student is not enrolled in this course");
        }

        courseParticipantRepository.deleteById(id);
    }

    @Transactional
    public void removeAllStudentsFromCourse(Long courseId) {
        courseParticipantRepository.deleteByCourseId(courseId);
    }


    public List<User> getStudentsInCourse(Long courseId) {
        return courseParticipantRepository.findByCourseId(courseId)
                .stream()
                .map(CourseParticipant::getStudent)
                .collect(Collectors.toList());
    }


    public List<Course> getCoursesForStudent(Long studentId) {
        return courseParticipantRepository.findByStudentId(studentId)
                .stream()
                .map(CourseParticipant::getCourse)
                .collect(Collectors.toList());
    }


    public boolean isStudentEnrolledInCourse(Long studentId, Long courseId) {
        CourseParticipantId id = new CourseParticipantId(studentId, courseId);
        return courseParticipantRepository.existsById(id);
    }


    public long getEnrollmentCountForCourse(Long courseId) {
        return courseParticipantRepository.countByCourseId(courseId);
    }


    @Transactional
    public List<CourseParticipant> bulkAddStudents(Long courseId, List<Long> studentIds) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + courseId));

        return studentIds.stream()
                .filter(studentId -> !isStudentEnrolledInCourse(studentId, courseId))
                .map(studentId -> {
                    User student = userRepository.findById(studentId)
                            .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

                    CourseParticipantId id = new CourseParticipantId(studentId, courseId);
                    CourseParticipant enrollment = new CourseParticipant();
                    enrollment.setId(id);
                    enrollment.setStudent(student);
                    enrollment.setCourse(course);

                    return courseParticipantRepository.save(enrollment);
                })
                .collect(Collectors.toList());
    }
}
