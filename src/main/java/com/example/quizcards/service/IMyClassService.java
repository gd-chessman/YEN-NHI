package com.example.quizcards.service;

import com.example.quizcards.entities.MyClass;

import java.util.List;
import java.util.Optional;

public interface IMyClassService {
    void save(MyClass myClass);

    List<MyClass> findMyClasses();

    Optional<MyClass> findById(Long id);

    boolean addFolderToClass(Long classId, Long folderId);
}
