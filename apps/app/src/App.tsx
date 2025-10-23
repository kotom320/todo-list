function App() {
  return (
    <>
      <header>
        <h1>TODO List</h1>
      </header>

      <main>
        <form>
          <input type="text" placeholder="할 일 추가" />
          <button type="submit">추가</button>
        </form>
        <ul>
          <li>할 일 1</li>
          <li>할 일 2</li>
          <li>할 일 3</li>
        </ul>
      </main>
    </>
  );
}

export default App;
