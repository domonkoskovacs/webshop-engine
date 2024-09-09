package hu.webshop.engine.webshopbe.domain.email.entity;

import java.time.DayOfWeek;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import hu.webshop.engine.webshopbe.domain.util.Constants;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "promotion_email")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PromotionEmail extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "email_text", nullable = false)
    private String text;

    @Column(name = "email_subject", nullable = false)
    private String subject;

    @Column(name = "email_image", nullable = false)
    private String imageUrl;

    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek;

    @Column(name = "hour_of_recurring", nullable = false)
    private int hour;

    @Column(name = "minute_of_recurring", nullable = false)
    private int minute;

    public boolean needsToBeSent() {
        OffsetDateTime now = OffsetDateTime.now();
        int currentMinute = now.getMinute();
        return getDayOfWeek().contains(now.getDayOfWeek()) &&
                hour == now.getHour() &&
                (currentMinute < 30 && minute < 30) || (currentMinute >= 30 && minute >= 30);
    }

    public List<DayOfWeek> getDayOfWeek() {
        return Arrays.stream(dayOfWeek.split(Constants.DAY_OF_WEEK_SEPARATOR))
                .map(DayOfWeek::valueOf)
                .toList();
    }
}
