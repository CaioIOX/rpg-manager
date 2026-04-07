-- Tabela de rate limit diário do chatbot Lorena por usuário
CREATE TABLE chat_rate_limits (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    message_count INT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, date)
);
