package api.database.model;

import jakarta.persistence.*;

import java.util.Set;


@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(name = "email", unique = true, columnDefinition = "VARCHAR(255) CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')")
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    // Relationships
    @OneToMany(mappedBy = "teacher")
    private Set<Course> createdCourses;

    @OneToMany(mappedBy = "student")
    private Set<CourseParticipant> courseEnrollments;
}