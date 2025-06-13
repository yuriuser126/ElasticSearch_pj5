package com.boot.swagger;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

import lombok.AllArgsConstructor; // ApiEndpointInfo DTO용
import lombok.Getter;      // ApiEndpointInfo DTO용
import lombok.Setter;    // ApiEndpointInfo DTO용

@Service
public class OpenApiConverterService {

    private final ObjectMapper objectMapper = new ObjectMapper(); // JSON 파싱용
    private final CsvMapper csvMapper = new CsvMapper();     // CSV 생성용

    public String convertToCsv(String openApiJsonString) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(openApiJsonString);
        List<ApiEndpointInfo> endpointInfos = new ArrayList<>();
        JsonNode paths = rootNode.path("paths");

        if (paths.isMissingNode() || !paths.isObject()) {
            throw new IllegalArgumentException("OpenAPI JSON에 'paths' 필드가 없거나 올바른 형식이 아닙니다.");
        }

        Iterator<Map.Entry<String, JsonNode>> pathIterator = paths.fields();
        while (pathIterator.hasNext()) {
            Map.Entry<String, JsonNode> pathEntry = pathIterator.next();
            String path = pathEntry.getKey();
            JsonNode methods = pathEntry.getValue();

            Iterator<Map.Entry<String, JsonNode>> methodIterator = methods.fields();
            while (methodIterator.hasNext()) {
                Map.Entry<String, JsonNode> methodEntry = methodIterator.next();
                String method = methodEntry.getKey().toUpperCase();
                JsonNode operationDetails = methodEntry.getValue();
                String summary = operationDetails.path("summary").asText("N/A");
                String description = operationDetails.path("description").asText("N/A");

                // 파라미터 정보 추출 (간단하게 이름과 위치만)
                List<String> parameters = new ArrayList<>();
                JsonNode paramsNode = operationDetails.path("parameters");
                if (paramsNode.isArray()) {
                    for (JsonNode param : paramsNode) {
                        parameters.add(param.path("name").asText("N/A") + " (" + param.path("in").asText("N/A") + ")");
                    }
                }
                String paramsString = String.join("; ", parameters); // CSV에서는 쉼표 대신 세미콜론 등으로 구분
                if (paramsString.isEmpty()) paramsString = "N/A";

                endpointInfos.add(new ApiEndpointInfo(path, method, summary, description, paramsString));
            }
        }

        if (endpointInfos.isEmpty()) {
            return "CSV로 변환할 API 경로 정보가 없습니다.";
        }

        CsvSchema schema = csvMapper.schemaFor(ApiEndpointInfo.class).withHeader();
        return csvMapper.writer(schema).writeValueAsString(endpointInfos);
    }

    public String convertToMarkdown(String openApiJsonString) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(openApiJsonString);
        StringBuilder md = new StringBuilder();

        // API 기본 정보
        md.append("# ").append(rootNode.path("info").path("title").asText("OpenAPI 문서")).append("\n");
        md.append("**Version:** ").append(rootNode.path("info").path("version").asText("N/A")).append("\n");
        md.append(rootNode.path("info").path("description").asText("N/A")).append("\n\n");

        // 서버 정보
        JsonNode servers = rootNode.path("servers");
        if (servers.isArray() && !servers.isEmpty()) {
            md.append("## Servers\n");
            for (JsonNode server : servers) {
                md.append("- ").append(server.path("url").asText("N/A"));
                if (server.has("description")) {
                    md.append(" (").append(server.path("description").asText("")).append(")");
                }
                md.append("\n");
            }
            md.append("\n");
        }

        // API 경로 정보
        md.append("## API Endpoints\n");
        JsonNode paths = rootNode.path("paths");
        if (paths.isMissingNode() || !paths.isObject()) {
             md.append("API 경로 정보가 없습니다.\n");
        } else {
            Iterator<Map.Entry<String, JsonNode>> pathIterator = paths.fields();
            while (pathIterator.hasNext()) {
                Map.Entry<String, JsonNode> pathEntry = pathIterator.next();
                String path = pathEntry.getKey();
                JsonNode methods = pathEntry.getValue();
                md.append("### `").append(path).append("`\n\n"); // 경로 제목

                Iterator<Map.Entry<String, JsonNode>> methodIterator = methods.fields();
                while (methodIterator.hasNext()) {
                    Map.Entry<String, JsonNode> methodEntry = methodIterator.next();
                    String method = methodEntry.getKey().toUpperCase();
                    JsonNode opDetails = methodEntry.getValue();
                    md.append("#### ").append(method).append("\n"); // HTTP 메소드
                    if (opDetails.has("summary")) {
                        md.append("**Summary:** ").append(opDetails.path("summary").asText("N/A")).append("\n");
                    }
                    if (opDetails.has("description")) {
                        md.append("**Description:** ").append(opDetails.path("description").asText("N/A")).append("\n");
                    }

                    // Parameters
                    JsonNode params = opDetails.path("parameters");
                    if (params.isArray() && !params.isEmpty()) {
                        md.append("**Parameters:**\n\n");
                        md.append("| Name | In | Description | Required | Schema Type |\n");
                        md.append("|------|----|-------------|----------|-------------|\n");
                        for (JsonNode param : params) {
                            md.append("| `").append(param.path("name").asText("N/A")).append("` ");
                            md.append("| ").append(param.path("in").asText("N/A")).append(" ");
                            md.append("| ").append(param.path("description").asText("N/A")).append(" ");
                            md.append("| ").append(param.path("required").asBoolean(false) ? "Yes" : "No").append(" ");
                            md.append("| ").append(param.path("schema").path("type").asText("N/A")).append(" |\n");
                        }
                        md.append("\n");
                    }

                    // Responses
                    JsonNode responses = opDetails.path("responses");
                    if (!responses.isMissingNode() && responses.isObject()) {
                        md.append("**Responses:**\n\n");
                        Iterator<Map.Entry<String, JsonNode>> respIter = responses.fields();
                        while (respIter.hasNext()) {
                            Map.Entry<String, JsonNode> respEntry = respIter.next();
                            md.append("- **`").append(respEntry.getKey()).append("`**: "); // Status Code
                            md.append(respEntry.getValue().path("description").asText("N/A"));
                            // 스키마 정보 (간단히)
                            JsonNode content = respEntry.getValue().path("content").path("application/json").path("schema");
                            if (content.has("$ref")) {
                                md.append(" (Schema: `").append(content.path("$ref").asText().replace("#/components/schemas/", "")).append("`)");
                            } else if (content.has("type")) {
                                md.append(" (Type: `").append(content.path("type").asText()).append("`)");
                            }
                            md.append("\n");
                        }
                         md.append("\n");
                    }
                }
            }
        }

        // 스키마(모델) 정보
        JsonNode schemas = rootNode.path("components").path("schemas");
        if (!schemas.isMissingNode() && schemas.isObject()) {
            md.append("## Schemas (Data Models)\n\n");
            Iterator<Map.Entry<String, JsonNode>> schemaIter = schemas.fields();
            while (schemaIter.hasNext()) {
                Map.Entry<String, JsonNode> schemaEntry = schemaIter.next();
                md.append("### `").append(schemaEntry.getKey()).append("`\n");
                if (schemaEntry.getValue().has("description")) {
                    md.append(schemaEntry.getValue().path("description").asText("N/A")).append("\n");
                }
                if (schemaEntry.getValue().has("type") && "object".equals(schemaEntry.getValue().path("type").asText())) {
                    JsonNode props = schemaEntry.getValue().path("properties");
                    if (!props.isMissingNode() && props.isObject()) {
                        md.append("\n| Field | Type | Description |\n");
                        md.append("|-------|------|-------------|\n");
                        Iterator<Map.Entry<String, JsonNode>> propIter = props.fields();
                        while (propIter.hasNext()) {
                            Map.Entry<String, JsonNode> propEntry = propIter.next();
                            md.append("| `").append(propEntry.getKey()).append("` ");
                            md.append("| ").append(propEntry.getValue().path("type").asText("N/A"));
                            if (propEntry.getValue().has("format")) {
                                 md.append(" (").append(propEntry.getValue().path("format").asText()).append(")");
                            }
                            md.append(" | ").append(propEntry.getValue().path("description").asText("N/A")).append(" |\n");
                        }
                    }
                }
                md.append("\n");
            }
        }
        return md.toString();
    }

    public String convertToHtml(String openApiJsonString) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(openApiJsonString);
        StringBuilder html = new StringBuilder();

        html.append("<!DOCTYPE html><html lang='ko'><head><meta charset='UTF-8'><title>OpenAPI Documentation</title>");
        html.append("<style>" +
                "body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; color: #333; } " +
                "h1, h2, h3, h4, h5 { color: #2c3e50; } " +
                "h1 { border-bottom: 3px solid #3498db; padding-bottom: 10px; } " +
                "h2 { border-bottom: 2px solid #e0e0e0; padding-bottom: 8px; margin-top: 40px; } " +
                "h3 { margin-top: 30px; color: #2980b9; } " +
                "h4 { margin-top: 20px; }"+
                "table { border-collapse: collapse; width: 100%; margin-bottom: 20px; box-shadow: 0 2px 3px rgba(0,0,0,0.1); } " +
                "th, td { border: 1px solid #ddd; padding: 10px 12px; text-align: left; } " +
                "th { background-color: #f8f9fa; font-weight: bold; } " +
                "code { background-color: #f0f0f0; padding: 2px 5px; border-radius: 4px; font-family: Consolas, monospace; color: #c7254e; }" +
                ".path-block { background-color: #fdfdfe; padding: 15px; margin-bottom:20px; border: 1px solid #eee; border-left: 5px solid #3498db; border-radius: 5px; }" +
                ".method { display: inline-block; font-weight: bold; text-transform: uppercase; padding: 6px 12px; border-radius: 4px; color: white; margin-right: 10px;}" +
                ".get { background-color: #2ecc71; }" + // 초록
                ".post { background-color: #3498db; }" + // 파랑
                ".put { background-color: #f1c40f; color: #333 !important;}" + // 노랑
                ".delete { background-color: #e74c3c; }" + // 빨강
                "ul { padding-left: 20px; } " +
                "strong { color: #555; } " +
                "</style></head><body>");

        // API 기본 정보
        JsonNode infoNode = rootNode.path("info");
        html.append("<h1>").append(infoNode.path("title").asText("OpenAPI 문서")).append("</h1>");
        html.append("<p><strong>Version:</strong> ").append(infoNode.path("version").asText("N/A")).append("</p>");
        html.append("<p>").append(infoNode.path("description").asText("N/A")).append("</p>");

        // 서버 정보
        JsonNode serversNode = rootNode.path("servers");
        if (serversNode.isArray() && !serversNode.isEmpty()) {
            html.append("<h2>Servers</h2><ul>");
            for (JsonNode server : serversNode) {
                html.append("<li><code>").append(server.path("url").asText("N/A")).append("</code>");
                if (server.has("description")) {
                    html.append(" - ").append(server.path("description").asText(""));
                }
                html.append("</li>");
            }
            html.append("</ul>");
        }

        // API 경로 정보
        html.append("<h2>API Endpoints</h2>");
        JsonNode pathsNode = rootNode.path("paths");
        if (pathsNode.isMissingNode() || !pathsNode.isObject()) {
            html.append("<p>API 경로 정보가 없습니다.</p>");
        } else {
            Iterator<Map.Entry<String, JsonNode>> pathIter = pathsNode.fields();
            while (pathIter.hasNext()) {
                Map.Entry<String, JsonNode> pathEntry = pathIter.next();
                String path = pathEntry.getKey();
                JsonNode methodsNode = pathEntry.getValue();
                html.append("<div class='path-block'><h3>Path: <code>").append(path).append("</code></h3>");

                Iterator<Map.Entry<String, JsonNode>> methodIter = methodsNode.fields();
                while (methodIter.hasNext()) {
                    Map.Entry<String, JsonNode> methodEntry = methodIter.next();
                    String method = methodEntry.getKey().toLowerCase();
                    JsonNode opDetails = methodEntry.getValue();
                    html.append("<h4><span class='method ").append(method).append("'>").append(method.toUpperCase()).append("</span>");
                    html.append(opDetails.path("summary").asText("N/A")).append("</h4>");
                    if (opDetails.has("description")) {
                        html.append("<p>").append(opDetails.path("description").asText("N/A")).append("</p>");
                    }

                    // Parameters 테이블
                    JsonNode paramsNode = opDetails.path("parameters");
                    if (paramsNode.isArray() && !paramsNode.isEmpty()) {
                        html.append("<h5>Parameters:</h5><table><thead><tr><th>Name</th><th>In</th><th>Description</th><th>Required</th><th>Schema Type</th></tr></thead><tbody>");
                        for (JsonNode param : paramsNode) {
                            html.append("<tr><td><code>").append(param.path("name").asText("N/A")).append("</code></td>");
                            html.append("<td>").append(param.path("in").asText("N/A")).append("</td>");
                            html.append("<td>").append(param.path("description").asText("N/A")).append("</td>");
                            html.append("<td>").append(param.path("required").asBoolean(false) ? "Yes" : "No").append("</td>");
                            JsonNode schema = param.path("schema");
                            html.append("<td><code>").append(schema.path("type").asText("N/A"));
                             if(schema.has("format")){
                                 html.append(" (").append(schema.path("format").asText()).append(")");
                             }
                             html.append("</code></td></tr>");
                        }
                        html.append("</tbody></table>");
                    }
                     // Responses
                    JsonNode responsesNode = opDetails.path("responses");
                    if (!responsesNode.isMissingNode() && responsesNode.isObject()) {
                        html.append("<h5>Responses:</h5><table><thead><tr><th>Status Code</th><th>Description</th><th>Content Schema</th></tr></thead><tbody>");
                        Iterator<Map.Entry<String, JsonNode>> respIter = responsesNode.fields();
                        while (respIter.hasNext()) {
                            Map.Entry<String, JsonNode> respEntry = respIter.next();
                            html.append("<tr><td><code>").append(respEntry.getKey()).append("</code></td>");
                            html.append("<td>").append(respEntry.getValue().path("description").asText("N/A")).append("</td><td>");
                            JsonNode contentSchema = respEntry.getValue().path("content").path("application/json").path("schema");
                            if (contentSchema.has("$ref")) {
                                html.append("<code>").append(contentSchema.path("$ref").asText().replace("#/components/schemas/", "")).append("</code>");
                            } else if (contentSchema.has("type")) {
                                html.append("<code>").append(contentSchema.path("type").asText());
                                if(contentSchema.path("items").has("$ref")) {
                                    html.append(" of ").append(contentSchema.path("items").path("$ref").asText().replace("#/components/schemas/", ""));
                                } else if (contentSchema.path("items").has("type")) {
                                    html.append(" of ").append(contentSchema.path("items").path("type").asText());
                                }
                                html.append("</code>");
                            } else {
                                html.append("N/A");
                            }
                            html.append("</td></tr>");
                        }
                        html.append("</tbody></table>");
                    }
                }
                html.append("</div>"); // path-block end
            }
        }

        // Schemas
        JsonNode schemasNode = rootNode.path("components").path("schemas");
        if(!schemasNode.isMissingNode() && schemasNode.isObject()){
            html.append("<h2>Schemas (Data Models)</h2>");
            Iterator<Map.Entry<String, JsonNode>> schemaIter = schemasNode.fields();
            while(schemaIter.hasNext()){
                Map.Entry<String, JsonNode> schemaEntry = schemaIter.next();
                html.append("<div class='path-block'><h3>Schema: <code>").append(schemaEntry.getKey()).append("</code></h3>");
                if(schemaEntry.getValue().has("description")){
                    html.append("<p>").append(schemaEntry.getValue().path("description").asText("N/A")).append("</p>");
                }
                if("object".equals(schemaEntry.getValue().path("type").asText())){
                    JsonNode propsNode = schemaEntry.getValue().path("properties");
                    if(!propsNode.isMissingNode() && propsNode.isObject()){
                        html.append("<table><thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead><tbody>");
                        Iterator<Map.Entry<String, JsonNode>> propIter = propsNode.fields();
                        while(propIter.hasNext()){
                            Map.Entry<String, JsonNode> propEntry = propIter.next();
                            html.append("<tr><td><code>").append(propEntry.getKey()).append("</code></td>");
                            html.append("<td><code>").append(propEntry.getValue().path("type").asText("N/A"));
                            if(propEntry.getValue().has("format")){
                                html.append(" (").append(propEntry.getValue().path("format").asText()).append(")");
                            }
                            html.append("</code></td>");
                            html.append("<td>").append(propEntry.getValue().path("description").asText("N/A")).append("</td></tr>");
                        }
                        html.append("</tbody></table>");
                    }
                }
                html.append("</div>");
            }
        }

        html.append("</body></html>");
        return html.toString();
    }


    // CSV 생성을 위한 간단한 내부 DTO (Lombok 어노테이션 사용)
    @Getter
    @Setter
    @AllArgsConstructor
    private static class ApiEndpointInfo {
        private String path;
        private String method;
        private String summary;
        private String description;
        private String parameters;
    }
}