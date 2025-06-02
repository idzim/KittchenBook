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
    CREATE LOGIN cookbook_user WITH PASSWORD = 'Passwordcd 123!';
    CREATE USER cookbook_user FOR LOGIN cookbook_user;
END
GO

-- Przyznanie uprawnień dla użytkownika
ALTER ROLE db_datareader ADD MEMBER cookbook_user;
ALTER ROLE db_datawriter ADD MEMBER cookbook_user;
ALTER ROLE db_owner ADD MEMBER cookbook_user;
GO

