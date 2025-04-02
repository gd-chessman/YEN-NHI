package com.example.quizcards.service.impl;

import com.example.quizcards.entities.Folder;
import com.example.quizcards.entities.MyClass;
import com.example.quizcards.repository.IFolderRepository;
import com.example.quizcards.repository.IMyClassRepository;
import com.example.quizcards.security.UserPrincipal;
import com.example.quizcards.service.IMyClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MyClassService implements IMyClassService {

    @Autowired
    private IMyClassRepository iMyClassRepository;

    @Autowired
    private IFolderRepository iFolderRepository;

    @Override
    public void save(MyClass myClass) {
        iMyClassRepository.save(myClass);
    }

    @Override
    public List<MyClass> findMyClasses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        Long userId = user.getId();
        return iMyClassRepository.findByUser_UserId(userId);
    }

    @Override
    public Optional<MyClass> findById(Long id) {
        return iMyClassRepository.findById(id);
    }

    @Override
    public boolean addFolderToClass(Long classId, Long folderId) {
        Optional<MyClass> optionalClass = findById(classId);
        Optional<Folder> optionalFolder = iFolderRepository.findById(folderId);

        if (optionalClass.isPresent() && optionalFolder.isPresent()) {
            MyClass myClass = optionalClass.get();
            Folder folder = optionalFolder.get();

            // Add the class to the folder's collection
            folder.getMyClasses().add(myClass);

            // The reciprocal relationship will be managed by JPA due to mappedBy
            iFolderRepository.save(folder);
            return true;
        }
        return false;
    }
}
