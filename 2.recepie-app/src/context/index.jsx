import { createContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [recipeDetailsData, setRecipeDetailsData] = useState(null);
  const [favoritesList, setFavoritesList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const res = await fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`
      );
      const data = await res.json();
      if (data?.data?.recipes) {
        setRecipeList(data?.data?.recipes);
        setLoading(false);
        setSearchParam("");
      }
    } catch (e) {
      console.log(e);

      setLoading(false);
      setSearchParam("");
    } finally {
      setLoading(false);
      if (location.pathname !== "/") {
        navigate("/");
      }
    }
  }
  function handleAddToFavorites(getCurrentItem) {
    console.log(getCurrentItem);
    let cpyFavoritesList = [...favoritesList];
    const index = cpyFavoritesList.findIndex(
      (item) => item.id === getCurrentItem.id
    );
    if (index === -1) {
      cpyFavoritesList.push(getCurrentItem);
    } else {
      cpyFavoritesList.splice(index);
    }
    setFavoritesList(cpyFavoritesList);
  }
  console.log(favoritesList, "favoritesList");

  return (
    <GlobalContext.Provider
      value={{
        searchParam,
        loading,
        recipeList,
        setSearchParam,
        handleSubmit,
        recipeDetailsData,
        setRecipeDetailsData,
        handleAddToFavorites,
        favoritesList,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
//06:37:46
