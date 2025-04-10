import { Assignment } from "./assignment";
import { User } from "./user";

export interface Course {
    id: number,
    courseName: string,
    description: string,
    students: User[],
    assignments: Assignment[];
}
