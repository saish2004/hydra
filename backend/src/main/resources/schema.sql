-- Database schema for HYDRA – AI Hydration & Fatigue Detector (MySQL-compatible)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(50),
    weight DOUBLE,
    daily_water_goal INT NOT NULL,
    reminders_enabled BOOLEAN DEFAULT TRUE,
    reminder_interval VARCHAR(50) DEFAULT '2'
);

-- 3. Daily Check-ins Table
CREATE TABLE IF NOT EXISTS daily_check_ins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    urine_color VARCHAR(100) NOT NULL,
    energy_level VARCHAR(100) NOT NULL,
    skin_texture VARCHAR(100) NOT NULL,
    hydration_score INT NOT NULL,
    fatigue_score INT NOT NULL,
    risk_level VARCHAR(100) NOT NULL,
    check_in_date DATE NOT NULL,
    recommendations VARCHAR(2000)
);

-- 4. Water Logs Table
CREATE TABLE IF NOT EXISTS water_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    log_date DATE NOT NULL
);

-- 5. Reminders Table
CREATE TABLE IF NOT EXISTS reminders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reminder_time TIME NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    label VARCHAR(255)
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    read_status BOOLEAN DEFAULT FALSE
);

-- 7. Push Subscriptions Table
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    endpoint VARCHAR(1000) NOT NULL,
    p256dh VARCHAR(255) NOT NULL,
    auth VARCHAR(255) NOT NULL
);

-- 8. Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(255)
);

-- 9. User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id BIGINT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP NOT NULL
);

-- 10. Streaks Table
CREATE TABLE IF NOT EXISTS streaks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0 NOT NULL,
    best_streak INT DEFAULT 0 NOT NULL,
    last_check_in_date DATE
);
