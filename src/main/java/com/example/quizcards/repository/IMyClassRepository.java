package com.example.quizcards.repository;

import com.example.quizcards.entities.MyClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IMyClassRepository extends JpaRepository<MyClass, Long> {
    List<MyClass> findByUser_UserId(Long userId);
}
