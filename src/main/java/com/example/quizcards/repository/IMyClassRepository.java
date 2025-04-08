package com.example.quizcards.repository;

import com.example.quizcards.entities.MyClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IMyClassRepository extends JpaRepository<MyClass, Long> {
    List<MyClass> findByOwners_UserId(Long userId);
    
    // Tìm các lớp mà user là thành viên (không phải chủ sở hữu)
    @Query("SELECT mc FROM MyClass mc JOIN mc.members m WHERE m.userId = :userId AND mc.owners.userId != :userId")
    List<MyClass> findJoinedClassesByUserId(@Param("userId") Long userId);
}
