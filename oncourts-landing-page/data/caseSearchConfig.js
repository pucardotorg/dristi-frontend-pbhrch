export const caseSearchConfig = {
    heading: "Search for a Case",
    buttonLabels: {
        cnr: "Case Number Record (CNR)",
        caseNumber: "Case Number",
    },
    cnrInput: {
        label: "Enter CNR Number",
        placeholder: "Example : KLKM520000452024",
    },
    caseNumberSection: {
        caseTypeLabel: "Select Case Type",
        caseTypes: [
            { value: "CMP", label: "CMP" },
            { value: "ST", label: "ST" },
        ],
        caseNumberLabel: "Enter Case Number",
        placeholders: {
            CMP: "Example: CMP/15/2024",
            ST: "Example: ST/15/2024",
        },
        yearLabel: "Select Year",
        years: ["2025", "2024"],
    },
    buttons: {
        clear: "Clear Response",
        submit: "Submit",
    },
};
