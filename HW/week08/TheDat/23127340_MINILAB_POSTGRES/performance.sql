-- 1. Đo trước khi tạo index
EXPLAIN (ANALYZE, BUFFERS)
SELECT user_id, SUM(final_amount)
FROM orders
GROUP BY user_id
ORDER BY SUM(final_amount) DESC;

-- 2. Tạo index và cập nhật thống kê
CREATE INDEX idx_orders_user_id ON orders(user_id);
ANALYZE orders;

-- 3. Đo lại sau khi tạo index
EXPLAIN (ANALYZE, BUFFERS)
SELECT user_id, SUM(final_amount)
FROM orders
GROUP BY user_id
ORDER BY SUM(final_amount) DESC;
