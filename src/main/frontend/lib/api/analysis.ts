// 'apiClient' 대신 'api'를 default import로 가져옵니다.
import api from './base';

/**
 * 검색어 로그를 서버에 전송하는 함수
 * @param keyword 사용자가 검색한 키워드
 */
export const logSearchQuery = (keyword: string) => {
  // apiClient.post 대신 api.post를 사용합니다.
  return api.post('/api/analysis/log', null, { params: { keyword } });
};

/**
 * 현재 로그인된 사용자의 시간대별 검색량 데이터를 가져오는 함수
 */
export const getMyHourlySearchVolume = async () => {
  // apiClient.get 대신 api.get을 사용합니다.
  const response = await api.get<Record<string, number>>('/api/analysis/stats/user/hourly');
  return response.data;
};

/**
 * 현재 로그인된 사용자의 인기 검색어 데이터를 가져오는 함수
 */
export const getMyTrendingKeywords = async () => {
  // apiClient.get 대신 api.get을 사용합니다.
  const response = await api.get<Record<string, number>>('/api/analysis/stats/user/trending');
  return response.data;
};

/**
 * [신규] 전체 사용자의 시간대별 검색량 데이터를 가져오는 함수
 */
export const getOverallHourlySearchVolume = async () => {
  const response = await api.get<Record<string, number>>('/api/analysis/stats/overall/hourly');
  return response.data;
};

/**
 * [신규] 전체 사용자의 인기 검색어 데이터를 가져오는 함수
 */
export const getOverallTrendingKeywords = async () => {
  const response = await api.get<Record<string, number>>('/api/analysis/stats/overall/trending');
  return response.data;
};
