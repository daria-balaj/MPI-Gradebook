package api.database.model;


import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String courseName;

    private String description;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @OneToMany(mappedBy = "course")
    private Set<CourseParticipant> enrollments;

    @OneToMany(mappedBy = "course")
    private Set<Assignment> assignments;
}

