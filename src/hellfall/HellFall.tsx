import { useEffect, useRef } from "react";
import { HellfallEntry } from "./HellfallEntry";
import { xIcon } from "@workday/canvas-system-icons-web";

import { styled } from "@workday/canvas-kit-react/common";
import {
  SidePanel,
  SidePanelOpenDirection,
} from "@workday/canvas-kit-react/side-panel";
import { PaginationComponent } from "./inputs";

import { HellfallCard } from "./HellfallCard";
import { Card } from "@workday/canvas-kit-react/card";
import { ToolbarIconButton } from "@workday/canvas-kit-react/button";
import { useAtom, useAtomValue } from "jotai";
import { activeCardAtom, offsetAtom } from "./searchAtoms";
import { useSearchResults } from "./useSearchResults";
import { SearchControls } from "./SearchControls";
import { SortComponent } from "./SortComponent";
import { CHUNK_SIZE } from "./constants";
import { useKeyPress } from "../hooks";
import { cardsAtom } from "./cardsAtom";

export const HellFall = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cards = useAtomValue(cardsAtom).filter((e) => e.Set != "C");
  const escape = useKeyPress("Escape");

  const [activeCardFromAtom, setActiveCardFromAtom] = useAtom(activeCardAtom);

  const activeCard = cards.find((entry) => {
    return entry.Name === activeCardFromAtom;
  });

  useEffect(() => {
    if (escape) {
      setActiveCardFromAtom("");
    }
  }, [escape]);
  const [offset, setOffset] = useAtom(offsetAtom);
  const resultSet = useSearchResults();

  return (
    <div>
          <LayoutGrid>
        <LeftSidebar>
          <SidebarSection>
            <h4>Filters</h4>
            <SearchControls />
          </SidebarSection>
        </LeftSidebar>

        <MainContent>
          <ResultCount ref={containerRef}>
            {`${resultSet.length} card(s)`}
          </ResultCount>
          <Container>
            {resultSet.slice(offset, offset + CHUNK_SIZE).map((entry, i) => (
              <HellfallEntry
                onClick={(event: React.MouseEvent<HTMLImageElement>) => {
                  if (event.button === 1 || event.metaKey || event.ctrlKey) {
                    window.open(
                      "/hellfall/card/" + encodeURIComponent(entry.Name),
                      "_blank"
                    );
                  } else {
                    setActiveCardFromAtom(entry.Name);
                  }
                }}
                key={"" + entry.Name + i}
                name={entry.Name}
                url={entry.Image[1] || entry.Image[0]!}
              />
            ))}
          </Container>
          <PaginationComponent
            onChange={(val) => {
              setOffset(val);
              containerRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            initialCurrentPage={offset}
            chunkSize={CHUNK_SIZE}
            total={resultSet.length}
          />
        </MainContent>

        <RightSidebar>
          <SidebarSection>
            <h4>Sort & Advanced</h4>
            <SortComponent />
          </SidebarSection>
        </RightSidebar>
      </LayoutGrid>

      {activeCard && (
        <StyledSidePanel
          openWidth={window.screen.width > 450 ? 810 : 400}
          openDirection={SidePanelOpenDirection.Right}
          open={!!activeCard}
        >
          <Card>
            <Card.Body padding={"zero"}>
              <SPContainer>
                <ToolbarIconButton
                  icon={xIcon}
                  onClick={() => setActiveCardFromAtom("")}
                />
                <HellfallCard data={activeCard} />
              </SPContainer>
            </Card.Body>
          </Card>
        </StyledSidePanel>
      )}
    </div>
  );
};

const LayoutGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "320px 1fr 320px",
  gap: "24px",
  padding: "24px",
  "@media (max-width: 1200px)": {
    gridTemplateColumns: "280px 1fr 280px",
  },
  "@media (max-width: 900px)": {
    gridTemplateColumns: "1fr",
  },
});

const LeftSidebar = styled("aside")({
  position: "sticky",
  top: "24px",
  height: "fit-content",
  "@media (max-width: 900px)": {
    position: "static",
  },
});

const RightSidebar = styled("aside")({
  position: "sticky",
  top: "24px",
  height: "fit-content",
  "@media (max-width: 900px)": {
    position: "static",
  },
});

const SidebarSection = styled("div")({
  padding: "16px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderRadius: "8px",
});

const MainContent = styled("main")({
  minHeight: "100vh",
});

const ResultCount = styled("h5")({ display: "flex", justifyContent: "center" });
const Container = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
});
const StyledSidePanel = styled(SidePanel)({
  zIndex: 40,
  height: "100%",
  position: "fixed",
  backgroundColor: "transparent",
  top: "10px",
  border: "none",
  boxShadow: "none",
  "& > div": {
    border: "none",
    boxShadow: "none",
  },
});
const SPContainer = styled("div")({
  overflowY: "auto",
  height: "90vh",
  overflowX: "hidden",
});
