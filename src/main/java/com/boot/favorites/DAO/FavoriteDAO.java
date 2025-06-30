package com.boot.favorites.DAO;

import com.boot.favorites.DTO.CollectionHistoryDTO;
import com.boot.favorites.DTO.FavoriteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Repository
public class FavoriteDAO {
    @Autowired
    private DataSource dataSource; // Oracle DataSource

    public void insertFavorite(FavoriteDTO favorite) throws Exception {
        String sql = "INSERT INTO FAVORITES (USER_ID, DOCUMENT_ID, TITLE, URL, CREATED_AT) VALUES (?, ?, ?, ?, SYSDATE)";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, favorite.getUserId());
            ps.setString(2, favorite.getDocumentId());
            ps.setString(3, favorite.getTitle());
            ps.setString(4, favorite.getUrl());
            ps.executeUpdate();
        }
    }

    public void deleteFavorite(FavoriteDTO favorite) throws Exception {
        String sql = "DELETE FROM FAVORITES WHERE USER_ID = ? AND TITLE = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, favorite.getUserId());
            ps.setString(2, favorite.getTitle());
            ps.executeUpdate();
        }
    }

    public List<CollectionHistoryDTO> getAllFavorites(String userId) throws Exception {
        String sql = "SELECT ID, USER_ID, DOCUMENT_ID, TITLE, URL, CREATED_AT FROM FAVORITES WHERE USER_ID = ?";
        List<CollectionHistoryDTO> favorites = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    CollectionHistoryDTO dto = new CollectionHistoryDTO();
                    dto.setId(rs.getString("ID"));
                    dto.setDatasetName(rs.getString("TITLE"));
                    dto.setURL(rs.getString("URL"));
                    dto.setCollectedAt(rs.getString("CREATED_AT"));
                    dto.setStatus("success");
                    dto.setRecordCount(12345);
                    dto.setFileSize("23");
                    favorites.add(dto);
                }
            }
        }
        return favorites;
    }
}

