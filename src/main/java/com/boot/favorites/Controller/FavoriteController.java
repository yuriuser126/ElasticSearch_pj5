package com.boot.favorites.Controller;

import com.boot.favorites.DTO.CollectionHistoryDTO;
import com.boot.user.dto.UserDTO;
import com.boot.user.service.UserService;
import org.springframework.security.core.Authentication;
import com.boot.favorites.DTO.FavoriteDTO;
import com.boot.favorites.Service.FavoriteService;
import com.boot.z_config.security.PrincipalDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/favorite")
public class FavoriteController {
    @Autowired
    private FavoriteService favoriteService;
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> addFavorite(@RequestBody FavoriteDTO favorite) {
        try {
            favoriteService.addFavorite(favorite);
            return ResponseEntity.ok(Collections.singletonMap("result", "ok"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Collections.singletonMap("error", "DB 등록 실패: " + e.getMessage()));
        }
    }

    @GetMapping
    public List<CollectionHistoryDTO> getAllFavorites(Authentication authentication) throws Exception {
        // PrincipalDetails는 사용자 인증 정보를 담은 커스텀 클래스
        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
        String userId = principal.getUser().getUserId();
        HashMap<String, String> param = new HashMap<>();
        param.put("userId", userId);
        UserDTO fullUser = userService.getUserInfo(param);
        String userName = fullUser.getUserName();
        System.out.println("userId: " + userId);
        System.out.println("userName: " + userName);
        return favoriteService.getAllFavorites(userId, userName);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteFavorite(@RequestBody FavoriteDTO favorite) {
        try {
            favoriteService.deleteFavorite(favorite);
            return ResponseEntity.ok(Collections.singletonMap("result", "ok"));
        }
        catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Collections.singletonMap("error", "DB 삭제 실패: " + e.getMessage()));
        }
    }
}