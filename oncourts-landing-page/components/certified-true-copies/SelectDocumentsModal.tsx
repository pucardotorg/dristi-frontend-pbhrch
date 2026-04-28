import React, { useState, useEffect } from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { svgIcons } from "../../data/svgIcons";
import { ctcStyles, ctcText } from "../../styles/certifiedCopyStyles";
import type { CaseBundleNode, AuthData } from "../../types";
import DocViewWrapper from "./DocViewWrapper";

interface SelectDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Returns the selected node IDs */
  onSelect: (selectedDocs: string[]) => void;
  initialSelected?: string[];
  /** CaseBundleNode list from the API response */
  documents: CaseBundleNode[];
  isParty?: boolean;
  tenantId?: string;
  authData?: AuthData | null;
  /** View-only mode for the Issue Document column */
  isViewMode?: boolean;
  /** Override modal title (used in view mode) */
  modalTitle?: string;
  /** Callback to download selected documents by their issuedFileStoreIds */
  onDownloadSelected?: (fileStoreIds: string[]) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

const SelectDocumentsModal: React.FC<SelectDocumentsModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialSelected = [],
  documents,
  isParty = false,
  tenantId,
  authData,
  isViewMode = false,
  modalTitle,
  onDownloadSelected,
}) => {
  const { t } = useSafeTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [selectedDocs, setSelectedDocs] = useState<string[]>(initialSelected);
  const [previewDocId, setPreviewDocId] = useState<string | null>(null);

  // Scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Collect all accepted leaf IDs for view mode auto-selection
  const getAcceptedLeafIds = (nodes: CaseBundleNode[]): string[] => {
    let ids: string[] = [];
    for (const node of nodes) {
      if (node.children?.length) {
        ids = ids.concat(getAcceptedLeafIds(node.children));
      } else if (node.status === "ACCEPTED") {
        ids.push(node.id);
      }
    }
    return ids;
  };

  // Collect all node IDs (for expanding all in view mode)
  const getAllNodeIds = (nodes: CaseBundleNode[]): Record<string, boolean> => {
    const map: Record<string, boolean> = {};
    for (const node of nodes) {
      map[node.id] = true;
      if (node.children?.length) {
        Object.assign(map, getAllNodeIds(node.children));
      }
    }
    return map;
  };

  // Find a node's issuedFileStoreId (fallback to fileStoreId) by ID
  const findNodeIssuedFileStoreIdById = (
    id: string,
    nodes: CaseBundleNode[],
  ): string | null => {
    for (const n of nodes) {
      if (n.id === id) return n.issuedFileStoreId || n.fileStoreId || null;
      if (n.children) {
        const found = findNodeIssuedFileStoreIdById(id, n.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Collect issuedFileStoreIds for selected docs
  const getSelectedIssuedFileStoreIds = (): string[] => {
    const ids: string[] = [];
    for (const docId of selectedDocs) {
      const fsId = findNodeIssuedFileStoreIdById(docId, documents);
      if (fsId) ids.push(fsId);
    }
    return ids;
  };

  // Sync internal state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery(""); // **Reset search query on open**
      setPreviewDocId(null); // Reset preview document

      if (isViewMode) {
        // View mode: expand all nodes, auto-select accepted leaves
        setExpandedSections(getAllNodeIds(documents));
        setSelectedDocs(getAcceptedLeafIds(documents));
      } else {
        setSelectedDocs(initialSelected);
        // Expand parent nodes that contain pre-selected documents
        const expanded: Record<string, boolean> = {};
        const expandParentsOfSelected = (nodes: CaseBundleNode[]): boolean => {
          let hasSelected = false;
          for (const node of nodes) {
            if (initialSelected.includes(node.id)) {
              hasSelected = true;
              expanded[node.id] = true; // expand the node itself (top-level leaf case)
            }
            if (node.children?.length) {
              const childHasSelected = expandParentsOfSelected(node.children);
              if (childHasSelected) {
                expanded[node.id] = true;
                hasSelected = true;
              }
            }
          }
          return hasSelected;
        };
        expandParentsOfSelected(documents);
        // For nodes without selected children, default to closed
        documents?.forEach((node) => {
          if (!(node.id in expanded)) {
            expanded[node.id] = false;
          }
        });
        setExpandedSections(expanded);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  // Helper to localize title with a number suffix (e.g. "VAKALATNAMA_HEADING 1" -> "Vakalat 1")
  const localizeTitle = (title: string): string => {
    const match = title.trim().match(/^(.*?)\s+(\d+)$/);
    if (match) {
      const baseTitle = match[1];
      const number = match[2];
      return `${t(baseTitle)} ${number}`;
    }
    return t(title);
  };

  // Helper to get all descendant IDs
  const getAllDescendantIds = (node: CaseBundleNode): string[] => {
    let ids: string[] = [];
    if (node.children) {
      for (const child of node.children) {
        ids.push(child.id);
        ids = ids.concat(getAllDescendantIds(child));
      }
    }
    return ids;
  };

  const toggleSection = (id: string, node?: CaseBundleNode) => {
    setExpandedSections((prev) => {
      const isCurrentlyExpanded = !!prev[id];
      const nextState = { ...prev, [id]: !isCurrentlyExpanded };
      // If closing, recursively close all children
      if (isCurrentlyExpanded && node) {
        const descendants = getAllDescendantIds(node);
        for (const descId of descendants) {
          nextState[descId] = false;
        }
      }
      return nextState;
    });
  };

  const toggleDocSelection = (id: string) =>
    setSelectedDocs((prev) =>
      prev?.includes(id)
        ? prev?.filter((d) => d !== id)
        : [...(prev || []), id],
    );

  const handleSelect = () => {
    onSelect(selectedDocs);
    onClose();
  };

  const matchesSearch = (title: string) =>
    title.toLowerCase().includes(searchQuery.toLowerCase());

  // Recursively check if a node or any descendant matches the search query
  const nodeMatchesSearch = (node: CaseBundleNode): boolean => {
    if (matchesSearch(localizeTitle(node.title))) return true;
    return (node.children || []).some((child) => nodeMatchesSearch(child));
  };

  // Find a node's title by ID across the entire document tree
  const findNodeTitleById = (
    id: string,
    nodes: CaseBundleNode[],
  ): string | null => {
    for (const n of nodes) {
      if (n.id === id) return n.title;
      if (n.children) {
        const found = findNodeTitleById(id, n.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Find a node's fileStoreId by ID across the entire document tree
  const findNodeFileStoreIdById = (
    id: string,
    nodes: CaseBundleNode[],
  ): string | null => {
    for (const n of nodes) {
      if (n.id === id) {
        // In view mode prefer issuedFileStoreId
        if (isViewMode && n.issuedFileStoreId) return n.issuedFileStoreId;
        return n.fileStoreId || null;
      }
      if (n.children) {
        const found = findNodeFileStoreIdById(id, n.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Recursive renderer:
  //   depth 0 → always a collapsible section header (numbered)
  //             leaf: expands to reveal a single checkbox for itself
  //             group: expands to render children recursively
  //   depth > 0, group  → collapsible sub-section (indented)
  //   depth > 0, leaf   → direct checkbox row
  const renderNode = (
    node: CaseBundleNode,
    depth: number,
    index: number,
    pathPrefix: string = "",
    forceShowChildren: boolean = false,
  ): React.ReactNode => {
    const isThisNodeMatch = searchQuery
      ? matchesSearch(localizeTitle(node.title))
      : true;
    const shouldShowAllDescendants = forceShowChildren || isThisNodeMatch;

    const hasChildren = Boolean(node.children && node.children.length > 0);
    // **If we are searching, we want everything matching to be expanded by default.**
    const isExpanded = !!expandedSections[node.id] || searchQuery.length > 0;
    const itemNumber = pathPrefix
      ? `${pathPrefix}.${index + 1}`
      : `${index + 1}`;

    if (depth === 0) {
      if (hasChildren) {
        const filteredChildren = node.children!.filter(
          (c) => shouldShowAllDescendants || nodeMatchesSearch(c),
        );
        if (
          searchQuery &&
          !shouldShowAllDescendants &&
          filteredChildren.length === 0
        )
          return null;

        return (
          <div key={node.id} className={ctcStyles.modalSection}>
            <button
              onClick={() => toggleSection(node.id, node)}
              className={ctcStyles.modalSectionBtn}
            >
              <span className={ctcStyles.modalSectionTitle}>
                {`${itemNumber}. ${localizeTitle(node.title)}`}
              </span>
              {searchQuery?.length === 0 &&
                (isExpanded
                  ? svgIcons.UpArrowIcon({ fill: "#0F172A", width: "20px" })
                  : svgIcons.DownArrowIcon({ fill: "#0F172A", width: "20px" }))}
            </button>
            {isExpanded && (
              <div className={ctcStyles.modalDocItems}>
                {filteredChildren.map((child, i) =>
                  renderNode(
                    child,
                    depth + 1,
                    i,
                    itemNumber,
                    shouldShowAllDescendants,
                  ),
                )}
              </div>
            )}
          </div>
        );
      }

      // Top-level leaf: collapsible section that reveals itself as a checkbox
      if (searchQuery && !shouldShowAllDescendants) return null;

      const isDisabled = isViewMode && node.status !== "ACCEPTED";

      return (
        <div key={node.id} className={ctcStyles.modalSection}>
          <button
            onClick={() => toggleSection(node.id, node)}
            className={ctcStyles.modalSectionBtn}
          >
            <span className={ctcStyles.modalSectionTitle}>
              {`${itemNumber}. ${localizeTitle(node.title)}`}
            </span>
            {searchQuery.length === 0 &&
              (isExpanded
                ? svgIcons.UpArrowIcon({ fill: "#0F172A", width: "20px" })
                : svgIcons.DownArrowIcon({ fill: "#0F172A", width: "20px" }))}
          </button>
          {isExpanded && (
            <div className={ctcStyles.modalDocItems}>
              <label
                className={`${ctcStyles.modalDocLabel} ${
                  isDisabled
                    ? ctcStyles.modalDocLabelDisabled
                    : ctcStyles.modalDocLabelEnabled
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedDocs?.includes(node.id)}
                  onChange={() => toggleDocSelection(node.id)}
                  disabled={isDisabled}
                  className={`${ctcStyles.modalDocCheckbox} flex-shrink-0`}
                />
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between flex-1 min-w-0 gap-2 xl:gap-3">
                  <span
                    className={`${ctcStyles.modalDocText} flex-1 min-w-0 pr-2`}
                  >
                    {localizeTitle(node.title)}
                  </span>
                  <div className="flex flex-row items-center gap-2 flex-shrink-0 mt-1 xl:mt-0">
                    {isViewMode && renderStatusBadge(node.status)}
                    {/* Preview Button */}
                    {(isViewMode
                      ? findNodeIssuedFileStoreIdById(node.id, documents)
                      : findNodeFileStoreIdById(node.id, documents)) && (
                      <button
                        title={t("PREVIEW_PDF")}
                        onClick={(e) => {
                          e.preventDefault();
                          setPreviewDocId(node.id);
                        }}
                        className="flex-shrink-0 text-[#0F766E] hover:bg-teal-50 p-1 rounded-full transition-colors"
                      >
                        {svgIcons.EyeIcon("20", "20", "#3D3C3C")}
                      </button>
                    )}
                  </div>
                </div>
              </label>
            </div>
          )}
        </div>
      );
    }

    // depth > 0 — nested group: collapsible sub-section
    if (hasChildren) {
      const filteredChildren = node.children!.filter(
        (c) => shouldShowAllDescendants || nodeMatchesSearch(c),
      );
      if (
        searchQuery &&
        !shouldShowAllDescendants &&
        filteredChildren.length === 0
      )
        return null;

      return (
        <div key={node.id} className="w-full mt-1">
          <button
            onClick={() => toggleSection(node.id, node)}
            className="flex items-center justify-between w-full py-2 px-2 text-left hover:bg-gray-50 rounded-md transition-colors"
          >
            <span className="text-lg font-semibold text-gray-700">
              {`${itemNumber}. ${localizeTitle(node.title)}`}
            </span>
            {searchQuery.length === 0 &&
              (isExpanded
                ? svgIcons.UpArrowIcon({ fill: "#64748b", width: "16px" })
                : svgIcons.DownArrowIcon({ fill: "#64748b", width: "16px" }))}
          </button>
          {isExpanded && (
            <div className="pl-5 mt-1 border-l-2 border-gray-100 ml-2">
              {filteredChildren.map((child, i) =>
                renderNode(
                  child,
                  depth + 1,
                  i,
                  itemNumber,
                  shouldShowAllDescendants,
                ),
              )}
            </div>
          )}
        </div>
      );
    }

    // depth > 0 — leaf: direct checkbox
    if (searchQuery && !shouldShowAllDescendants) return null;

    const isDisabled = isViewMode && node.status !== "ACCEPTED";

    return (
      <label
        key={node.id}
        className={`${ctcStyles.modalDocLabel} ${
          isDisabled
            ? ctcStyles.modalDocLabelDisabled
            : ctcStyles.modalDocLabelEnabled
        } mt-1`}
      >
        <input
          type="checkbox"
          checked={selectedDocs?.includes(node.id)}
          onChange={() => toggleDocSelection(node.id)}
          disabled={isDisabled}
          className={`${ctcStyles.modalDocCheckbox} flex-shrink-0`}
        />
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between flex-1 min-w-0">
          <span className={`${ctcStyles.modalDocText} flex-1 min-w-0 pr-2`}>
            {localizeTitle(node.title)}
          </span>
          <div className="flex flex-row items-center gap-2 flex-shrink-0 mt-1 xl:mt-0">
            {isViewMode && renderStatusBadge(node.status)}
            {/* Preview Button */}
            {(isViewMode
              ? findNodeIssuedFileStoreIdById(node.id, documents)
              : findNodeFileStoreIdById(node.id, documents)) && (
              <button
                title={t("PREVIEW_PDF")}
                onClick={(e) => {
                  e.preventDefault();
                  setPreviewDocId(node.id);
                }}
                className="flex-shrink-0 text-[#0F766E] hover:bg-teal-50 p-1 rounded-full transition-colors"
              >
                {svgIcons.EyeIcon("20", "20", "#3D3C3C")}
              </button>
            )}
          </div>
        </div>
      </label>
    );
  };

  // Status badge renderer for view mode
  const renderStatusBadge = (status: CaseBundleNode["status"]) => {
    const styles: Record<string, string> = {
      ACCEPTED:
        "bg-[#DCFCE7] text-[#166534] px-2.5 py-0.5 rounded-md text-sm font-medium ml-auto flex-shrink-0",
      REJECTED:
        "bg-[#FEE2E2] text-[#991B1B] px-2.5 py-0.5 rounded-md text-sm font-medium ml-auto flex-shrink-0",
      PENDING:
        "bg-[#FFEDD5] text-[#9A3412] px-2.5 py-0.5 rounded-md text-sm font-medium ml-auto flex-shrink-0",
    };
    const labels: Record<string, string> = {
      ACCEPTED: ctcText.viewDocs.statusApproved,
      REJECTED: ctcText.viewDocs.statusRejected,
      PENDING: ctcText.viewDocs.statusPending,
    };
    return (
      <span className={styles[status || "PENDING"] || styles.PENDING}>
        {t(labels[status || "PENDING"] || labels.PENDING)}
      </span>
    );
  };

  return (
    <div className={ctcStyles.modalOverlay}>
      <div className={ctcStyles.modalContainer}>
        {/* Header */}
        <div className={ctcStyles.modalHeader}>
          <h2 className={ctcStyles.modalHeaderTitle}>
            {modalTitle || t(ctcText.selectDocModal.title)}
          </h2>
          <button onClick={onClose} className={ctcStyles.modalCloseBtn}>
            {svgIcons.OtpCloseIcon()}
          </button>
        </div>

        {/* Body */}
        <div className={ctcStyles.modalBody}>
          {/* Left Sidebar */}
          <div className={ctcStyles.modalSidebar}>
            <div className={ctcStyles.modalSidebarHeader}>
              <h3 className={ctcStyles.modalSidebarTitle}>
                {t(ctcText.selectDocModal.sidebarTitle)}
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t(ctcText.selectDocModal.searchPlaceholder)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={ctcStyles.modalSearchInput}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-[20px] h-[20px] text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
            </div>

            <div className={ctcStyles.modalDocList}>
              {documents?.map((node, index) => renderNode(node, 0, index))}
            </div>
          </div>

          {/* Right Preview Area */}
          <div className={ctcStyles.modalPreviewArea}>
            {isViewMode ? (
              // View mode: always show preview using issuedFileStoreId
              !previewDocId ? (
                <p className={ctcStyles.modalPreviewText}>
                  {t(ctcText.selectDocModal.selectADocumentToPreview)}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full p-4">
                  <div className="w-full max-w-2xl bg-gray-50 rounded-lg flex flex-col items-center justify-center h-[90%] border border-gray-200 overflow-hidden">
                    {(() => {
                      const selectedTitle =
                        findNodeTitleById(previewDocId, documents) ||
                        "Document Preview";
                      const fileStoreId = findNodeIssuedFileStoreIdById(
                        previewDocId,
                        documents,
                      );

                      if (fileStoreId) {
                        return (
                          <div className="w-full h-full flex flex-col">
                            <div className="flex-1 w-full bg-white relative overflow-hidden">
                              <DocViewWrapper
                                fileStoreId={fileStoreId}
                                tenantId={tenantId}
                                authToken={authData?.authToken}
                              />
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="p-4 flex flex-col items-center justify-center h-full text-center">
                            <p className="text-gray-600 font-medium text-lg px-4 mb-2">
                              {localizeTitle(selectedTitle)}
                            </p>
                            <p className="text-sm text-gray-400">
                              {t(ctcText.viewDocs.noPreview)}
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              )
            ) : !isParty ? (
              <p className={ctcStyles.modalPreviewText}>
                {t(ctcText.selectDocModal.previewText)}
              </p>
            ) : !previewDocId ? (
              <p className={ctcStyles.modalPreviewText}>
                {t(ctcText.selectDocModal.selectADocumentToPreview)}
              </p>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full p-4">
                <div className="w-full max-w-2xl bg-gray-50 rounded-lg flex flex-col items-center justify-center h-[90%] border border-gray-200 overflow-hidden">
                  {(() => {
                    const selectedTitle =
                      findNodeTitleById(previewDocId, documents) ||
                      "Document Preview";
                    const fileStoreId = findNodeFileStoreIdById(
                      previewDocId,
                      documents,
                    );

                    if (fileStoreId) {
                      return (
                        <div className="w-full h-full flex flex-col">
                          <div className="flex-1 w-full bg-white relative overflow-hidden">
                            <DocViewWrapper
                              fileStoreId={fileStoreId}
                              tenantId={tenantId}
                              authToken={authData?.authToken}
                            />
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div className="p-4 flex flex-col items-center justify-center h-full text-center">
                          <p className="text-gray-600 font-medium text-lg px-4 mb-2">
                            {localizeTitle(selectedTitle)}
                          </p>
                          <p className="text-sm text-gray-400">
                            {t(ctcText.viewDocs.noPreview)}
                          </p>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={ctcStyles.modalFooter}>
          <button onClick={onClose} className={ctcStyles.modalBtnSecondary}>
            {t(ctcText.selectDocModal.goBack)}
          </button>
          {isViewMode ? (
            <button
              onClick={() => {
                if (onDownloadSelected) {
                  onDownloadSelected(getSelectedIssuedFileStoreIds());
                }
              }}
              disabled={selectedDocs.length === 0}
              className={`${ctcStyles.modalBtnPrimary} ${
                selectedDocs.length > 0
                  ? ctcStyles.modalBtnPrimaryActive
                  : ctcStyles.modalBtnPrimaryDisabled
              }`}
            >
              {selectedDocs?.length > 0
                ? `${t(ctcText.viewDocs.downloadSelected)} (${selectedDocs?.length})`
                : t(ctcText.viewDocs.downloadSelected)}
            </button>
          ) : (
            <button
              onClick={handleSelect}
              disabled={selectedDocs.length === 0}
              className={`${ctcStyles.modalBtnPrimary} ${
                selectedDocs.length > 0
                  ? ctcStyles.modalBtnPrimaryActive
                  : ctcStyles.modalBtnPrimaryDisabled
              }`}
            >
              {selectedDocs?.length > 0
                ? `${t(ctcText?.selectDocModal?.selectDocBtn)} (${selectedDocs?.length})`
                : t(ctcText?.selectDocModal?.selectDocBtn)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectDocumentsModal;
