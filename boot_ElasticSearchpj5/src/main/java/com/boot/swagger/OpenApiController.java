package com.boot.swagger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;

@RestController
@RequestMapping("/api/convert") // API 기본 경로
public class OpenApiController {

    private final OpenApiConverterService converterService;

    @Autowired
    public OpenApiController(OpenApiConverterService converterService) {
        this.converterService = converterService;
    }

    @PostMapping("/{format}")
    public ResponseEntity<String> convertOpenApi(
//            @PathVariable String format,
    		@PathVariable("format") String format,
            @RequestBody String openApiJsonString) { // 요청 본문으로 JSON 문자열을 받음
        try {
            String result;
            String contentType = MediaType.TEXT_PLAIN_VALUE; // 기본 콘텐츠 타입
            String filename = "converted_openapi";

            switch (format.toLowerCase()) {
                case "csv":
                    result = converterService.convertToCsv(openApiJsonString);
                    contentType = "text/csv; charset=UTF-8";
                    filename += ".csv";
                    break;
                case "markdown":
                    result = converterService.convertToMarkdown(openApiJsonString);
                    contentType = "text/markdown; charset=UTF-8";
                    filename += ".md";
                    break;
                case "html":
                    result = converterService.convertToHtml(openApiJsonString);
                    contentType = MediaType.TEXT_HTML_VALUE + "; charset=UTF-8";
                    filename += ".html";
                    break;
                default:
                    return ResponseEntity.badRequest().body("지원하지 않는 포맷입니다: " + format + ". (지원 포맷: csv, markdown, html)");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
            // Content-Type은 ResponseEntity 생성자에서 설정 또는 여기서 명시적 설정 가능
            // headers.setContentType(MediaType.parseMediaType(contentType));


            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType)) // 응답 콘텐츠 타입 설정
                    // .headers(headers) // 다운로드 파일명을 지정하고 싶다면 이 헤더를 추가 (JavaScript에서 처리할 예정이므로 여기선 주석)
                    .body(result);

        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 JSON 형식입니다: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        catch (Exception e) {
            // 실제 운영 환경에서는 더 상세한 로깅 및 예외 처리가 필요합니다.
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("변환 중 서버 내부 오류 발생: " + e.getMessage());
        }
    }
}