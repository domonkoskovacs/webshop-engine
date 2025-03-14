package hu.webshop.engine.webshopbe.infrastructure.controller;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.StatisticsAdapter;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Admin;
import hu.webshop.engine.webshopbe.infrastructure.model.response.StatisticsResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@Tag(
        name = "Statistics service",
        description = "REST endpoints for statistics service"
)
public class StatisticsController {

    private final StatisticsAdapter statisticsAdapter;

    @Operation(
            tags = {"Statistics service"},
            summary = "Get statistics",
            description = "Admin can get statistics"
    )
    @GetMapping(produces = "application/json")
    @Admin
    public ResponseEntity<StatisticsResponse> getStatistics(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to,
            @RequestParam(required = false, defaultValue = "5") Integer mostSavedProductCount,
            @RequestParam(required = false, defaultValue = "5") Integer mostOrderedProductCount,
            @RequestParam(required = false, defaultValue = "5") Integer topUserCount
    ) {
        log.info("getStatistics");
        return ResponseEntity.ok(statisticsAdapter.getStatistics(from, to, mostSavedProductCount, mostOrderedProductCount, topUserCount));
    }
}
