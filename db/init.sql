-- Tworzenie bazy danych
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'KitchenBookDB')
BEGIN
    CREATE DATABASE KitchenBookDB;
END
GO

-- Używanie nowo stworzonej bazy
USE KitchenBookDB;
GO

-- Tworzenie użytkownika
IF NOT EXISTS (SELECT * FROM sys.syslogins WHERE name = 'cookbook_user')
BEGIN
    CREATE LOGIN cookbook_user WITH PASSWORD = 'ZAQ!2wsx';
    CREATE USER cookbook_user FOR LOGIN cookbook_user;
END
GO

-- Przyznanie uprawnień dla użytkownika
ALTER ROLE db_datareader ADD MEMBER cookbook_user;
ALTER ROLE db_datawriter ADD MEMBER cookbook_user;
ALTER ROLE db_owner ADD MEMBER cookbook_user;
GO

-- Tworzenie tabeli User
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
BEGIN
    CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(255) NOT NULL,
        email NVARCHAR(255) UNIQUE NOT NULL
    );
END
GO

-- Tworzenie tabeli Recipe
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'recipes')
BEGIN
    CREATE TABLE recipes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        title NVARCHAR(255) NOT NULL,
        description TEXT
    );
END
GO
