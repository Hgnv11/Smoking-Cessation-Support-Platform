package com.smokingcessation.repository;

import com.smokingcessation.model.CommunityPost;
import com.smokingcessation.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
@Repository
public interface PostRepository extends JpaRepository<CommunityPost, Integer> {
    List<CommunityPost> findByUser(User user);
}
