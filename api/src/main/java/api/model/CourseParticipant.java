package api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

// Updated Entity
@Getter
@Entity
@Table(name = "course_participants")
public class CourseParticipant {
    @EmbeddedId
    private CourseParticipantId id;

    @Setter
    @ManyToOne
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    private User student;

    @Setter
    @ManyToOne
    @MapsId("courseId")
    @JoinColumn(name = "course_id")
    private Course course;

    public void setId(Long studentId, Long courseID) {
        this.id = new CourseParticipantId(studentId, courseID);
    }

    public void setId(CourseParticipantId id) {
        this.id = id;
    }

}
