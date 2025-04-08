package com.example.quizcards.controller;

import com.example.quizcards.entities.Folder;
import com.example.quizcards.entities.MyClass;
import com.example.quizcards.service.IMyClassService;
import com.example.quizcards.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/my-class")
public class MyClassController {

    @Autowired
    private IMyClassService iMyClassService;

    @PostMapping
    public ResponseEntity<?> createMyClass(@RequestBody MyClass myClass) {
        iMyClassService.save(myClass);
        return new ResponseEntity<>(HttpStatus.CREATED);

    }

    // API lấy danh sách các lớp do người dùng tạo (myClasses)
    @GetMapping("/me")
    public ResponseEntity<List<MyClass>> getMyClasses() {
        List<MyClass> myClasses = iMyClassService.findMyClasses();
        return new ResponseEntity<>(myClasses, HttpStatus.OK);
    }

    // API lấy danh sách các lớp mà người dùng đã tham gia
    @GetMapping("/joined")
    public ResponseEntity<List<MyClass>> getJoinedClasses() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        Long userId = user.getId();
        
        List<MyClass> joinedClasses = iMyClassService.findJoinedClasses(userId);
        return new ResponseEntity<>(joinedClasses, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClassById(@PathVariable Long id) {
        Optional<MyClass> myClass = iMyClassService.findById(id);
        return new ResponseEntity<>(myClass, HttpStatus.OK);
    }

    @PutMapping("/{classId}/add-folder/{folderId}")
    public ResponseEntity<?> addFolderToClass(@PathVariable Long classId, @PathVariable Long folderId) {
        try {
            boolean success = iMyClassService.addFolderToClass(classId, folderId);
            if (success) {
                return new ResponseEntity<>("Folder added to class successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Failed to add folder to class", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{classId}/folders")
    public ResponseEntity<?> getFoldersFromClass(@PathVariable Long classId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
            Long userId = user.getId();

            Optional<MyClass> myClassOptional = iMyClassService.findById(classId);

            if (myClassOptional.isPresent()) {
                MyClass myClass = myClassOptional.get();
                
                // Kiểm tra nếu người dùng là owner hoặc thành viên của lớp
                boolean isOwner = myClass.getOwners() != null && myClass.getOwners().getUserId().equals(userId);
                boolean isMember = myClass.getMembers().stream()
                        .anyMatch(member -> member.getUserId().equals(userId));
                
                if (!isOwner && !isMember) {
                    return new ResponseEntity<>("You don't have permission to access this class's folders", HttpStatus.FORBIDDEN);
                }

                Set<Folder> folders = myClass.getFolders();
                return new ResponseEntity<>(folders, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Class not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{classId}/remove-folder/{folderId}")
    public ResponseEntity<?> removeFolderFromClass(@PathVariable Long classId, @PathVariable Long folderId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
            Long userId = user.getId();

            Optional<MyClass> myClassOptional = iMyClassService.findById(classId);
            if (myClassOptional.isPresent()) {
                MyClass myClass = myClassOptional.get();
                
                // Kiểm tra nếu người dùng là owner của lớp
                boolean isOwner = myClass.getOwners() != null && myClass.getOwners().getUserId().equals(userId);
                
                if (!isOwner) {
                    return new ResponseEntity<>("Only class owner can remove folders", HttpStatus.FORBIDDEN);
                }

                boolean success = iMyClassService.removeFolderFromClass(classId, folderId);
                if (success) {
                    return new ResponseEntity<>("Folder removed from class successfully", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Failed to remove folder from class", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("Class not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
