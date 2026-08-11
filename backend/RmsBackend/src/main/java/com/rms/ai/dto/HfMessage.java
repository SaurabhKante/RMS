package com.rms.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A single message in the HF chat completions messages array.
 * role = "system" | "user" | "assistant"
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HfMessage {

    private String role;
    private String content;
}
