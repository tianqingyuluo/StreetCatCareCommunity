package com.streetCat.controller;
import com.streetCat.pojo.Feeding;
import com.streetCat.service.FeedingService;
import com.streetCat.vo.request.CreateFeedingRequest;
import com.streetCat.vo.request.FeedingStatRequest;
import com.streetCat.vo.response.FeedingStatResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedings")
@RequiredArgsConstructor
@Tag(name = "feeding", description = "投喂相关")
public class FeedingController {

    private final FeedingService feedingService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateFeedingRequest request) {
        try {
            Feeding resp = feedingService.create(request);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("新增投喂失败: " + e.getMessage());
        }
    }
    @GetMapping
    public ResponseEntity<?> list(@RequestParam(required = false) Long catId,
                                  @RequestParam(required = false) Long userId,
                                  @RequestParam(required = false) Long shelterId) {
        try {
            return ResponseEntity.ok(feedingService.listFeedings(catId, userId, shelterId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("查询投喂列表失败: " + e.getMessage());
        }
    }
    @GetMapping("/statistics")
    public ResponseEntity<?> getFeedingStatistics(FeedingStatRequest req) {
        try {
            FeedingStatResponse resp = feedingService.statistics(req);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("投喂统计失败: " + e.getMessage());
        }
    }
}