-- Dodawanie użytkowników
INSERT INTO "user" (email, password, createdAt, updatedAt)
VALUES 
('user1@example.com', 'password123', GETDATE(), GETDATE()),
('user2@example.com', 'securePass456', GETDATE(), GETDATE()),
('user3@example.com', 'hashedPass789', GETDATE(), GETDATE()),
('user4@example.com', 'testPass101', GETDATE(), GETDATE()),
('user5@example.com', 'randomPass202', GETDATE(), GETDATE());

-- Dodawanie planów posiłków
INSERT INTO meal_plan (date, userId, createdAt, updatedAt)
VALUES 
('2025-03-25', 1, GETDATE(), GETDATE()),
('2025-03-26', 2, GETDATE(), GETDATE()),
('2025-03-27', 3, GETDATE(), GETDATE()),
('2025-03-28', 4, GETDATE(), GETDATE()),
('2025-03-29', 5, GETDATE(), GETDATE());

-- Dodawanie przepisów
INSERT INTO recipe (name, description, link, createdAt, updatedAt)
VALUES 
('Pancakes', 'Fluffy pancakes with syrup', 'http://example.com/pancakes', GETDATE(), GETDATE()),
('Spaghetti Carbonara', 'Classic Italian dish', 'http://example.com/carbonara', GETDATE(), GETDATE()),
('Caesar Salad', 'Fresh lettuce with chicken', 'http://example.com/caesar', GETDATE(), GETDATE()),
('Tomato Soup', 'Creamy tomato soup', 'http://example.com/tomato-soup', GETDATE(), GETDATE()),
('Grilled Salmon', 'Salmon with lemon sauce', 'http://example.com/salmon', GETDATE(), GETDATE());

-- Dodawanie powiązań przepisów z planem posiłków
INSERT INTO meal_plan_recipe (mealPlanId, recipeId, mealType, createdAt, updatedAt)
VALUES 
(1, 1, 'breakfast', GETDATE(), GETDATE()),
(2, 2, 'dinner', GETDATE(), GETDATE()),
(3, 3, 'lunch', GETDATE(), GETDATE()),
(4, 4, 'dinner', GETDATE(), GETDATE()),
(5, 5, 'breakfast', GETDATE(), GETDATE());

-- Dodawanie list zakupów
INSERT INTO shopping_list (userId, items, createdAt, updatedAt)
VALUES 
(1, 'Milk,Eggs,Flour,Sugar', GETDATE(), GETDATE()),
(2, 'Pasta,Cheese,Bacon', GETDATE(), GETDATE()),
(3, 'Lettuce,Croutons,Parmesan', GETDATE(), GETDATE()),
(4, 'Tomatoes,Garlic,Onion,Basil', GETDATE(), GETDATE()),
(5, 'Salmon,Lemon,Olive Oil', GETDATE(), GETDATE());
