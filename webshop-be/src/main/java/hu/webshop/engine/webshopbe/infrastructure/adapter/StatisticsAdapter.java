package hu.webshop.engine.webshopbe.infrastructure.adapter;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.statistics.StatisticsService;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.StatisticsMapper;
import hu.webshop.engine.webshopbe.infrastructure.model.response.StatisticsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatisticsAdapter {

    private final StatisticsService statisticsService;
    private final StatisticsMapper statisticsMapper;

    public StatisticsResponse getStatistics(LocalDate from, LocalDate to, Integer mostSavedProductCount, Integer mostOrderedProductCount, Integer topUserCount) {
        return statisticsMapper.toResponse(statisticsService.calculateStatistics(from, to, mostSavedProductCount, mostOrderedProductCount, topUserCount));
    }
}

