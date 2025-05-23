package api.repository;

import api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsernameOrEmail(String username, String email);
    List<User> findByFullNameStartingWithIgnoreCase(String prefix);
    @Query("SELECT u FROM User u WHERE CONCAT(u.lastName, ' ', u.firstName) = :fullName")
    Optional<User> findByFullName(@Param("fullName") String fullName);

}
