package com.smokingcessation.service;

import com.smokingcessation.model.Consultation;
import com.smokingcessation.repository.ConsultationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class DailyVideoService {

    private final WebClient webClient;
    private final ConsultationRepository consultationRepository;

    @Value("${daily.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.daily.co/v1";

    public String createRoom() {
        Map<String, Object> requestBody = Map.of(
                "properties", Map.of(
                        "enable_chat", true,
                        "start_video_off", true
                )
        );

        return webClient.post()
                .uri(BASE_URL + "/rooms")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(resp -> (String) resp.get("url"))
                .block();
    }

    public void deleteRoomByUrl(String fullUrl) {
        String roomName = extractRoomNameFromUrl(fullUrl);
        if (roomName != null && !roomName.isBlank()) {
            deleteRoom(roomName);
        }
    }

    private void deleteRoom(String roomName) {
        webClient.delete()
                .uri(BASE_URL + "/rooms/" + roomName)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .retrieve()
                .toBodilessEntity()
                .block();
    }

    private String extractRoomNameFromUrl(String url) {
        if (url == null || !url.contains("/")) return null;
        return url.substring(url.lastIndexOf('/') + 1);
    }

    @Transactional
    public String createAndAssignVideoRoom(Integer consultationId) {
        Consultation consultation = consultationRepository.findByConsultationId(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found with ID: " + consultationId));

        // Nếu đã có meetLink cũ thì xóa room trên Daily
        if (consultation.getMeetingLink() != null) {
            this.deleteRoomByUrl(consultation.getMeetingLink());
        }

        // Tạo room mới
        String newRoomUrl = this.createRoom();

        // Cập nhật lại meetLink trong consultation
        consultation.setMeetingLink(newRoomUrl);
        consultationRepository.save(consultation);

        return newRoomUrl;
    }

}
