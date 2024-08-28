import React, { useState, useEffect } from "react";
import {
  Mosaic,
  MosaicWindow,
  MosaicBranch,
  MosaicWindowProps,
  MosaicNode,
} from "react-mosaic-component";
import { Button, ButtonGroup } from "@blueprintjs/core";
import XTermAgentTerminal from "../components/XtermAgent";
import StructuresTable from "../components/tables/StructuresTable";
import DataConnectorsTable from "../components/tables/DataConnectorsTable";
import StructureDetailView from "../components/Structures/StructureDetail";
import DataConnectorDetailView from "../components/DataConnectors/DataConnectorDetail";
import { useResponse } from "../contexts/ResponseContext";
import { generateUniqueId } from "../utils/idGen";
import "react-mosaic-component/react-mosaic-component.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "../mosaicLayout.css";

type BaseViewType =
  | "terminal"
  | "structuresList"
  | "dataConnectorsList"
  | "structureDetail"
  | "dataConnectorDetail";
type ViewType = BaseViewType | string;

type ComponentProps = {
  terminal: Record<string, never>;
  structuresList: { data: string };
  dataConnectorsList: { data: string };
  structureDetail: { data: string };
  dataConnectorDetail: { data: string };
};

type ViewData = {
  [key: string]: string;
};

const TYPE_MAP: {
  [K in BaseViewType]: React.ComponentType<ComponentProps[K]>;
} = {
  terminal: XTermAgentTerminal,
  structuresList: StructuresTable,
  dataConnectorsList: DataConnectorsTable,
  structureDetail: StructureDetailView,
  dataConnectorDetail: DataConnectorDetailView,
};

const IDENTIFIER_TO_VIEW_TYPE: { [key: string]: BaseViewType } = {
  "List Structures": "structuresList",
  "List Data Connectors": "dataConnectorsList",
  "Structure Detail": "structureDetail",
  "Data Connector Detail": "dataConnectorDetail",
};

const MosaicLayout: React.FC = () => {
  const { response } = useResponse();
  const [mosaicArrangement, setMosaicArrangement] =
    useState<MosaicNode<ViewType>>("terminal");
  const [viewData, setViewData] = useState<ViewData>({});

  useEffect(() => {
    console.log(response?.identifier);
    if (response && response.identifier in IDENTIFIER_TO_VIEW_TYPE) {
      const baseViewType = IDENTIFIER_TO_VIEW_TYPE[response.identifier];
      const newViewType = generateUniqueId(baseViewType);
      setMosaicArrangement((currentArrangement) => {
        if (currentArrangement === "terminal") {
          return {
            direction: "row",
            first: "terminal",
            second: newViewType,
            splitPercentage: 50,
          };
        } else if (typeof currentArrangement === "object") {
          return {
            ...currentArrangement,
            second: currentArrangement.second
              ? {
                  direction: "column",
                  first: currentArrangement.second,
                  second: newViewType,
                }
              : newViewType,
          };
        }
        return currentArrangement;
      });
      setViewData((prevData) => ({
        ...prevData,
        [newViewType]: response.response,
      }));
    }
  }, [response]);

  const renderTile = (id: ViewType, path: MosaicBranch[]) => {
    const baseViewType = id.split("-")[0] as BaseViewType;
    const Component = TYPE_MAP[baseViewType];
    let componentProps: ComponentProps[BaseViewType] =
      baseViewType === "terminal" ? {} : { data: viewData[id] || "" };

    return (
      <MosaicWindow<ViewType>
        path={path}
        title={
          baseViewType === "terminal" ? "Griptape Cloud Agent Terminal" : id
        }
        toolbarControls={createToolbarControls(id)}
        renderToolbar={renderToolbar}
      >
        <Component {...componentProps} />
      </MosaicWindow>
    );
  };

  const createToolbarControls = (id: ViewType) => {
    return [
      <Button key="collapse" icon="minimize" minimal={true} />,
      <Button key="expand" icon="maximize" minimal={true} />,
      <Button
        key="close"
        icon="cross"
        minimal={true}
        onClick={() => removeView(id)}
      />,
    ];
  };

  const removeView = (id: ViewType) => {
    if (id !== "terminal") {
      setMosaicArrangement((currentArrangement) => {
        const removeViewFromNode = (
          node: MosaicNode<ViewType>,
        ): MosaicNode<ViewType> | null => {
          if (typeof node === "string") {
            return node === id ? null : node;
          } else {
            const newFirst = removeViewFromNode(node.first);
            const newSecond = removeViewFromNode(node.second);
            if (newFirst === null) return newSecond;
            if (newSecond === null) return newFirst;
            return { ...node, first: newFirst, second: newSecond };
          }
        };
        const newArrangement = removeViewFromNode(currentArrangement);
        return newArrangement || "terminal";
      });
      setViewData((prevData) => {
        const newData = { ...prevData };
        delete newData[id];
        return newData;
      });
    }
  };

  const renderToolbar = (props: MosaicWindowProps<ViewType>) => {
    return (
      <div className="mosaic-window-toolbar bp3-dark">
        <div className="mosaic-window-title">{props.title}</div>
        <ButtonGroup minimal={true}>{props.toolbarControls}</ButtonGroup>
      </div>
    );
  };

  return (
    <Mosaic<ViewType>
      renderTile={renderTile}
      value={mosaicArrangement}
      onChange={(newNode) => setMosaicArrangement(newNode || "terminal")}
      className="bp3-dark"
    />
  );
};

export default MosaicLayout;
