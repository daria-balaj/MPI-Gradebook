package api.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Getter
    @Column(nullable = false)
    private String courseName;

    @Setter
    @Getter
    private String description;

    @ManyToOne
    @Setter
    @Getter
    @JoinColumn(name = "teacher_id", nullable = false)
//    @JsonBackReference
//    @JsonIgnore
    @JsonIdentityInfo(
    generator = ObjectIdGenerators.PropertyGenerator.class,
    property = "id")
    private User teacher;

    @OneToMany(mappedBy = "course")
//    @JsonBackReference
    @JsonIgnore
    private Set<CourseParticipant> students;

    @JsonIgnore
    @OneToMany(mappedBy = "course")
    private Set<Assignment> assignments;

    public long getId() { return this.id;}
    public void setId(long id ) { this.id = id; }

}

