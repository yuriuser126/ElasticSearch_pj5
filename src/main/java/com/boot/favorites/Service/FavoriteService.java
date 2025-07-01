package com.boot.favorites.Service;

import com.boot.favorites.DAO.FavoriteDAO;
import com.boot.favorites.DTO.CollectionHistoryDTO;
import com.boot.favorites.DTO.FavoriteDTO;
import com.boot.log.model.Logs;
import com.boot.log.service.LogService;
import com.boot.user.dao.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FavoriteService {
    @Autowired
    private FavoriteDAO favoriteDAO;
    @Autowired
    private LogService logService;


    public void addFavorite(FavoriteDTO favorite) throws Exception {
        Logs log = new Logs();
        log.setActivityType("USER_ACTION");
        log.setActorType("USER");
        log.setActorId(favorite.getUserId());
        log.setActorName(favorite.getUserName());
        log.setAction("addFavorite");
        log.setTimestamp(LocalDateTime.now());
        try{
            favoriteDAO.insertFavorite(favorite);
            log.setActionStatus("SUCCESS");
            log.setActionDetail("SUCCESS: 즐겨찾기 추가 - " + favorite.toString());
        } catch (Exception e) {
            log.setActionStatus("FAIL");
            log.setActionDetail("FAIL: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            throw e;
        } finally {
            log.setTimestamp(LocalDateTime.now());
            logService.saveLog(log);
        }
    }

    public void deleteFavorite(FavoriteDTO favorite) throws Exception {
        Logs log = new Logs();
        log.setActivityType("USER_ACTION");
        log.setActorType("USER");
        log.setActorId(favorite.getUserId());
        log.setActorName(favorite.getUserName());
        log.setAction("deleteFavorite");
        log.setTimestamp(LocalDateTime.now());
        try {
            favoriteDAO.deleteFavorite(favorite);
            log.setActionStatus("SUCCESS");
            log.setActionDetail("SUCCESS: 즐겨찾기 삭제 - " + favorite.toString());
        } catch (Exception e) {
            log.setActionStatus("FAIL");
            log.setActionDetail("FAIL: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            throw e;
        } finally {
            log.setTimestamp(LocalDateTime.now());
            logService.saveLog(log);
        }
    }

    public List<CollectionHistoryDTO> getAllFavorites(String userId ,String userName) throws Exception {
        Logs log = new Logs();
        log.setActivityType("USER_ACTION");
        log.setActorType("USER");
        log.setActorId(userId);
        log.setActorName(userName);
        log.setAction("getAllFavorites");
        log.setTimestamp(LocalDateTime.now());

        try {
            List<CollectionHistoryDTO> result = favoriteDAO.getAllFavorites(userId);
            log.setActionStatus("SUCCESS");
            log.setActionDetail("SUCCESS: 즐겨찾기 목록 조회 - " + result.size() + "개");
            return result;
        } catch (Exception e) {
            log.setActionStatus("FAIL");
            log.setActionDetail("FAIL: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            throw e;
        } finally {
            log.setTimestamp(LocalDateTime.now());
            logService.saveLog(log);
        }
    }
}
