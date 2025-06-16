package com.boot.favorites.Service;

import com.boot.favorites.DAO.FavoriteDAO;
import com.boot.favorites.DTO.CollectionHistoryDTO;
import com.boot.favorites.DTO.FavoriteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {
    @Autowired
    private FavoriteDAO favoriteDAO;

    public void addFavorite(FavoriteDTO favorite) throws Exception {
        favoriteDAO.insertFavorite(favorite);
    }

    public void deleteFavorite(FavoriteDTO favorite) throws Exception {
        favoriteDAO.deleteFavorite(favorite);
    }

    public List<CollectionHistoryDTO> getAllFavorites(String userId) throws Exception {
        return favoriteDAO.getAllFavorites(userId);
    }
}
