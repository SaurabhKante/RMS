package com.rms.ai.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * Response from the HF Inference API chat completions endpoint.
 * We only need choices[0].message.content — the rest is ignored.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class HfChatResponse {

    private List<Choice> choices;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Choice {
        private Message message;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Message {
        private String role;
        private String content;
    }

    /**
     * Convenience method — extracts the assistant's reply text.
     */
    public String getFirstChoiceContent() {
        if (choices == null || choices.isEmpty()) return null;
        Choice choice = choices.get(0);
        if (choice.getMessage() == null) return null;
        return choice.getMessage().getContent();
    }
}
