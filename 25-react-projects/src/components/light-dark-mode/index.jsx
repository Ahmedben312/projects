import useLocalStoarge from "./useLocalStoarge";
import "./styles.css";

export default function LightDarkMode() {
  const [theme, setTheme] = useLocalStoarge("theme", "dark");
  function handelToggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }
  console.log(theme);
  return (
    <div className="light-dark-mode" data-theme={theme}>
      <div className="container">
        <p>Hello World !</p>
        <button onClick={handelToggleTheme}>Change theme</button>
      </div>
    </div>
  );
}
