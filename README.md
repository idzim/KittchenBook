# KitchenBook - Setup

## 1. Instalacja SQL Server

Aby uruchomić bazę danych w projekcie, potrzebujesz zainstalowanego **SQL Server**. Możesz to zrobić, postępując zgodnie z poniższymi krokami:

### Instalacja SQL Server na systemie Windows:

1. Pobierz i zainstaluj **SQL Server Express** z [oficjalnej strony Microsoft](https://www.microsoft.com/pl-pl/sql-server/sql-server-downloads).
2. Podczas instalacji wybierz **Basic** (najprostsza opcja), która zainstaluje SQL Server bez dodatkowych narzędzi.
3. Upewnij się, że port 1433 jest dostępny w firewallu i używasz **autentykacji SQL** (a nie tylko Windows).
4. Po zakończeniu instalacji możesz otworzyć **SQL Server Management Studio (SSMS)** i połączyć się z bazą danych za pomocą `localhost\SQLEXPRESS` lub jak tam nazwałeś swojego sql'a.

### Instalacja SQL Server na systemie Linux:

Postępuj zgodnie z instrukcjami na stronie: [SQL Server dla Linux](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-setup?view=sql-server-ver15).

---

## 2. Setup Bazy Danych

Po zainstalowaniu **SQL Server**, musisz skonfigurować odpowiednią bazę danych i użytkownika. Użyj następujących kroków, aby skonfigurować środowisko bazy danych:

### 2.1. Tworzenie Bazy Danych i Użytkownika

1.  Zaloguj się do SQL Server z poziomu terminala (lub użyj SSMS):

        sqlcmd -S localhost -U sa -P "TwojeHaslo123" -i db/init.sql

    To polecenie odpali spkrypt .sql, w którym zapisana jest

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
cd backend
npm start

Serwer backendu uruchomi się na porcie 3000 domyślnie. Możesz teraz sprawdzić, czy aplikacja działa, odwiedzając:
http://localhost:3000.

Backend będzie łączyć się z lokalnym SQL Serverem i uruchomi aplikację.

### 4.2 Uruchomienie frontendu

Frontend jest obsługiwany przez server ExpressJS. Dzięki temu nie musimy robić nic dodatkowego oraz korzystać z dodatkowej obsługi fronendu czoy CORS do obsługi innych portów. Frontend i api są na tym samym porcie, co ułatwia pracę.

Po uruchomieniu projektu, frontend będzie dostępny pod adresem:
http://localhost:3000/index.html

## 5. Backend - baza danych (TypeORM)

    Backend łączy się z bazą danych poprzez plik database/connection.ts,
    dodatkowo do połączenia wykorzystany jest dodatek TypeORM.
    Dlaczego? Bo ułatwia zarządzanie bazą (działa to podobnie jak w .net mvc),
    można zarządzać za pomocą migracji, ale obecnie są wyłaczone.
    Oznacza to, że wszelkie zmiany na modelach są automatycznie synchronizowane z bazą danych
    oraz, że tabele tworzą/aktualizują się w momencie odpalenia backendu,
    zgodnie z entities przekazanymi w database/conntection.ts.
    TypeORM w połączeniu z TSem w dość prosty sposób pozwala nam
    tworzyć encje (tabele) i określać relacje,
    co z kolei pomaga wygodnie ograć te bardziej złożone powiązania.

### 5.1 Plik .env

    plik do stworzenia lokalnie, bowiem jest dodany do .gitignore
    Treść:
    DB_HOST=localhost //lub twoja nazwa bazy
    DB_PORT=1433
    DB_USERNAME=cookbook_user
    DB_PASSWORD= Password123! //haslo zgodne z haslem podanym w init.db, można sobie dowolnie zmieniac
    DB_NAME=KitchenBookDB

## 6. Zarys dokumentacji wraz progressem

[Dokumentacja](zarysDOKUMENTACJI.md)

## 7. TO DO

- opisać front
- zacząć robić front
- opisać architekturę backendu entities-service-routes
- dodać Jest do testów backendu (lub coś innego)
- zacząć pisać testy jednostkowe
- napisać testy API (bruno? playwright? coś innego?)

## Bugs/issue to solve

- Przepisy > edytuj przepis/szczegóły przepisu: (modal-body)
  Ostre krawędzie zamiast okrągłych - jakięs paddingi lub coś takiego do zrobienia
