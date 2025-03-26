export const formatStatus = (status) => {
    switch (status) {
        case "available": return "Available";
        case "out_of_stock": return "Out of Stock";
        case "upcoming": return "Coming Soon";
        default: return status?.replace(/_/g, " ") || "Unknown";
    }
};

export default formatStatus;