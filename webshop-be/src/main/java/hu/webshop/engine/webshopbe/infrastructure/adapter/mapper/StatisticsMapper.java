package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import org.mapstruct.Mapper;

import hu.webshop.engine.webshopbe.domain.statistics.value.OrderStatistics;
import hu.webshop.engine.webshopbe.domain.statistics.value.ProductStatistics;
import hu.webshop.engine.webshopbe.domain.statistics.value.Statistics;
import hu.webshop.engine.webshopbe.domain.statistics.value.UserStatistics;
import hu.webshop.engine.webshopbe.infrastructure.model.response.OrderStatisticsResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ProductStatisticsResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.StatisticsResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.UserStatisticsResponse;


@Mapper(uses = {ProductMapper.class, UserMapper.class})
public interface StatisticsMapper {

    UserStatisticsResponse toResponse(UserStatistics userStatistics);

    ProductStatisticsResponse toResponse(ProductStatistics productStatistics);

    OrderStatisticsResponse toResponse(OrderStatistics orderStatistics);

    StatisticsResponse toResponse(Statistics statistics);
}
