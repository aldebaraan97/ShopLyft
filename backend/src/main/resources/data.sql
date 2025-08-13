-- Insert sample products
INSERT INTO products (name, description, price, stock_quantity, category)
VALUES ('Apples', 'Fresh red apples', 2.99, 100, 'Fruits'),
       ('Bananas', 'Ripe yellow bananas', 1.99, 150, 'Fruits'),
       ('Milk', 'Fresh whole milk', 3.49, 50, 'Dairy'),
       ('Bread', 'Whole wheat bread', 2.49, 75, 'Bakery'),
       ('Eggs', 'Large eggs dozen', 4.99, 60, 'Dairy'),
       ('Tomatoes', 'Fresh tomatoes', 3.99, 80, 'Vegetables'),
       ('Chicken Breast', 'Boneless chicken breast', 8.99, 40, 'Meat'),
       ('Rice', 'Long grain white rice', 5.99, 90, 'Grains'),
       ('Pasta', 'Italian spaghetti', 2.79, 120, 'Grains'),
       ('Orange Juice', 'Fresh orange juice', 4.49, 45, 'Beverages');

-- Insert sample user
INSERT INTO users (username, password, email) VALUES ('testuser', 'password123', 'test@example.com');

-- Create cart for the user
INSERT INTO carts (user_id) VALUES (1);