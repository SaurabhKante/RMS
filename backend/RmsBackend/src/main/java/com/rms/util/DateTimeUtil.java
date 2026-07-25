package com.rms.util;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeUtil {

    private static final ZoneId IST_ZONE = ZoneId.of("Asia/Kolkata");

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static String convertUTCtoIST(LocalDateTime utcDateTime) {

        ZonedDateTime utc = utcDateTime.atZone(ZoneOffset.UTC);

        ZonedDateTime ist = utc.withZoneSameInstant(IST_ZONE);

        return ist.format(FORMATTER);
    }

}