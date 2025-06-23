import { useContext } from "react";
import { FeatureFlagsContext } from "./context";
import Accordion from "../accordion/accordion";
import LightAndDarkMode from "../light-dark-mode/index";
import RandomColor from "../random-color/random-colo";
import TicTakToe from "../tik-tak-toe/indes";
import TreeView from "../tree-view/index.jsx";
import menus from "../tree-view/data.js";
import TabTest from "../custom-tabs/tab-test.jsx";

export default function FeatureFlags() {
  const { loading, enabledFlags } = useContext(FeatureFlagsContext);

  const componentsToRender = [
    {
      key: "showLightAndDarkMode",
      component: <LightAndDarkMode />,
    },
    {
      key: "showTicTacToeBoard",
      component: <TicTakToe />,
    },
    {
      key: "showRandomColorGenerator",
      component: <RandomColor />,
    },
    {
      key: "showAccordion",
      component: <Accordion />,
    },
    {
      key: "showTreeView",
      component: <TreeView menus={menus} />,
    },
    {
      key: "showTabs",
      component: <TabTest />,
    },
  ];

  function checkEnabledFlags(getCurrentKey) {
    return enabledFlags[getCurrentKey];
  }
  if (loading) return <h1>Loading Data ! Please Wait</h1>;
  return (
    <div>
      <h1>Feature Flags</h1>
      {componentsToRender.map((componentItem) =>
        checkEnabledFlags(componentItem.key) ? componentItem.component : null
      )}
    </div>
  );
}
