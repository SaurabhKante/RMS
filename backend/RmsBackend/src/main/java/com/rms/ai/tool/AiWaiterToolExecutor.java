package com.rms.ai.tool;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rms.entity.Dish;
import com.rms.entity.Order;
import com.rms.entity.OrderItem;
import com.rms.entity.RestaurantTable;
import com.rms.entity.enums.DishType;
import com.rms.entity.enums.OrderStatus;
import com.rms.exception.ResourceNotFoundException;
import com.rms.repository.DishRepository;
import com.rms.repository.OrderRepository;
import com.rms.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Executes tool calls requested by the LLM during the orchestration loop.
 *
 * Each method maps directly to a real data operation using repositories.
 * We bypass the service layer here to avoid unwrapping ResponseEntity objects
 * and to keep the AI path independent of Spring Security context.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AiWaiterToolExecutor {

    private final DishRepository dishRepository;
    private final OrderRepository orderRepository;
    private final RestaurantTableRepository restaurantTableRepository;
    private final ObjectMapper objectMapper;

    /**
     * Main dispatch method — routes to the correct tool by name.
     *
     * @param toolName name of the tool (must match system prompt tool names)
     * @param args     arguments map from the LLM's tool_call.args
     * @param tableId  current table (passed separately for context)
     * @return JSON string result to feed back to the LLM
     */
    public String execute(String toolName, Map<String, Object> args, Integer tableId) {
        log.info("Executing tool: {} with args: {}", toolName, args);
        return switch (toolName) {
            case "get_menu_categories"    -> getMenuCategories();
            case "get_dishes_in_category" -> getDishesInCategory(args);
            case "get_dish_details"       -> getDishDetails(args);
            case "get_pending_order"      -> getPendingOrder(tableId);
            default -> toJson(Map.of("error", "Unknown tool: " + toolName));
        };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Tool: get_menu_categories
    // ─────────────────────────────────────────────────────────────────────────

    private String getMenuCategories() {
        List<Map<String, Object>> categories = dishRepository
                .findByDishTypeAndIsActiveTrue(DishType.PARENT)
                .stream()
                .map(dish -> Map.<String, Object>of(
                        "categoryId", dish.getDishId(),
                        "categoryName", dish.getDishName()
                ))
                .collect(Collectors.toList());
        return toJson(Map.of("categories", categories));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Tool: get_dishes_in_category
    // ─────────────────────────────────────────────────────────────────────────

    private String getDishesInCategory(Map<String, Object> args) {
        Integer parentDishId = toInteger(args.get("parentDishId"));
        if (parentDishId == null) {
            return toJson(Map.of("error", "parentDishId is required"));
        }

        List<Map<String, Object>> dishes = dishRepository
                .findActiveChildren(parentDishId)
                .stream()
                .map(this::dishToMap)
                .collect(Collectors.toList());

        return toJson(Map.of("dishes", dishes));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Tool: get_dish_details
    // ─────────────────────────────────────────────────────────────────────────

    private String getDishDetails(Map<String, Object> args) {
        Integer dishId = toInteger(args.get("dishId"));
        if (dishId == null) {
            return toJson(Map.of("error", "dishId is required"));
        }

        Optional<Dish> dishOpt = dishRepository.findByDishIdAndIsActiveTrue(dishId);
        if (dishOpt.isEmpty()) {
            return toJson(Map.of("error", "Dish not found: " + dishId));
        }

        return toJson(dishToMap(dishOpt.get()));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Tool: get_pending_order
    // ─────────────────────────────────────────────────────────────────────────

    private String getPendingOrder(Integer tableId) {
        Optional<RestaurantTable> tableOpt = restaurantTableRepository.findById(tableId);
        if (tableOpt.isEmpty()) {
            return toJson(Map.of("error", "Table not found: " + tableId));
        }

        Optional<Order> orderOpt = orderRepository.findByRestaurantTableAndOrderStatus(
                tableOpt.get(), OrderStatus.PENDING
        );

        if (orderOpt.isEmpty()) {
            return toJson(Map.of("hasPendingOrder", false, "items", List.of()));
        }

        Order order = orderOpt.get();
        List<Map<String, Object>> items = order.getOrderItems().stream()
                .map(item -> Map.<String, Object>of(
                        "dishId", item.getDish().getDishId(),
                        "dishName", item.getDish().getDishName(),
                        "quantity", item.getQuantity(),
                        "price", item.getPrice()
                ))
                .collect(Collectors.toList());

        return toJson(Map.of(
                "hasPendingOrder", true,
                "orderId", order.getOrderId(),
                "totalAmount", order.getTotalAmount(),
                "items", items
        ));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    private Map<String, Object> dishToMap(Dish dish) {
        return Map.of(
                "dishId", dish.getDishId(),
                "dishName", dish.getDishName(),
                "description", dish.getDescription() != null ? dish.getDescription() : "",
                "price", dish.getPrice(),
                "tags", dish.getTags() != null ? dish.getTags() : "",
                "imageUrl", dish.getImageUrl() != null ? dish.getImageUrl() : ""
        );
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.error("JSON serialization error", e);
            return "{\"error\": \"serialization error\"}";
        }
    }

    private Integer toInteger(Object value) {
        if (value == null) return null;
        if (value instanceof Integer i) return i;
        if (value instanceof Number n) return n.intValue();
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
