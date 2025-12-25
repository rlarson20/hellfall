import { useEffect, useRef } from "react";
import { HellfallEntry } from "./HellfallEntry";
import { xIcon } from "@workday/canvas-system-icons-web";

import { styled } from "@workday/canvas-kit-react/common";
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

      {!!activeCard && <StyledBackdrop onClick={() => setActiveCardFromAtom("")} />}
      {!!activeCard && (
        <BottomSheet open={!!activeCard}>
          <Card>
              <Card.Body padding={"zero"}>
                <SheetContainer>
                  <ToolbarIconButton
                    icon={xIcon}
                    onClick={() => setActiveCardFromAtom("")}
                  />
                  <HellfallCard data={activeCard} />
                </SheetContainer>
              </Card.Body>
            </Card>
        </BottomSheet>
      )}
    </div>
  );
};

const LayoutGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "240px 1fr 240px",
  gap: "16px",
  padding: "16px",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
  },
});

const LeftSidebar = styled("aside")({
  position: "sticky",
  top: "16px",
  height: "fit-content",
  maxHeight: "calc(100vh - 32px)",
  overflowY: "auto",
  "@media (max-width: 768px)": {
    position: "static",
    maxHeight: "none",
  },
});

const RightSidebar = styled("aside")({
  position: "sticky",
  top: "16px",
  height: "fit-content",
  maxHeight: "calc(100vh - 32px)",
  overflowY: "auto",
  "@media (max-width: 768px)": {
    position: "static",
    maxHeight: "none",
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
const StyledBackdrop = styled("div")({
  position: "fixed",
  inset: 0,
  zIndex: 50,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
});

const BottomSheet = styled("div")<{ open: boolean }>(({ open }) => ({
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 51,
  transform: open ? "translateY(0)" : "translateY(100%)",
  transition: "transform 0.3s ease-out",
  maxHeight: "90vh",
  backgroundColor: "transparent",
}));
const SheetContainer = styled("div")({
  overflowY: "auto",
  maxHeight: "90vh",
  padding: "16px",
});
