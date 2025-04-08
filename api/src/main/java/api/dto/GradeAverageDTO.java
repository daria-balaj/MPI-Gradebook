package api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GradeAverageDTO {
    private Long courseId;
    private String courseName;
    private Double averageGrade;
}
