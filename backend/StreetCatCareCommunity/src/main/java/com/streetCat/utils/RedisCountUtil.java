package com.streetCat.utils;

import com.streetCat.dao.MainCatMapper;
import com.streetCat.dao.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.concurrent.TimeUnit;
@EnableScheduling
@Component
public class RedisCountUtil {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    @Autowired
    private MainCatMapper catMapper;
    @Autowired
    private PostMapper postMapper;
    // Redis key 前缀
    private static final String LIKE_COUNT_KEY = "count:like";
    private static final String COMMENT_COUNT_KEY = "count:comment";
    private static final String VIEW_COUNT_KEY = "count:view";
    private static final String COLLECT_COUNT_KEY = "count:collect"; // 新增收藏计数key

    // 防重复操作key（同一用户对同一目标）
    private static final String USER_ACTION_KEY = "user_action";

    /**
     * 生成Redis key
     */
    private String generateKey(String countType, String targetType, Long targetId) {
        return String.format("%s:%s:%d", countType, targetType, targetId);
    }

    /**
     * 生成用户行为key（防重复）
     */
    private String generateUserActionKey(String actionType, String targetType, Long targetId, Long userId) {
        return String.format("%s:%s:%s:%d:%d", USER_ACTION_KEY, actionType, targetType, targetId, userId);
    }

    // ==================== 点赞数相关方法 ====================

    /**
     * 增加点赞数（带防重复）
     */
    public boolean incrementLikeCount(String targetType, Long targetId, Long userId) {
        String actionKey = generateUserActionKey("like", targetType, targetId, userId);
        String countKey = generateKey(LIKE_COUNT_KEY, targetType, targetId);

        // 检查是否已经点赞过（24小时内防重复）
        if (Boolean.TRUE.equals(redisTemplate.hasKey(actionKey))) {
            return false;
        }

        // 记录用户行为（24小时过期）
        redisTemplate.opsForValue().set(actionKey, "1", 24, TimeUnit.HOURS);
        // 增加计数
        redisTemplate.opsForValue().increment(countKey);
        return true;
    }

    /**
     * 取消点赞
     */
    public boolean decrementLikeCount(String targetType, Long targetId, Long userId) {
        String actionKey = generateUserActionKey("like", targetType, targetId, userId);
        String countKey = generateKey(LIKE_COUNT_KEY, targetType, targetId);

        // 检查是否有点赞记录
        if (Boolean.FALSE.equals(redisTemplate.hasKey(actionKey))) {
            return false;
        }

        // 删除用户行为记录
        redisTemplate.delete(actionKey);
        // 减少计数
        redisTemplate.opsForValue().decrement(countKey);
        return true;
    }

    // ==================== 收藏数相关方法 ====================

    /**
     * 增加收藏数（带防重复）
     */
    public boolean incrementCollectCount(String targetType, Long targetId, Long userId) {
        String actionKey = generateUserActionKey("collect", targetType, targetId, userId);
        String countKey = generateKey(COLLECT_COUNT_KEY, targetType, targetId);

        // 检查是否已经收藏过（防重复）
        if (Boolean.TRUE.equals(redisTemplate.hasKey(actionKey))) {
            return false;
        }

        // 记录用户行为（永久有效，直到取消收藏）
        redisTemplate.opsForValue().set(actionKey, "1");
        // 增加计数
        redisTemplate.opsForValue().increment(countKey);
        return true;
    }

    /**
     * 取消收藏
     */
    public boolean decrementCollectCount(String targetType, Long targetId, Long userId) {
        String actionKey = generateUserActionKey("collect", targetType, targetId, userId);
        String countKey = generateKey(COLLECT_COUNT_KEY, targetType, targetId);

        // 直接删除用户行为记录（不管是否存在）
        Boolean deleted = redisTemplate.delete(actionKey);

        // 减少计数（不管用户行为记录是否存在，因为数据库已经删除了）
        Long newCount = redisTemplate.opsForValue().decrement(countKey);

        // 如果计数为0或负数，删除计数键
        if (newCount != null && newCount <= 0) {
            redisTemplate.delete(countKey);
        }

        return deleted;
    }

    /**
     * 检查用户是否已收藏
     */
    public boolean isCollected(String targetType, Long targetId, Long userId) {
        String actionKey = generateUserActionKey("collect", targetType, targetId, userId);
        return Boolean.TRUE.equals(redisTemplate.hasKey(actionKey));
    }

    // ==================== 评论数相关方法 ====================

    /**
     * 增加评论数
     */
    public void incrementCommentCount(String targetType, Long targetId) {
        String countKey = generateKey(COMMENT_COUNT_KEY, targetType, targetId);
        redisTemplate.opsForValue().increment(countKey);
    }

    /**
     * 减少评论数
     */
    public void decrementCommentCount(String targetType, Long targetId) {
        String countKey = generateKey(COMMENT_COUNT_KEY, targetType, targetId);
        redisTemplate.opsForValue().decrement(countKey);
    }

    // ==================== 浏览数相关方法 ====================

    /**
     * 增加浏览数（带防刷）
     */
    public boolean incrementViewCount(String targetType, Long targetId, Long userId) {
        String actionKey = generateUserActionKey("view", targetType, targetId, userId);
        String countKey = generateKey(VIEW_COUNT_KEY, targetType, targetId);

        // 同一用户30分钟内不重复计数
        if (Boolean.TRUE.equals(redisTemplate.hasKey(actionKey))) {
            return false;
        }

        // 记录用户行为（30分钟过期）
        redisTemplate.opsForValue().set(actionKey, "1", 30, TimeUnit.MINUTES);
        // 增加计数
        redisTemplate.opsForValue().increment(countKey);
        return true;
    }


    // ==================== 获取计数方法 ====================

    /**
     * 获取点赞数
     */
    public Integer getLikeCount(String targetType, Long targetId) {
        String countKey = generateKey(LIKE_COUNT_KEY, targetType, targetId);
        Object count = redisTemplate.opsForValue().get(countKey);
        return count != null ? Integer.parseInt(count.toString()) : 0;
    }

    /**
     * 获取收藏数
     */
    public Integer getCollectCount(String targetType, Long targetId) {
        String countKey = generateKey(COLLECT_COUNT_KEY, targetType, targetId);
        Object count = redisTemplate.opsForValue().get(countKey);
        return count != null ? Integer.parseInt(count.toString()) : 0;
    }

    /**
     * 获取评论数
     */
    public Integer getCommentCount(String targetType, Long targetId) {
        String countKey = generateKey(COMMENT_COUNT_KEY, targetType, targetId);
        Object count = redisTemplate.opsForValue().get(countKey);
        return count != null ? Integer.parseInt(count.toString()) : 0;
    }

    /**
     * 获取浏览数
     */
    public Integer getViewCount(String targetType, Long targetId) {
        String countKey = generateKey(VIEW_COUNT_KEY, targetType, targetId);
        Object count = redisTemplate.opsForValue().get(countKey);
        return count != null ? Integer.parseInt(count.toString()) : 0;
    }

    // ==================== 定时同步到数据库 ====================

    /**
     * 定时同步点赞数到数据库（每分钟执行）
     */
    @Scheduled(fixedRate = 6000)
    public void syncLikeCountToDatabase() {
        syncCountToDatabase(LIKE_COUNT_KEY, "like");
    }

    /**
     * 定时同步收藏数到数据库（每分钟执行）
     */
    @Scheduled(fixedRate = 6000)
    public void syncCollectCountToDatabase() {
        syncCountToDatabase(COLLECT_COUNT_KEY, "collect");
    }

    /**
     * 定时同步评论数到数据库（每2分钟执行）
     */
    @Scheduled(fixedRate = 6000)
    public void syncCommentCountToDatabase() {
        syncCountToDatabase(COMMENT_COUNT_KEY, "comment");
    }

    /**
     * 定时同步浏览数到数据库（每30秒执行）
     */
    @Scheduled(fixedRate = 6000)
    public void syncViewCountToDatabase() {
        syncCountToDatabase(VIEW_COUNT_KEY, "view");
    }

    /**
     * 通用的计数同步方法
     */
    private void syncCountToDatabase(String countType, String fieldName) {
        // 获取该类型的所有key
        String pattern = countType + ":*";
        var keys = redisTemplate.keys(pattern);

        if (keys == null || keys.isEmpty()) {
            return;
        }

        for (String key : keys) {
            try {
                // 解析key获取目标类型和ID
                String[] parts = key.split(":");
                if (parts.length >= 4) {
                    String targetType = parts[2]; // Cat 或 POST
                    Long targetId = Long.parseLong(parts[3]);

                    // 获取计数值
                    Object countObj = redisTemplate.opsForValue().get(key);
                    if (countObj != null) {
                        int count = Integer.parseInt(countObj.toString());

                        if (count > 0) {
                            // 同步到数据库（假设mapper方法已存在）
                            syncToDatabase(targetType, targetId, fieldName, count);

                            // 同步成功后，重置计数（根据业务需求选择是否重置）
                            redisTemplate.opsForValue().set(key, 0);
                        }
                    }
                }
            } catch (Exception e) {
                // 记录日志，继续处理其他key
                System.err.println("同步计数失败，key: " + key + ", 错误: " + e.getMessage());
            }
        }
    }

    /**
     * 同步到数据库（这里需要您实现具体的mapper调用）
     */
    private void syncToDatabase(String targetType, Long targetId, String fieldName, Integer count) {
        try {
            switch (targetType) {
                case "CAT":
                    catMapper.updateCountField(targetId, fieldName, count);
                    System.out.printf("同步猫咪计数: ID=%d, 字段=%s, 数量=%d%n", targetId, fieldName, count);
                    break;
                case "POST":
                    // 更新帖子表的计数
                    postMapper.updateCountField(targetId, fieldName, count);
                    System.out.printf("同步帖子计数: ID=%d, 字段=%s, 数量=%d%n", targetId, fieldName, count);
                    break;
                default:
                    System.err.println("未知的目标类型: " + targetType);
            }
        } catch (Exception e) {
            System.err.printf("数据库同步失败: %s-%d %s +%d, 错误: %s%n",
                    targetType, targetId, fieldName, count, e.getMessage());
        }
    }

    /**
     * 手动立即同步所有计数
     */
    public void manualSyncAllCounts() {
        syncLikeCountToDatabase();
        syncCollectCountToDatabase();
        syncCommentCountToDatabase();
        syncViewCountToDatabase();
    }
}