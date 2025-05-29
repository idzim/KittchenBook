// Importujemy funkcje do testowania z modułu recipesAPI
import { fetchRecipes, createRecipe, deleteRecipe, updateRecipe } from "../api/recipesAPI.js";

// Podmieniamy globalny obiekt `fetch` na wersję testową (mock)
global.fetch = jest.fn();

// Po każdym teście resetujemy mocki
afterEach(() => {
  jest.clearAllMocks();
});

//
// TEST 1: Sprawdzanie pobierania przepisów
//
test("fetchRecipes zwraca listę przepisów", async () => {
  // Mockujemy odpowiedź z serwera
  const mockRecipes = [{ id: 1, name: "Jajecznica" }];
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockRecipes,
  });

  // Wywołujemy funkcję i sprawdzamy wynik
  const recipes = await fetchRecipes();
  expect(recipes).toEqual(mockRecipes); // Oczekujemy tej samej listy
});

//
// TEST 2: Sprawdzanie tworzenia przepisu
//
test("createRecipe wysyła dane i zwraca nowy przepis", async () => {
  const newRecipe = { name: "Naleśniki" };
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 123, ...newRecipe }),
  });

  const result = await createRecipe(newRecipe);

  // Sprawdzamy, czy fetch został wywołany z metodą POST i poprawnym adresem
  expect(fetch).toHaveBeenCalledWith("/api/recipes", expect.objectContaining({ method: "POST" }));
  // Sprawdzamy, czy otrzymaliśmy nowe ID w odpowiedzi
  expect(result.id).toBe(123);
});

//
// TEST 3: Sprawdzanie usuwania przepisu
//
test("deleteRecipe wywołuje DELETE na odpowiednim URL-u", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: "Usunięto" }),
  });

  const response = await deleteRecipe(10);

  // Sprawdzamy, czy adres zawiera ID przepisu i metodę DELETE
  expect(fetch).toHaveBeenCalledWith("/api/recipes/10", expect.objectContaining({ method: "DELETE" }));
  // Sprawdzamy, czy dostaliśmy komunikat "Usunięto"
  expect(response.message).toBe("Usunięto");
});

//
// TEST 4: Sprawdzanie aktualizacji przepisu
//
test("updateRecipe aktualizuje dane przepisu", async () => {
  const updated = { name: "Nowa nazwa" };
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => updated,
  });

  const response = await updateRecipe(5, updated);

  // Sprawdzamy, czy fetch został wywołany z PUT i poprawnym ID
  expect(fetch).toHaveBeenCalledWith("/api/recipes/5", expect.objectContaining({ method: "PUT" }));
  // Sprawdzamy, czy wynik zawiera nowe dane
  expect(response.name).toBe("Nowa nazwa");
});

//
// TEST 5: Sprawdzanie błędu przy nieudanym fetchu
//
test("fetchRecipes rzuca błąd, gdy odpowiedź nie jest ok", async () => {
  fetch.mockResolvedValueOnce({ ok: false });

  // Sprawdzamy, czy funkcja rzuca wyjątek
  await expect(fetchRecipes()).rejects.toThrow("Nie udało się pobrać przepisów");
});
