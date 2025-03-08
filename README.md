# KitchenBook - Backend Setup

## 1. Instalacja SQL Server

Aby uruchomić bazę danych w projekcie, potrzebujesz zainstalowanego **SQL Server**. Możesz to zrobić, postępując zgodnie z poniższymi krokami:

### Instalacja SQL Server na systemie Windows:
1. Pobierz i zainstaluj **SQL Server Express** z [oficjalnej strony Microsoft](https://www.microsoft.com/pl-pl/sql-server/sql-server-downloads).
2. Podczas instalacji wybierz **Basic** (najprostsza opcja), która zainstaluje SQL Server bez dodatkowych narzędzi.
3. Upewnij się, że port 1433 jest dostępny w firewallu i używasz **autentykacji SQL** (a nie tylko Windows).
4. Po zakończeniu instalacji możesz otworzyć **SQL Server Management Studio (SSMS)** i połączyć się z bazą danych za pomocą `localhost\SQLEXPRESS`.

### Instalacja SQL Server na systemie Linux:
Postępuj zgodnie z instrukcjami na stronie: [SQL Server dla Linux](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-setup?view=sql-server-ver15).

---

## 2. Setup Bazy Danych

Po zainstalowaniu **SQL Server**, musisz skonfigurować odpowiednią bazę danych i użytkownika. Użyj następujących kroków, aby skonfigurować środowisko bazy danych:

### 2.1. Tworzenie Bazy Danych i Użytkownika

1. Zaloguj się do SQL Server z poziomu terminala (lub użyj SSMS):

    sqlcmd -S localhost -U sa -P "TwojeHaslo123" -i db/init.sql

### 3. Instalacja Zależności
Aby uruchomić backend aplikacji, należy zainstalować wymagane zależności.

1. Zainstaluj Node.js i npm (jeśli jeszcze tego nie zrobiłeś):
Node.js Download.

2. Zainstaluj zależności projektu:
    cd backend
    npm install
## 4.Uruchomienie Projektu
### 4.1. Uruchomienie backendu
Aby uruchomić backend aplikacji:
    npm run start:dev

Serwer backendu uruchomi się na porcie 3000 domyślnie. Możesz teraz sprawdzić, czy aplikacja działa, odwiedzając:
http://localhost:3000.

Backend będzie łączyć się z lokalnym SQL Serverem i uruchomi aplikację.
### 4.2 Uruchomienie frontendu
1. Instalacja http-server: 
    cd ../frontend
    npm install -g http-server
2. Uruchom forntend:
    http-server ./ -p 8080 

Frontend powinien być dostępny pod adresem:
http://localhost:8080.   

## 5. TO DO
    * opisać sposób łączenia się z bazą (TypeORM)
    * opisać .env
    * 
